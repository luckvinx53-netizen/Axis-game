import Link from "next/link";

const pillars = [
  { label: "Carreira de Jogador", detail: "Suba do zero, ganhe a titularidade e conquiste o mundo em campo." },
  { label: "Carreira de Treinador", detail: "Monte o elenco, defina a tática e responda pela diretoria." },
  { label: "Motor de Simulação", detail: "Resultados guiados por atributos, forma e decisões — partida a partida." },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-stadium-glow">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-24">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-signal-500">Alpha</p>
        <h1 className="mt-4 text-6xl font-extrabold uppercase leading-[0.95] tracking-tight text-ink-100 sm:text-8xl">
          Axis
          <span className="block text-transparent [-webkit-text-stroke:2px_theme(colors.gold.500)]">Game</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-ink-300">
          O simulador de futebol completo: carreira de jogador, carreira de treinador, transferências, treinamento e a sua sala de troféus.
        </p>

        <div className="mt-8">
          <Link href="/login" className="inline-block rounded-md bg-signal-500 px-6 py-3 font-bold text-pitch-900">
            Entrar / Criar Conta
          </Link>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {pillars.map((pillar) => (
            <div key={pillar.label} className="rounded-lg border border-pitch-600 bg-pitch-800/60 p-5">
              <h2 className="text-xl font-bold text-ink-100">{pillar.label}</h2>
              <p className="mt-2 text-sm text-ink-500">{pillar.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
