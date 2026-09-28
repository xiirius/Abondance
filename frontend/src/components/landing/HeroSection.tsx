import { motion, useReducedMotion } from "motion/react";
import { BookCover } from "./BookCover";
import { useCheckout } from "@/lib/useCheckout";
import { formatPrice, type SiteConfig } from "@/lib/useConfig";
import { Loader2, Download, Smartphone, Lock } from "lucide-react";

interface HeroSectionProps {
  prenom: string | null;
  config: SiteConfig;
}

const lineVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

export function HeroSection({ prenom, config }: HeroSectionProps) {
  const reduce = useReducedMotion();
  const { startCheckout, loading, error } = useCheckout();
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

          <motion.div
            initial={reduce ? false : "hidden"}
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.14, delayChildren: 0.7 } } }}
            className="mt-7 max-w-xl text-base leading-relaxed text-muted-warm sm:text-lg"
            data-testid="hero-subtitle"
          >
            <motion.p variants={lineVariants} className="font-heading text-xl italic leading-snug text-ink sm:text-2xl">
              En attendant votre lecture, prenez quelques minutes pour découvrir la suite : vous
              risqueriez de passer à côté de l'essentiel.
            </motion.p>
            <motion.p variants={lineVariants} className="pt-6">
              J'ai créé un guide basé sur mes{" "}
              <span className="font-heading font-bold italic text-[#6F4A1C]">52 années de pratique et d'expérience</span>{" "}
              autour de <span className="font-medium text-sage-deep">la méditation</span>,{" "}
              <span className="font-medium text-sage-deep">du développement personnel</span>,{" "}
              <span className="font-medium text-sage-deep">de l'énergie</span> et{" "}
              <span className="font-medium text-sage-deep">de la spiritualité</span>.
            </motion.p>
            <motion.p variants={lineVariants} className="pt-6 font-bold text-forest">
              <em>Le Guide de l'Abondance Intérieure</em> vous propose un cheminement simple, à
              votre rythme :
            </motion.p>
            <motion.ul variants={lineVariants} className="space-y-3.5 pt-5">
              {[
                "des repères pour mieux comprendre ce que vous traversez ;",
                "des exercices d'écriture pour prendre du recul et clarifier vos pensées ;",
                "des rituels faciles à intégrer à votre quotidien ;",
                "un parcours de 30 jours pour mettre progressivement ces pratiques en place.",
              ].map((item) => (
                <li key={item} className="flex items-baseline gap-3">
                  <span className="shrink-0 font-heading text-gold" aria-hidden="true">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </motion.ul>
            <motion.p variants={lineVariants} className="pt-6">
              L'idée n'est pas de tout changer d'un coup, mais de vous donner des outils concrets
              pour{" "}
              <span className="font-heading italic text-gold">avancer sereinement, un jour après l'autre</span>.
            </motion.p>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.95 }}
            className="mt-10"
          >
            <p className="font-sans text-sm text-muted-warm" data-testid="hero-note">
              Votre lecture gratuite arrive prochainement dans votre boîte mail.
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
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.15 }}
            className="mt-12 text-center"
          >
            <button
              onClick={startCheckout}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-9 py-4 font-sans text-base font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-[#2D4B39] hover:shadow-xl disabled:opacity-60 disabled:hover:translate-y-0"
              data-testid="hero-buy-button"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Redirection…" : `Accéder au guide pour ${formatPrice(config.price_euros)}`}
            </button>
            {error && (
              <p className="mt-3 text-sm text-[#A63D40]" data-testid="hero-checkout-error">{error}</p>
            )}
            <ul className="mx-auto mt-7 w-fit space-y-3 text-left" data-testid="hero-features-list">
              {[
                { icon: Download, label: "PDF numérique, accès immédiat après paiement" },
                { icon: Smartphone, label: "Lecture sur téléphone, tablette ou ordinateur" },
                { icon: Lock, label: "Paiement sécurisé via Stripe (CB, Apple Pay)" },
              ].map((f) => (
                <li key={f.label} className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage text-sage-deep">
                    <f.icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </span>
                  <span className="font-sans text-xs leading-snug text-muted-warm sm:text-sm">{f.label}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 font-sans text-xs text-muted-warm">
              Paiement unique sécurisé. Téléchargement immédiat.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
