// Runs once on each startup

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { db } = await import("./lib/db");
    const { DEFAULT_LOAN_DURATION_DAYS } = await import("./lib/consts");

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
      ]);

      console.log("[STARTUP] Database successfully populated.");
    } catch (error) {
      console.error("[STARTUP] Something went wrong :", error);
    }
  }
}
