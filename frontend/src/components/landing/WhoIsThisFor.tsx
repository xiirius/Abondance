import { Reveal } from "./Reveal";
import { Check, X } from "lucide-react";

export function WhoIsThisFor() {
  return (
    <section className="bg-sand/70 py-24 sm:py-32" data-testid="who-section">
      <div className="mx-auto max-w-5xl px-5">
        <Reveal>
          <p className="mb-5 text-center font-sans text-xs font-medium uppercase tracking-[0.24em] text-[#7D6B4E]">
            À qui il s'adresse
          </p>
          <h2 className="mx-auto max-w-2xl text-center font-heading text-3xl leading-[1.15] tracking-tight text-ink sm:text-4xl">
            Un guide pensé pour votre rythme
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <Reveal delay={0.08}>
            <div className="h-full rounded-3xl border border-sage-deep/20 bg-sage p-8 sm:p-10" data-testid="who-for-card">
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/70 text-sage-deep">
                <Check className="h-5 w-5" strokeWidth={2} />
              </div>
              <h3 className="font-heading text-2xl tracking-tight text-[#1E2E25]">Ce guide est fait pour vous si…</h3>
              <p className="mt-4 text-base leading-relaxed text-[#415C4D]">
                … vous ressentez le besoin de ralentir, de remettre du sens dans votre quotidien, de
                retrouver confiance en votre chemin ou de créer une relation plus apaisée avec vos
                aspirations.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="h-full rounded-3xl border border-line bg-white p-8 sm:p-10" data-testid="who-not-for-card">
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-cream text-muted-warm">
                <X className="h-5 w-5" strokeWidth={2} />
              </div>
              <h3 className="font-heading text-2xl tracking-tight text-ink">Il n'est pas fait pour vous si…</h3>
              <p className="mt-4 text-base leading-relaxed text-muted-warm">
                … vous recherchez une promesse de richesse immédiate, une prédiction certaine ou une
                solution magique. Ici, on avance honnêtement, pas à pas.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
