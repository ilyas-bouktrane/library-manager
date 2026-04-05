import { LoanActionButton } from "@/components/loans/loan-action-btn";
import { LoanCreateButton } from "@/components/loans/loan-create-btn";
import { SearchInput } from "@/components/search/search-input";
import { SearchPagination } from "@/components/search/search-pagination";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Prisma } from "@/generated/prisma/client";
import { DEFAULT_MAX_PAGE_TAKE } from "@/lib/consts";
import { db } from "@/lib/db";
import { safeNumberParse, safeStringParse } from "@/lib/utils";
import { Album } from "lucide-react";
import { setRequestLocale } from "next-intl/server";

export default async function Loans({
  searchParams,
  params,
}: {
  searchParams: Promise<{ q?: string; p?: string }>;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { q, p } = await searchParams;
  const currentPage = safeNumberParse(p, 1);
  const searchQuery = safeStringParse(q, "");

  const where: Prisma.LoanWhereInput = {
    OR: [
      {
        book: {
          bar_code: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
      },
      {
        member: {
          email: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
      },
    ],
  };

  const [count, loans] = await Promise.all([
    db.loan.count({
      where,
    }),
    db.loan.findMany({
      where,
      take: DEFAULT_MAX_PAGE_TAKE,
      skip: DEFAULT_MAX_PAGE_TAKE * (currentPage - 1),
      include: {
        book: {
          select: {
            title: true,
            bar_code: true,
          },
        },
        member: {
          select: {
            email: true,
          },
        },
      },
      orderBy: {
        end_date: "desc",
      },
    }),
  ]);

  const maxPage = Math.ceil(count / DEFAULT_MAX_PAGE_TAKE);

  return (
    <main className="py-4 flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-1 items-center">
            <Album size={18} /> Loans
          </CardTitle>
          <CardDescription>Manage and view all loans.</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <SearchInput
            resultsCount={count}
            placeholder="Search by book's bar code or by member's email..."
          />
          <LoanCreateButton />
        </CardContent>
        <CardFooter>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Member Email</TableHead>
                <TableHead>Book Title</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Return State</TableHead>
                <TableHead className="text-center">Renewal Count</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell>{loan.id}</TableCell>
                  <TableCell>{loan.member.email}</TableCell>
                  <TableCell>{loan.book.title}</TableCell>
                  <TableCell>{loan.start_date.toLocaleDateString()}</TableCell>
                  <TableCell
                    className={
                      new Date() > loan.end_date ? "text-orange-600" : ""
                    }
                  >
                    {loan.end_date.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {loan.is_returned ? (
                      <Badge>Returned</Badge>
                    ) : (
                      <Badge
                        variant={
                          new Date() > loan.end_date
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        Unreturned
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={"secondary"}>{loan.renewal_count}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <LoanActionButton
                      prevLoanData={{
                        id: loan.id,
                        email: loan.member.email,
                        bar_code: loan.book.bar_code,
                        end_date: loan.end_date,
                        is_returned: loan.is_returned,
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardFooter>
      </Card>
      <SearchPagination maxPage={maxPage} />
    </main>
  );
}
