import { Reveal } from "./Reveal";
import { ShieldCheck } from "lucide-react";

const IMG =
  "https://images.unsplash.com/photo-1654542645844-590f5b8c146a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwzfHxqb3VybmFsJTIwb3BlbiUyMGJvb2slMjBnb2xkZW4lMjBsaWdodCUyMGRlc2t8ZW58MHx8fHwxNzkwNTU0MTIxfDA&ixlib=rb-4.1.0&q=85";

export function WhyThisGuide() {
  return (
    <section id="guide" className="py-24 sm:py-32" data-testid="why-guide-section">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <p className="mb-5 font-sans text-xs font-medium uppercase tracking-[0.24em] text-[#7D6B4E]">
            Pourquoi ce guide ?
          </p>
          <h2 className="font-heading text-3xl leading-[1.15] tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Un guide pour revenir <span className="italic text-sage-deep">à l'essentiel</span>
          </h2>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-warm sm:text-lg">
            L'abondance ne se limite pas à l'argent. Elle peut aussi prendre la forme de sérénité, de
            confiance, de relations plus justes, d'occasions nouvelles et d'une vie plus alignée avec
            vos besoins profonds.
          </p>
          <div className="mt-9 flex max-w-xl items-start gap-4 rounded-2xl border border-gold/30 bg-sand/60 p-6">
            <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-gold" strokeWidth={1.5} />
            <p className="text-sm leading-relaxed text-ink/90">
              En toute honnêteté : ce guide ne promet pas de résultats miraculeux, ne prédit pas
              l'avenir et ne remplace pas une aide médicale, psychologique, juridique ou financière.
              C'est un support d'introspection et de passage à l'action, à votre rythme.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.15} className="lg:col-span-5">
          <div className="relative">
            <div className="absolute -inset-3 rounded-[2rem] border border-gold/30" aria-hidden="true" />
            <img
              src={IMG}
              alt="Carnet ouvert dans une lumière douce, invitation à l'introspection"
              className="aspect-[4/5] w-full rounded-[1.75rem] object-cover book-shadow"
              loading="lazy"
              data-testid="why-guide-image"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
