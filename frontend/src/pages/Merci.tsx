import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { apiGet } from "@/lib/api";
import { Logo } from "@/components/landing/Logo";
import { Download, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface PaymentStatus {
  session_id: string;
  status: string;
  payment_status: string;
}

export default function Merci() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const prenom = localStorage.getItem("abondance_prenom");
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    let attempts = 0;
    const timer = setInterval(async () => {
      attempts += 1;
      try {
        const s = await apiGet<PaymentStatus>(`/payments/status/${sessionId}`);
        setStatus(s);
        if (s.payment_status === "paid") clearInterval(timer);
      } catch {
        setFailed(true);
        clearInterval(timer);
      }
      if (attempts > 30) {
        setFailed(true);
        clearInterval(timer);
      }
    }, 2000);
    return () => clearInterval(timer);
  }, [sessionId]);

  const paid = status?.payment_status === "paid";

  return (
    <div className="grain flex min-h-screen flex-col bg-cream" data-testid="merci-page">
      <header className="border-b border-line bg-cream/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <Link to="/" data-testid="merci-logo-link"><Logo /></Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 py-20">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-xl text-center"
        >
          {!sessionId || failed ? (
            <>
              <AlertCircle className="mx-auto h-10 w-10 text-gold" strokeWidth={1.5} />
              <h1 className="mt-6 font-heading text-3xl tracking-tight text-ink sm:text-4xl">
                Nous n'avons pas retrouvé votre paiement
              </h1>
              <p className="mt-4 text-base leading-relaxed text-muted-warm">
                Si vous venez de régler votre commande, patientez quelques instants puis rechargez
                cette page. Sinon, contactez-nous et nous vérifierons ensemble.
              </p>
              <Link
                to="/"
                className="mt-8 inline-block rounded-full bg-forest px-8 py-3.5 font-sans text-base font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-[#2D4B39]"
                data-testid="merci-back-home-button"
              >
                Revenir à l'accueil
              </Link>
            </>
          ) : !paid ? (
            <>
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-gold" strokeWidth={1.5} />
              <h1 className="mt-6 font-heading text-3xl tracking-tight text-ink sm:text-4xl" data-testid="merci-pending-title">
                Confirmation de votre paiement…
              </h1>
              <p className="mt-4 text-base leading-relaxed text-muted-warm">
                Quelques secondes suffisent. Votre guide apparaîtra ici dès que le paiement sera
                confirmé.
              </p>
            </>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 16 }}
              >
                <CheckCircle2 className="mx-auto h-14 w-14 text-sage-deep" strokeWidth={1.25} />
              </motion.div>
              <h1 className="mt-6 font-heading text-3xl leading-snug tracking-tight text-ink sm:text-4xl" data-testid="merci-success-title">
                Merci{prenom ? ` ${prenom}` : ""}, votre guide vous attend
              </h1>
              <p className="mt-4 text-base leading-relaxed text-muted-warm">
                Votre paiement est confirmé. Vous pouvez télécharger{" "}
                <em className="text-ink">Le Guide de l'Abondance Intérieure</em> dès maintenant et le
                lire sur téléphone, tablette ou ordinateur.
              </p>
              <a
                href={`/api/download/guide?session_id=${sessionId}`}
                className="mt-9 inline-flex items-center gap-2.5 rounded-full bg-forest px-10 py-4 font-sans text-lg font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-[#2D4B39] hover:shadow-xl"
                data-testid="merci-download-button"
              >
                <Download className="h-5 w-5" />
                Télécharger mon guide (PDF)
              </a>
              <p className="mt-5 font-sans text-xs text-muted-warm">
                Conservez ce lien : il vous permet de retélécharger le guide à tout moment.
              </p>
            </>
          )}
        </motion.div>
      </main>

      <footer className="border-t border-line py-6 text-center font-sans text-xs text-muted-warm">
        © {new Date().getFullYear()} Le Guide de l'Abondance Intérieure
      </footer>
    </div>
  );
}
