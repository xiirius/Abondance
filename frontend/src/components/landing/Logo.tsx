export function Logo({ dark = false }: { dark?: boolean }) {
  const stroke = "#C69B56";
  return (
    <span className="inline-flex items-center gap-2.5" data-testid="brand-logo">
      <svg width="34" height="34" viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r="20" fill="none" stroke={stroke} strokeWidth="2" />
        <path d="M40 21a14 14 0 1 0 0 22 11.5 11.5 0 0 1 0-22z" fill={stroke} />
        <circle cx="46" cy="17" r="1.5" fill={stroke} />
        <circle cx="17" cy="46" r="1.2" fill={stroke} />
      </svg>
      <span
        className={`font-heading text-lg leading-tight tracking-tight ${dark ? "text-[#FDFCFA]" : "text-ink"}`}
      >
        Abondance
        <span className="block text-[11px] font-sans font-medium uppercase tracking-[0.22em] text-gold">
          Intérieure
        </span>
      </span>
    </span>
  );
}
