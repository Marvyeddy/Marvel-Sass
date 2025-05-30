import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";

const Home = () => {
  return (
    <section className="flex items-center justify-center bg-background h-[90vh]">
      <div className="relative w-full mx-auto items-center px-5 py-12 lg:px-16 max-w-7xl md:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <div>
            <span className="w-auto bg-secondary px-6 py-3 rounded-full">
              <span className="font-medium text-primary text-sm">
                Sort your notes easily
              </span>
            </span>

            <h1 className="text-3xl mt-8 font-extrabold tracking-tight lg:text-6xl capitalize">
              Create Notes with ease
            </h1>

            <p className="mt-6 max-w-xl text-base mx-auto lg:text-xl text-secondary-foreground">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Veritatis, libero nesciunt tenetur
            </p>
          </div>

          <div className="max-w-sm mx-auto mt-10 flex justify-center">
            <SignInButton forceRedirectUrl={"/dashboard"}>
              <Button className="cursor-pointer" size={"lg"}>
                Sign up for free
              </Button>
            </SignInButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
