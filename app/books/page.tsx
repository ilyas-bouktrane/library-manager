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
import { db } from "@/lib/db";
import { SearchInput } from "@/components/search/search-input";
import { SearchPagination } from "@/components/search/search-pagination";
import { DEFAULT_MAX_PAGE_TAKE } from "@/lib/consts";
import { safeNumberParse, safeStringParse } from "@/lib/utils";
import { Book } from "lucide-react";
import { BookActionButton } from "@/components/books/book-action-btn";
import { BookCreateButton } from "@/components/books/book-create-btn";
import { Prisma } from "@/generated/prisma/client";

export default async function Books({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; p?: string }>;
}) {
  const { q, p } = await searchParams;
  const currentPage = safeNumberParse(p, 1);
  const searchQuery = safeStringParse(q, "");

  const where: Prisma.BookWhereInput = {
    OR: [
      {
        bar_code: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
      {
        title: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
      {
        author: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
    ],
  };

  const [count, books] = await Promise.all([
    db.book.count({
      where,
    }),
    db.book.findMany({
      where,
      take: DEFAULT_MAX_PAGE_TAKE,
      skip: DEFAULT_MAX_PAGE_TAKE * (currentPage - 1),
    }),
  ]);

  const maxPage = Math.ceil(count / DEFAULT_MAX_PAGE_TAKE);

  return (
    <main className="py-4 flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-1 items-center">
            <Book size={18} /> Books
          </CardTitle>
          <CardDescription>
            Manage and view all registered library books.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <SearchInput
            resultsCount={count}
            placeholder="Search by title, author or bar code..."
          />
          <BookCreateButton />
        </CardContent>
        <CardFooter>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Bar Code</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book, index) => (
                <TableRow key={index}>
                  <TableCell>{book.id}</TableCell>
                  <TableCell>{book.bar_code}</TableCell>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.quantity}</TableCell>
                  <TableCell className="text-right">
                    <BookActionButton prevBookData={book} />
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
