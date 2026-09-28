import { Logo } from "./Logo";
import { scrollToId } from "@/lib/scroll";
import { goToPayment } from "@/lib/payment";

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-cream/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} data-testid="nav-logo-link">
          <Logo />
        </a>
        <nav className="hidden items-center gap-8 font-sans text-sm text-muted-warm md:flex">
          <button onClick={() => scrollToId("guide")} className="transition-colors hover:text-ink" data-testid="nav-link-guide">
            Le guide
          </button>
          <button onClick={() => scrollToId("contenu")} className="transition-colors hover:text-ink" data-testid="nav-link-contenu">
            Contenu
          </button>
          <button onClick={() => scrollToId("faq")} className="transition-colors hover:text-ink" data-testid="nav-link-faq">
            FAQ
          </button>
        </nav>
        <button
          onClick={goToPayment}
          className="rounded-full bg-forest px-5 py-2.5 font-sans text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-[#2D4B39] hover:shadow-lg"
          data-testid="nav-cta-button"
        >
          Accéder au guide
        </button>
      </div>
    </header>
  );
}
