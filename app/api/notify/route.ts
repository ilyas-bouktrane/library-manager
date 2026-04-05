import { LoanReminderEmail } from "@/components/resend/due-reminder-template";
import { OverdueNoticeEmail } from "@/components/resend/overdue-notice-template";
import { db } from "@/lib/db";
import { getResend } from "@/lib/resend";
import { getSettings } from "@/lib/settings";
import { addDays } from "date-fns";
import { headers } from "next/headers";

export async function POST() {
  const { LIBRARY_NAME, REMINDERS_DAYS_BEFORE } = await getSettings();
  const authorization = (await headers()).get("Authorization");
  if (authorization !== `Bearer ${process.env.EMAIL_CRON_SECRET}`)
    return Response.json(
      {
        timestamp: new Date().toISOString(),
        success: false,
        msg: "Invalid secret.",
      },
      { status: 401 },
    );

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reminders = REMINDERS_DAYS_BEFORE.split(",").map((r) => Number(r));

    const [dueLoans, overDueLoans] = await Promise.all([
      db.loan.findMany({
        where: {
          AND: [
            {
              is_returned: false,
              start_date: { lt: new Date() },
              end_date: { gt: new Date() },
            },
            { OR: [{ last_reminder: null }, { last_reminder: { lt: today } }] },
            {
              OR: reminders.map((days) => ({
                end_date: {
                  gte: addDays(today, days),
                  lt: addDays(today, days + 1),
                },
              })),
            },
          ],
        },
        include: {
          book: true,
          member: true,
        },
      }),
      db.loan.findMany({
        where: {
          is_returned: false,
          start_date: { lt: new Date() },
          end_date: { lt: today },
          OR: [{ last_reminder: null }, { last_reminder: { lt: today } }],
        },
        include: {
          book: true,
          member: true,
        },
      }),
    ]);

    await Promise.all([
      ...dueLoans.map((loan) =>
        getResend().emails.send({
          from: `${LIBRARY_NAME} <${process.env.RESEND_SENDER_EMAIL || "onboarding@resend.dev"}>`,
          to: loan.member.email,
          subject: "Loan Reminder - Library Notification",
          react: LoanReminderEmail({ loan, libraryName: LIBRARY_NAME }),
        }),
      ),
      ...overDueLoans.map((loan) =>
        getResend().emails.send({
          from: `${LIBRARY_NAME} <${process.env.RESEND_SENDER_EMAIL || "onboarding@resend.dev"}>`,
          to: loan.member.email,
          subject: "Overdue Notice - Library Notification",
          react: OverdueNoticeEmail({ loan, libraryName: LIBRARY_NAME }),
        }),
      ),
    ]);

    await db.loan.updateMany({
      where: {
        id: {
          in: [
            ...dueLoans.map((loan) => loan.id),
            ...overDueLoans.map((loan) => loan.id),
          ],
        },
      },
      data: { last_reminder: new Date() },
    });

    return Response.json(
      {
        timestamp: new Date().toISOString(),
        success: true,
        msg: `${dueLoans.length + overDueLoans.length} emails sent.`,
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      {
        timestamp: new Date().toISOString(),
        success: false,
        msg: error instanceof Error ? error.message : "Internal Error.",
      },
      { status: 500 },
    );
  }
}
