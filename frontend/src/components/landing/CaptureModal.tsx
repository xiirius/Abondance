import { useState } from "react";
import { motion } from "motion/react";
import { Moon, Star } from "lucide-react";
import { apiPost } from "@/lib/api";

interface CaptureModalProps {
  onDone: (prenom: string, email: string) => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function CaptureModal({ onDone }: CaptureModalProps) {
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (prenom.trim().length < 2) return setError("Merci d'indiquer votre prénom.");
    if (!EMAIL_RE.test(email.trim())) return setError("Merci d'indiquer une adresse e-mail valide.");
    if (!consent) return setError("Merci de cocher la case de consentement pour continuer.");
    setLoading(true);
    try {
      await apiPost("/leads", { prenom: prenom.trim(), email: email.trim(), consent });
      localStorage.setItem("abondance_prenom", prenom.trim());
      localStorage.setItem("abondance_email", email.trim().toLowerCase());
      onDone(prenom.trim(), email.trim().toLowerCase());
    } catch {
      setError("Une petite erreur est survenue. Merci de réessayer dans un instant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-night/60 p-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      data-testid="capture-modal"
    >
      <motion.div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-8 shadow-2xl sm:p-10"
        initial={{ opacity: 0, y: 36, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 160, damping: 20, delay: 0.15 }}
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full aura" aria-hidden="true" />
        <div className="mb-6 flex items-center gap-3 text-gold">
          <Moon className="h-5 w-5" strokeWidth={1.5} />
          <Star className="h-3 w-3 star-twinkle" strokeWidth={1.5} />
          <span className="h-px flex-1 bg-gradient-to-r from-gold/50 to-transparent" />
        </div>

        <h2 className="font-heading text-2xl leading-snug tracking-tight text-ink sm:text-3xl" data-testid="capture-modal-title">
          Votre lecture personnalisée gratuite vous attend
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-warm">
          Prenez quelques instants pour recevoir une lecture personnelle, pensée comme une invitation
          à mieux comprendre votre énergie et votre période actuelle.
        </p>

        <form onSubmit={submit} className="mt-7 space-y-5" noValidate>
          <div>
            <label htmlFor="capture-prenom" className="mb-1.5 block font-sans text-xs font-medium uppercase tracking-[0.14em] text-muted-warm">
              Prénom
            </label>
            <input
              id="capture-prenom"
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              placeholder="Votre prénom"
              autoComplete="given-name"
              className="w-full rounded-xl border border-line bg-cream/60 px-4 py-3 text-base text-ink outline-none transition-colors placeholder:text-muted-warm/50 focus:border-gold focus:ring-2 focus:ring-gold/30"
              data-testid="capture-prenom-input"
            />
          </div>
          <div>
            <label htmlFor="capture-email" className="mb-1.5 block font-sans text-xs font-medium uppercase tracking-[0.14em] text-muted-warm">
              Adresse e-mail
            </label>
            <input
              id="capture-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.fr"
              autoComplete="email"
              className="w-full rounded-xl border border-line bg-cream/60 px-4 py-3 text-base text-ink outline-none transition-colors placeholder:text-muted-warm/50 focus:border-gold focus:ring-2 focus:ring-gold/30"
              data-testid="capture-email-input"
            />
          </div>
          <label className="flex cursor-pointer items-start gap-3" data-testid="capture-consent-label">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded accent-[#385244]"
              data-testid="capture-consent-checkbox"
            />
            <span className="text-xs leading-relaxed text-muted-warm">
              J'accepte de recevoir ma lecture personnalisée gratuite et les communications liées à ce
              guide. Je peux me désinscrire à tout moment.
            </span>
          </label>

          {error && (
            <p className="rounded-lg bg-[#A63D40]/10 px-3 py-2 text-sm text-[#A63D40]" data-testid="capture-error-message">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-forest py-4 font-sans text-base font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-[#2D4B39] hover:shadow-xl disabled:opacity-60 disabled:hover:translate-y-0"
            data-testid="capture-submit-button"
          >
            {loading ? "Un instant…" : "Recevoir ma lecture gratuite"}
          </button>
          <p className="text-center text-[11px] leading-relaxed text-muted-warm/80">
            Gratuit, sans engagement. Votre lecture n'est pas une prédiction et ne remplace jamais un
            avis médical, financier ou professionnel.
          </p>
        </form>
      </motion.div>
    </motion.div>
  );
}
