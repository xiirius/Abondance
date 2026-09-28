import { Reveal } from "./Reveal";

const CONTENTS = [
  "Des explications simples sur l'abondance intérieure et l'alignement.",
  "Des exercices d'écriture et de réflexion pour clarifier ce que vous vivez.",
  "Des rituels doux pour commencer ou terminer votre journée.",
  "Des pratiques de visualisation et de gratitude accessibles à tous.",
  "Des pistes pour comprendre les blocages, les doutes et la peur de recevoir.",
  "Un programme concret sur 30 jours pour appliquer les idées progressivement.",
];

const IMG =
  "https://images.unsplash.com/photo-1658934475116-990b909c3038?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTF8MHwxfHNlYXJjaHwyfHxjYWxtJTIwYm90YW5pY2FsJTIwbGVhZiUyMHNvZnQlMjBzaGFkb3dzJTIwd2FybSUyMGJlaWdlfGVufDB8fHx8MTc5MDU1NDEyMXww&ixlib=rb-4.1.0&q=85";

export function ContentsSection() {
  return (
    <section id="contenu" className="py-24 sm:py-32" data-testid="contents-section">
      <div className="mx-auto grid max-w-6xl items-start gap-14 px-5 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <p className="mb-5 font-sans text-xs font-medium uppercase tracking-[0.24em] text-[#7D6B4E]">
            Ce qu'il contient
          </p>
          <h2 className="font-heading text-3xl leading-[1.15] tracking-tight text-ink sm:text-4xl">
            Un ebook complet <span className="italic text-gold">et pratique</span>
          </h2>
          <ol className="mt-10 space-y-6">
            {CONTENTS.map((item, i) => (
              <li key={i} className="flex items-start gap-5" data-testid={`content-item-${i + 1}`}>
                <span className="font-heading text-lg italic text-gold">{String(i + 1).padStart(2, "0")}</span>
                <div className="flex-1 border-b border-line pb-5">
                  <p className="text-base leading-relaxed text-ink/90">{item}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
        <Reveal delay={0.15} className="lg:sticky lg:top-28 lg:col-span-5">
          <div className="overflow-hidden rounded-[2rem] book-shadow">
            <img
              src={IMG}
              alt="Ombres végétales douces sur un mur crème"
              className="aspect-[4/5] w-full object-cover"
              loading="lazy"
              data-testid="contents-image"
            />
          </div>
          <p className="mt-5 text-center font-heading text-sm italic text-muted-warm">
            « Avancer doucement, c'est déjà avancer. »
          </p>
        </Reveal>
      </div>
    </section>
  );
}
