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
  A: { bg: "bg-amber-500/15", border: "border-amber-500/45", ring: "ring-amber-500/30", text: "text-amber-700", glow: "shadow-amber-500/20" },
  B: { bg: "bg-sky-500/12", border: "border-sky-500/40", ring: "ring-sky-500/25", text: "text-sky-700", glow: "shadow-sky-500/20" },
  C: { bg: "bg-emerald-500/12", border: "border-emerald-500/40", ring: "ring-emerald-500/25", text: "text-emerald-700", glow: "shadow-emerald-500/20" },
  D: { bg: "bg-rose-500/12", border: "border-rose-500/40", ring: "ring-rose-500/25", text: "text-rose-700", glow: "shadow-rose-500/20" },
};

const zoneNames: Record<string, string> = {
  A: "Window row",
  B: "Central hall",
  C: "Lounge",
  D: "Main dining",
};

const T = ({
  table,
  onClick,
  w = 52,
  h = 52,
}: {
  table: TableInfo;
  onClick: () => void;
  w?: number;
  h?: number;
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
      title={`${table.id} - ${table.capacity}${table.isWindow ? " (window)" : ""}${table.isVip ? " (VIP)" : ""}`}
      style={{ width: w, height: h }}
      className={`
        relative flex shrink-0 flex-col items-center justify-center rounded-lg font-sans backdrop-blur-sm transition-all duration-300
        ${table.isWindow ? "border border-dashed" : "border"}
        ${
          booked
            ? "cursor-not-allowed border-muted-foreground/10 bg-muted/20 opacity-30"
            : selected
              ? `${z.bg} ${z.border} ring-2 ${z.ring} z-10 shadow-lg ${z.glow}`
              : table.isVip
                ? "cursor-pointer border-primary/30 bg-gradient-to-br from-primary/15 to-primary/5 hover:border-primary/60 hover:shadow-md hover:shadow-primary/10"
                : "cursor-pointer border-border/80 bg-white/82 hover:border-primary/20 hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-white/15 dark:hover:bg-white/[0.08]"
        }
      `}
    >
      <span
        className={`text-[9px] font-semibold uppercase leading-none tracking-wider md:text-[10px] ${
          booked ? "text-muted-foreground/30" : selected ? z.text : "text-foreground/78"
        }`}
      >
        {table.id}
      </span>
      <span
        className={`mt-1 text-[7px] leading-none md:text-[8px] ${
          booked ? "text-muted-foreground/20" : selected ? "text-foreground/60" : "text-muted-foreground/48"
        }`}
      >
        {table.capacity}
      </span>
      {table.isVip && !booked && !selected && (
        <span className="absolute -right-1.5 -top-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80 px-1.5 py-0.5 text-[6px] font-bold leading-none tracking-wider text-primary-foreground">
          VIP
        </span>
      )}
      {booked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute h-[1px] w-5 rotate-45 bg-muted-foreground/30" />
          <div className="absolute h-[1px] w-5 -rotate-45 bg-muted-foreground/30" />
        </div>
      )}
    </motion.button>
  );
};

const Box = ({ label, w = 80, h = 36, accent = false }: { label: string; w?: number; h?: number; accent?: boolean }) => (
  <div
    style={{ width: w, height: h }}
    className={`flex shrink-0 items-center justify-center rounded-lg text-center backdrop-blur-sm ${
      accent
        ? "border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5"
        : "border border-border/70 bg-white/76 dark:border-white/10 dark:bg-white/[0.04]"
    }`}
  >
    <span
      className={`whitespace-nowrap text-[8px] font-medium uppercase tracking-[0.15em] md:text-[9px] ${
        accent ? "text-primary/70" : "text-muted-foreground/50"
      }`}
    >
      {label}
    </span>
  </div>
);

const WindowLine = ({ style, vertical = false }: { style: React.CSSProperties; vertical?: boolean }) => (
  <div className="pointer-events-none absolute" style={style}>
    <div
      className={
        vertical
          ? "h-full w-[2px] bg-gradient-to-b from-transparent via-primary/15 to-transparent"
          : "h-[2px] w-full bg-gradient-to-r from-transparent via-primary/15 to-transparent"
      }
    />
  </div>
);

