"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent } from "../ui/card";
import { usePathname, useSearchParams } from "next/navigation";

export const SearchPagination = ({ maxPage }: { maxPage: number }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentPage = (Number(searchParams.get("p")) as number) || 1;
  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("p", String(page));
    return `${pathname}?${params}`;
  };

  return (
    <Card>
      <CardContent>
        <Pagination className="h-4">
          <PaginationContent>
            {currentPage > 1 && (
              <>
                <PaginationItem>
                  <PaginationPrevious href={setPage(currentPage - 1)} />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href={setPage(currentPage - 1)}>
                    {currentPage - 1}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}
            <PaginationItem>
              <PaginationLink href="#" isActive>
                {currentPage}
              </PaginationLink>
            </PaginationItem>
            {currentPage < maxPage && (
              <PaginationItem>
                <PaginationLink href={setPage(currentPage + 1)}>
                  {currentPage + 1}
                </PaginationLink>
              </PaginationItem>
            )}
            {currentPage + 1 < maxPage && (
              <>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href={setPage(maxPage)}>
                    {maxPage}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}
            {currentPage < maxPage && (
              <PaginationItem>
                <PaginationNext href={setPage(currentPage + 1)} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  );
};
