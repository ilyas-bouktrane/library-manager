"use server";

import { Book, Loan, Member, Prisma } from "@/generated/prisma/client";
import { LOAN_DURATION } from "@/lib/consts";
import { db } from "@/lib/db";

type DeleteLoan = {
  timestamp: number;
  success: boolean;
};
export const deleteLoan = async (
  _: DeleteLoan,
  formData: FormData,
): Promise<DeleteLoan> => {
  const id = formData.get("id") as string;

  try {
    if (!id) throw new Error();
    const result = await db.loan.delete({
      where: { id },
    });

    return { timestamp: Date.now(), success: result.id === id };
  } catch {
    return { timestamp: Date.now(), success: false };
  }
};

type ReturnLoan = {
  timestamp: number;
  success: boolean;
};
export const returnLoan = async (
  _: ReturnLoan,
  formData: FormData,
): Promise<ReturnLoan> => {
  const id = formData.get("id") as string;

  try {
    if (!id) throw new Error();
    const prev = await db.loan.findUnique({
      where: { id },
      select: { is_returned: true },
    });
    const result = await db.loan.update({
      where: { id },
      data: { is_returned: !prev?.is_returned },
    });

    return { timestamp: Date.now(), success: result.id === id };
  } catch {
    return { timestamp: Date.now(), success: false };
  }
};

type RenewLoan = {
  timestamp: number;
  success: boolean;
};
export const renewLoan = async (
  _: RenewLoan,
  formData: FormData,
): Promise<RenewLoan> => {
  const id = formData.get("id") as string;

  try {
    if (!id) throw new Error();
    const prev = await db.loan.findUnique({ where: { id } });
    const result = await db.loan.update({
      where: { id },
      data: {
        renewal_count: {
          increment: 1,
        },
        end_date: new Date(prev!.end_date!.getTime() + LOAN_DURATION),
      },
    });

    return { timestamp: Date.now(), success: result.id === id };
  } catch {
    return { timestamp: Date.now(), success: false };
  }
};

type UpdateLoan = {
  timestamp: number;
  success: boolean;
  not_found: string;
};
export const updateLoan = async (
  _: UpdateLoan,
  formData: FormData,
): Promise<UpdateLoan> => {
  const {
    id,
    email,
    bar_code,
    end_date,
  }: Pick<Loan, "end_date" | "id"> &
    Pick<Member, "email"> &
    Pick<Book, "bar_code"> = {
    id: formData.get("id") as string,
    email: formData.get("email") as string,
    bar_code: formData.get("bar_code") as string,
    end_date: new Date(formData.get("end_date") as string),
  };

  try {
    if (!id || !email || !bar_code || !end_date) throw new Error();
    const result = await db.loan.update({
      where: { id },
      data: {
        book: {
          connect: {
            bar_code,
          },
        },
        member: {
          connect: {
            email,
          },
        },
        end_date,
      },
    });

    return {
      timestamp: Date.now(),
      success: result.id === id,
      not_found: "",
    };
  } catch (error) {
    console.log(error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return {
        timestamp: Date.now(),
        success: false,
        not_found: String(error.meta?.model).toLocaleLowerCase(),
      };
    }
    return { timestamp: Date.now(), success: false, not_found: "" };
  }
};

type CreateLoan = {
  timestamp: number;
  success: boolean;
  not_found: string;
};
export const createLoan = async (
  _: CreateLoan,
  formData: FormData,
): Promise<CreateLoan> => {
  const {
    bar_code,
    email,
    end_date,
  }: Pick<Loan, "end_date"> & Pick<Member, "email"> & Pick<Book, "bar_code"> = {
    email: formData.get("email") as string,
    bar_code: formData.get("bar_code") as string,
    end_date: new Date(formData.get("end_date") as string),
  };

  try {
    if (!bar_code || !email || !end_date) throw new Error();
    const result = await db.loan.create({
      data: {
        book: {
          connect: {
            bar_code,
          },
        },
        member: {
          connect: {
            email,
          },
        },
        end_date,
      },
    });

    return {
      timestamp: Date.now(),
      success: result.is_returned === false,
      not_found: "",
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return {
        timestamp: Date.now(),
        success: false,
        not_found: String(error.meta?.model).toLocaleLowerCase(),
      };
    }
    return { timestamp: Date.now(), success: false, not_found: "" };
  }
};
