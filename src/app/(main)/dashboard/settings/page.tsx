import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import SubmitButton from "@/components/custom/SubmitButton";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";

async function getSettings(userId: string) {
  noStore();
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      email: true,
      colorScheme: true,
    },
  });

  return data;
}

const SettingsPage = async () => {
  const user = await currentUser();
  if (!user) {
    return null;
  }
  const data = await getSettings(user.id);

  async function postData(formdata: FormData) {
    "use server";

    const name = formdata.get("name") as string;
    const colorScheme = formdata.get("color") as string;

    await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        name: name ?? "",
        colorScheme: colorScheme ?? undefined,
      },
    });

    revalidatePath("/dashboard");
  }
  return (
    <div className="grid items-start gap-4">
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-1">
          <h1 className="text-3xl md:text-4xl font-bold">Settings</h1>
          <p className="text-lg text-muted-foreground">Your profile settings</p>
        </div>
      </div>

      <Card>
        <form action={postData}>
          <CardHeader>
            <CardTitle>General Data</CardTitle>
            <CardDescription>
              Please provide general information about yourself, please
              don&apos;t forget to save
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-5">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  placeholder="Enter your name"
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={data?.name || undefined}
                />
              </div>

              <div className="flex flex-col gap-y-2">
                <Label htmlFor="email">Your Email</Label>
                <Input
                  placeholder="Enter your email"
                  type="email"
                  id="email"
                  name="email"
                  disabled
                  defaultValue={data?.email as string}
                />
              </div>

              <div className="flex flex-col gap-y-2">
                <Label>Color Scheme</Label>
                <Select name="color" defaultValue={data?.colorScheme}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Colors</SelectLabel>
                      <SelectItem value="theme-green">Green</SelectItem>
                      <SelectItem value="theme-blue">Blue</SelectItem>
                      <SelectItem value="theme-violet">Violet</SelectItem>
                      <SelectItem value="theme-yellow">Yellow</SelectItem>
                      <SelectItem value="theme-orange">Orange</SelectItem>
                      <SelectItem value="theme-red">Red</SelectItem>
                      <SelectItem value="theme-rose">Rose</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>

          <CardFooter className="mt-3">
            <SubmitButton>Save now</SubmitButton>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SettingsPage;
