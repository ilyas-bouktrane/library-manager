import {
  Album,
  Book,
  LayoutDashboard,
  LibraryBig,
  Settings,
  Users,
} from "lucide-react";
import { Button } from "../ui/button";
import { HEADER_HEIGHT, PAGE_WIDTH } from "@/lib/consts";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ThemeToggle } from "../theme/theme-toggle";
import { NavLink } from "./nav-link";

export const Header = () => {
  const pages = [
    { Icon: <LayoutDashboard />, label: "Dashboard", link: "/dashboard" },
    { Icon: <Book />, label: "Books", link: "/books" },
    { Icon: <Users />, label: "Members", link: "/members" },
    { Icon: <Album />, label: "Loans", link: "/loans" },
    { Icon: <Settings />, label: "Settings", link: "/settings" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full flex justify-center border-b bg-white/5 backdrop-blur-md">
      <div
        style={{ height: HEADER_HEIGHT, width: PAGE_WIDTH }}
        className="w-full p-2 flex justify-between"
      >
        <div className="flex gap-1 text-2xl font-bold items-center">
          <LibraryBig size={30} /> Library Manager
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          {pages.map((page, index) => (
            <NavLink page={page} key={index} />
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <ThemeToggle />
          <Popover>
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
          </Popover>
        </div>
      </div>
    </header>
  );
};
