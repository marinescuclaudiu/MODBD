import { ReactNode } from "react";
import { Outlet } from "react-router";

interface AuthLayoutProps {
  children?: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div>
      <h1>Auth Layout</h1>
      {children}
      <Outlet />
    </div>
  );
}
