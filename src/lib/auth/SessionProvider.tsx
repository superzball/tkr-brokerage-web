// src/lib/auth/SessionProvider.tsx
// Client session context. The (app) server layout reads the httpOnly cookie
// with getSession() and feeds the user in here, so client components (TopBar,
// user menu) can read it via useSession() without another round-trip.

"use client";

import { createContext, useContext } from "react";
import type { User } from "@/types/portal";

const SessionContext = createContext<User | null>(null);

export function SessionProvider({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  return (
    <SessionContext.Provider value={user}>{children}</SessionContext.Provider>
  );
}

/** The signed-in user. Throws if used outside the authenticated (app) shell. */
export function useSession(): User {
  const user = useContext(SessionContext);
  if (!user) {
    throw new Error("useSession must be used within the (app) SessionProvider");
  }
  return user;
}
