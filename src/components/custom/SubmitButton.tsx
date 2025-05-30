"use client";

import { ReactNode } from "react";
import { Button } from "../ui/button";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

const SubmitButton = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className={`text-secondary ${className}`}
    >
      {pending ? <Loader2 className="animate-spin" /> : children}
    </Button>
  );
};

export default SubmitButton;