const FloorPlan = ({ tables, onTableClick }: FloorPlanProps) => {
  const g = (id: string) => tables.find((tb) => tb.id === id)!;
  const c = (id: string) => () => onTableClick(id);

  return (
    <div className="relative w-full overflow-x-auto rounded-xl border border-border/70 bg-gradient-to-br from-white via-[hsl(40_38%_97%)] to-[hsl(34_38%_94%)] shadow-[0_24px_60px_hsl(28_25%_35%/.1)] dark:border-white/10 dark:bg-gradient-to-br dark:from-[hsl(22_12%_14%)] dark:via-[hsl(20_10%_11%)] dark:to-[hsl(18_12%_9%)] dark:shadow-[0_24px_60px_hsl(0_0%_0%/.3)]">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(119,95,62,0.24) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative mx-auto w-full min-w-[620px] max-w-[900px]" style={{ aspectRatio: "1 / 1.1", maxHeight: 960 }}>
        <div className="pointer-events-none absolute inset-[12px] rounded-lg border border-border/70 dark:border-white/10" />

        <WindowLine style={{ top: 12, left: "2%", width: "30%" }} />
        <WindowLine style={{ top: 12, left: "34%", width: "34%" }} />
        <WindowLine style={{ top: 12, left: "68%", width: "14%" }} />
        <WindowLine style={{ right: 12, top: "28%", height: "18%" }} vertical />
        <WindowLine style={{ right: 12, top: "72%", height: "18%" }} vertical />
        <WindowLine style={{ bottom: 12, left: "2%", width: "22%" }} />
        <WindowLine style={{ bottom: 12, left: "52%", width: "22%" }} />

        <div className="pointer-events-none absolute" style={{ top: "38%", left: "1%", right: "1%" }}>
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
        <div className="pointer-events-none absolute" style={{ top: "64%", left: "1%", right: "1%" }}>
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        <div className="absolute" style={{ top: "3%", left: "2%" }}>
          <T table={g("C-3")} onClick={c("C-3")} w={48} h={56} />
        </div>
        <div className="absolute" style={{ top: "2.5%", left: "11%" }}>
          <T table={g("C-4")} onClick={c("C-4")} w={66} h={62} />
        </div>
        <div className="absolute" style={{ top: "2.5%", left: "33%" }}>
          <T table={g("D-7")} onClick={c("D-7")} w={70} h={66} />
        </div>
        <div className="absolute" style={{ top: "2.5%", left: "48%" }}>
          <T table={g("D-8")} onClick={c("D-8")} w={70} h={66} />
        </div>
        <div className="absolute" style={{ top: "2%", left: "72%" }}>
          <Box label="Stage" w={140} h={72} />
        </div>

        <div className="absolute" style={{ top: "14%", left: "4%" }}>
          <T table={g("C-2")} onClick={c("C-2")} w={54} h={54} />
        </div>
        <div className="absolute" style={{ top: "14%", left: "26%" }}>
          <T table={g("D-6")} onClick={c("D-6")} w={58} h={58} />
        </div>
        <div className="absolute" style={{ top: "14%", left: "35%" }}>
          <T table={g("D-5")} onClick={c("D-5")} w={58} h={58} />
        </div>
        <div className="absolute" style={{ top: "14%", left: "44%" }}>
          <T table={g("D-4")} onClick={c("D-4")} w={58} h={58} />
        </div>
        <div className="absolute" style={{ top: "14%", left: "53%" }}>
          <T table={g("D-3")} onClick={c("D-3")} w={58} h={58} />
        </div>
        <div className="absolute" style={{ top: "14%", left: "62%" }}>
          <T table={g("D-2")} onClick={c("D-2")} w={58} h={58} />
        </div>

        <div className="absolute" style={{ top: "29%", left: "9%" }}>
          <T table={g("C-1")} onClick={c("C-1")} w={52} h={52} />
        </div>
        <div className="absolute" style={{ top: "34%", left: "1%" }}>
          <T table={g("VIP-2")} onClick={c("VIP-2")} w={80} h={52} />
        </div>
        <div className="absolute" style={{ top: "29%", left: "22%" }}>
          <Box label="Stairs" w={140} h={38} />
        </div>
        <div className="absolute" style={{ top: "28%", left: "50%" }}>
          <T table={g("D-1")} onClick={c("D-1")} w={72} h={68} />
        </div>
        <div className="absolute" style={{ top: "27%", left: "80%" }}>
          <T table={g("D-9")} onClick={c("D-9")} w={48} h={48} />
        </div>
        <div className="absolute" style={{ top: "34%", left: "80%" }}>
          <T table={g("D-10")} onClick={c("D-10")} w={48} h={48} />
        </div>

        <div className="absolute" style={{ top: "44%", left: "10%" }}>
          <Box label="WC" w={70} h={34} />
        </div>
        <div className="absolute" style={{ top: "42%", left: "28%" }}>
          <Box label="Lift" w={76} h={52} />
        </div>
        <div className="absolute" style={{ top: "42%", left: "40%" }}>
          <Box label="Lift" w={76} h={52} />
        </div>
        <div className="absolute" style={{ top: "49%", left: "1%" }}>
          <T table={g("VIP-1")} onClick={c("VIP-1")} w={80} h={52} />
        </div>
        <div className="absolute" style={{ top: "46%", left: "55%" }}>
          <Box label="Bar" w={120} h={50} accent />
        </div>
        <div className="absolute" style={{ top: "52%", left: "28%" }}>
          <Box label="Stairs" w={140} h={38} />
        </div>
        <div className="absolute" style={{ top: "54%", left: "10%" }}>
          <Box label="WC" w={70} h={34} />
        </div>

        <div className="absolute" style={{ top: "42%", left: "86%" }}>
          <T table={g("A-1")} onClick={c("A-1")} w={44} h={44} />
        </div>
        <div className="absolute" style={{ top: "48%", left: "86%" }}>
          <T table={g("A-2")} onClick={c("A-2")} w={44} h={44} />
        </div>
        <div className="absolute" style={{ top: "54%", left: "86%" }}>
          <T table={g("A-3")} onClick={c("A-3")} w={44} h={44} />
        </div>
        <div className="absolute" style={{ top: "60%", left: "86%" }}>
          <T table={g("A-4")} onClick={c("A-4")} w={44} h={44} />
        </div>

        <div className="absolute" style={{ top: "70%", left: "2%" }}>
          <T table={g("B-3")} onClick={c("B-3")} w={60} h={62} />
        </div>
        <div className="absolute" style={{ top: "70%", left: "28%" }}>
          <T table={g("B-4")} onClick={c("B-4")} w={66} h={62} />
        </div>
        <div className="absolute" style={{ top: "70%", left: "44%" }}>
          <T table={g("B-5")} onClick={c("B-5")} w={66} h={62} />
        </div>

        <div className="absolute" style={{ top: "68%", left: "86%" }}>
          <T table={g("A-5")} onClick={c("A-5")} w={44} h={44} />
        </div>
        <div className="absolute" style={{ top: "74%", left: "86%" }}>
          <T table={g("A-6")} onClick={c("A-6")} w={44} h={44} />
        </div>
        <div className="absolute" style={{ top: "80%", left: "86%" }}>
          <T table={g("A-7")} onClick={c("A-7")} w={44} h={44} />
        </div>
        <div className="absolute" style={{ top: "86%", left: "86%" }}>
          <T table={g("A-8")} onClick={c("A-8")} w={44} h={44} />
        </div>

        <div className="absolute" style={{ top: "80%", left: "2%" }}>
          <T table={g("B-2")} onClick={c("B-2")} w={60} h={62} />
        </div>
        <div className="absolute" style={{ top: "88%", left: "10%" }}>
          <T table={g("B-1")} onClick={c("B-1")} w={50} h={50} />
        </div>
        <div className="absolute" style={{ top: "82%", left: "38%" }}>
          <T table={g("B-6")} onClick={c("B-6")} w={66} h={62} />
        </div>
        <div className="absolute" style={{ top: "84%", left: "60%" }}>
          <T table={g("A-9")} onClick={c("A-9")} w={50} h={50} />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 border-t border-border/70 px-4 py-5 text-center dark:border-white/10 sm:gap-6">
        {Object.entries(zoneNames).map(([key, label]) => (
          <div key={key} className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${zoneColors[key].bg} border ${zoneColors[key].border}`} />
            <span className={`text-[10px] font-medium uppercase tracking-[0.15em] ${zoneColors[key].text}`}>
              {key} - {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export { type TableInfo, type TableStatus };
export default FloorPlan;
