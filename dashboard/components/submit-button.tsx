"use client";

import { Button } from "@components/ui/button";
import { type ComponentProps } from "react";
import { useFormStatus } from "react-dom";

type Props = ComponentProps<typeof Button> & {
  pendingText?: string;
  className?: string;
};

export function SubmitButton({
  children,
  pendingText = "Submitting...",
  className,
  ...props
}: Props) {
  const { pending } = useFormStatus();


  return (
    <Button type="submit" className={className} aria-disabled={pending} {...props}>
      {pending ? pendingText : children}
    </Button>
  );
}
