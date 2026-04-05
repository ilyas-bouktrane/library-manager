"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "@/i18n/navigation";
import { GB, FR } from "country-flag-icons/react/3x2";
import { useLocale } from "next-intl";
import { useTopLoader } from "nextjs-toploader";
import { useEffect } from "react";

export function LanguageToggle() {
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();
  const toploader = useTopLoader();

  const languages = [
    { locale: "fr", label: "Français", Icon: FR },
    { locale: "en", label: "English", Icon: GB },
  ];

  const currentLanguage = languages.find((l) => l.locale === locale);

  useEffect(() => {
    toploader.done();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="hover:cursor-pointer">
          {currentLanguage && (
            <div className="flex gap-2 justify-center items-center">
              <currentLanguage.Icon /> {currentLanguage.label}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((l) => (
          <DropdownMenuItem
            key={l.locale}
            className="flex p-2 justify-start items-center"
            onClick={() => {
              toploader.start();
              router.replace(pathname, { locale: l.locale });
            }}
          >
            <l.Icon />
            {l.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
