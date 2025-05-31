import DashboardNav from "@/components/custom/DashboardNav";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { unstable_noStore as noStore } from "next/cache";

async function getUser({
  email,
  id,
  firstName,
  lastName,
}: {
  email: string;
  id: string;
  firstName: string | undefined | null;
  lastName: string | undefined | null;
  profileImage: string | undefined | null;
}) {
  noStore();
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      stripeCustomerId: true,
      id: true,
    },
  });

  if (!user) {
    const name = `${firstName ?? ""} ${lastName ?? ""}`;
    await prisma.user.create({
      data: {
        id: id,
        email: email,
        name: name,
      },
    });
  }

  if (!user?.stripeCustomerId) {
    const data = await stripe.customers.create({
      email: email,
    });

    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        stripeCustomerId: data.id,
      },
    });
  }
}

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();
  if (!user) {
    return null; // or redirect to sign-in page
  }

  await getUser({
    email: user.emailAddresses[0]?.emailAddress,
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    profileImage: user.imageUrl,
  });

  return (
    <div className="flex flex-col space-y-6 mt-10 px-4 md:px-6">
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] mx-auto">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav />
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
