"use client";

import { redirect } from "next/navigation";

export default function RedirectOnClick({
  url,
  children,
}: {
  url: string;
  children: React.ReactNode;
}) {
  return <button onClick={() => redirect(url)}>{children}</button>;
}
