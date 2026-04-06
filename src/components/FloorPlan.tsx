import { motion } from "framer-motion";

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

const zoneColors: Record<string, { bg: string; border: string; ring: string; text: string; glow: string }> = {
  A: { bg: "bg-amber-500/15", border: "border-amber-400/50", ring: "ring-amber-400/40", text: "text-amber-300", glow: "shadow-amber-500/20" },
  B: { bg: "bg-sky-500/15", border: "border-sky-400/50", ring: "ring-sky-400/40", text: "text-sky-300", glow: "shadow-sky-500/20" },
  C: { bg: "bg-emerald-500/15", border: "border-emerald-400/50", ring: "ring-emerald-400/40", text: "text-emerald-300", glow: "shadow-emerald-500/20" },
  D: { bg: "bg-rose-500/15", border: "border-rose-400/50", ring: "ring-rose-400/40", text: "text-rose-300", glow: "shadow-rose-500/20" },
};

/* ─── Table button ─── */
const T = ({
  table, onClick, w = 52, h = 52,
}: {
  table: TableInfo; onClick: () => void; w?: number; h?: number;
}) => {
  const booked = table.status === "booked";
  const selected = table.status === "selected";
  const z = zoneColors[table.zone];

  return (
    <motion.button
      whileHover={!booked ? { scale: 1.08 } : undefined}
      whileTap={!booked ? { scale: 0.95 } : undefined}
      onClick={onClick}
      disabled={booked}
      title={`${table.id} — ${table.capacity}${table.isWindow ? " (Цонх)" : ""}${table.isVip ? " (VIP)" : ""}`}
      style={{ width: w, height: h }}
      className={`
        rounded-lg flex flex-col items-center justify-center transition-all duration-300 font-sans relative shrink-0 backdrop-blur-sm
        ${table.isWindow ? "border border-dashed" : "border"}
        ${booked
          ? "bg-muted/20 border-muted-foreground/10 opacity-30 cursor-not-allowed"
          : selected
          ? `${z.bg} ${z.border} ring-2 ${z.ring} shadow-lg ${z.glow} z-10`
          : table.isVip
          ? "bg-gradient-to-br from-primary/15 to-primary/5 border-primary/30 hover:border-primary/60 cursor-pointer hover:shadow-md hover:shadow-primary/10"
          : "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] cursor-pointer"
        }
      `}
    >
      <span className={`text-[9px] md:text-[10px] tracking-wider uppercase font-semibold leading-none ${
        booked ? "text-muted-foreground/30" : selected ? z.text : "text-foreground/70"
      }`}>{table.id}</span>
      <span className={`text-[7px] md:text-[8px] leading-none mt-1 ${
        booked ? "text-muted-foreground/20" : selected ? "text-foreground/50" : "text-muted-foreground/40"
      }`}>{table.capacity}</span>
      {table.isVip && !booked && !selected && (
        <span className="absolute -top-1.5 -right-1.5 text-[6px] bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-1.5 py-0.5 rounded-full font-bold leading-none tracking-wider">VIP</span>
      )}
      {booked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-[1px] bg-muted-foreground/30 rotate-45 absolute" />
          <div className="w-5 h-[1px] bg-muted-foreground/30 -rotate-45 absolute" />
        </div>
      )}
    </motion.button>
  );
};

/* ─── Landmark box ─── */
const Box = ({ label, w = 80, h = 36, accent = false }: { label: string; w?: number; h?: number; accent?: boolean }) => (
  <div
    style={{ width: w, height: h }}
    className={`flex items-center justify-center rounded-lg text-center shrink-0 backdrop-blur-sm ${
      accent
        ? "border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5"
        : "border border-white/[0.06] bg-white/[0.02]"
    }`}
  >
    <span className={`text-[8px] md:text-[9px] tracking-[0.15em] uppercase whitespace-nowrap font-medium ${
      accent ? "text-primary/50" : "text-muted-foreground/35"
    }`}>{label}</span>
  </div>
);

