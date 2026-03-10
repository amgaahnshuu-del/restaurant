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

const TableButton = ({
  table,
  onClick,
  size = "normal",
}: {
  table: TableInfo;
  onClick: () => void;
  size?: "small" | "normal" | "large" | "wide" | "vip";
}) => {
  const isBooked = table.status === "booked";
  const isSelected = table.status === "selected";

  const sizeClasses = {
    small: "w-[46px] h-[46px] md:w-[54px] md:h-[54px]",
    normal: "w-[54px] h-[54px] md:w-[62px] md:h-[62px]",
    large: "w-[64px] h-[64px] md:w-[74px] md:h-[74px]",
    wide: "w-[80px] h-[54px] md:w-[96px] md:h-[62px]",
    vip: "w-[90px] h-[58px] md:w-[110px] md:h-[68px]",
  };

  const zoneColors: Record<string, string> = {
    A: "ring-primary/60",
    B: "ring-blue-400/60",
    C: "ring-emerald-400/60",
    D: "ring-rose-400/60",
  };

  const zoneBorderSelected: Record<string, string> = {
    A: "border-primary",
    B: "border-blue-400",
    C: "border-emerald-400",
    D: "border-rose-400",
  };

  return (
    <button
      onClick={onClick}
      disabled={isBooked}
      title={`${table.id} — ${table.capacity}${table.isWindow ? " (Цонх)" : ""}${table.isVip ? " (VIP)" : ""}`}
      className={`
        ${sizeClasses[size]} rounded-lg flex flex-col items-center justify-center transition-all duration-300 font-sans relative
        ${table.isWindow ? "border-2 border-dashed" : "border-2"}
        ${isBooked
          ? "bg-muted/30 border-muted-foreground/20 opacity-40 cursor-not-allowed"
          : isSelected
          ? `bg-primary/20 ${zoneBorderSelected[table.zone]} ring-2 ${zoneColors[table.zone]} scale-110 shadow-lg shadow-primary/20`
          : table.isVip
          ? "bg-accent/20 border-accent/60 hover:border-primary/60 hover:bg-primary/10 cursor-pointer hover:scale-105"
          : "bg-secondary/80 border-border hover:border-primary/50 hover:bg-primary/10 cursor-pointer hover:scale-105"
        }
      `}
    >
      <span className={`text-[10px] md:text-[11px] tracking-wider uppercase font-bold ${
        isBooked ? "text-muted-foreground/50" : isSelected ? "text-primary" : "text-foreground/80"
      }`}>
        {table.id}
      </span>
      <span className={`text-[8px] md:text-[9px] leading-tight mt-0.5 ${
        isBooked ? "text-muted-foreground/30" : "text-muted-foreground/70"
      }`}>
        {table.capacity}
      </span>
      {table.isVip && !isBooked && !isSelected && (
        <span className="absolute -top-1 -right-1 text-[8px] bg-accent text-accent-foreground px-1 rounded-sm font-bold">VIP</span>
      )}
      {isBooked && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="text-destructive/60 text-lg font-bold">✕</span>
        </span>
      )}
    </button>
  );
};

const Landmark = ({ label, className = "" }: { label: string; className?: string }) => (
  <div className={`px-4 py-2.5 border border-border/40 rounded-lg bg-secondary/30 text-center backdrop-blur-sm ${className}`}>
    <span className="text-[9px] md:text-[10px] tracking-[0.15em] uppercase text-muted-foreground/60 whitespace-nowrap font-medium">
      {label}
    </span>
  </div>
);

const WindowLabel = ({ className = "" }: { className?: string }) => (
  <span className={`text-[8px] md:text-[9px] tracking-[0.2em] uppercase text-muted-foreground/40 font-medium ${className}`}>
    ┃ WINDOW ┃
  </span>
);

