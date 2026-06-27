type Logo = { name: string; src: string };

export default function LogoGrid({
  logos,
  label,
  variant = "static",
}: {
  logos: Logo[];
  label: string;
  variant?: "static" | "marquee";
}) {
  if (variant === "marquee") {
    return (
      <section className="border-y border-foreground/10 py-12 sm:py-14 overflow-hidden">
        <p className="mb-10 text-center text-[11px] font-medium uppercase tracking-[0.32em] text-foreground/55 sm:text-xs">
          {label}
        </p>
        <div className="relative">
          {/* Fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-background to-transparent sm:w-24" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-background to-transparent sm:w-24" />

          <div className="marquee-track flex w-max items-center gap-x-14 sm:gap-x-20">
            {/* Duplicate logos twice for seamless loop */}
            {[...logos, ...logos, ...logos, ...logos].map((logo, i) => (
              <div
                key={`${logo.name}-${i}`}
                className="flex h-12 w-32 shrink-0 items-center justify-center sm:h-14 sm:w-40"
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
        </div>
      </section>
    );
  }

  return (
    <section className="border-y border-foreground/10 py-12 sm:py-14">
      <p className="mb-10 text-center text-[11px] font-medium uppercase tracking-[0.32em] text-foreground/55 sm:text-xs">
        {label}
      </p>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-12 gap-y-8 px-4 sm:gap-x-16 lg:gap-x-20">
        {logos.map((logo) => (
          <div
            key={logo.name}
            className="flex h-16 w-40 shrink-0 items-center justify-center sm:h-20 sm:w-52"
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
