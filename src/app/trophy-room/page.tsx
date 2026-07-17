"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type TrophyRow = {
  id: string;
  won_at: string;
  trophy: { name: string; competition_name: string; tier: string } | null;
};

export default function TrophyRoomPage() {
  const supabase = createClient();
  const [clubName, setClubName] = useState<string>("");
  const [trophies, setTrophies] = useState<TrophyRow[]>([]);
  const [loadingState, setLoadingState] = useState<"loading" | "ready">("loading");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: career } = await supabase
        .from("careers")
        .select("club_id, club:clubs ( name )")
        .eq("profile_id", user.id)
        .order("last_played_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!career?.club_id) {
        setLoadingState("ready");
        return;
      }

      setClubName((career.club as any)?.name ?? "");

      const { data: clubTrophies } = await supabase
        .from("club_trophies")
        .select("id, won_at, trophy:trophies ( name, competition_name, tier )")
        .eq("club_id", career.club_id)
        .order("won_at", { ascending: false });

      setTrophies((clubTrophies as unknown as TrophyRow[]) ?? []);
      setLoadingState("ready");
    }
    load();
  }, []);

  return (
    <main className="min-h-screen bg-pitch-950 px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <Link href="/career" className="text-xs text-ink-500 underline">← Voltar</Link>

        <p className="mt-4 font-mono text-xs uppercase tracking-[0.3em] text-gold-500">Sala de Troféus</p>
        <h1 className="mt-2 text-4xl font-extrabold uppercase text-ink-100">{clubName || "Seu Clube"}</h1>

        {loadingState === "ready" && trophies.length === 0 && (
          <p className="mt-10 text-ink-500">Nenhum troféu ainda. Vença competições para preencher esta sala.</p>
        )}

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trophies.map((t) => (
            <div key={t.id} className="relative overflow-hidden rounded-lg border border-gold-600/40 bg-pitch-800 p-6">
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gold-500 shadow-[0_0_20px_4px_rgba(212,175,55,0.6)]" />
              <p className="text-xs uppercase tracking-wide text-ink-500">{t.trophy?.tier}</p>
              <p className="mt-2 text-xl font-bold text-ink-100">{t.trophy?.name}</p>
              <p className="mt-1 text-sm text-ink-500">{t.trophy?.competition_name}</p>
              <p className="mt-4 font-mono text-xs text-gold-500">{new Date(t.won_at).getFullYear()}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
                        }
