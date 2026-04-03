import { Book, Loan, Member } from "@/generated/prisma/client";
import Head from "next/head";

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const getDaysLeft = (endDate: Date) =>
  Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

export const LoanReminderEmail = ({
  loan,
  libraryName,
}: {
  loan: Loan & { book: Book; member: Member };
  libraryName: string;
}) => {
  const daysLeft = getDaysLeft(loan.end_date);
  const overdue = daysLeft < 0;
  const overdueDays = Math.abs(daysLeft);

  const accentColor = overdue ? "#dc2626" : "#4f46e5";
  const accentBg = overdue ? "#fef2f2" : "#eef2ff";
  const badgeColor = overdue ? "#fee2e2" : "#e0e7ff";
  const badgeText = overdue ? "#991b1b" : "#3730a3";

  return (
    <html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>
          {overdue ? "Overdue Loan Notice" : "Loan Return Reminder"} —{" "}
          {libraryName}
        </title>
      </Head>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#f8f7f4",
          fontFamily: "'Georgia', 'Times New Roman', serif",
        }}
      >
        <table
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          role="presentation"
          style={{ backgroundColor: "#f8f7f4", padding: "40px 16px" }}
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
                  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                  maxWidth: "560px",
                  width: "100%",
                }}
              >
                <tr>
                  <td
                    style={{
                      backgroundColor: accentColor,
                      height: "4px",
                      fontSize: "0",
                      lineHeight: "0",
                    }}
                  >
                    &nbsp;
                  </td>
                </tr>

                {/* Header */}
                <tr>
                  <td
                    style={{
                      padding: "36px 40px 24px",
                      borderBottom: "1px solid #ede8df",
                    }}
                  >
                    <table
                      width="100%"
                      cellPadding={0}
                      cellSpacing={0}
                      role="presentation"
                    >
                      <tr>
                        <td>
                          <p
                            style={{
                              margin: 0,
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
                              margin: "8px 0 0",
                              fontSize: "22px",
                              fontWeight: "normal",
                              color: "#1c1917",
                              letterSpacing: "-0.02em",
                              lineHeight: "1.3",
                            }}
                          >
                            {overdue ? (
                              <>
                                Your loan is{" "}
                                <em style={{ color: accentColor }}>overdue</em>
                              </>
                            ) : (
                              <>
                                Your return date is{" "}
                                <em style={{ color: accentColor }}>
                                  approaching
                                </em>
                              </>
                            )}
                          </h1>
                        </td>
                        <td align="right" style={{ verticalAlign: "top" }}>
                          <span
                            style={{
                              display: "inline-block",
                              backgroundColor: badgeColor,
                              color: badgeText,
                              fontSize: "11px",
                              fontFamily: "'Courier New', monospace",
                              letterSpacing: "0.05em",
                              padding: "4px 10px",
                              borderRadius: "2px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {overdue
                              ? `${overdueDays}d overdue`
                              : daysLeft === 0
                                ? "Due today"
                                : `${daysLeft}d remaining`}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                {/* Greeting */}
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
                      {overdue
                        ? `This is a notice that the following book was due on ${formatDate(loan.end_date)} and has not yet been returned. Please return it at your earliest convenience.`
                        : `This is a friendly reminder that the following book is due for return on ${formatDate(loan.end_date)}. Please plan accordingly.`}
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
                        borderLeft: `3px solid ${accentColor}`,
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
                            Book on loan
                          </p>
                          <p
                            style={{
                              margin: "0 0 2px",
                              fontSize: "17px",
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
                                margin: "0 0 16px",
                                fontSize: "13px",
                                color: "#78716c",
                                fontStyle: "italic",
                              }}
                            >
                              by {loan.book.author}
                            </p>
                          )}
                          <table
                            width="100%"
                            cellPadding={0}
                            cellSpacing={0}
                            role="presentation"
                          >
                            <tr>
                              <td style={{ paddingRight: "24px" }}>
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
                              <td style={{ paddingRight: "24px" }}>
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
                                  Borrowed on
                                </p>
                                <p
                                  style={{
                                    margin: 0,
                                    fontSize: "13px",
                                    color: "#44403c",
                                  }}
                                >
                                  {formatDate(loan.start_date)}
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
                                  Due date
                                </p>
                                <p
                                  style={{
                                    margin: 0,
                                    fontSize: "13px",
                                    color: overdue ? accentColor : "#44403c",
                                    fontWeight: overdue ? "bold" : "normal",
                                  }}
                                >
                                  {formatDate(loan.end_date)}
                                </p>
                              </td>
                            </tr>
                          </table>
                          {loan.renewal_count > 0 && (
                            <p
                              style={{
                                margin: "14px 0 0",
                                fontSize: "12px",
                                color: "#a8a29e",
                                fontFamily: "'Courier New', monospace",
                              }}
                            >
                              Renewed {loan.renewal_count} time
                              {loan.renewal_count > 1 ? "s" : ""}
                            </p>
                          )}
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
                      If you have already returned this book, please disregard
                      this notice. For questions, contact your library
                      administrator.
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
                      — {libraryName} · Automated notification
                    </p>
                  </td>
                </tr>

                <tr>
                  <td
                    style={{
                      backgroundColor: "#f5f0e8",
                      height: "3px",
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
