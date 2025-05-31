import SubmitButton from "@/components/custom/SubmitButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { Edit, File, Trash2 } from "lucide-react";
import { revalidatePath, unstable_noStore as nostore } from "next/cache";
import Link from "next/link";
import React from "react";

const getData = async (userId: string) => {
  nostore();
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      Notes: true,
      subscription: {
        select: {
          status: true,
        },
      },
    },
  });

  return data;
};

const DashboardPage = async () => {
  const user = await currentUser();
  if (!user?.id) {
    return <div className="p-8 text-center">User not found.</div>;
  }
  const data = await getData(user.id);

  async function deleteNote(formData: FormData) {
    "use server";

    const note = formData.get("noteId") as string;

    await prisma.note.delete({
      where: {
        id: note,
      },
    });

    revalidatePath("/dashboard");
  }
  return (
    <div className="grid items-start gap-y-8">
      <div className="flex justify-between px-2">
        <div className="grid gap-1">
          <h1 className="text-2xl md:text-3xl">Your Notes</h1>
          <p className="text-base text-muted-foreground">
            Here you can see and create new notes
          </p>
        </div>

        {data?.subscription?.status === "active" ? (
          <Button asChild>
            <Link href="/dashboard/new">Create a new Note</Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href="/dashboard/billing">Create a new Note</Link>
          </Button>
        )}
      </div>

      {data?.Notes.length == 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <File className="w-10 h-10 text-primary" />
          </div>

          <h2 className="mt-6 text-xl font-semibold">
            You dont have any notes created
          </h2>
          <p className="mb-8 mt-2 text-center text-sm leading-6 text-muted-foreground max-w-sm mx-auto">
            You currently dont have any notes. please create some so that you
            can see them right here.
          </p>

          {data?.subscription?.status === "active" ? (
            <Button asChild>
              <Link href="/dashboard/new">Create a new Note</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/dashboard/billing">Create a new Note</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-y-4">
          {data?.Notes.map((item) => (
            <Card
              key={item.id}
              className="flex flex-row items-center justify-between p-4"
            >
              <div>
                <h2 className="font-semibold text-xl text-primary">
                  {item.title}
                </h2>
                <p>
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "full",
                  }).format(new Date(item.createdAt))}
                </p>
              </div>

              <div className="flex items-center gap-x-4">
                <Link href={`/dashboard/new/${item.id}`}>
                  <Button variant="outline" size="icon">
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>
                <form action={deleteNote}>
                  <input type="hidden" name="noteId" value={item.id} />
                  <SubmitButton>
                    <Trash2 size={6} />
                  </SubmitButton>
                </form>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
