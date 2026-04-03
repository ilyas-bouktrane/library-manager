"use server";

import { db } from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";

type UpdateSetting = {
  timestamp: number;
  success: boolean;
};
export const updateSetting = async (
  _: UpdateSetting,
  formData: FormData,
): Promise<UpdateSetting> => {
  const key = formData.get("key") as string;
  const value = formData.get("value") as string;

  try {
    if (!key || !value) throw new Error();
    const result = await db.setting.update({
      where: { key },
      data: { value },
    });

    revalidateTag("settings", "default");
    revalidatePath("/", "layout");
    return { timestamp: Date.now(), success: result.key === key };
  } catch {
    return { timestamp: Date.now(), success: false };
  }
};
