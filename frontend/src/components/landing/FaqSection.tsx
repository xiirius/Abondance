import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Reveal } from "./Reveal";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Est-ce une prédiction ?",
    a: "Non. Le contenu est proposé comme une démarche d'introspection et de développement personnel. Rien ici ne prétend prédire votre avenir.",
  },
  {
    q: "Vais-je recevoir le guide immédiatement ?",
    a: "Oui. Après confirmation du paiement, vous êtes redirigé vers une page de remerciement où le guide est disponible au téléchargement immédiat.",
  },
  {
    q: "Puis-je lire le guide sur mon téléphone ?",
    a: "Oui, le guide PDF est compatible avec téléphone, tablette et ordinateur. Vous pouvez le lire où que vous soyez.",
  },
  {
    q: "Est-ce un abonnement ?",
    a: "Non, c'est un paiement unique de 8,90 €. Aucun renouvellement, aucune surprise.",
  },
  {
    q: "Comment fonctionne ma lecture gratuite ?",
    a: "Elle est envoyée à l'adresse e-mail renseignée lors de votre inscription, dans les jours qui suivent.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-sage/40 py-24 sm:py-32" data-testid="faq-section">
      <div className="mx-auto max-w-3xl px-5">
        <Reveal>
          <p className="mb-5 text-center font-sans text-xs font-medium uppercase tracking-[0.24em] text-[#7D6B4E]">
            Questions fréquentes
          </p>
          <h2 className="text-center font-heading text-3xl leading-[1.15] tracking-tight text-ink sm:text-4xl">
            Vos questions, en toute transparence
          </h2>
        </Reveal>
        <div className="mt-12 space-y-4">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={0.05 * i}>
                <div className="overflow-hidden rounded-2xl border border-line bg-white" data-testid={`faq-accordion-item-${i + 1}`}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    aria-expanded={isOpen}
                    data-testid={`faq-question-${i + 1}`}
                  >
                    <span className="font-heading text-lg tracking-tight text-ink">{f.q}</span>
                    <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                      <ChevronDown className="h-5 w-5 text-gold" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p className="px-6 pb-6 text-sm leading-relaxed text-muted-warm" data-testid={`faq-answer-${i + 1}`}>
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
