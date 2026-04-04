import { Book, Loan, Member } from "@/generated/prisma/client";
import Head from "next/head";

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const getLoanDuration = (start: Date, end: Date) =>
  Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

export const LoanConfirmationEmail = ({
  loan,
  libraryName,
}: {
  loan: Loan & { book: Book; member: Member };
  libraryName: string;
}) => {
  const duration = getLoanDuration(loan.start_date, loan.end_date);

  return (
    <html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Loan Confirmed — {libraryName}</title>
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
                {/* Top bar */}
                <tr>
                  <td
                    style={{
                      backgroundColor: "#16a34a",
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
                            Your loan is{" "}
                            <em style={{ color: "#16a34a" }}>confirmed</em> ✓
                          </h1>
                        </td>
                        <td align="right" style={{ verticalAlign: "top" }}>
                          <span
                            style={{
                              display: "inline-block",
                              backgroundColor: "#dcfce7",
                              color: "#15803d",
                              fontSize: "11px",
                              fontFamily: "'Courier New', monospace",
                              letterSpacing: "0.05em",
                              padding: "4px 10px",
                              borderRadius: "2px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {duration} days
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
                      This email confirms that the following item has been
                      successfully checked out to your account. Please keep this
                      receipt for your records.
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
                        backgroundColor: "#f0fdf4",
                        borderLeft: "3px solid #16a34a",
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
                            Checked out item
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
                                  Return by
                                </p>
                                <p
                                  style={{
                                    margin: 0,
                                    fontSize: "13px",
                                    color: "#16a34a",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {formatDate(loan.end_date)}
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                {/* Loan ID */}
                <tr>
                  <td style={{ padding: "0 40px 28px" }}>
                    <table
                      width="100%"
                      cellPadding={0}
                      cellSpacing={0}
                      role="presentation"
                      style={{
                        backgroundColor: "#fafaf9",
                        borderRadius: "4px",
                        padding: "14px 18px",
                      }}
                    >
                      <tr>
                        <td>
                          <p
                            style={{
                              margin: "0 0 2px",
                              fontSize: "10px",
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              color: "#a8a29e",
                              fontFamily: "'Courier New', monospace",
                            }}
                          >
                            Loan reference
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "13px",
                              color: "#78716c",
                              fontFamily: "'Courier New', monospace",
                            }}
                          >
                            {loan.id}
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
                      You will receive a reminder before your return date. If
                      you need more time, ask your library administrator to
                      renew your loan.
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
                      — {libraryName} · Automated confirmation
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
