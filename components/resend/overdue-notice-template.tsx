import { Book, Loan, Member } from "@/generated/prisma/client";
import Head from "next/head";

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const getOverdueDays = (endDate: Date) =>
  Math.ceil((Date.now() - endDate.getTime()) / (1000 * 60 * 60 * 24));

export const OverdueNoticeEmail = ({
  loan,
  libraryName,
}: {
  loan: Loan & { book: Book; member: Member };
  libraryName: string;
}) => {
  const overdueDays = getOverdueDays(loan.end_date);

  const severity =
    overdueDays > 14 ? "critical" : overdueDays > 7 ? "high" : "medium";
  const accentColor =
    severity === "critical"
      ? "#7f1d1d"
      : severity === "high"
        ? "#dc2626"
        : "#ea580c";
  const accentBg =
    severity === "critical"
      ? "#fef2f2"
      : severity === "high"
        ? "#fff1f2"
        : "#fff7ed";
  const stripeBg =
    severity === "critical"
      ? "#991b1b"
      : severity === "high"
        ? "#dc2626"
        : "#ea580c";

  return (
    <html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>⚠ Overdue Notice — {libraryName}</title>
      </Head>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#1a0a0a",
          fontFamily: "'Georgia', 'Times New Roman', serif",
        }}
      >
        <table
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          role="presentation"
          style={{ backgroundColor: "#1a0a0a", padding: "40px 16px" }}
        >
          <tr>
            <td align="center">
              <table
                width="560"
                cellPadding={0}
                cellSpacing={0}
                role="presentation"
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "4px",
                  overflow: "hidden",
                  maxWidth: "560px",
                  width: "100%",
                }}
              >
                {/* Warning stripe */}
                <tr>
                  <td
                    style={{ backgroundColor: stripeBg, padding: "10px 40px" }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: "11px",
                        fontFamily: "'Courier New', monospace",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "#ffffff",
                        opacity: 0.9,
                      }}
                    >
                      ⚠ &nbsp; Official Overdue Notice &nbsp; ⚠
                    </p>
                  </td>
                </tr>

                {/* Header */}
                <tr>
                  <td
                    style={{
                      padding: "36px 40px 28px",
                      backgroundColor: "#fff5f5",
                      borderBottom: `2px solid ${accentColor}`,
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 6px",
                        fontSize: "11px",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#9ca3af",
                        fontFamily: "'Courier New', monospace",
                      }}
                    >
                      {libraryName}
                    </p>
                    <h1
                      style={{
                        margin: "0 0 12px",
                        fontSize: "26px",
                        fontWeight: "normal",
                        color: "#1c1917",
                        letterSpacing: "-0.02em",
                        lineHeight: "1.2",
                      }}
                    >
                      This book is{" "}
                      <strong
                        style={{ color: accentColor, fontStyle: "italic" }}
                      >
                        {overdueDays} day{overdueDays > 1 ? "s" : ""} late.
                      </strong>
                    </h1>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "14px",
                        color: "#78716c",
                        lineHeight: "1.6",
                      }}
                    >
                      Issued on {formatDate(new Date())} · Due was{" "}
                      {formatDate(loan.end_date)}
                    </p>
                  </td>
                </tr>

                {/* Member */}
                <tr>
                  <td style={{ padding: "28px 40px 0" }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "15px",
                        color: "#44403c",
                        lineHeight: "1.6",
                      }}
                    >
                      Dear{" "}
                      <strong style={{ color: "#1c1917" }}>
                        {loan.member.first_name} {loan.member.last_name}
                      </strong>
                      ,
                    </p>
                    <p
                      style={{
                        margin: "12px 0 0",
                        fontSize: "15px",
                        color: "#78716c",
                        lineHeight: "1.7",
                      }}
                    >
                      Our records indicate that you have not yet returned the
                      following item. This is a formal notice requesting its
                      immediate return to {libraryName}.
                    </p>
                  </td>
                </tr>

                {/* Book card */}
                <tr>
                  <td style={{ padding: "24px 40px" }}>
                    <table
                      width="100%"
                      cellPadding={0}
                      cellSpacing={0}
                      role="presentation"
                      style={{
                        backgroundColor: accentBg,
                        borderLeft: `4px solid ${accentColor}`,
                        borderRadius: "0 4px 4px 0",
                        padding: "20px 24px",
                      }}
                    >
                      <tr>
                        <td>
                          <p
                            style={{
                              margin: "0 0 4px",
                              fontSize: "10px",
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              color: "#9ca3af",
                              fontFamily: "'Courier New', monospace",
                            }}
                          >
                            Unreturned item
                          </p>
                          <p
                            style={{
                              margin: "0 0 2px",
                              fontSize: "18px",
                              fontWeight: "bold",
                              color: "#1c1917",
                              lineHeight: "1.3",
                            }}
                          >
                            {loan.book.title}
                          </p>
                          {loan.book.author && (
                            <p
                              style={{
                                margin: "0 0 18px",
                                fontSize: "13px",
                                color: "#78716c",
                                fontStyle: "italic",
                              }}
                            >
                              by {loan.book.author}
                            </p>
                          )}

                          {/* Stats row */}
                          <table
                            width="100%"
                            cellPadding={0}
                            cellSpacing={0}
                            role="presentation"
                          >
                            <tr>
                              <td style={{ paddingRight: "20px" }}>
                                <p
                                  style={{
                                    margin: "0 0 2px",
                                    fontSize: "10px",
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    color: "#a8a29e",
                                    fontFamily: "'Courier New', monospace",
                                  }}
                                >
                                  Bar code
                                </p>
                                <p
                                  style={{
                                    margin: 0,
                                    fontSize: "13px",
                                    color: "#44403c",
                                    fontFamily: "'Courier New', monospace",
                                  }}
                                >
                                  {loan.book.bar_code}
                                </p>
                              </td>
                              <td style={{ paddingRight: "20px" }}>
                                <p
                                  style={{
                                    margin: "0 0 2px",
                                    fontSize: "10px",
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    color: "#a8a29e",
                                    fontFamily: "'Courier New', monospace",
                                  }}
                                >
                                  Was due
                                </p>
                                <p
                                  style={{
                                    margin: 0,
                                    fontSize: "13px",
                                    color: accentColor,
                                    fontWeight: "bold",
                                  }}
                                >
                                  {formatDate(loan.end_date)}
                                </p>
                              </td>
                              <td>
                                <p
                                  style={{
                                    margin: "0 0 2px",
                                    fontSize: "10px",
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    color: "#a8a29e",
                                    fontFamily: "'Courier New', monospace",
                                  }}
                                >
                                  Days late
                                </p>
                                <p
                                  style={{
                                    margin: 0,
                                    fontSize: "20px",
                                    fontWeight: "bold",
                                    color: accentColor,
                                    fontFamily: "'Courier New', monospace",
                                  }}
                                >
                                  +{overdueDays}
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                {/* Urgency callout */}
                <tr>
                  <td style={{ padding: "0 40px 28px" }}>
                    <table
                      width="100%"
                      cellPadding={0}
                      cellSpacing={0}
                      role="presentation"
                      style={{
                        backgroundColor: "#1c1917",
                        borderRadius: "4px",
                        padding: "16px 20px",
                      }}
                    >
                      <tr>
                        <td>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "13px",
                              color: "#e7e5e4",
                              lineHeight: "1.6",
                            }}
                          >
                            {severity === "critical"
                              ? "⚠ This item is critically overdue. Failure to return it may result in your borrowing privileges being suspended. Please return it immediately."
                              : severity === "high"
                                ? "Please return this book as soon as possible. Other members may be waiting for this item."
                                : "Please arrange to return this book at your earliest convenience."}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style={{ padding: "0 40px" }}>
                    <hr
                      style={{
                        border: "none",
                        borderTop: "1px solid #ede8df",
                        margin: 0,
                      }}
                    />
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td style={{ padding: "24px 40px 36px" }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        color: "#a8a29e",
                        lineHeight: "1.6",
                      }}
                    >
                      If you have already returned this book, please contact
                      your library administrator to reconcile your account.
                    </p>
                    <p
                      style={{
                        margin: "16px 0 0",
                        fontSize: "12px",
                        color: "#d4cfc9",
                        fontFamily: "'Courier New', monospace",
                        letterSpacing: "0.04em",
                      }}
                    >
                      — {libraryName} · Automated overdue notice
                    </p>
                  </td>
                </tr>

                <tr>
                  <td
                    style={{
                      backgroundColor: stripeBg,
                      height: "4px",
                      fontSize: "0",
                      lineHeight: "0",
                    }}
                  >
                    &nbsp;
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
};
