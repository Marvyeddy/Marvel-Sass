"use client";

import { cn } from "@/lib/utils";
import { CreditCard, Home, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    id: 1,
    name: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    id: 2,
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    id: 3,
    name: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
];

const DashboardNav = () => {
  const pathname = usePathname();
  return (
    <nav className="grid items-start gap-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link href={item.href} key={item.id}>
            <span
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                {
                  "bg-accent": isActive,
                }
              )}
            >
              <item.icon className="mr-2 size-4 text-primary" />
              <span>{item.name}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default DashboardNav;
