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
      <section className="border-y border-foreground/10 py-10 sm:py-12 overflow-hidden">
        <p className="mb-8 text-center text-[11px] font-medium uppercase tracking-[0.32em] text-foreground/55 sm:text-xs">
          {label}
        </p>
        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-background to-transparent sm:w-24" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-background to-transparent sm:w-24" />

          <div className="marquee-track flex w-max items-center" style={{ gap: "3.5rem" }}>
            {[...logos, ...logos, ...logos, ...logos].map((logo, i) => (
              <div
                key={`${logo.name}-${i}`}
                className="shrink-0 flex items-center justify-center"
                style={{ height: "48px", width: "130px" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.src}
                  alt={logo.name}
                  style={{ height: "100%", width: "100%", objectFit: "contain" }}
                  className="opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0"
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
    <section className="border-y border-foreground/10 py-14 sm:py-16">
      <p className="mb-10 text-center text-[11px] font-medium uppercase tracking-[0.32em] text-foreground/55 sm:text-xs">
        {label}
      </p>
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center px-6" style={{ gap: "3rem 4rem" }}>
        {logos.map((logo) => (
          <div
            key={logo.name}
            className="shrink-0 flex items-center justify-center"
            style={{ height: "60px", width: "180px" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.src}
              alt={logo.name}
              style={{ height: "100%", width: "100%", objectFit: "contain" }}
              className="opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
