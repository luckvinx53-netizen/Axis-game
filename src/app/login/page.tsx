"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });
      if (error) {
        setError(traduzErro(error.message));
        setLoading(false);
        return;
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(traduzErro(error.message));
        setLoading(false);
        return;
      }
    }

    router.push("/career");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-pitch-900 px-6">
      <div className="w-full max-w-sm">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-signal-500">Axis Game</p>
        <h1 className="mt-2 text-4xl font-extrabold uppercase text-ink-100">
          {mode === "login" ? "Entrar" : "Criar Conta"}
        </h1>

        <div className="mt-6 flex gap-2 text-sm">
          <button type="button" onClick={() => setMode("login")}
            className={`rounded-md px-3 py-1.5 ${mode === "login" ? "bg-signal-500 text-pitch-900" : "bg-pitch-800 text-ink-500"}`}>
            Entrar
          </button>
          <button type="button" onClick={() => setMode("signup")}
            className={`rounded-md px-3 py-1.5 ${mode === "signup" ? "bg-signal-500 text-pitch-900" : "bg-pitch-800 text-ink-500"}`}>
            Criar Conta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <div>
              <label className="text-sm text-ink-500">Nome de usuário</label>
              <input required value={username} onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full rounded-md border border-pitch-600 bg-pitch-800 px-3 py-2 text-ink-100 outline-none focus:border-signal-500" />
            </div>
          )}
          <div>
            <label className="text-sm text-ink-500">E-mail</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-pitch-600 bg-pitch-800 px-3 py-2 text-ink-100 outline-none focus:border-signal-500" />
          </div>
          <div>
            <label className="text-sm text-ink-500">Senha</label>
            <input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-pitch-600 bg-pitch-800 px-3 py-2 text-ink-100 outline-none focus:border-signal-500" />
          </div>

          {error && <p className="text-sm text-alert-500">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full rounded-md bg-signal-500 py-2.5 font-bold text-pitch-900 disabled:opacity-50">
            {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar Conta"}
          </button>
        </form>
      </div>
    </main>
  );
}

function traduzErro(msg: string) {
  if (msg.includes("Invalid login credentials")) return "E-mail ou senha incorretos.";
  if (msg.includes("already registered")) return "Esse e-mail já está cadastrado.";
  return msg;
}
