"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "@/i18n/navigation";
export const NavLink = ({
  page,
}: {
  page: { link: string; label: string; Icon: React.ReactNode };
}) => {
  const pathname = usePathname();
  return (
    <Button variant={"ghost"} asChild>
      <Link
        href={page.link}
        className={`text-[17px]
        ${pathname === page.link ? "text-foreground underline underline-offset-5" : ""}`}
      >
        {page.Icon} {page.label}
      </Link>
    </Button>
  );
};
