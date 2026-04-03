// Runs once on each startup

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { db } = await import("./lib/db");
    const {
      DEFAULT_LOAN_DURATION_DAYS,
      DEFAULT_LIBRARY_NAME,
      DEFAULT_REMINDERS_DAYS_BEFORE,
    } = await import("./lib/consts");

    try {
      console.log("[STARTUP] Populating database with default settings...");

      await Promise.all([
        db.setting.upsert({
          where: { key: "LOAN_DURATION_DAYS" },
          update: {},
          create: {
            key: "LOAN_DURATION_DAYS",
            value: String(DEFAULT_LOAN_DURATION_DAYS),
          },
        }),
        db.setting.upsert({
          where: { key: "LIBRARY_NAME" },
          update: {},
          create: {
            key: "LIBRARY_NAME",
            value: String(DEFAULT_LIBRARY_NAME),
          },
        }),
        db.setting.upsert({
          where: { key: "REMINDERS_DAYS_BEFORE" },
          update: {},
          create: {
            key: "REMINDERS_DAYS_BEFORE",
            value: String(DEFAULT_REMINDERS_DAYS_BEFORE),
          },
        }),
      ]);

      console.log("[STARTUP] Database successfully populated.");
    } catch (error) {
      console.error("[STARTUP] Something went wrong :", error);
    }
  }
}
