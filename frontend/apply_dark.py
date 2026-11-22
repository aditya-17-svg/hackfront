import re, sys

PAGE = "src/app/page.tsx"
GRAPH = "src/components/IntelligenceGraph.tsx"

COLOR_RULES = [
    (r'\bbg-white\b', 'bg-surface'),
    (r'\bbg-slate-50\b', 'bg-ink/[0.03]'),
    (r'\bbg-slate-100\b', 'bg-ink/[0.07]'),
    (r'\bbg-slate-200\b', 'bg-ink/10'),
    (r'\btext-slate-900\b', 'text-ink'),
    (r'\btext-slate-(800|700)\b', 'text-ink/85'),
    (r'\btext-slate-600\b', 'text-ink/70'),
    (r'\btext-slate-(500|400)\b', 'text-ink/55'),
    (r'\btext-slate-300\b', 'text-ink/30'),
    (r'\bborder-slate-(200|300)\b', 'border-ink/12'),
    (r'\bhover:bg-slate-50\b', 'hover:bg-ink/[0.05]'),
    (r'\bhover:bg-slate-100\b', 'hover:bg-ink/[0.08]'),
    (r'\bdivide-slate-200\b', 'divide-ink/12'),
    (r'\bring-slate-200\b', 'ring-ink/12'),
]

OVERVIEW = '''          {/* TAB: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <section className="grain relative overflow-hidden rounded-3xl border border-ink/10 bg-paper p-6 text-ink sm:p-10">
                <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60">
                  <span>TierLens · Device Lab</span>
                  <span className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
                    </span>
                    Live · Chromium CDP
                  </span>
                </div>

                <LineReveal
                  as="h1"
                  text="Test on the phone in the drawer."
                  className="mt-12 block font-display text-[clamp(2.75rem,8vw,7rem)] font-semibold leading-[0.9] tracking-[-0.045em]"
                />

                <div className="mt-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
                  <Reveal>
                    <p className="max-w-xl text-base leading-relaxed text-ink/70">
                      Throttle the CPU, shape the network, and set the viewport. Then see exactly where your site
                      slows down, side by side, with real measurements.
                    </p>
                  </Reveal>
                  <Reveal delay={150}>
                    <Magnetic>
                      <button
                        onClick={() => navigateToTab("web_test")}
                        className="group inline-flex items-center gap-3 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-paper transition-colors duration-300 hover:bg-signal"
                      >
                        Run a test
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </button>
                    </Magnetic>
                  </Reveal>
                </div>
              </section>

              <Marquee
                items={["Entry-level Android", "Budget Android", "Mid-range Android", "Flagship Android", "Low-end Desktop", "Standard Desktop"]}
              />

              <Card className="grid grid-cols-2 divide-x divide-y divide-ink/10 overflow-hidden lg:grid-cols-4 lg:divide-y-0">
                <StatCell value={8} suffix="x" label="Max CPU slowdown" />
                <StatCell value={500} suffix=" kbps" label="Slow 3G downlink" />
                <StatCell value={200} suffix=" ms" label="Entry-level latency" />
                <StatCell value={savedProfiles.length} label="Device profiles" />
              </Card>

              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { id: "web_test" as const, icon: Globe, title: "Multi-device web test", desc: "Run Playwright sessions with real CDP CPU and network throttling." },
                  { id: "device_builder" as const, icon: Sliders, title: "Device config builder", desc: "Tune RAM, CPU slowdown, storage, and network presets." },
                  { id: "compare" as const, icon: GitCompare, title: "Performance comparison", desc: "Side-by-side degradation and Core Web Vitals differences." },
                ].map((c, i) => (
                  <Reveal key={c.id} delay={i * 90}>
                    <Spotlight
                      onClick={() => navigateToTab(c.id)}
                      className="group h-full cursor-pointer rounded-2xl border border-ink/10 bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-ink/30 hover:shadow-xl"
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-mono text-xs text-ink/40">0{i + 1}</span>
                        <c.icon className="h-5 w-5 text-ink transition-all duration-500 group-hover:rotate-12 group-hover:text-signal" />
                      </div>
                      <div className="mt-16 font-display text-2xl font-semibold tracking-tight text-ink">{c.title}</div>
                      <p className="mt-2 text-sm leading-relaxed text-ink/55">{c.desc}</p>
                    </Spotlight>
                  </Reveal>
                ))}
              </div>

              <Reveal>
                <Card className="p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-ink">Configured device profiles ({savedProfiles.length})</h3>
                      <p className="mt-0.5 text-xs text-ink/55">Hardware and network specs ready for testing.</p>
                    </div>
                    <button
                      onClick={() => navigateToTab("device_builder")}
                      className="flex items-center gap-1 text-xs font-semibold text-ink transition hover:gap-2 hover:text-signal"
                    >
                      Manage <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {savedProfiles.slice(0, 6).map((p, i) => (
                      <Reveal key={p.id} delay={i * 50}>
                        <div className="rounded-xl border border-ink/10 bg-paper/50 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-surface hover:shadow-md">
                          <div className="mb-3 flex items-center justify-between gap-2">
                            <span className="truncate text-xs font-semibold text-ink">{p.name}</span>
                            <Pill tone={p.is_custom ? "purple" : "slate"}>{p.is_custom ? "Custom" : "Preset"}</Pill>
                          </div>
                          <div className="space-y-1.5 font-mono text-[11px] text-ink/55">
                            <div>CPU · {p.cpu_cores} cores · {p.cpu_throttle_rate}x slowdown</div>
                            <div>RAM · {Math.round(p.ram_mb / 1024)} GB · Storage {p.storage_capacity_gb} GB</div>
                            <div>Network · {p.network_profile} ({p.network_latency_ms} ms)</div>
                          </div>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </Card>
              </Reveal>
            </div>
          )}

'''

