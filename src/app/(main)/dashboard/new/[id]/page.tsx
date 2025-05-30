import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

import { redirect } from "next/navigation";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import SubmitButton from "@/components/custom/SubmitButton";

async function getData({ userId, noteId }: { userId: string; noteId: string }) {
  noStore();
  const data = await prisma.note.findUnique({
    where: {
      id: noteId,
      userId: userId,
    },
    select: {
      title: true,
      description: true,
      id: true,
    },
  });

  return data;
}

export default async function DynamicRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await currentUser();
  if (!user) {
    return null;
  }
  const data = await getData({ userId: user?.id as string, noteId: id });

  async function postData(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    await prisma.note.update({
      where: {
        id: data?.id,
        userId: user?.id,
      },
      data: {
        description: description,
        title: title,
      },
    });

    revalidatePath("/dashboard");

    return redirect("/dashboard");
  }
  return (
    <Card>
      <form action={postData} className="space-y-4">
        <CardHeader>
          <CardTitle>Edit Note</CardTitle>
          <CardDescription>
            Right here you can now edit your notes
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-5">
          <div className="gap-y-2 flex flex-col">
            <Label>Title</Label>
            <Input
              required
              type="text"
              name="title"
              placeholder="Title for your note"
              defaultValue={data?.title}
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <Label>Description</Label>
            <Textarea
              name="description"
              placeholder="Describe your note as you want"
              required
              defaultValue={data?.description}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button asChild variant="destructive">
            <Link href="/dashboard">Cancel</Link>
          </Button>
          <SubmitButton>Save Now</SubmitButton>
        </CardFooter>
      </form>
    </Card>
  );
}
