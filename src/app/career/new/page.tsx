"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { PlayerPosition } from "@/types/database.types";

type Club = {
  id: string;
  name: string;
  short_name: string;
  country: string | null;
  reputation: number;
};

const POSITIONS: PlayerPosition[] = ["GK", "CB", "LB", "RB", "CDM", "CM", "CAM", "LW", "RW", "ST"];

export default function NewCareerPage() {
  const router = useRouter();
  const supabase = createClient();

  const [userId, setUserId] = useState<string | null>(null);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [mode, setMode] = useState<"player" | "manager">("manager");
  const [clubId, setClubId] = useState("");
  const [saveName, setSaveName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [position, setPosition] = useState<PlayerPosition>("ST");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUserId(user.id);

      const { data } = await supabase
        .from("clubs")
        .select("id, name, short_name, country, reputation")
        .order("reputation", { ascending: false });
      setClubs(data ?? []);
      if (data && data.length > 0) setClubId(data[0].id);
    }
    init();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId || !clubId) return;
    setLoading(true);
    setError(null);

    let playerId: string | null = null;

    if (mode === "player") {
      const birthYear = new Date().getFullYear() - 17;
      const { data: player, error: playerError } = await supabase
        .from("players")
        .insert({
          club_id: clubId,
          first_name: firstName,
          last_name: lastName,
          nationality: "Brasil",
          birth_date: `${birthYear}-01-01`,
          preferred_foot: "right",
          position,
          overall_rating: 55,
          potential_rating: 80,
          market_value: 250000,
          wage: 2000,
          is_user_controlled: true,
        })
        .select("id")
        .single();

      if (playerError || !player) {
        setError("Não foi possível criar o jogador. Tente novamente.");
        setLoading(false);
        return;
      }
      playerId = player.id;

      await supabase.from("player_attributes").insert({
        player_id: playerId,
        pace: 55, shooting: 55, passing: 55, dribbling: 55, defending: 40, physical: 50,
        gk_diving: null, gk_handling: null, gk_reflexes: null,
        form: 5, morale: 70, fitness: 100,
      });
    }

    const { error: careerError } = await supabase.from("careers").insert({
      profile_id: userId,
      mode,
      club_id: clubId,
      player_id: playerId,
      save_name: saveName || "Minha Carreira",
    });

    if (careerError) {
      setError("Não foi possível criar a carreira. Tente novamente.");
      setLoading(false);
      return;
    }

    router.push("/career");
  }

  return (
    <main className="min-h-screen bg-pitch-900 px-6 py-16">
      <div className="mx-auto max-w-lg">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-signal-500">Nova Carreira</p>
        <h1 className="mt-2 text-4xl font-extrabold uppercase text-ink-100">Comece sua jornada</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="text-sm text-ink-500">Nome da carreira</label>
            <input value={saveName} onChange={(e) => setSaveName(e.target.value)} placeholder="Ex: Rumo ao topo"
              className="mt-1 w-full rounded-md border border-pitch-600 bg-pitch-800 px-3 py-2 text-ink-100 outline-none focus:border-signal-500" />
          </div>

          <div>
            <label className="text-sm text-ink-500">Modo de carreira</label>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setMode("player")}
                className={`rounded-lg border p-4 text-left ${mode === "player" ? "border-signal-500 bg-pitch-800" : "border-pitch-600 bg-pitch-800/50"}`}>
                <p className="font-bold text-ink-100">Jogador</p>
                <p className="mt-1 text-xs text-ink-500">Suba do zero em campo</p>
              </button>
              <button type="button" onClick={() => setMode("manager")}
                className={`rounded-lg border p-4 text-left ${mode === "manager" ? "border-signal-500 bg-pitch-800" : "border-pitch-600 bg-pitch-800/50"}`}>
                <p className="font-bold text-ink-100">Treinador</p>
                <p className="mt-1 text-xs text-ink-500">Comande um clube</p>
              </button>
            </div>
          </div>

          {mode === "player" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-ink-500">Nome</label>
                <input required value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 w-full rounded-md border border-pitch-600 bg-pitch-800 px-3 py-2 text-ink-100 outline-none focus:border-signal-500" />
              </div>
              <div>
                <label className="text-sm text-ink-500">Sobrenome</label>
                <input required value={lastName} onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 w-full rounded-md border border-pitch-600 bg-pitch-800 px-3 py-2 text-ink-100 outline-none focus:border-signal-500" />
              </div>
              <div className="col-span-2">
                <label className="text-sm text-ink-500">Posição</label>
                <select value={position} onChange={(e) => setPosition(e.target.value as PlayerPosition)}
                  className="mt-1 w-full rounded-md border border-pitch-600 bg-pitch-800 px-3 py-2 text-ink-100 outline-none focus:border-signal-500">
                  {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="text-sm text-ink-500">Clube</label>
            <select value={clubId} onChange={(e) => setClubId(e.target.value)}
              className="mt-1 w-full rounded-md border border-pitch-600 bg-pitch-800 px-3 py-2 text-ink-100 outline-none focus:border-signal-500">
              {clubs.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.country})</option>)}
            </select>
          </div>

          {error && <p className="text-sm text-alert-500">{error}</p>}

          <button type="submit" disabled={loading || !clubId}
            className="w-full rounded-md bg-signal-500 py-2.5 font-bold text-pitch-900 disabled:opacity-50">
            {loading ? "Criando..." : "Começar Carreira"}
          </button>
        </form>
      </div>
    </main>
  );
}
