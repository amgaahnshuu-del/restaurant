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
  size?: "small" | "normal" | "large" | "vip";
}) => {
  const isBooked = table.status === "booked";
  const isSelected = table.status === "selected";

  const sizeClasses = {
    small: "w-10 h-10 md:w-12 md:h-12",
    normal: "w-12 h-12 md:w-14 md:h-14",
    large: "w-14 h-14 md:w-16 md:h-16",
    vip: "w-16 h-12 md:w-20 md:h-14",
  };

  const zoneRing: Record<string, string> = {
    A: "ring-primary/50",
    B: "ring-blue-400/50",
    C: "ring-emerald-400/50",
    D: "ring-rose-400/50",
  };

  return (
    <button
      onClick={onClick}
      disabled={isBooked}
      title={`${table.id} — ${table.capacity}${table.isWindow ? " (Цонх)" : ""}${table.isVip ? " (VIP)" : ""}`}
      className={`
        ${sizeClasses[size]} rounded-md flex flex-col items-center justify-center transition-all duration-300 font-sans relative
        ${table.isWindow ? "border-2 border-dashed" : "border-2"}
        ${isBooked
          ? "bg-muted/30 border-muted-foreground/20 opacity-40 cursor-not-allowed"
          : isSelected
          ? `bg-primary/20 border-primary ring-2 ${zoneRing[table.zone]} scale-110 shadow-lg shadow-primary/20`
          : table.isVip
          ? "bg-accent/30 border-accent hover:border-primary/50 hover:bg-primary/10 cursor-pointer"
          : "bg-secondary border-border hover:border-primary/50 hover:bg-primary/10 cursor-pointer"
        }
      `}
    >
      <span className={`text-[9px] md:text-[10px] tracking-wider uppercase font-semibold ${
        isBooked ? "text-muted-foreground/50" : isSelected ? "text-primary" : "text-foreground/80"
      }`}>
        {table.id}
      </span>
      <span className={`text-[7px] md:text-[8px] leading-tight ${
        isBooked ? "text-muted-foreground/30" : "text-muted-foreground/70"
      }`}>
        {table.capacity}
      </span>
      {isBooked && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="text-destructive/60 text-sm">✕</span>
        </span>
      )}
    </button>
  );
};

const Landmark = ({ label, className = "" }: { label: string; className?: string }) => (
  <div className={`px-3 py-2 border border-border/30 rounded-sm bg-secondary/20 text-center ${className}`}>
    <span className="text-[9px] md:text-[10px] tracking-wider uppercase text-muted-foreground/60 whitespace-nowrap">
      {label}
    </span>
  </div>
);

