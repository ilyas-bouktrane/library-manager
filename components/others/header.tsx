import {
  Album,
  Book,
  LayoutDashboard,
  LibraryBig,
  Settings,
  Users,
} from "lucide-react";
import { DEFAULT_HEADER_HEIGHT, DEFAULT_PAGE_WIDTH } from "@/lib/consts";
import { ThemeToggle } from "../theme/theme-toggle";
import { NavLink } from "./nav-link";
import { getSettings } from "@/lib/settings";
import { LanguageToggle } from "./lang-toggle";
import { getTranslations } from "next-intl/server";

export const Header = async () => {
  const t = await getTranslations("Navigation");
  const { LIBRARY_NAME } = await getSettings();
  const pages = [
    { Icon: <LayoutDashboard />, label: t("dashboard"), link: "/dashboard" },
    { Icon: <Album />, label: t("loans"), link: "/loans" },
    { Icon: <Book />, label: t("books"), link: "/books" },
    { Icon: <Users />, label: t("members"), link: "/members" },
    { Icon: <Settings />, label: t("settings"), link: "/settings" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full flex justify-center border-b bg-white/5 backdrop-blur-md">
      <div
        style={{ height: DEFAULT_HEADER_HEIGHT, width: DEFAULT_PAGE_WIDTH }}
        className="w-full p-2 flex justify-between"
      >
        <div className="flex gap-1 text-2xl font-bold items-center">
          <LibraryBig size={30} /> {LIBRARY_NAME}
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          {pages.map((page, index) => (
            <NavLink page={page} key={index} />
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <LanguageToggle />
          <ThemeToggle />
          {/* <Popover> // FUTURE FEATURE...
            <PopoverTrigger asChild>
              <Button>IB</Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit" align="end">
              <PopoverHeader>
                <PopoverTitle>i.bouktrane@interne.belagir.ca</PopoverTitle>
                <PopoverDescription>
                  Logged as Ilyas Bouktrane
                </PopoverDescription>
              </PopoverHeader>
              <Button variant={"destructive"}>Disconnect</Button>
            </PopoverContent>
          </Popover> */}
        </div>
      </div>
    </header>
  );
};
