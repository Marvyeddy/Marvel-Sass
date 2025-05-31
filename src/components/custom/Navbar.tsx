import Link from "next/link";
import { Button } from "../ui/button";
import { ModeToggle } from "./ModeToggle";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import UserDropdown from "./UserDropdown";

const Navbar = () => {
  return (
    <div className="border-b bg-background h-[64px] flex items-center">
      <div className="container flex items-center justify-between mx-auto px-4">
        <Link href="/">
          <h1 className="font-semibold text-lg">
            Marvel<span className="text-primary">Sass</span>
          </h1>
        </Link>

        <div className="flex items-center gap-x-3">
          <ModeToggle />

          <SignedOut>
            <div className="flex items-center gap-x-3">
              <SignInButton forceRedirectUrl="/dashboard">
                <Button
                  size="sm"
                  variant="secondary"
                  className="hidden md:block"
                >
                  Login
                </Button>
              </SignInButton>

              <SignUpButton forceRedirectUrl="/dashboard">
                <Button size="sm">Sign up</Button>
              </SignUpButton>
            </div>
          </SignedOut>

          <SignedIn>
            <UserDropdown />
          </SignedIn>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
