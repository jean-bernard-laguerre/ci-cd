"use client";
import {
  DatabaseBackup,
  DatabaseZap,
  History,
  House,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarLinkProps {
  href: string;
  title: string;
  Icon: LucideIcon;
}

const SidebarLink = ({ href, title, Icon }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");
  return (
    <Link
      aria-disabled="true"
      href={href}
      className={`flex items-center justify-start gap-2 w-full rounded px-2 py-1.5 text-sm transition-[box-shadow,_background-color,_color] ${
        isActive
          ? "bg-white text-stone-950 shadow"
          : "hover:bg-stone-200 bg-transparent text-stone-500 shadow-none"
      }`}
    >
      <Icon className={isActive ? "text-violet-500" : ""} />
      <span className={isActive ? "font-semibold text-violet-500" : ""}>
        {title}
      </span>
    </Link>
  );
};
export const RouteSelect = () => {
  return (
    <div className="space-y-1">
      <SidebarLink href="/" title="Dashboard" Icon={House} />
      <SidebarLink href="/database" title="Database" Icon={DatabaseZap} />
      <SidebarLink href="/backup" title="Backup" Icon={DatabaseBackup} />
      <SidebarLink href="/history" title="History" Icon={History} />
    </div>
  );
};
