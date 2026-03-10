type TableStatus = "available" | "booked" | "selected";

type TableInfo = {
  id: string;
  zone: string;
  number: number;
  status: TableStatus;
  capacity: string;
  isWindow?: boolean;
  isVip?: boolean;
};

type FloorPlanProps = {
  tables: TableInfo[];
  onTableClick: (id: string) => void;
};

/* ─── Table button ─── */
const T = ({
  table, onClick, w = 52, h = 52,
}: {
  table: TableInfo; onClick: () => void; w?: number; h?: number;
}) => {
  const booked = table.status === "booked";
  const selected = table.status === "selected";
  const ring: Record<string, string> = { A: "ring-primary/60", B: "ring-blue-400/60", C: "ring-emerald-400/60", D: "ring-rose-400/60" };
  const border: Record<string, string> = { A: "border-primary", B: "border-blue-400", C: "border-emerald-400", D: "border-rose-400" };

  return (
    <button
      onClick={onClick} disabled={booked}
      title={`${table.id} — ${table.capacity}${table.isWindow ? " (Цонх)" : ""}${table.isVip ? " (VIP)" : ""}`}
      style={{ width: w, height: h }}
      className={`
        rounded-md flex flex-col items-center justify-center transition-all duration-200 font-sans relative shrink-0
        ${table.isWindow ? "border-2 border-dashed" : "border-2"}
        ${booked
          ? "bg-muted/30 border-muted-foreground/20 opacity-40 cursor-not-allowed"
          : selected
          ? `bg-primary/20 ${border[table.zone]} ring-2 ${ring[table.zone]} scale-110 shadow-lg shadow-primary/20 z-10`
          : table.isVip
          ? "bg-accent/20 border-accent/50 hover:border-primary/50 hover:bg-primary/10 cursor-pointer hover:scale-105"
          : "bg-secondary/80 border-border hover:border-primary/50 hover:bg-primary/10 cursor-pointer hover:scale-105"
        }
      `}
    >
      <span className={`text-[9px] md:text-[10px] tracking-wider uppercase font-bold leading-none ${
        booked ? "text-muted-foreground/50" : selected ? "text-primary" : "text-foreground/80"
      }`}>{table.id}</span>
      <span className={`text-[7px] md:text-[8px] leading-none mt-0.5 ${
        booked ? "text-muted-foreground/30" : "text-muted-foreground/60"
      }`}>{table.capacity}</span>
      {table.isVip && !booked && !selected && (
        <span className="absolute -top-1.5 -right-1.5 text-[7px] bg-accent text-accent-foreground px-1 rounded font-bold leading-tight">VIP</span>
      )}
      {booked && <span className="absolute inset-0 flex items-center justify-center text-destructive/50 text-base font-bold">✕</span>}
    </button>
  );
};

/* ─── Landmark box ─── */
const Box = ({ label, w = 80, h = 36, accent = false }: { label: string; w?: number; h?: number; accent?: boolean }) => (
  <div
    style={{ width: w, height: h }}
    className={`flex items-center justify-center rounded-md text-center shrink-0 ${
      accent ? "border-2 border-primary/25 bg-primary/5" : "border border-border/40 bg-secondary/25"
    }`}
  >
    <span className={`text-[8px] md:text-[9px] tracking-[0.12em] uppercase whitespace-nowrap font-medium ${
      accent ? "text-primary/60" : "text-muted-foreground/50"
    }`}>{label}</span>
  </div>
);

