"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Command, Search, X } from "lucide-react";

/* ---------- Self-contained intersection & number helpers ---------- */
function useElementInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function AnimatedNumber({
  value,
  decimals = 0,
  duration = 850,
  suffix = "",
}: {
  value: number;
  decimals?: number;
  duration?: number;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") {
      setDisplay(value);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return (
    <>
      {display.toFixed(decimals)}
      {suffix}
    </>
  );
}

/* Headline that reveals word by word, each word rising out of a mask */
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
  const { ref, inView } = useElementInView(0.1);
  const words = text.split(" ");

  return (
    <div ref={ref} className="inline-block w-full">
      <Tag className={className} aria-label={text}>
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.06em] -mb-[0.06em]">
            <span
              className="inline-block transition-transform will-change-transform"
              style={{
                transform: inView ? "translateY(0)" : "translateY(115%)",
                transitionDuration: "820ms",
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                transitionDelay: `${delay + i * 55}ms`,
              }}
            >
              {w}
              {i < words.length - 1 ? "\u00A0" : ""}
            </span>
          </span>
        ))}
      </Tag>
    </div>
  );
}

/* Infinite ticker; pauses on hover */
export function Marquee({ items, duration = 38 }: { items: string[]; duration?: number }) {
  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center gap-8 pr-8">
      {items.map((t) => (
        <span
          key={t}
          className="flex items-center gap-8 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#8E9299] sm:text-sm"
        >
          {t}
          <span className="text-[#FF6901]">/</span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className="group overflow-hidden border-y border-[#1F2326] bg-[#0A0A0A] py-3"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
      }}
    >
      <div
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${duration}s` }}
      >
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}

/* Button or link that leans subtly toward the cursor */
export function Magnetic({ children, strength = 0.22 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const r = ref.current.getBoundingClientRect();
    setPos({
      x: (e.clientX - (r.left + r.width / 2)) * strength,
      y: (e.clientY - (r.top + r.height / 2)) * strength,
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      className="inline-block transition-transform duration-300 ease-out will-change-transform"
      style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
    >
      {children}
    </div>
  );
}

/* Card with a crisp spotlight border that tracks the cursor */
export function Spotlight({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
    ref.current.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onClick={onClick}
      className={`spotlight relative overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

/* Subtle 3D tilt card with cursor spotlight border */
export function TiltCard({
  children,
  className = "",
  maxTilt = 3.5,
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
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const px = x / r.width - 0.5;
    const py = y / r.height - 0.5;
    setTilt({
      rx: -py * maxTilt * 2,
      ry: px * maxTilt * 2,
      active: true,
    });
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
          ? `perspective(950px) rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg) translateY(-2px)`
          : "perspective(950px) rotateX(0deg) rotateY(0deg) translateY(0px)",
      }}
    >
      {children}
    </div>
  );
}

/* Choreographed stagger container & item */
export function StaggerGroup({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function StaggerItem({
  children,
  index = 0,
  stepMs = 60,
  className = "",
}: {
  children: React.ReactNode;
  index?: number;
  stepMs?: number;
  className?: string;
}) {
  const { ref, inView } = useElementInView(0.08);
  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${index * stepMs}ms` }}
    >
      {children}
    </div>
  );
}

/* Monospaced telemetry stat cell */
export function StatCell({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  const { ref, inView } = useElementInView(0.2);
  return (
    <div ref={ref} className="px-5 py-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6E737D]">{label}</div>
      <div className="mt-2 font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#F2F2F0] tabular-nums">
        <AnimatedNumber value={inView ? value : 0} suffix={suffix} />
      </div>
    </div>
  );
}

/* Blackbox-inspired precision terminal backdrop */
export function AmbientBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#080808]" />
      <div className="absolute inset-0 bg-atelier-grid opacity-70" />
      <div
        className="absolute left-1/2 -top-48 h-[420px] w-[760px] -translate-x-1/2 rounded-full blur-[130px]"
        style={{ background: "radial-gradient(circle, rgba(255, 105, 1, 0.11) 0%, transparent 72%)" }}
      />
      <div className="awwwards-grain absolute inset-0" />
    </div>
  );
}

/* 2px signal scroll rail compatible with React 18 & 19 refs */
export function ScrollProgressBar({
  scrollRef,
}: {
  scrollRef: { readonly current: HTMLDivElement | null };
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [scrollRef]);

  return (
    <div aria-hidden className="pointer-events-none relative h-[2px] w-full shrink-0 bg-[#1F2326]/70">
      <div
        className="h-full origin-left bg-[#FF6901] transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}

/* Floating Blackbox-style Command Palette (Cmd+K / Ctrl+K) */
export interface CommandPaletteItem {
  id: string;
  label: string;
  group: string;
  icon: LucideIcon;
  shortcut?: string;
}

export function CommandPalette({
  items,
  open,
  onOpenChange,
  onSelect,
}: {
  items: CommandPaletteItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) => i.label.toLowerCase().includes(q) || i.group.toLowerCase().includes(q)
    );
  }, [items, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [open]);

  useEffect(() => {
    if (cursor >= filtered.length) {
      setCursor(Math.max(0, filtered.length - 1));
    }
  }, [filtered.length, cursor]);

  if (!open) return null;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => (filtered.length ? (c + 1) % filtered.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => (filtered.length ? (c - 1 + filtered.length) % filtered.length : 0));
    } else if (e.key === "Enter" && filtered[cursor]) {
      e.preventDefault();
      onSelect(filtered[cursor].id);
      onOpenChange(false);
    } else if (e.key === "Escape") {
      onOpenChange(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Quick navigation command palette"
      onClick={() => onOpenChange(false)}
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/80 px-4 pt-[14vh] backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-up w-full max-w-xl overflow-hidden rounded-xl border border-[#262A2E] bg-[#0D0D0D] shadow-warm-lg"
      >
        <div className="flex items-center gap-3 border-b border-[#1F2326] px-4 py-3">
          <Search className="h-4 w-4 text-[#FF6901] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Jump to view or run action..."
            className="w-full bg-transparent text-sm text-[#F2F2F0] placeholder:text-[#6E737D] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded border border-[#1F2326] bg-[#181818] p-1 text-[#8E9299] hover:text-[#F2F2F0]"
            aria-label="Close command palette"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-xs text-[#6E737D]">
              No matching views for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const active = idx === cursor;
              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setCursor(idx)}
                  onClick={() => {
                    onSelect(item.id);
                    onOpenChange(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                    active ? "bg-[#181818] text-[#F2F2F0]" : "text-[#8E9299] hover:bg-[#141414]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-md border ${
                        active
                          ? "border-[#FF6901]/50 bg-[#FF6901]/15 text-[#FF6901]"
                          : "border-[#1F2326] bg-[#0A0A0A] text-[#6E737D]"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0">
                      <div className="font-medium text-[#F2F2F0] truncate">{item.label}</div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#6E737D]">
                        {item.group}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {item.shortcut && (
                      <span className="rounded border border-[#1F2326] bg-[#0A0A0A] px-1.5 py-0.5 font-mono text-[10px] text-[#8E9299]">
                        {item.shortcut}
                      </span>
                    )}
                    {active && <ArrowRight className="h-3.5 w-3.5 text-[#FF6901]" />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[#1F2326] bg-[#0A0A0A] px-4 py-2 font-mono text-[10px] text-[#6E737D]">
          <span className="flex items-center gap-1.5">
            <Command className="h-3 w-3 text-[#FF6901]" />
            BLACKBOX COMMAND
          </span>
          <span>↑↓ Navigate · ↵ Open · Esc Close</span>
        </div>
      </div>
    </div>
  );
}