/* ─── Window Line ─── */
const WindowLine = ({ style, vertical = false }: { style: React.CSSProperties; vertical?: boolean }) => (
  <div className="absolute pointer-events-none" style={style}>
    <div className={`${vertical ? "w-[2px] h-full" : "h-[2px] w-full"} bg-gradient-to-${vertical ? 'b' : 'r'} from-transparent via-primary/15 to-transparent`} />
  </div>
);

const FloorPlan = ({ tables, onTableClick }: FloorPlanProps) => {
  const g = (id: string) => tables.find((tb) => tb.id === id)!;
  const c = (id: string) => () => onTableClick(id);

  return (
    <div className="relative w-full rounded-xl bg-gradient-to-br from-card/80 via-card/60 to-card/80 border border-white/[0.06] overflow-x-auto shadow-2xl shadow-black/20">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
        backgroundSize: '24px 24px'
      }} />

      <div className="min-w-[760px] md:min-w-[900px] mx-auto relative" style={{ aspectRatio: '1 / 1.1', maxHeight: 960 }}>

        {/* ── Outer wall ── */}
        <div className="absolute inset-[12px] border border-white/[0.06] rounded-lg pointer-events-none" />

        {/* ── Window markers ── */}
        <WindowLine style={{ top: 12, left: '2%', width: '30%' }} />
        <WindowLine style={{ top: 12, left: '34%', width: '34%' }} />
        <WindowLine style={{ top: 12, left: '68%', width: '14%' }} />
        <WindowLine style={{ right: 12, top: '28%', height: '18%' }} vertical />
        <WindowLine style={{ right: 12, top: '72%', height: '18%' }} vertical />
        <WindowLine style={{ bottom: 12, left: '2%', width: '22%' }} />
        <WindowLine style={{ bottom: 12, left: '52%', width: '22%' }} />

        {/* ── Zone dividers (subtle) ── */}
        <div className="absolute pointer-events-none" style={{ top: '38%', left: '1%', right: '1%' }}>
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </div>
        <div className="absolute pointer-events-none" style={{ top: '64%', left: '1%', right: '1%' }}>
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </div>

        {/* ════════════════════════════════
            TABLES — positioned by %
            ════════════════════════════════ */}

        {/* ── C-3 ── */}
        <div className="absolute" style={{ top: '3%', left: '2%' }}>
          <T table={g("C-3")} onClick={c("C-3")} w={48} h={56} />
        </div>
        {/* ── C-4 ── */}
        <div className="absolute" style={{ top: '2.5%', left: '11%' }}>
          <T table={g("C-4")} onClick={c("C-4")} w={66} h={62} />
        </div>
        {/* ── D-7 ── */}
        <div className="absolute" style={{ top: '2.5%', left: '33%' }}>
          <T table={g("D-7")} onClick={c("D-7")} w={70} h={66} />
        </div>
        {/* ── D-8 ── */}
        <div className="absolute" style={{ top: '2.5%', left: '48%' }}>
          <T table={g("D-8")} onClick={c("D-8")} w={70} h={66} />
        </div>
        {/* ── STAGE ── */}
        <div className="absolute" style={{ top: '2%', left: '72%' }}>
          <Box label="🎤 ТАЙЗ" w={140} h={72} />
        </div>

        {/* ── C-2 ── */}
        <div className="absolute" style={{ top: '14%', left: '4%' }}>
          <T table={g("C-2")} onClick={c("C-2")} w={54} h={54} />
        </div>
        {/* ── D-6 ~ D-2 ── */}
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

        {/* ── C-1 ── */}
        <div className="absolute" style={{ top: '29%', left: '9%' }}>
          <T table={g("C-1")} onClick={c("C-1")} w={52} h={52} />
        </div>
        {/* ── VIP-2 ── */}
        <div className="absolute" style={{ top: '34%', left: '1%' }}>
          <T table={g("VIP-2")} onClick={c("VIP-2")} w={80} h={52} />
        </div>
        {/* ── STAIRS upper ── */}
        <div className="absolute" style={{ top: '29%', left: '22%' }}>
          <Box label="↗ ШАТААР" w={140} h={38} />
        </div>
        {/* ── D-1 ── */}
        <div className="absolute" style={{ top: '28%', left: '50%' }}>
          <T table={g("D-1")} onClick={c("D-1")} w={72} h={68} />
        </div>
        {/* ── D-9 ── */}
        <div className="absolute" style={{ top: '27%', left: '80%' }}>
          <T table={g("D-9")} onClick={c("D-9")} w={48} h={48} />
        </div>
        {/* ── D-10 ── */}
        <div className="absolute" style={{ top: '34%', left: '80%' }}>
          <T table={g("D-10")} onClick={c("D-10")} w={48} h={48} />
        </div>

        {/* ── WC ── */}
        <div className="absolute" style={{ top: '44%', left: '10%' }}>
          <Box label="🚺 WC" w={70} h={34} />
        </div>
        {/* ── Elevators ── */}
        <div className="absolute" style={{ top: '42%', left: '28%' }}>
          <Box label="🛗 ЛИФТ" w={76} h={52} />
        </div>
        <div className="absolute" style={{ top: '42%', left: '40%' }}>
          <Box label="🛗 ЛИФТ" w={76} h={52} />
        </div>
        {/* ── VIP-1 ── */}
        <div className="absolute" style={{ top: '49%', left: '1%' }}>
          <T table={g("VIP-1")} onClick={c("VIP-1")} w={80} h={52} />
        </div>
        {/* ── BAR ── */}
        <div className="absolute" style={{ top: '46%', left: '55%' }}>
          <Box label="🍸 БАР" w={120} h={50} accent />
        </div>
        {/* ── STAIRS lower ── */}
        <div className="absolute" style={{ top: '52%', left: '28%' }}>
          <Box label="↗ ШАТААР" w={140} h={38} />
        </div>
        {/* ── WC ── */}
        <div className="absolute" style={{ top: '54%', left: '10%' }}>
          <Box label="🚹 WC" w={70} h={34} />
        </div>

        {/* ── A-1 ~ A-4 ── */}
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

        {/* ── B-3 ── */}
        <div className="absolute" style={{ top: '70%', left: '2%' }}>
          <T table={g("B-3")} onClick={c("B-3")} w={60} h={62} />
        </div>
        {/* ── B-4 ── */}
        <div className="absolute" style={{ top: '70%', left: '28%' }}>
          <T table={g("B-4")} onClick={c("B-4")} w={66} h={62} />
        </div>
        {/* ── B-5 ── */}
        <div className="absolute" style={{ top: '70%', left: '44%' }}>
          <T table={g("B-5")} onClick={c("B-5")} w={66} h={62} />
        </div>

        {/* ── A-5 ~ A-8 ── */}
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

        {/* ── B-2 ── */}
        <div className="absolute" style={{ top: '80%', left: '2%' }}>
          <T table={g("B-2")} onClick={c("B-2")} w={60} h={62} />
        </div>
        {/* ── B-1 ── */}
        <div className="absolute" style={{ top: '88%', left: '10%' }}>
          <T table={g("B-1")} onClick={c("B-1")} w={50} h={50} />
        </div>
        {/* ── B-6 ── */}
        <div className="absolute" style={{ top: '82%', left: '38%' }}>
          <T table={g("B-6")} onClick={c("B-6")} w={66} h={62} />
        </div>
        {/* ── A-9 ── */}
        <div className="absolute" style={{ top: '84%', left: '60%' }}>
          <T table={g("A-9")} onClick={c("A-9")} w={50} h={50} />
        </div>
      </div>

      {/* ── Zone Legend ── */}
      <div className="flex flex-wrap justify-center gap-6 py-5 border-t border-white/[0.06]">
        {[
          { key: "A", label: "Бар", colors: zoneColors.A },
          { key: "B", label: "Төв зал", colors: zoneColors.B },
          { key: "C", label: "Chill", colors: zoneColors.C },
          { key: "D", label: "Үндсэн", colors: zoneColors.D },
        ].map(({ key, label, colors }) => (
          <div key={key} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${colors.bg} border ${colors.border}`} />
            <span className={`text-[10px] tracking-[0.15em] uppercase font-medium ${colors.text}`}>
              {key} — {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export { type TableInfo, type TableStatus };
export default FloorPlan;
