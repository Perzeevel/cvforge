"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";

type AuthGuardProps = {
  children: React.ReactNode;
};

export default function AuthGuard({
  children,
}: AuthGuardProps) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        if (!currentUser) {
          router.replace("/auth");
          return;
        }

        setUser(currentUser);
        setChecking(false);
      }
    );

    return () => unsubscribe();
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="text-2xl font-black">
            CV<span className="text-blue-500">Forge</span>
          </div>

          <p className="mt-3 text-sm text-slate-400">
            Checking your account...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}