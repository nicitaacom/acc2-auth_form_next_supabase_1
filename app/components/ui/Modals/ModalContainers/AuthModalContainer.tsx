"use client";
import { useSearchParams } from "next/navigation";
import React from "react";

export function AuthModalContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  //If you put import AdminModal.tsx in client component (e.g this component) it also becomes a client component
  const searchParams = useSearchParams();
  return <>{searchParams.getAll("modal").includes("AuthModal") && children}</>;
}
