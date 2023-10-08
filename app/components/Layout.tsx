"use client";

import React, { useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {

  //children in client component is server component by default https://www.youtube.com/watch?v=c8Q_Kp_lDng
  useEffect(() => {
    document.getElementsByTagName("html")[0].classList.remove("light");
    document.getElementsByTagName("html")[0].classList.add("dark");
  });

  return (
    <div
      className="bg-background text-title
    min-h-screen transition-colors duration-300 pt-[62px]"
    >
      {children}
    </div>
  );
}
