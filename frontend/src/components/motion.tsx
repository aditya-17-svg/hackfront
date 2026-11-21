export function LineReveal({
  text,
  as: Tag = "span",
  className = "",
  delay = 0,
}: {
  text: string;
  as?: "h1" | "h2" | "p" | "span";
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useInView<HTMLElement>(0.15);
  const words = text.split(" ");
  return (
    <Tag ref={ref as any} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.06em] -mb-[0.06em]">
          <span
            className="inline-block transition-transform will-change-transform"
            style={{
              transform: inView ? "translateY(0)" : "translateY(115%)",
              transitionDuration: "900ms",
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              transitionDelay: `${delay + i * 65}ms`,
            }}
          >
            {w}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}

export function TiltCard({
  children,
  className = "",
  maxTilt = 4.5,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, active: false });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const px = x / r.width - 0.5;
    const py = y / r.height - 0.5;
    setTilt({ rx: -py * maxTilt * 2, ry: px * maxTilt * 2, active: true });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ rx: 0, ry: 0, active: false })}
      onClick={onClick}
      className={`spotlight relative overflow-hidden transition-[transform,border-color,box-shadow] duration-300 will-change-transform ${className}`}
      style={{
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        transform: tilt.active
          ? `perspective(900px) rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg) translateY(-2px)`
          : "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)",
      }}
    >
      {children}
    </div>
  );
}