const FloorPlan = ({ tables, onTableClick }: FloorPlanProps) => {
  const t = (id: string) => tables.find((tb) => tb.id === id)!;
  const click = (id: string) => () => onTableClick(id);

  return (
    <div className="relative w-full border border-border/60 rounded-lg bg-card/60 backdrop-blur-sm p-4 md:p-8 overflow-x-auto shadow-xl">
      <div className="min-w-[780px] md:min-w-[950px] mx-auto relative" style={{ height: 920 }}>

        {/* ══════════ OUTER WALLS ══════════ */}
        <div className="absolute inset-0 border-2 border-border/30 rounded-lg pointer-events-none" />

        {/* ── TOP WINDOWS ── */}
        <div className="absolute top-[-2px] left-[3%] right-[15%] flex justify-around">
          <WindowLabel />
          <WindowLabel />
          <WindowLabel />
          <WindowLabel />
        </div>

        {/* ══════════ ROW 1: C-3, C-4 | D-7, D-8 | STAGE — top: ~30 ══════════ */}
        <div className="absolute" style={{ top: 30, left: '2%' }}>
          <TableButton table={t("C-3")} onClick={click("C-3")} />
        </div>
        <div className="absolute" style={{ top: 30, left: '12%' }}>
          <TableButton table={t("C-4")} onClick={click("C-4")} size="large" />
        </div>
        <div className="absolute" style={{ top: 30, left: '33%' }}>
          <TableButton table={t("D-7")} onClick={click("D-7")} size="large" />
        </div>
        <div className="absolute" style={{ top: 30, left: '48%' }}>
          <TableButton table={t("D-8")} onClick={click("D-8")} size="large" />
        </div>
        {/* STAGE */}
        <div className="absolute" style={{ top: 30, right: '2%' }}>
          <div className="w-[120px] md:w-[140px] h-[70px] md:h-[80px] border-2 border-border/50 rounded-lg bg-secondary/40 flex items-center justify-center">
            <span className="text-[11px] md:text-[12px] tracking-[0.25em] uppercase text-muted-foreground/70 font-medium">🎤 STAGE</span>
          </div>
        </div>

        {/* ══════════ ROW 2: C-2 | D-6~D-2 — top: ~130 ══════════ */}
        <div className="absolute" style={{ top: 130, left: '4%' }}>
          <TableButton table={t("C-2")} onClick={click("C-2")} />
        </div>
        <div className="absolute flex gap-2.5" style={{ top: 125, left: '26%' }}>
          <TableButton table={t("D-6")} onClick={click("D-6")} size="large" />
          <TableButton table={t("D-5")} onClick={click("D-5")} size="large" />
          <TableButton table={t("D-4")} onClick={click("D-4")} size="large" />
          <TableButton table={t("D-3")} onClick={click("D-3")} size="large" />
          <TableButton table={t("D-2")} onClick={click("D-2")} size="large" />
        </div>

        {/* ══════════ ROW 3: C-1 | STAIRS | D-1 | D-9/D-10 — top: ~250 ══════════ */}
        <div className="absolute" style={{ top: 265, left: '8%' }}>
          <TableButton table={t("C-1")} onClick={click("C-1")} />
        </div>
        {/* VIP-2 */}
        <div className="absolute" style={{ top: 310, left: '1%' }}>
          <TableButton table={t("VIP-2")} onClick={click("VIP-2")} size="vip" />
        </div>
        {/* STAIRS upper */}
        <div className="absolute" style={{ top: 265, left: '24%' }}>
          <div className="w-[130px] md:w-[160px] h-[40px] border border-border/40 rounded-lg bg-secondary/20 flex items-center justify-center">
            <span className="text-[9px] md:text-[10px] tracking-[0.15em] uppercase text-muted-foreground/50">↗ STAIRS</span>
          </div>
        </div>
        {/* D-1 */}
        <div className="absolute" style={{ top: 250, left: '50%' }}>
          <TableButton table={t("D-1")} onClick={click("D-1")} size="large" />
        </div>
        {/* D-9 */}
        <div className="absolute" style={{ top: 235, right: '4%' }}>
          <TableButton table={t("D-9")} onClick={click("D-9")} size="small" />
        </div>
        {/* D-10 */}
        <div className="absolute" style={{ top: 310, right: '4%' }}>
          <TableButton table={t("D-10")} onClick={click("D-10")} size="small" />
        </div>
        {/* RIGHT WINDOW */}
        <div className="absolute" style={{ top: 220, right: 0, writingMode: 'vertical-rl' as const }}>
          <WindowLabel />
        </div>

        {/* ══════════ ROW 4: TOILET WOMAN | ELEVATORS | BAR | A-1~A-4 — top: ~410 ══════════ */}
        {/* Toilet Woman */}
        <div className="absolute" style={{ top: 420, left: '10%' }}>
          <Landmark label="🚺 WC" />
        </div>
        {/* Elevators */}
        <div className="absolute flex gap-3" style={{ top: 410, left: '28%' }}>
          <div className="w-[70px] md:w-[85px] h-[55px] md:h-[65px] border-2 border-border/40 rounded-lg bg-secondary/30 flex items-center justify-center">
            <span className="text-[9px] md:text-[10px] tracking-wider uppercase text-muted-foreground/50">🛗 ЛИФТ</span>
          </div>
          <div className="w-[70px] md:w-[85px] h-[55px] md:h-[65px] border-2 border-border/40 rounded-lg bg-secondary/30 flex items-center justify-center">
            <span className="text-[9px] md:text-[10px] tracking-wider uppercase text-muted-foreground/50">🛗 ЛИФТ</span>
          </div>
        </div>

        {/* VIP-1 */}
        <div className="absolute" style={{ top: 470, left: '1%' }}>
          <TableButton table={t("VIP-1")} onClick={click("VIP-1")} size="vip" />
        </div>

        {/* BAR */}
        <div className="absolute" style={{ top: 430, left: '54%' }}>
          <div className="w-[110px] md:w-[130px] h-[50px] md:h-[58px] border-2 border-primary/30 rounded-lg bg-primary/5 flex items-center justify-center">
            <span className="text-[11px] md:text-[12px] tracking-[0.25em] uppercase text-primary/70 font-semibold">🍸 BAR</span>
          </div>
        </div>

        {/* A-1 ~ A-4 (right side, vertical stack) */}
        <div className="absolute flex flex-col gap-2" style={{ top: 385, right: '3%' }}>
          <TableButton table={t("A-1")} onClick={click("A-1")} size="small" />
          <TableButton table={t("A-2")} onClick={click("A-2")} size="small" />
          <TableButton table={t("A-3")} onClick={click("A-3")} size="small" />
          <TableButton table={t("A-4")} onClick={click("A-4")} size="small" />
        </div>

        {/* ══════════ ROW 5: TOILET MAN | STAIRS lower — top: ~500 ══════════ */}
        {/* Toilet Man */}
        <div className="absolute" style={{ top: 520, left: '10%' }}>
          <Landmark label="🚹 WC" />
        </div>
        {/* STAIRS lower */}
        <div className="absolute" style={{ top: 510, left: '28%' }}>
          <div className="w-[130px] md:w-[160px] h-[40px] border border-border/40 rounded-lg bg-secondary/20 flex items-center justify-center">
            <span className="text-[9px] md:text-[10px] tracking-[0.15em] uppercase text-muted-foreground/50">↗ STAIRS</span>
          </div>
        </div>

        {/* ══════════ ROW 6: B-3 | B-4, B-5 | A-5~A-8 — top: ~620 ══════════ */}
        <div className="absolute" style={{ top: 630, left: '2%' }}>
          <TableButton table={t("B-3")} onClick={click("B-3")} size="large" />
        </div>
        <div className="absolute" style={{ top: 630, left: '28%' }}>
          <TableButton table={t("B-4")} onClick={click("B-4")} size="large" />
        </div>
        <div className="absolute" style={{ top: 630, left: '45%' }}>
          <TableButton table={t("B-5")} onClick={click("B-5")} size="large" />
        </div>
        {/* A-5 ~ A-8 */}
        <div className="absolute flex flex-col gap-2" style={{ top: 610, right: '3%' }}>
          <TableButton table={t("A-5")} onClick={click("A-5")} size="small" />
          <TableButton table={t("A-6")} onClick={click("A-6")} size="small" />
          <TableButton table={t("A-7")} onClick={click("A-7")} size="small" />
          <TableButton table={t("A-8")} onClick={click("A-8")} size="small" />
        </div>
        {/* RIGHT WINDOW lower */}
        <div className="absolute" style={{ top: 650, right: 0, writingMode: 'vertical-rl' as const }}>
          <WindowLabel />
        </div>

        {/* ══════════ ROW 7: B-2, B-1 | B-6 | A-9 — top: ~740 ══════════ */}
        <div className="absolute" style={{ top: 740, left: '2%' }}>
          <TableButton table={t("B-2")} onClick={click("B-2")} size="large" />
        </div>
        <div className="absolute" style={{ top: 815, left: '8%' }}>
          <TableButton table={t("B-1")} onClick={click("B-1")} />
        </div>
        <div className="absolute" style={{ top: 760, left: '38%' }}>
          <TableButton table={t("B-6")} onClick={click("B-6")} size="large" />
        </div>
        {/* A-9 */}
        <div className="absolute" style={{ top: 770, left: '60%' }}>
          <TableButton table={t("A-9")} onClick={click("A-9")} />
        </div>

        {/* ── BOTTOM WINDOWS ── */}
        <div className="absolute bottom-[5px] left-[3%] right-[15%] flex justify-around">
          <WindowLabel />
          <WindowLabel />
        </div>

        {/* ══════════ ZONE LEGEND ══════════ */}
        <div className="absolute bottom-[-35px] left-0 right-0 flex flex-wrap justify-center gap-5 pt-3 border-t border-border/30">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-primary/40 border border-primary/60" />
            <span className="text-[9px] md:text-[10px] tracking-wider uppercase text-primary font-medium">A — Бар хэсэг</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-blue-400/40 border border-blue-400/60" />
            <span className="text-[9px] md:text-[10px] tracking-wider uppercase text-blue-400 font-medium">B — Төв зал</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-emerald-400/40 border border-emerald-400/60" />
            <span className="text-[9px] md:text-[10px] tracking-wider uppercase text-emerald-400 font-medium">C — Chill Zone</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-rose-400/40 border border-rose-400/60" />
            <span className="text-[9px] md:text-[10px] tracking-wider uppercase text-rose-400 font-medium">D — Үндсэн зал</span>
          </div>
        </div>
      </div>
      {/* spacer for legend */}
      <div className="h-12" />
    </div>
  );
};

export { type TableInfo, type TableStatus };
export default FloorPlan;