const FloorPlan = ({ tables, onTableClick }: FloorPlanProps) => {
  const t = (id: string) => tables.find((tb) => tb.id === id)!;
  const click = (id: string) => () => onTableClick(id);

  return (
    <div className="relative w-full border border-border rounded-sm bg-card/50 p-3 md:p-6 overflow-x-auto">
      <div className="min-w-[720px] md:min-w-[860px] mx-auto relative" style={{ minHeight: 700 }}>

        {/* === Use absolute positioning to match the PDF layout === */}

        {/* ── TOP WINDOWS ── */}
        <div className="absolute top-0 left-[2%] text-[9px] tracking-wider uppercase text-muted-foreground/50">🪟 Цонх</div>
        <div className="absolute top-0 left-[35%] text-[9px] tracking-wider uppercase text-muted-foreground/50">🪟 Цонх</div>
        <div className="absolute top-0 left-[52%] text-[9px] tracking-wider uppercase text-muted-foreground/50">🪟 Цонх</div>
        <div className="absolute top-0 right-[15%] text-[9px] tracking-wider uppercase text-muted-foreground/50">🪟 Цонх</div>

        {/* ── ROW 1: C-3, C-4 | D-7, D-8 | STAGE ── */}
        {/* C-3 */}
        <div className="absolute" style={{ top: 20, left: '2%' }}>
          <TableButton table={t("C-3")} onClick={click("C-3")} />
        </div>
        {/* C-4 */}
        <div className="absolute" style={{ top: 20, left: '12%' }}>
          <TableButton table={t("C-4")} onClick={click("C-4")} />
        </div>
        {/* D-7 */}
        <div className="absolute" style={{ top: 20, left: '32%' }}>
          <TableButton table={t("D-7")} onClick={click("D-7")} size="large" />
        </div>
        {/* D-8 */}
        <div className="absolute" style={{ top: 20, left: '48%' }}>
          <TableButton table={t("D-8")} onClick={click("D-8")} size="large" />
        </div>
        {/* STAGE */}
        <div className="absolute" style={{ top: 25, right: '2%' }}>
          <div className="px-6 py-4 border border-border/50 rounded-sm bg-secondary/30 text-center">
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">🎤 Stage</span>
          </div>
        </div>

        {/* ── ROW 2: C-2 | D-6, D-5, D-4, D-3, D-2 ── */}
        {/* C-2 */}
        <div className="absolute" style={{ top: 100, left: '5%' }}>
          <TableButton table={t("C-2")} onClick={click("C-2")} />
        </div>
        {/* D-6 ~ D-2 */}
        <div className="absolute flex gap-2" style={{ top: 100, left: '25%' }}>
          <TableButton table={t("D-6")} onClick={click("D-6")} />
          <TableButton table={t("D-5")} onClick={click("D-5")} />
          <TableButton table={t("D-4")} onClick={click("D-4")} />
          <TableButton table={t("D-3")} onClick={click("D-3")} />
          <TableButton table={t("D-2")} onClick={click("D-2")} />
        </div>

        {/* ── ROW 3: C-1 | STAIRS | D-1 | D-9, D-10 (window side) ── */}
        {/* C-1 */}
        <div className="absolute" style={{ top: 200, left: '8%' }}>
          <TableButton table={t("C-1")} onClick={click("C-1")} />
        </div>
        {/* STAIRS (upper) */}
        <div className="absolute" style={{ top: 205, left: '25%' }}>
          <Landmark label="🔼 Шат" />
        </div>
        {/* D-1 */}
        <div className="absolute" style={{ top: 195, left: '48%' }}>
          <TableButton table={t("D-1")} onClick={click("D-1")} size="large" />
        </div>
        {/* D-9 */}
        <div className="absolute" style={{ top: 180, right: '3%' }}>
          <TableButton table={t("D-9")} onClick={click("D-9")} />
        </div>
        {/* D-10 */}
        <div className="absolute" style={{ top: 245, right: '3%' }}>
          <TableButton table={t("D-10")} onClick={click("D-10")} />
        </div>
        {/* RIGHT WINDOW label */}
        <div className="absolute text-[9px] tracking-wider uppercase text-muted-foreground/50" style={{ top: 210, right: 0, writingMode: 'vertical-rl' }}>
          🪟 Цонх
        </div>

        {/* ── ROW 4: VIP-2 | TOILET WOMAN | ELEVATOR x2 | BAR | A-1~A-4 ── */}
        {/* VIP-2 */}
        <div className="absolute" style={{ top: 270, left: '1%' }}>
          <TableButton table={t("VIP-2")} onClick={click("VIP-2")} size="vip" />
        </div>
        {/* Toilet Woman */}
        <div className="absolute" style={{ top: 330, left: '13%' }}>
          <Landmark label="🚺 WC" />
        </div>
        {/* Elevators */}
        <div className="absolute flex gap-2" style={{ top: 330, left: '30%' }}>
          <Landmark label="🛗 Лифт" />
          <Landmark label="🛗 Лифт" />
        </div>
        {/* BAR */}
        <div className="absolute" style={{ top: 340, left: '52%' }}>
          <div className="px-8 py-3 border border-primary/20 rounded-sm bg-primary/5">
            <span className="text-[10px] tracking-[0.2em] uppercase text-primary/70">🍸 Бар</span>
          </div>
        </div>
        {/* A-1 */}
        <div className="absolute" style={{ top: 300, right: '3%' }}>
          <TableButton table={t("A-1")} onClick={click("A-1")} size="small" />
        </div>
        {/* A-2 */}
        <div className="absolute" style={{ top: 345, right: '3%' }}>
          <TableButton table={t("A-2")} onClick={click("A-2")} size="small" />
        </div>
        {/* A-3 */}
        <div className="absolute" style={{ top: 390, right: '3%' }}>
          <TableButton table={t("A-3")} onClick={click("A-3")} size="small" />
        </div>
        {/* A-4 */}
        <div className="absolute" style={{ top: 435, right: '3%' }}>
          <TableButton table={t("A-4")} onClick={click("A-4")} size="small" />
        </div>

        {/* ── ROW 5: VIP-1 | TOILET MAN | STAIRS (lower) ── */}
        {/* VIP-1 */}
        <div className="absolute" style={{ top: 385, left: '1%' }}>
          <TableButton table={t("VIP-1")} onClick={click("VIP-1")} size="vip" />
        </div>
        {/* Toilet Man */}
        <div className="absolute" style={{ top: 420, left: '13%' }}>
          <Landmark label="🚹 WC" />
        </div>
        {/* STAIRS (lower) */}
        <div className="absolute" style={{ top: 415, left: '30%' }}>
          <Landmark label="🔼 Шат" />
        </div>

        {/* ── ROW 6: B-3 | B-4, B-5 | A-5~A-8 (window side) ── */}
        {/* B-3 */}
        <div className="absolute" style={{ top: 500, left: '2%' }}>
          <TableButton table={t("B-3")} onClick={click("B-3")} size="large" />
        </div>
        {/* B-4 */}
        <div className="absolute" style={{ top: 500, left: '28%' }}>
          <TableButton table={t("B-4")} onClick={click("B-4")} size="large" />
        </div>
        {/* B-5 */}
        <div className="absolute" style={{ top: 500, left: '46%' }}>
          <TableButton table={t("B-5")} onClick={click("B-5")} size="large" />
        </div>
        {/* A-5, A-6 */}
        <div className="absolute" style={{ top: 490, right: '3%' }}>
          <TableButton table={t("A-5")} onClick={click("A-5")} size="small" />
        </div>
        <div className="absolute" style={{ top: 535, right: '3%' }}>
          <TableButton table={t("A-6")} onClick={click("A-6")} size="small" />
        </div>
        {/* A-7, A-8 */}
        <div className="absolute" style={{ top: 580, right: '3%' }}>
          <TableButton table={t("A-7")} onClick={click("A-7")} size="small" />
        </div>
        <div className="absolute" style={{ top: 625, right: '3%' }}>
          <TableButton table={t("A-8")} onClick={click("A-8")} size="small" />
        </div>
        {/* RIGHT WINDOW label (lower) */}
        <div className="absolute text-[9px] tracking-wider uppercase text-muted-foreground/50" style={{ top: 560, right: 0, writingMode: 'vertical-rl' }}>
          🪟 Цонх
        </div>

        {/* ── ROW 7: B-2, B-1 | B-6 | A-9 ── */}
        {/* B-2 */}
        <div className="absolute" style={{ top: 585, left: '2%' }}>
          <TableButton table={t("B-2")} onClick={click("B-2")} size="large" />
        </div>
        {/* B-1 */}
        <div className="absolute" style={{ top: 645, left: '8%' }}>
          <TableButton table={t("B-1")} onClick={click("B-1")} />
        </div>
        {/* B-6 */}
        <div className="absolute" style={{ top: 600, left: '40%' }}>
          <TableButton table={t("B-6")} onClick={click("B-6")} size="large" />
        </div>
        {/* A-9 */}
        <div className="absolute" style={{ top: 610, left: '62%' }}>
          <TableButton table={t("A-9")} onClick={click("A-9")} />
        </div>

        {/* ── BOTTOM WINDOWS ── */}
        <div className="absolute bottom-0 left-[2%] text-[9px] tracking-wider uppercase text-muted-foreground/50">🪟 Цонх</div>
        <div className="absolute bottom-0 right-[20%] text-[9px] tracking-wider uppercase text-muted-foreground/50">🪟 Цонх</div>

        {/* ── Zone Legend ── */}
        <div className="absolute bottom-[-30px] left-0 right-0 flex flex-wrap justify-center gap-4 pt-4 border-t border-border/30">
          <span className="text-[9px] tracking-wider uppercase text-primary">A — Бар хэсэг</span>
          <span className="text-[9px] tracking-wider uppercase text-blue-400">B — Төв зал</span>
          <span className="text-[9px] tracking-wider uppercase text-emerald-400">C — Chill Zone</span>
          <span className="text-[9px] tracking-wider uppercase text-rose-400">D — Үндсэн зал</span>
        </div>
      </div>
      {/* spacer for legend */}
      <div className="h-8" />
    </div>
  );
};

export { type TableInfo, type TableStatus };
export default FloorPlan;
