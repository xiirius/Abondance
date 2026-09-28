import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import type { SiteConfig } from "@/lib/useConfig";
import { Mail } from "lucide-react";

interface SereneFooterProps {
  config: SiteConfig;
}

export function SereneFooter({ config }: SereneFooterProps) {
  const links = [
    { to: "/mentions-legales", label: "Mentions légales", id: "footer-link-mentions-legales" },
    { to: "/confidentialite", label: "Politique de confidentialité", id: "footer-link-confidentialite" },
    { to: "/cgv", label: "Conditions générales de vente", id: "footer-link-cgv" },
    { to: "/remboursement", label: "Politique de remboursement", id: "footer-link-remboursement" },
  ];

  return (
    <footer className="bg-night py-16" data-testid="site-footer">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
          <Logo dark />
          <nav className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-10">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="font-sans text-sm text-[#DDD4C8] transition-colors hover:text-gold-soft"
                data-testid={l.id}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <a
            href={`mailto:${config.contact_email}`}
            className="flex items-center gap-2 font-sans text-sm text-[#DDD4C8] transition-colors hover:text-gold-soft"
            data-testid="footer-contact-email"
          >
            <Mail className="h-4 w-4 text-gold-soft" />
            {config.contact_email}
          </a>
        </div>
        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="mx-auto max-w-3xl text-center text-xs leading-relaxed text-[#DDD4C8]/70" data-testid="footer-disclaimer">
            Ce site propose du contenu de bien-être et de développement personnel. Il ne constitue pas
            un avis médical, psychologique, juridique ou financier.
          </p>
          <p className="mt-4 text-center font-sans text-xs text-[#DDD4C8]/50">
            © {new Date().getFullYear()} Le Guide de l'Abondance Intérieure. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