const FloorPlan = ({ tables, onTableClick }: FloorPlanProps) => {
  const g = (id: string) => tables.find((tb) => tb.id === id)!;
  const c = (id: string) => () => onTableClick(id);

  /* positions mapped from the PDF blueprint (percentage-based) */
  return (
    <div className="relative w-full border border-border/50 rounded-md bg-card/50 overflow-x-auto">
      <div className="min-w-[760px] md:min-w-[900px] mx-auto relative" style={{ aspectRatio: '1 / 1.1', maxHeight: 960 }}>

        {/* ── WALLS ── */}
        <div className="absolute inset-[8px] border-2 border-border/20 rounded pointer-events-none" />

        {/* ── WINDOW markers: top ── */}
        <svg className="absolute top-[8px] left-[2%] w-[30%] h-[8px] pointer-events-none">
          <line x1="0" y1="4" x2="100%" y2="4" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="6 4" opacity="0.4" />
        </svg>
        <span className="absolute top-[10px] left-[10%] text-[7px] tracking-[0.15em] uppercase text-muted-foreground/30">window</span>
        <svg className="absolute top-[8px] left-[34%] w-[34%] h-[8px] pointer-events-none">
          <line x1="0" y1="4" x2="100%" y2="4" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="6 4" opacity="0.4" />
        </svg>
        <span className="absolute top-[10px] left-[42%] text-[7px] tracking-[0.15em] uppercase text-muted-foreground/30">window</span>
        <span className="absolute top-[10px] left-[55%] text-[7px] tracking-[0.15em] uppercase text-muted-foreground/30">window</span>
        <svg className="absolute top-[8px] left-[68%] w-[14%] h-[8px] pointer-events-none">
          <line x1="0" y1="4" x2="100%" y2="4" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="6 4" opacity="0.4" />
        </svg>
        <span className="absolute top-[10px] left-[70%] text-[7px] tracking-[0.15em] uppercase text-muted-foreground/30">window</span>

        {/* ── RIGHT WINDOW markers ── */}
        <svg className="absolute right-[8px] top-[28%] w-[8px] h-[18%] pointer-events-none">
          <line x1="4" y1="0" x2="4" y2="100%" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="6 4" opacity="0.4" />
        </svg>
        <span className="absolute right-[12px] top-[35%] text-[7px] tracking-[0.15em] uppercase text-muted-foreground/30" style={{ writingMode: 'vertical-rl' as const }}>window</span>

        <svg className="absolute right-[8px] top-[72%] w-[8px] h-[18%] pointer-events-none">
          <line x1="4" y1="0" x2="4" y2="100%" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="6 4" opacity="0.4" />
        </svg>
        <span className="absolute right-[12px] top-[79%] text-[7px] tracking-[0.15em] uppercase text-muted-foreground/30" style={{ writingMode: 'vertical-rl' as const }}>window</span>

        {/* ── BOTTOM WINDOW markers ── */}
        <svg className="absolute bottom-[8px] left-[2%] w-[22%] h-[8px] pointer-events-none">
          <line x1="0" y1="4" x2="100%" y2="4" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="6 4" opacity="0.4" />
        </svg>
        <span className="absolute bottom-[10px] left-[6%] text-[7px] tracking-[0.15em] uppercase text-muted-foreground/30">window</span>
        <svg className="absolute bottom-[8px] left-[52%] w-[22%] h-[8px] pointer-events-none">
          <line x1="0" y1="4" x2="100%" y2="4" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="6 4" opacity="0.4" />
        </svg>
        <span className="absolute bottom-[10px] left-[57%] text-[7px] tracking-[0.15em] uppercase text-muted-foreground/30">window</span>

        {/* ════════════════════════════════════════════════
            TABLES — positioned by % to match PDF exactly
            ════════════════════════════════════════════════ */}

        {/* ── C-3 (top-left, window) ── */}
        <div className="absolute" style={{ top: '3%', left: '2%' }}>
          <T table={g("C-3")} onClick={c("C-3")} w={48} h={56} />
        </div>

        {/* ── C-4 (next to C-3, slightly larger) ── */}
        <div className="absolute" style={{ top: '2.5%', left: '11%' }}>
          <T table={g("C-4")} onClick={c("C-4")} w={66} h={62} />
        </div>

        {/* ── D-7 (center-top, large arch table) ── */}
        <div className="absolute" style={{ top: '2.5%', left: '33%' }}>
          <T table={g("D-7")} onClick={c("D-7")} w={70} h={66} />
        </div>

        {/* ── D-8 (center-top, large arch table) ── */}
        <div className="absolute" style={{ top: '2.5%', left: '48%' }}>
          <T table={g("D-8")} onClick={c("D-8")} w={70} h={66} />
        </div>

        {/* ── STAGE (top-right corner) ── */}
        <div className="absolute" style={{ top: '2%', left: '72%' }}>
          <Box label="🎤 STAGE" w={140} h={72} />
        </div>

        {/* ── C-2 (left side, below C-3) ── */}
        <div className="absolute" style={{ top: '14%', left: '4%' }}>
          <T table={g("C-2")} onClick={c("C-2")} w={54} h={54} />
        </div>

        {/* ── D-6 through D-2 (horizontal row, center) ── */}
        <div className="absolute" style={{ top: '14%', left: '26%' }}>
          <T table={g("D-6")} onClick={c("D-6")} w={58} h={58} />
        </div>
        <div className="absolute" style={{ top: '14%', left: '35%' }}>
          <T table={g("D-5")} onClick={c("D-5")} w={58} h={58} />
        </div>
        <div className="absolute" style={{ top: '14%', left: '44%' }}>
          <T table={g("D-4")} onClick={c("D-4")} w={58} h={58} />
        </div>
        <div className="absolute" style={{ top: '14%', left: '53%' }}>
          <T table={g("D-3")} onClick={c("D-3")} w={58} h={58} />
        </div>
        <div className="absolute" style={{ top: '14%', left: '62%' }}>
          <T table={g("D-2")} onClick={c("D-2")} w={58} h={58} />
        </div>

        {/* ── C-1 (left, mid section) ── */}
        <div className="absolute" style={{ top: '29%', left: '9%' }}>
          <T table={g("C-1")} onClick={c("C-1")} w={52} h={52} />
        </div>

        {/* ── VIP-2 (far left, below C-1) ── */}
        <div className="absolute" style={{ top: '34%', left: '1%' }}>
          <T table={g("VIP-2")} onClick={c("VIP-2")} w={80} h={52} />
        </div>

        {/* ── STAIRS upper ── */}
        <div className="absolute" style={{ top: '29%', left: '22%' }}>
          <Box label="↗ STAIRS" w={140} h={38} />
        </div>

        {/* ── D-1 (large, center-right) ── */}
        <div className="absolute" style={{ top: '28%', left: '50%' }}>
          <T table={g("D-1")} onClick={c("D-1")} w={72} h={68} />
        </div>

        {/* ── D-9 (right side, window) ── */}
        <div className="absolute" style={{ top: '27%', left: '80%' }}>
          <T table={g("D-9")} onClick={c("D-9")} w={48} h={48} />
        </div>

        {/* ── D-10 (below D-9, window) ── */}
        <div className="absolute" style={{ top: '34%', left: '80%' }}>
          <T table={g("D-10")} onClick={c("D-10")} w={48} h={48} />
        </div>

        {/* ── TOILET WOMAN ── */}
        <div className="absolute" style={{ top: '44%', left: '10%' }}>
          <Box label="🚺 WC" w={70} h={34} />
        </div>

        {/* ── ELEVATOR x2 ── */}
        <div className="absolute" style={{ top: '42%', left: '28%' }}>
          <Box label="🛗 ЛИФТ" w={76} h={52} />
        </div>
        <div className="absolute" style={{ top: '42%', left: '40%' }}>
          <Box label="🛗 ЛИФТ" w={76} h={52} />
        </div>

        {/* ── VIP-1 (far left, mid-lower) ── */}
        <div className="absolute" style={{ top: '49%', left: '1%' }}>
          <T table={g("VIP-1")} onClick={c("VIP-1")} w={80} h={52} />
        </div>

        {/* ── BAR (center-right area) ── */}
        <div className="absolute" style={{ top: '46%', left: '55%' }}>
          <Box label="🍸 BAR" w={120} h={50} accent />
        </div>

        {/* ── STAIRS lower ── */}
        <div className="absolute" style={{ top: '52%', left: '28%' }}>
          <Box label="↗ STAIRS" w={140} h={38} />
        </div>

        {/* ── TOILET MAN ── */}
        <div className="absolute" style={{ top: '54%', left: '10%' }}>
          <Box label="🚹 WC" w={70} h={34} />
        </div>

        {/* ── A-1 ~ A-4 (right wall, vertical column) ── */}
        <div className="absolute" style={{ top: '42%', left: '86%' }}>
          <T table={g("A-1")} onClick={c("A-1")} w={44} h={44} />
        </div>
        <div className="absolute" style={{ top: '48%', left: '86%' }}>
          <T table={g("A-2")} onClick={c("A-2")} w={44} h={44} />
        </div>
        <div className="absolute" style={{ top: '54%', left: '86%' }}>
          <T table={g("A-3")} onClick={c("A-3")} w={44} h={44} />
        </div>
        <div className="absolute" style={{ top: '60%', left: '86%' }}>
          <T table={g("A-4")} onClick={c("A-4")} w={44} h={44} />
        </div>

        {/* ── B-3 (bottom-left, window) ── */}
        <div className="absolute" style={{ top: '70%', left: '2%' }}>
          <T table={g("B-3")} onClick={c("B-3")} w={60} h={62} />
        </div>

        {/* ── B-4 (bottom center-left) ── */}
        <div className="absolute" style={{ top: '70%', left: '28%' }}>
          <T table={g("B-4")} onClick={c("B-4")} w={66} h={62} />
        </div>

        {/* ── B-5 (bottom center) ── */}
        <div className="absolute" style={{ top: '70%', left: '44%' }}>
          <T table={g("B-5")} onClick={c("B-5")} w={66} h={62} />
        </div>

        {/* ── A-5 ~ A-8 (right wall, lower column, window) ── */}
        <div className="absolute" style={{ top: '68%', left: '86%' }}>
          <T table={g("A-5")} onClick={c("A-5")} w={44} h={44} />
        </div>
        <div className="absolute" style={{ top: '74%', left: '86%' }}>
          <T table={g("A-6")} onClick={c("A-6")} w={44} h={44} />
        </div>
        <div className="absolute" style={{ top: '80%', left: '86%' }}>
          <T table={g("A-7")} onClick={c("A-7")} w={44} h={44} />
        </div>
        <div className="absolute" style={{ top: '86%', left: '86%' }}>
          <T table={g("A-8")} onClick={c("A-8")} w={44} h={44} />
        </div>

        {/* ── B-2 (bottom-left, window) ── */}
        <div className="absolute" style={{ top: '80%', left: '2%' }}>
          <T table={g("B-2")} onClick={c("B-2")} w={60} h={62} />
        </div>

        {/* ── B-1 (below B-2) ── */}
        <div className="absolute" style={{ top: '88%', left: '10%' }}>
          <T table={g("B-1")} onClick={c("B-1")} w={50} h={50} />
        </div>

        {/* ── B-6 (bottom center) ── */}
        <div className="absolute" style={{ top: '82%', left: '38%' }}>
          <T table={g("B-6")} onClick={c("B-6")} w={66} h={62} />
        </div>

        {/* ── A-9 (bottom, near center-right) ── */}
        <div className="absolute" style={{ top: '84%', left: '60%' }}>
          <T table={g("A-9")} onClick={c("A-9")} w={50} h={50} />
        </div>

      </div>

      {/* ── Zone Legend ── */}
      <div className="flex flex-wrap justify-center gap-5 py-4 border-t border-border/30 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-primary/40 border border-primary/60" />
          <span className="text-[9px] tracking-wider uppercase text-primary font-medium">A — Бар</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-blue-400/40 border border-blue-400/60" />
          <span className="text-[9px] tracking-wider uppercase text-blue-400 font-medium">B — Төв зал</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400/40 border border-emerald-400/60" />
          <span className="text-[9px] tracking-wider uppercase text-emerald-400 font-medium">C — Chill</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-rose-400/40 border border-rose-400/60" />
          <span className="text-[9px] tracking-wider uppercase text-rose-400 font-medium">D — Үндсэн</span>
        </div>
      </div>
    </div>
  );
};

export { type TableInfo, type TableStatus };
export default FloorPlan;
