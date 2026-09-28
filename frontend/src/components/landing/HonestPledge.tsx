import { Reveal } from "./Reveal";
import { Star } from "lucide-react";

export function HonestPledge() {
  return (
    <section className="relative overflow-hidden bg-night py-24 sm:py-32" data-testid="honest-pledge-section">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full aura opacity-70" aria-hidden="true" />
      <Star className="star-twinkle pointer-events-none absolute left-[12%] top-[22%] h-3 w-3 text-gold-soft/70" aria-hidden="true" />
      <Star className="star-twinkle pointer-events-none absolute right-[16%] top-[35%] h-2 w-2 text-gold-soft/50" style={{ animationDelay: "1.2s" }} aria-hidden="true" />
      <Star className="star-twinkle pointer-events-none absolute bottom-[20%] left-[24%] h-2.5 w-2.5 text-gold-soft/60" style={{ animationDelay: "2s" }} aria-hidden="true" />
      <div className="relative mx-auto max-w-3xl px-5 text-center">
        <Reveal>
          <p className="mb-6 font-sans text-xs font-medium uppercase tracking-[0.24em] text-gold-soft">
            Notre engagement
          </p>
          <h2 className="font-heading text-3xl leading-[1.2] tracking-tight text-[#FDFCFA] sm:text-4xl lg:text-5xl">
            Pas une promesse magique.
            <span className="mt-2 block italic text-gold-soft">Un espace pour avancer.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-[#DDD4C8] sm:text-lg">
            Le Guide de l'Abondance Intérieure ne vous promet pas que tout changera du jour au
            lendemain. Il vous propose plutôt des repères, des exercices et un temps pour vous
            recentrer. Les résultats dépendent de votre situation, de votre implication et des actions
            que vous choisissez de mettre en place.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
