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
import { MemberOptionsButton } from "@/components/custom/member-options-btn";
import { MemberCreateButton } from "@/components/custom/member-create-btn";
import { SearchInput } from "@/components/search/search-input";
import { SearchPagination } from "@/components/search/search-pagination";
import { MAX_PAGE_TAKE } from "@/lib/consts";
import { safeNumberParse, safeStringParse } from "@/lib/utils";

export default async function Members({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; p?: string }>;
}) {
  const { q, p } = await searchParams;
  const currentPage = safeNumberParse(p, 1);
  const searchQuery = safeStringParse(q, "");

  const where = {
    OR: [
      {
        email: {
          contains: searchQuery,
        },
      },
      {
        first_name: {
          contains: searchQuery,
        },
      },
      {
        last_name: {
          contains: searchQuery,
        },
      },
      {
        phone_number: {
          contains: searchQuery,
        },
      },
    ],
  };

  const [count, members] = await Promise.all([
    db.member.count({ where }),
    db.member.findMany({
      where,
      take: MAX_PAGE_TAKE,
      skip: MAX_PAGE_TAKE * (currentPage - 1),
    }),
  ]);

  const maxPage = Math.ceil(count / MAX_PAGE_TAKE);

  return (
    <main className="py-4 flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>
            Manage and view all registered library members.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <SearchInput resultsCount={count} />
          <MemberCreateButton />
        </CardContent>
        <CardFooter>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Member Since</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member, index) => (
                <TableRow key={index}>
                  <TableCell>{member.id}</TableCell>
                  <TableCell>{member.first_name}</TableCell>
                  <TableCell>{member.last_name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.phone_number}</TableCell>
                  <TableCell>
                    {member.created_at.toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <MemberOptionsButton prevMemberData={member} />
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
