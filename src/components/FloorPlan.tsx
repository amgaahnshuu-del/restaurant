

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
        ${sizeClasses[size]} rounded-md flex flex-col items-center justify-center transition-all duration-300 font-sans
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

const FloorPlan = ({ tables, onTableClick }: FloorPlanProps) => {
  const getTable = (id: string) => tables.find((t) => t.id === id)!;

  return (
    <div className="relative w-full border border-border rounded-sm bg-card/50 p-3 md:p-6 overflow-x-auto">
      <div className="min-w-[700px] md:min-w-[800px] mx-auto">
        
        {/* === TOP ROW: Windows label === */}
        <div className="flex justify-between items-center mb-2 px-2">
          <span className="text-[9px] tracking-wider uppercase text-muted-foreground/50">🪟 Цонх</span>
          <span className="text-[9px] tracking-wider uppercase text-muted-foreground/50">🪟 Цонх</span>
          <span className="text-[9px] tracking-wider uppercase text-muted-foreground/50">🪟 Цонх</span>
        </div>

        {/* === MAIN LAYOUT === */}
        <div className="grid grid-cols-12 gap-2 md:gap-3">

          {/* ======= ROW 1: C-3, C-4, D-7, D-8, STAGE ======= */}
          <div className="col-span-2 flex flex-col gap-2 items-center">
            <div className="flex gap-2">
              <TableButton table={getTable("C-3")} onClick={() => onTableClick("C-3")} />
              <TableButton table={getTable("C-4")} onClick={() => onTableClick("C-4")} />
            </div>
          </div>
          <div className="col-span-1" />
          <div className="col-span-4 flex justify-center gap-3">
            <TableButton table={getTable("D-7")} onClick={() => onTableClick("D-7")} size="large" />
            <TableButton table={getTable("D-8")} onClick={() => onTableClick("D-8")} size="large" />
          </div>
          <div className="col-span-1" />
          <div className="col-span-4 flex items-center justify-center">
            <div className="px-6 py-4 border border-border/50 rounded-sm bg-secondary/30 text-center">
              <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">🎤 Stage</span>
            </div>
          </div>

          {/* ======= ROW 2: C-2, D-6~D-2 row ======= */}
          <div className="col-span-2 flex justify-center">
            <TableButton table={getTable("C-2")} onClick={() => onTableClick("C-2")} />
          </div>
          <div className="col-span-1" />
          <div className="col-span-6 flex justify-center gap-2">
            <TableButton table={getTable("D-6")} onClick={() => onTableClick("D-6")} />
            <TableButton table={getTable("D-5")} onClick={() => onTableClick("D-5")} />
            <TableButton table={getTable("D-4")} onClick={() => onTableClick("D-4")} />
            <TableButton table={getTable("D-3")} onClick={() => onTableClick("D-3")} />
            <TableButton table={getTable("D-2")} onClick={() => onTableClick("D-2")} />
          </div>
          <div className="col-span-3" />

          {/* ======= ROW 3: VIP-2 + C-1, STAIRS, D-1, D-9 ======= */}
          <div className="col-span-2 flex flex-col gap-2 items-center">
            <TableButton table={getTable("VIP-2")} onClick={() => onTableClick("VIP-2")} size="vip" />
            <TableButton table={getTable("C-1")} onClick={() => onTableClick("C-1")} />
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <div className="px-3 py-2 border border-border/30 rounded-sm bg-secondary/20">
              <span className="text-[9px] tracking-wider uppercase text-muted-foreground/60">🔼 Шат</span>
            </div>
          </div>
          <div className="col-span-3 flex items-center justify-center">
            <TableButton table={getTable("D-1")} onClick={() => onTableClick("D-1")} size="large" />
          </div>
          <div className="col-span-1" />
          <div className="col-span-4 flex flex-col items-end gap-2 pr-2">
            <TableButton table={getTable("D-9")} onClick={() => onTableClick("D-9")} />
            <TableButton table={getTable("D-10")} onClick={() => onTableClick("D-10")} />
          </div>

          {/* ======= ROW 4: VIP-1, ELEVATOR, BAR, A-1~A-4 ======= */}
          <div className="col-span-2 flex justify-center items-center">
            <TableButton table={getTable("VIP-1")} onClick={() => onTableClick("VIP-1")} size="vip" />
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <div className="px-3 py-2 border border-border/30 rounded-sm bg-secondary/20">
              <span className="text-[9px] tracking-wider uppercase text-muted-foreground/60">🛗 Лифт</span>
            </div>
          </div>
          <div className="col-span-4 flex items-center justify-center">
            <div className="px-8 py-3 border border-primary/20 rounded-sm bg-primary/5">
              <span className="text-[10px] tracking-[0.2em] uppercase text-primary/70">🍸 Бар</span>
            </div>
          </div>
          <div className="col-span-4 flex flex-col items-end gap-1.5 pr-2">
            <div className="flex gap-1.5">
              <TableButton table={getTable("A-1")} onClick={() => onTableClick("A-1")} size="small" />
              <TableButton table={getTable("A-2")} onClick={() => onTableClick("A-2")} size="small" />
            </div>
            <div className="flex gap-1.5">
              <TableButton table={getTable("A-3")} onClick={() => onTableClick("A-3")} size="small" />
              <TableButton table={getTable("A-4")} onClick={() => onTableClick("A-4")} size="small" />
            </div>
          </div>

          {/* ======= ROW 5: B-3, B-4, B-5, A-5~A-8 ======= */}
          <div className="col-span-2 flex justify-center">
            <TableButton table={getTable("B-3")} onClick={() => onTableClick("B-3")} size="large" />
          </div>
          <div className="col-span-1" />
          <div className="col-span-5 flex justify-center gap-3">
            <TableButton table={getTable("B-4")} onClick={() => onTableClick("B-4")} size="large" />
            <TableButton table={getTable("B-5")} onClick={() => onTableClick("B-5")} size="large" />
          </div>
          <div className="col-span-4 flex flex-col items-end gap-1.5 pr-2">
            <div className="flex gap-1.5">
              <TableButton table={getTable("A-5")} onClick={() => onTableClick("A-5")} size="small" />
              <TableButton table={getTable("A-6")} onClick={() => onTableClick("A-6")} size="small" />
            </div>
            <div className="flex gap-1.5">
              <TableButton table={getTable("A-7")} onClick={() => onTableClick("A-7")} size="small" />
              <TableButton table={getTable("A-8")} onClick={() => onTableClick("A-8")} size="small" />
            </div>
          </div>

          {/* ======= ROW 6: B-2, B-1, B-6, A-9 ======= */}
          <div className="col-span-2 flex flex-col items-center gap-2">
            <TableButton table={getTable("B-2")} onClick={() => onTableClick("B-2")} size="large" />
            <TableButton table={getTable("B-1")} onClick={() => onTableClick("B-1")} />
          </div>
          <div className="col-span-1" />
          <div className="col-span-5 flex justify-center">
            <TableButton table={getTable("B-6")} onClick={() => onTableClick("B-6")} size="large" />
          </div>
          <div className="col-span-4 flex items-start justify-end pr-2">
            <TableButton table={getTable("A-9")} onClick={() => onTableClick("A-9")} />
          </div>
        </div>

        {/* Bottom windows */}
        <div className="flex justify-between items-center mt-2 px-2">
          <span className="text-[9px] tracking-wider uppercase text-muted-foreground/50">🪟 Цонх</span>
          <span className="text-[9px] tracking-wider uppercase text-muted-foreground/50">🪟 Цонх</span>
        </div>

        {/* Zone Legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-4 pt-4 border-t border-border/30">
          <span className="text-[9px] tracking-wider uppercase text-primary">A — Бар хэсэг</span>
          <span className="text-[9px] tracking-wider uppercase text-blue-400">B — Төв зал</span>
          <span className="text-[9px] tracking-wider uppercase text-emerald-400">C — Chill Zone</span>
          <span className="text-[9px] tracking-wider uppercase text-rose-400">D — Үндсэн зал</span>
        </div>
      </div>
    </div>
  );
};

export { type TableInfo, type TableStatus };
export default FloorPlan;
