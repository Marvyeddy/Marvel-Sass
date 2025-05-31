import React from "react";
import { Card } from "@/components/ui/card";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const StripeCancelPage = () => {
  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-[350px]">
        <div className="p-6">
          <div className="flex items-center justify-center">
            <XIcon className="size-12 p-2 text-red-500 bg-red-300/30 rounded-full" />
          </div>

          <div className="mt-3 sm:mt-5 text-center w-full ">
            <h3 className="text-lg leading-6 font-medium">Payment Failed</h3>
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">
                No worries, you won&apos;t be charged please try again
              </p>
            </div>

            <div className="mt-4 sm:mt-6 w-full">
              <Button className="full" asChild variant={"destructive"}>
                <Link href={"/"}>Go back to Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StripeCancelPage;
