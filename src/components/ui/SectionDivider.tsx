export function SectionDivider() {
  return (
    <div
      className="relative bg-sand py-2"
      aria-hidden
    >
      <div className="section-pad container-site">
        <div className="relative flex items-center justify-center gap-4">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-navy/20 to-navy/25" />
          <span className="relative flex h-3 w-3 rotate-45 items-center justify-center border border-gold/80 bg-sand">
            <span className="h-1.5 w-1.5 bg-gold" />
          </span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent via-navy/20 to-navy/25" />
        </div>
      </div>
    </div>
  );
}
