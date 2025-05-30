import Link from "next/link";
import { Button } from "../ui/button";
import { ModeToggle } from "./ModeToggle";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

const Navbar = () => {
  return (
    <div className="border-b bg-background h-[10vh] flex items-center">
      <div className="container flex items-center justify-between mx-auto">
        <Link href={"/"}>
          <h1 className="font-bold text-2xl">
            Marvel<span className="text-primary">Sass</span>
          </h1>
        </Link>

        <div className="flex items-center gap-x-5">
          <ModeToggle />
          <SignedOut>
            <div className="flex items-center gap-x-5">
              <SignInButton forceRedirectUrl={"/dashboard"}>
                <Button variant={"secondary"}>Login</Button>
              </SignInButton>

              <SignUpButton forceRedirectUrl={"/dashboard"}>
                <Button>Sign up</Button>
              </SignUpButton>
            </div>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-6 h-6",
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
