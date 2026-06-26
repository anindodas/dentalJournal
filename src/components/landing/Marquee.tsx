const items = [
  "Restorative Dentistry",
  "Digital Implantology",
  "Periodontal Science",
  "Oral Microbiology",
  "Biomaterials Research",
  "Orthodontic Innovation",
  "Endodontic Advances",
  "Public Health Dentistry",
  "CBCT-Guided Surgery",
  "Minimally Invasive Care",
];

export default function Marquee() {
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-border bg-secondary/50 py-3">
      <div className="marquee-track flex w-max gap-8 whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-8 text-sm font-medium tracking-wide text-primary/80"
          >
            {item}
            <span className="text-accent">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
