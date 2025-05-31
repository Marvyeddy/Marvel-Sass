"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserButton, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

const UserDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer">
          <UserButton
            userProfileUrl="/dashboard/settings"
            userProfileMode="navigation"
            appearance={{
              elements: {
                avatarBox: "w-6 h-6",
              },
            }}
          />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/">🏠 Home</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings">⚙️ Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/billing">💳 Billing</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <SignOutButton>
            <div>Sign Out</div>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
