import { Moon } from "lucide-react";

const WORDS = ["Clarté", "Énergie", "Paix intérieure", "Alignement", "Gratitude", "Intuition", "Sérénité", "Confiance"];

export function EditorialMarquee() {
  const items = [...WORDS, ...WORDS];
  return (
    <div className="overflow-hidden border-y border-line bg-sand py-5" aria-hidden="true" data-testid="editorial-marquee">
      <div className="marquee-track flex w-max items-center gap-10">
        {items.map((w, i) => (
          <span key={i} className="flex items-center gap-10 font-heading text-lg italic text-[#7D6B4E]/80">
            {w}
            <Moon className="h-3.5 w-3.5 text-gold/70" strokeWidth={1.5} />
          </span>
        ))}
      </div>
    </div>
  );
}
