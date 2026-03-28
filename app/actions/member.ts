"use server";

import { Member, Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";

type DeleteMember = {
  timestamp: number;
  success: boolean;
};
export const deleteMember = async (
  _: DeleteMember,
  formData: FormData,
): Promise<DeleteMember> => {
  const id = formData.get("id") as string;

  try {
    if (!id) throw new Error();
    const result = await db.member.delete({
      where: { id },
    });

    return { timestamp: Date.now(), success: result.id === id };
  } catch {
    return { timestamp: Date.now(), success: false };
  }
};

type UpdateMember = {
  timestamp: number;
  success: boolean;
  emailTaken: boolean;
};
export const updateMember = async (
  _: UpdateMember,
  formData: FormData,
): Promise<UpdateMember> => {
  const {
    id,
    first_name,
    last_name,
    email,
    phone_number,
  }: Omit<Member, "created_at"> = {
    id: formData.get("id") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    email: formData.get("email") as string,
    phone_number: (formData.get("phone_number") as string) ?? null,
  };

  try {
    if (!id || !first_name || !last_name || !email) throw new Error();
    const result = await db.member.update({
      where: { id },
      data: {
        first_name,
        last_name,
        email,
        phone_number,
      },
    });

    return {
      timestamp: Date.now(),
      success: result.id === id,
      emailTaken: false,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { timestamp: Date.now(), success: false, emailTaken: true };
    }
    return { timestamp: Date.now(), success: false, emailTaken: false };
  }
};

type CreateMember = {
  timestamp: number;
  success: boolean;
  emailTaken: boolean;
};
export const createMember = async (
  _: CreateMember,
  formData: FormData,
): Promise<CreateMember> => {
  const {
    first_name,
    last_name,
    email,
    phone_number,
  }: Omit<Member, "created_at" | "id"> = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    email: formData.get("email") as string,
    phone_number: (formData.get("phone_number") as string) ?? null,
  };

  try {
    if (!first_name || !last_name || !email) throw new Error();
    const result = await db.member.create({
      data: {
        first_name,
        last_name,
        email,
        phone_number,
      },
    });

    return {
      timestamp: Date.now(),
      success: result.email === email,
      emailTaken: false,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { timestamp: Date.now(), success: false, emailTaken: true };
    }
    return { timestamp: Date.now(), success: false, emailTaken: false };
  }
};
