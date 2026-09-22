"use client";

import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async () => {
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
      } else {
        await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
      }

      router.push("/builder");
    } catch (error: any) {
      console.error("Authentication error:", error);

      if (error?.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please log in.");
      } else if (error?.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (error?.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else if (
        error?.code === "auth/invalid-credential" ||
        error?.code === "auth/wrong-password" ||
        error?.code === "auth/user-not-found"
      ) {
        setError("Incorrect email or password.");
      } else {
        setError(
          "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-md">

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black">
            CV<span className="text-blue-500">Forge</span>
          </h1>

          <p className="mt-3 text-slate-400">
            {isLogin
              ? "Welcome back. Sign in to continue."
              : "Create your CVForge account."}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

          <h2 className="text-2xl font-black">
            {isLogin ? "Sign In" : "Create Account"}
          </h2>

          <div className="mt-6 space-y-4">

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-500"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleAuth}
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-5 py-3 font-bold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </button>

          </div>

          <div className="mt-6 border-t border-white/10 pt-6 text-center">

            <p className="text-sm text-slate-400">
              {isLogin
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>

            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="mt-2 text-sm font-bold text-blue-400 hover:text-blue-300"
            >
              {isLogin
                ? "Create an account"
                : "Sign in instead"}
            </button>

          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          CVForge — Build smarter. Apply stronger.
        </p>

      </div>
    </main>
  );
}