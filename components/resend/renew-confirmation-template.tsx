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

export const LoanRenewalEmail = ({
  loan,
  libraryName,
}: {
  loan: Loan & { book: Book; member: Member };
  libraryName: string;
}) => {
  const daysLeft = getDaysLeft(loan.end_date);

  return (
    <html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Loan Renewed — {libraryName}</title>
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
                      backgroundColor: "#7c3aed",
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
                            Your loan has been{" "}
                            <em style={{ color: "#7c3aed" }}>renewed</em> ↻
                          </h1>
                        </td>
                        <td align="right" style={{ verticalAlign: "top" }}>
                          <span
                            style={{
                              display: "inline-block",
                              backgroundColor: "#ede9fe",
                              color: "#6d28d9",
                              fontSize: "11px",
                              fontFamily: "'Courier New', monospace",
                              letterSpacing: "0.05em",
                              padding: "4px 10px",
                              borderRadius: "2px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Renewal #{loan.renewal_count}
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
                      Your loan has been successfully renewed. You now have
                      until{" "}
                      <strong style={{ color: "#1c1917" }}>
                        {formatDate(loan.end_date)}
                      </strong>{" "}
                      to return the item below.
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
                        backgroundColor: "#faf5ff",
                        borderLeft: "3px solid #7c3aed",
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
                            Renewed item
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
                                  New due date
                                </p>
                                <p
                                  style={{
                                    margin: 0,
                                    fontSize: "13px",
                                    color: "#7c3aed",
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
                                  Days left
                                </p>
                                <p
                                  style={{
                                    margin: 0,
                                    fontSize: "20px",
                                    fontWeight: "bold",
                                    color: "#7c3aed",
                                    fontFamily: "'Courier New', monospace",
                                  }}
                                >
                                  {daysLeft}
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                {/* Renewal count note */}
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
                              margin: "0 0 10px",
                              fontSize: "13px",
                              color: "#78716c",
                              fontFamily: "'Courier New', monospace",
                            }}
                          >
                            {loan.id}
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "13px",
                              color: "#a8a29e",
                              lineHeight: "1.5",
                            }}
                          >
                            This item has been renewed{" "}
                            <strong style={{ color: "#78716c" }}>
                              {loan.renewal_count} time
                              {loan.renewal_count > 1 ? "s" : ""}
                            </strong>
                            . Contact your library administrator if you need
                            further extensions.
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
                      You will receive a reminder before your new return date.
                      If you no longer need this item, please return it so other
                      members can borrow it.
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
                      — {libraryName} · Automated renewal confirmation
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
