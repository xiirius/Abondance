import { useState } from "react";
import { Reveal } from "./Reveal";
import { apiPost } from "@/lib/api";
import { formatPrice, type SiteConfig } from "@/lib/useConfig";
import { Download, Lock, Smartphone, CreditCard, Loader2 } from "lucide-react";

interface PricingCardProps {
  config: SiteConfig;
}

interface CheckoutResponse {
  checkout_url: string;
  session_id: string;
}

export function PricingCard({ config }: PricingCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkout = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiPost<CheckoutResponse>("/payments/checkout", {
        origin_url: window.location.origin,
        prenom: localStorage.getItem("abondance_prenom") || undefined,
        email: localStorage.getItem("abondance_email") || undefined,
      });
      window.location.href = res.checkout_url;
    } catch {
      setError("Le paiement n'a pas pu démarrer. Merci de réessayer dans un instant.");
      setLoading(false);
    }
  };

  const features = [
    { icon: Download, label: "PDF numérique, téléchargement immédiat après paiement" },
    { icon: Smartphone, label: "Lecture sur téléphone, tablette ou ordinateur" },
    { icon: Lock, label: "Paiement sécurisé via Stripe (CB, Apple Pay)" },
  ];

  return (
    <section id="prix" className="py-24 sm:py-32" data-testid="pricing-section">
      <div className="mx-auto max-w-2xl px-5">
        <Reveal>
          <p className="mb-5 text-center font-sans text-xs font-medium uppercase tracking-[0.24em] text-[#7D6B4E]">
            Prix et accès
          </p>
          <h2 className="text-center font-heading text-3xl leading-[1.15] tracking-tight text-ink sm:text-4xl">
            Accédez au guide complet <span className="italic text-sage-deep">dès aujourd'hui</span>
          </h2>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="relative mt-12 overflow-hidden rounded-[2rem] border border-gold/30 bg-white p-8 shadow-2xl sm:p-12" data-testid="pricing-card">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full aura" aria-hidden="true" />
            <div className="text-center">
              <span className="inline-block rounded-full border border-gold/40 bg-sand px-4 py-1.5 font-sans text-xs font-medium uppercase tracking-[0.16em] text-[#7D6B4E]">
                Paiement unique
              </span>
              <p className="mt-6 font-heading text-6xl tracking-tight text-ink" data-testid="pricing-price">
                {formatPrice(config.price_euros)}
              </p>
              <p className="mt-2 font-sans text-sm text-muted-warm">Un prix accessible, en toute transparence.</p>
            </div>

            <ul className="mt-9 space-y-4">
              {features.map((f) => (
                <li key={f.label} className="flex items-center gap-4">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage text-sage-deep">
                    <f.icon className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <span className="text-sm leading-relaxed text-ink/90">{f.label}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={checkout}
              disabled={loading}
              className="mt-10 flex w-full items-center justify-center gap-2 rounded-full bg-forest py-4.5 font-sans text-lg font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-[#2D4B39] hover:shadow-xl disabled:opacity-60 disabled:hover:translate-y-0"
              data-testid="cta-buy-main-button"
            >
              {loading && <Loader2 className="h-5 w-5 animate-spin" />}
              {loading ? "Redirection vers le paiement…" : `Accéder au guide pour ${formatPrice(config.price_euros)}`}
            </button>
            {error && (
              <p className="mt-3 text-center text-sm text-[#A63D40]" data-testid="checkout-error-message">{error}</p>
            )}
            <p className="mt-4 flex items-center justify-center gap-1.5 text-center font-sans text-xs text-muted-warm">
              <CreditCard className="h-3.5 w-3.5" />
              Paiement unique sécurisé. Aucun abonnement. Téléchargement immédiat.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
