type Logo = { name: string; src: string };

export default function LogoGrid({
  logos,
  label,
}: {
  logos: Logo[];
  label: string;
}) {
  return (
    <section className="border-y border-foreground/10 py-12 sm:py-14">
      <p className="mb-10 text-center text-[11px] font-medium uppercase tracking-[0.32em] text-foreground/55 sm:text-xs">
        {label}
      </p>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-8 px-4 sm:gap-x-14 lg:gap-x-16">
        {logos.map((logo) => (
          <div
            key={logo.name}
            className="flex h-14 w-36 shrink-0 items-center justify-center sm:h-16 sm:w-44"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.src}
              alt={logo.name}
              className="max-h-full max-w-full object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
