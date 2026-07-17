"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type CareerView = {
  id: string;
  mode: "player" | "manager";
  save_name: string;
  club: { name: string; short_name: string; country: string | null; budget_transfer: number; reputation: number } | null;
  player: { first_name: string; last_name: string; position: string; overall_rating: number } | null;
};

export default function CareerPage() {
  const router = useRouter();
  const supabase = createClient();
  const [career, setCareer] = useState<CareerView | null>(null);
  const [loadingState, setLoadingState] = useState<"loading" | "empty" | "ready">("loading");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("careers")
        .select(`
          id, mode, save_name,
          club:clubs ( name, short_name, country, budget_transfer, reputation ),
          player:players ( first_name, last_name, position, overall_rating )
        `)
        .eq("profile_id", user.id)
        .order("last_played_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!data) {
        setLoadingState("empty");
        return;
      }

      setCareer(data as unknown as CareerView);
      setLoadingState("ready");
    }
    load();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loadingState === "loading") {
    return <main className="flex min-h-screen items-center justify-center bg-pitch-900 text-ink-500">Carregando...</main>;
  }

  if (loadingState === "empty") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-pitch-900 px-6 text-center">
        <p className="text-ink-300">Você ainda não tem nenhuma carreira.</p>
        <Link href="/career/new" className="rounded-md bg-signal-500 px-5 py-2.5 font-bold text-pitch-900">
          Criar Carreira
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-pitch-900 px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-signal-500">
            {career?.mode === "player" ? "Modo Jogador" : "Modo Treinador"}
          </p>
          <button onClick={handleLogout} className="text-xs text-ink-500 underline">Sair</button>
        </div>

        <h1 className="mt-2 text-4xl font-extrabold uppercase text-ink-100">{career?.save_name}</h1>

        <div className="mt-8 rounded-lg border border-pitch-600 bg-pitch-800/60 p-6">
          <p className="text-xs uppercase tracking-wide text-ink-500">Clube</p>
          <p className="mt-1 text-2xl font-bold text-ink-100">{career?.club?.name ?? "—"}</p>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-ink-500">Orçamento de transferências</p>
              <p className="font-mono text-lg text-gold-500">
                € {career?.club?.budget_transfer?.toLocaleString("pt-BR") ?? 0}
              </p>
            </div>
            <div>
              <p className="text-ink-500">Reputação</p>
              <p className="font-mono text-lg text-ink-100">{career?.club?.reputation ?? "—"}/100</p>
            </div>
          </div>
        </div>

        {career?.mode === "player" && career.player && (
          <div className="mt-4 rounded-lg border border-pitch-600 bg-pitch-800/60 p-6">
            <p className="text-xs uppercase tracking-wide text-ink-500">Seu jogador</p>
            <p className="mt-1 text-2xl font-bold text-ink-100">
              {career.player.first_name} {career.player.last_name}
            </p>
            <div className="mt-4 flex gap-6 text-sm">
              <div>
                <p className="text-ink-500">Posição</p>
                <p className="font-mono text-lg text-ink-100">{career.player.position}</p>
              </div>
              <div>
                <p className="text-ink-500">Overall</p>
                <p className="font-mono text-lg text-signal-500">{career.player.overall_rating}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/trophy-room" className="rounded-md border border-gold-500 px-4 py-2 text-sm font-bold text-gold-500">
            Sala de Troféus
          </Link>
          <span className="rounded-md border border-pitch-600 px-4 py-2 text-sm text-ink-700">Elenco (em breve)</span>
          <span className="rounded-md border border-pitch-600 px-4 py-2 text-sm text-ink-700">Partidas (em breve)</span>
        </div>
      </div>
    </main>
  );
                }
