import { Reveal } from "./Reveal";
import { Compass, Sun, Leaf, MoonStar, Heart, Footprints } from "lucide-react";

const BENEFITS = [
  { icon: Compass, title: "Comprendre ce qui freine", text: "Identifier les schémas de manque et les croyances qui limitent votre élan." },
  { icon: Sun, title: "Retrouver de la clarté", text: "Remettre de l'ordre dans vos pensées lorsque tout semble confus." },
  { icon: Leaf, title: "Des pratiques simples", text: "Gratitude, intention et ancrage : des rituels doux à intégrer au quotidien." },
  { icon: MoonStar, title: "Écouter son intuition", text: "Renouer avec votre boussole intérieure sans perdre votre esprit critique." },
  { icon: Heart, title: "Votre vision du bonheur", text: "Créer une définition personnelle de la réussite, qui vous ressemble vraiment." },
  { icon: Footprints, title: "Avancer concrètement", text: "Progresser pas à pas, même avec de petits gestes répétés chaque jour." },
];

export function BenefitsGrid() {
  return (
    <section className="bg-sage/50 py-24 sm:py-32" data-testid="benefits-section">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <p className="mb-5 text-center font-sans text-xs font-medium uppercase tracking-[0.24em] text-[#7D6B4E]">
            Ce que le guide apporte
          </p>
          <h2 className="mx-auto max-w-2xl text-center font-heading text-3xl leading-[1.15] tracking-tight text-ink sm:text-4xl">
            Des repères concrets, en douceur
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b, i) => (
            <Reveal key={b.title} delay={0.06 * i}>
              <article
                className="group h-full rounded-2xl border border-line bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-xl"
                data-testid={`benefit-card-${i + 1}`}
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-sage text-sage-deep transition-colors group-hover:bg-gold/15 group-hover:text-gold">
                  <b.icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h3 className="font-heading text-xl tracking-tight text-ink">{b.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-warm">{b.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
