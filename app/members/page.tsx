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
import { MemberActionButton } from "@/components/members/member-action-btn";
import { MemberCreateButton } from "@/components/members/member-create-btn";
import { SearchInput } from "@/components/search/search-input";
import { SearchPagination } from "@/components/search/search-pagination";
import { DEFAULT_MAX_PAGE_TAKE } from "@/lib/consts";
import { safeNumberParse, safeStringParse } from "@/lib/utils";
import { Users } from "lucide-react";
import { Prisma } from "@/generated/prisma/client";

export default async function Members({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; p?: string }>;
}) {
  const { q, p } = await searchParams;
  const currentPage = safeNumberParse(p, 1);
  const searchQuery = safeStringParse(q, "");

  const where: Prisma.MemberWhereInput = {
    OR: [
      {
        email: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
      {
        first_name: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
      {
        last_name: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
      {
        phone_number: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
    ],
  };

  const [count, members] = await Promise.all([
    db.member.count({ where }),
    db.member.findMany({
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
            <Users size={18} /> Members
          </CardTitle>
          <CardDescription>
            Manage and view all registered library members.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <SearchInput
            resultsCount={count}
            placeholder="Search by name, email or phone number..."
          />
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
                    <MemberActionButton prevMemberData={member} />
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
