import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";

const StripeSuccessPage = () => {
  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-[350px]">
        <div className="p-6">
          <div className="flex items-center justify-center">
            <CheckCircle2Icon className="size-12 p-2 text-primary bg-primary/30 rounded-full" />
          </div>

          <div className="mt-3 sm:mt-5 text-center w-full ">
            <h3 className="text-lg leading-6 font-medium">
              Payment Successful
            </h3>
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">
                Congrats on your subscription!!🌟🌟..Please check your e-mail to
                move on
              </p>
            </div>

            <div className="mt-4 sm:mt-6 w-full">
              <Button className="full" asChild>
                <Link href={"/"}>Go back to Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StripeSuccessPage;
