import Link from "next/link";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Functies", href: "/#features" },
      { label: "Prijzen", href: "/pricing" },
      { label: "Demo", href: "/demo" },
      { label: "API", href: "/api" },
    ],
  },
  {
    title: "Ondersteuning",
    links: [
      { label: "Helpcentrum", href: "/help" },
      { label: "Contact", href: "/contact" },
      { label: "Status", href: "/status" },
      { label: "Updates", href: "/updates" },
    ],
  },
  {
    title: "Bedrijf",
    links: [
      { label: "Over ons", href: "/about" },
      { label: "Werken bij", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Pers", href: "/press" },
    ],
  },
];

const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 border-t border-white/8 bg-[#0b1018]/70 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-10 mb-12">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-accent" />
              <span className="display text-white text-xl tracking-tight">Numico</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Geautomatiseerde boekhouding voor Nederlandse ondernemers. Maak een
              foto, wij doen de rest.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="eyebrow text-slate-500 mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-300 hover:text-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/8 pt-7 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="num text-xs text-slate-500">
            © {new Date().getFullYear()} Numico — Alle rechten voorbehouden
          </span>
          <div className="flex items-center gap-6 text-xs text-slate-400">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Voorwaarden
            </Link>
            <Link href="/cookies" className="hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;