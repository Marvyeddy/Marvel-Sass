import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";

const Home = () => {
  return (
    <section className="flex items-center justify-center bg-background min-h-[80vh] px-4">
      <div className="w-full max-w-2xl text-center">
        <div className="inline-block bg-secondary px-3 py-1.5 rounded-full">
          <span className="font-medium text-primary text-xs sm:text-sm">
            Sort your notes easily
          </span>
        </div>

        <h1 className="mt-6 text-2xl sm:text-3xl font-bold tracking-tight text-foreground capitalize">
          Create notes with ease
        </h1>

        <p className="mt-3 text-sm sm:text-base text-secondary-foreground max-w-md mx-auto">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis,
          libero nesciunt tenetur.
        </p>

        <div className="mt-6 flex justify-center">
          <SignInButton forceRedirectUrl="/dashboard">
            <Button size="sm" className="px-4 py-2 text-sm">
              Sign up for free
            </Button>
          </SignInButton>
        </div>
      </div>
    </section>
  );
};

export default Home;
