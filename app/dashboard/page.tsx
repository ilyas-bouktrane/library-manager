import { TemporalSumChart } from "@/components/charts/temporal-sum-chart";
import { MiniCard } from "@/components/custom/mini-card";
import { db } from "@/lib/db";
import {
  BookCopy,
  Bookmark,
  MessageCircleWarning,
  UserRound,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [loans, members, booksCount, activeLoansCount, lateLoansCount] =
    await Promise.all([
      db.loan.findMany({
        select: {
          start_date: true,
          return_date: true,
        },
      }),
      db.member.findMany({
        select: {
          created_at: true,
        },
      }),
      db.book.count(),
      db.loan.count({ where: { is_returned: false } }),
      db.loan.count({
        where: { is_returned: false, end_date: { lt: new Date() } },
      }),
    ]);

  const loansChartData = loans.reduce<Record<string, Record<string, number>>>(
    (prev, curr) => {
      const loanDate = curr.start_date.toISOString().split("T")[0];
      const returnDate = curr.return_date?.toISOString().split("T")[0] ?? null;

      prev[loanDate] = {
        ...prev[loanDate],
        loans: (prev[loanDate]?.loans ?? 0) + 1,
      };

      if (returnDate) {
        prev[returnDate] = {
          ...prev[returnDate],
          returns: (prev[returnDate]?.returns ?? 0) + 1,
        };
      }

      return prev;
    },
    {},
  );

  const membersChartData = members.reduce<Record<string, number>>(
    (prev, curr) => {
      const memberDate = curr.created_at.toISOString().split("T")[0];
      prev[memberDate] = prev[memberDate] + 1 || 1;
      return prev;
    },
    {},
  );

  return (
    <main className="py-4 flex flex-col gap-4">
      <div className="flex gap-4">
        <MiniCard
          label="Registered Books"
          value={String(booksCount)}
          Icon={BookCopy}
        />
        <MiniCard
          label="Registered Members"
          value={String(members.length)}
          Icon={UserRound}
        />
        <MiniCard
          label="Active Loans"
          value={
            <span className={"text-green-500"}>{String(activeLoansCount)}</span>
          }
          Icon={Bookmark}
        />
        <MiniCard
          label="Unreturned Overdue Loans"
          value={
            <span className={lateLoansCount ? "text-red-500" : ""}>
              {String(lateLoansCount)}
            </span>
          }
          Icon={MessageCircleWarning}
        />
      </div>
      <TemporalSumChart
        title="Past Loans and Returns over Time"
        description="Double bar and line chart"
        labels={{ loans: "Due and Overdue Loans", returns: "Returned Loans" }}
        defaultChartType="area"
        defaultGroupBy="day"
        defaultRange="1m"
        data={Object.entries(loansChartData).map(([date, values]) => ({
          date,
          ...values,
        }))}
      />
      <TemporalSumChart
        title="New Members over Time"
        description="Double bar and line chart"
        labels={{ value: "New Members" }}
        defaultChartType="area"
        defaultGroupBy="day"
        defaultRange="1m"
        data={Object.entries(membersChartData).map(([date, value]) => ({
          date,
          value,
        }))}
      />
    </main>
  );
}
