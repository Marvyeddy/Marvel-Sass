import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { getStripeSession, stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import SubmitButton from "@/components/custom/SubmitButton";
import { unstable_noStore as noStore } from "next/cache";

const featureItems = [
  {
    name: "Lorem ipsum something",
  },
  {
    name: "Lorem ipsum something",
  },
  {
    name: "Lorem ipsum something",
  },
  {
    name: "Lorem ipsum something",
  },
  {
    name: "Lorem ipsum something",
  },
];

const getData = async (userId: string) => {
  noStore();
  const data = await prisma.subscription.findUnique({
    where: {
      userId: userId,
    },
    select: {
      status: true,
      user: {
        select: {
          stripeCustomerId: true,
        },
      },
    },
  });

  return data;
};

const BillingPage = async () => {
  const user = await currentUser();
  if (!user) {
    return null;
  }
  const data = await getData(user.id);

  const createSubscription = async () => {
    "use server";

    const dbUser = await prisma.user.findUnique({
      where: {
        id: user?.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    if (!dbUser?.stripeCustomerId) {
      throw new Error("Unable to get stripe customer id");
    }

    const subscriptionUrl = await getStripeSession({
      customerId: dbUser?.stripeCustomerId as string,
      priceId: process.env.STRIPE_PRICE_ID!,
      domainUrl: `https://marvel-sass.vercel.app`,
    });

    return redirect(subscriptionUrl);
  };

  const viewPayment = async () => {
    "use server";
    const session = await stripe.billingPortal.sessions.create({
      customer: data?.user.stripeCustomerId as string,
      return_url: "https://marvel-sass.vercel.app/dashboard",
    });

    return redirect(session.url);
  };

  if (data?.status === "active") {
    return (
      <div className="grid items-start gap-8">
        <div className="flex items-center justify-between px-2">
          <div className="grid gap-1">
            <h1 className="text-3xl md:text-4xl">Subscription</h1>
            <p className="text-lg text-muted-foreground">
              Settings regarding your subscription
            </p>
          </div>
        </div>

        <Card className="w-full lg:w-2/3">
          <CardHeader>
            <CardTitle>Edit subscription</CardTitle>
            <CardDescription>
              Click on the button below and this will give you the opportunity
              to change your payment details and statement at the same time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={viewPayment}>
              <SubmitButton>View Payment Details</SubmitButton>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <Card className="flex flex-col">
        <CardContent className="py-4">
          <div>
            <h1 className="inline-flex px-4 py-1 rounded-full text-sm uppercase tracking-wide font-semibold bg-primary/10 text-primary">
              Monthly
            </h1>
          </div>

          <div className="mt-4 flex items-baseline text-6xl font-extrabold">
            $30{" "}
            <span className="ml-1 text-2xl font-medium text-muted-foreground">
              /mo
            </span>
          </div>

          <p className="mt-5 text-lg text-muted-foreground">
            Write and save your notes as you like for $30 a month
          </p>
        </CardContent>
        <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-secondary rounded-lg m-1 space-y-6 sm:p-10 sm:pt-6">
          <ul className="space-y-4">
            {featureItems.map((item, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <CheckCircle className="size-6 text-primary" />
                </div>
                <p className="text-base">{item.name}</p>
              </li>
            ))}
          </ul>

          <form action={createSubscription}>
            <SubmitButton className="w-full">Buy Today</SubmitButton>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default BillingPage;
