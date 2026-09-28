import { motion, useReducedMotion } from "motion/react";
import { BookCover } from "./BookCover";
import { scrollToId } from "@/lib/scroll";

interface HeroSectionProps {
  prenom: string | null;
}

export function HeroSection({ prenom }: HeroSectionProps) {
  const reduce = useReducedMotion();
  const lines = [
    `Bienvenue${prenom ? ` ${prenom}` : ""},`,
    "votre lecture gratuite",
    "est en préparation.",
  ];

  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28" data-testid="hero-section">
      <div className="pointer-events-none absolute -top-24 right-[-10%] h-96 w-96 rounded-full aura" aria-hidden="true" />
      <svg className="pointer-events-none absolute left-[8%] top-24 hidden text-gold/60 lg:block" width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true">
        <circle cx="60" cy="60" r="42" stroke="currentColor" strokeWidth="1" strokeDasharray="2 6" />
        <path d="M70 42a22 22 0 1 0 0 36 18 18 0 0 1 0-36z" fill="currentColor" opacity="0.5" />
      </svg>

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-6 font-sans text-xs font-medium uppercase tracking-[0.24em] text-[#7D6B4E]"
            data-testid="hero-overline"
          >
            Votre lecture personnalisée
          </motion.p>

          <h1 className="font-heading text-4xl leading-[1.15] tracking-tight text-ink sm:text-5xl lg:text-6xl" data-testid="hero-title">
            {lines.map((line, i) => (
              <span className="line-mask" key={line}>
                <motion.span
                  initial={reduce ? false : { y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.14, ease: [0.22, 1, 0.36, 1] }}
                >
                  {i === 0 ? line : <span className={i === 1 ? "italic text-sage-deep" : "italic text-gold"}>{line}</span>}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="mt-7 max-w-xl text-base leading-relaxed text-muted-warm sm:text-lg"
            data-testid="hero-subtitle"
          >
            Si cette lecture vous a donné envie de vous reconnecter à vous-même,{" "}
            <em className="text-ink">Le Guide de l'Abondance Intérieure</em> peut vous accompagner
            plus loin, à votre rythme.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.95 }}
            className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
          >
            <button
              onClick={() => scrollToId("guide")}
              className="rounded-full bg-forest px-9 py-4 font-sans text-base font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-[#2D4B39] hover:shadow-xl"
              data-testid="hero-discover-button"
            >
              Découvrir le guide
            </button>
            <p className="font-sans text-sm text-muted-warm">
              Votre lecture arrive prochainement dans votre boîte mail.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5"
        >
          <BookCover />
        </motion.div>
      </div>
    </section>
  );
}
