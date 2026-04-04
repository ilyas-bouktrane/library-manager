import { unstable_cache } from "next/cache";
import { db } from "./db";

export const getSettings = unstable_cache(
  async () =>
    Object.fromEntries(
      (await db.setting.findMany({ orderBy: { key: "asc" } })).map((s) => [
        s.key,
        s.value,
      ]),
    ),
  ["settings"],
  { tags: ["settings"] },
);
