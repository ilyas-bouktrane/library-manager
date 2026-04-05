"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

export const SearchInput = ({
  resultsCount,
  placeholder,
}: {
  resultsCount: number;
  placeholder: string;
}) => {
  const t = useTranslations("Actions");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchIsPending, setSearchIsPending] = useState(false);

  const handleSearch = () => {
    setSearchIsPending(true);
    const params = new URLSearchParams();
    params.set("q", searchQuery);
    router.push(`${pathname}?${params}`);
  };

  const handleReset = () => {
    setSearchIsPending(true);
    setSearchQuery("");
    router.push(pathname);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchIsPending(false);
  }, [searchParams]);

  return (
    <>
      <InputGroup>
        <InputGroupInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={searchIsPending}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          {resultsCount} {resultsCount === 1 ? t("result") : t("results")}
        </InputGroupAddon>
      </InputGroup>
      <Button disabled={searchIsPending} onClick={() => handleSearch()}>
        {t("search")}
      </Button>
      <Button
        disabled={searchIsPending}
        onClick={() => handleReset()}
        variant={"secondary"}
      >
        {t("reset")}
      </Button>
    </>
  );
};
