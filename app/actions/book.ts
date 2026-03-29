"use server";

import { Book, Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { safeNumberParse } from "@/lib/utils";

type DeleteBook = {
  timestamp: number;
  success: boolean;
};
export const deleteBook = async (
  _: DeleteBook,
  formData: FormData,
): Promise<DeleteBook> => {
  const id = formData.get("id") as string;

  try {
    if (!id) throw new Error();
    const result = await db.book.delete({
      where: { id },
    });

    return { timestamp: Date.now(), success: result.id === id };
  } catch {
    return { timestamp: Date.now(), success: false };
  }
};

type UpdateBook = {
  timestamp: number;
  success: boolean;
  barCodeTaken: boolean;
};
export const updateBook = async (
  _: UpdateBook,
  formData: FormData,
): Promise<UpdateBook> => {
  const { id, title, bar_code, author, quantity }: Book = {
    id: formData.get("id") as string,
    title: formData.get("title") as string,
    bar_code: formData.get("bar_code") as string,
    quantity: safeNumberParse(formData.get("quantity"), 1),
    author: (formData.get("author") as string) ?? null,
  };

  try {
    if (!id || !title || !bar_code || !author || !quantity) throw new Error();
    const result = await db.book.update({
      where: { id },
      data: {
        title,
        bar_code,
        author,
        quantity,
      },
    });

    return {
      timestamp: Date.now(),
      success: result.id === id,
      barCodeTaken: false,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { timestamp: Date.now(), success: false, barCodeTaken: true };
    }
    return { timestamp: Date.now(), success: false, barCodeTaken: false };
  }
};

type CreateBook = {
  timestamp: number;
  success: boolean;
  barCodeTaken: boolean;
};
export const createBook = async (
  _: CreateBook,
  formData: FormData,
): Promise<CreateBook> => {
  const { bar_code, title, author, quantity }: Omit<Book, "id"> = {
    bar_code: formData.get("bar_code") as string,
    title: formData.get("title") as string,
    quantity: safeNumberParse(formData.get("quantity"), 1),
    author: (formData.get("author") as string) ?? null,
  };

  try {
    if (!bar_code || !title || !quantity) throw new Error();
    const result = await db.book.create({
      data: {
        bar_code,
        title,
        author,
        quantity,
      },
    });

    return {
      timestamp: Date.now(),
      success: result.bar_code === bar_code,
      barCodeTaken: false,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { timestamp: Date.now(), success: false, barCodeTaken: true };
    }
    return { timestamp: Date.now(), success: false, barCodeTaken: false };
  }
};
