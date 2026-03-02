"use client";

import { createContext, useContext } from "react";

type GetTokenFn = (
  resource?: string,
  organizationId?: string
) => Promise<string>;

const AuthContext = createContext<GetTokenFn | null>(null);

export function AuthProvider({
  children,
  getToken,
}: {
  children: React.ReactNode;
  getToken: GetTokenFn;
}) {
  return (
    <AuthContext.Provider value={getToken}>{children}</AuthContext.Provider>
  );
}

export function useAuthToken() {
  const getToken = useContext(AuthContext);
  if (!getToken) {
    throw new Error("useAuthToken must be used within AuthProvider");
  }
  return getToken;
}