SHELL_OPEN = '''  return (
    <AppShell
      active={activeTab as TabId}
      onNavigate={navigateToTab}
      mobileOpen={mobileMenuOpen}
      onMobileOpenChange={setMobileMenuOpen}
      services={[
        { label: "PostgreSQL", ok: true, okText: "Connected" },
        { label: "Neo4j", ok: !!systemHealth?.neo4j?.connected, okText: "Online", offText: "Fallback" },
      ]}
      onRefresh={() => { refreshHealth(); loadProfiles(); }}
      error={errorBanner}
      onDismissError={() => setErrorBanner(null)}
    >
'''

def read(p):
    try:
        return open(p, encoding="utf-8").read()
    except FileNotFoundError:
        sys.exit(f"Missing {p}. Run this from the frontend folder.")

def must_once(text, old, label):
    n = text.count(old)
    if n != 1:
        sys.exit(f"Expected exactly one match for {label}, found {n}. Your page.tsx differs from the expected version; send it to me and I will adjust the script.")

def recolor(text):
    for a, b in COLOR_RULES:
        text = re.sub(a, b, text)
    return text

# ---- page.tsx ----
t = read(PAGE)
must_once(t, 'import { ApiClient } from "@/lib/api";', "ApiClient import")
t = t.replace('import { ApiClient } from "@/lib/api";',
  'import { ApiClient } from "@/lib/api";\n'
  'import AppShell, { type TabId } from "@/components/AppShell";\n'
  'import { Reveal, Card, Pill } from "@/components/ui";\n'
  'import { LineReveal, Marquee, Magnetic, Spotlight, StatCell } from "@/components/motion";', 1)

if 'ArrowUpRight' not in t:
    must_once(t, '  HelpCircle,\n  Menu\n} from "lucide-react";', "lucide import end")
    t = t.replace('  HelpCircle,\n  Menu\n} from "lucide-react";', '  HelpCircle,\n  Menu,\n  ArrowUpRight\n} from "lucide-react";', 1)

must_once(t, '        </div>\n      </main>\n    </div>\n  );\n}', "old layout closing tags")
t = t.replace('        </div>\n      </main>\n    </div>\n  );\n}', '      </AppShell>\n  );\n}', 1)

s = t.index('          {/* TAB: OVERVIEW */}')
m = t.index('{/* TAB: DEVICE CONFIGURATION BUILDER */}')
e = t.rindex('          {/* ====', 0, m)
t = t[:s] + OVERVIEW + t[e:]

s = t.index('  return (\n    <div className="flex h-screen bg-slate-50')
e = t.index('          {/* TAB: OVERVIEW */}')
t = t[:s] + SHELL_OPEN + t[e:]

t = recolor(t)
open(PAGE, "w", encoding="utf-8").write(t)
print("page.tsx updated")

# ---- IntelligenceGraph.tsx ----
g = read(GRAPH)
open(GRAPH, "w", encoding="utf-8").write(recolor(g))
print("IntelligenceGraph.tsx updated")
print("Done. Run: npm run build")
