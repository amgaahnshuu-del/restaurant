"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Star } from "lucide-react";
import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { type TableRecord } from "@/lib/api";

// ─── DB table number → floor slot ─────────────────────────────────────────────
const SLOT_TO_DBNUM: Record<string, number> = {
  // Original 12
  "A-1": 1,  "A-2": 2,   "A-3": 5,   "A-4": 11,  "B-1": 12,
  "D-3": 3,  "D-4": 4,   "D-5": 7,   "B-4": 10,
  "C-4": 6,  "D-7": 9,   "VIP-1": 8,
  // New 19
  "C-3": 13, "C-2": 14,  "C-1": 15,
  "D-8": 16, "D-6": 17,  "D-2": 18,  "D-1": 19,
  "D-9": 20, "D-10": 21, "VIP-2": 22,
  "A-5": 23, "A-6": 24,  "A-7": 25,  "A-8": 26,  "A-9": 27,
  "B-3": 28, "B-5": 29,  "B-2": 30,  "B-6": 31,
};

// ─── Layout config (SVG viewBox 900 × 990) ────────────────────────────────────
// x, y = top-left corner in SVG pixels; w, h = size; type drives shape + chairs
type TableType = "round" | "rect" | "booth" | "vip";
interface LayoutEntry {
  id: string;
  type: TableType;
  x: number; y: number; w: number; h: number;
  seats: number;
  zone: string;
  isWindow?: boolean;
  isVip?: boolean;
}

const restaurantLayout: LayoutEntry[] = [
  // Zone C
  { id: "C-3",   type: "rect",  x: 18,  y: 30,  w: 48, h: 56, seats: 4, zone: "C" },
  { id: "C-2",   type: "rect",  x: 36,  y: 139, w: 54, h: 54, seats: 4, zone: "C" },
  { id: "C-4",   type: "booth", x: 99,  y: 25,  w: 66, h: 62, seats: 5, zone: "C", isWindow: true },
  { id: "C-1",   type: "round", x: 81,  y: 287, w: 52, h: 52, seats: 7, zone: "C" },
  // Zone D
  { id: "D-7",   type: "booth", x: 297, y: 25,  w: 70, h: 66, seats: 5, zone: "D", isWindow: true },
  { id: "D-8",   type: "booth", x: 432, y: 25,  w: 70, h: 66, seats: 5, zone: "D", isWindow: true },
  { id: "D-6",   type: "round", x: 234, y: 139, w: 58, h: 58, seats: 2, zone: "D" },
  { id: "D-5",   type: "round", x: 315, y: 139, w: 58, h: 58, seats: 2, zone: "D" },
  { id: "D-4",   type: "round", x: 396, y: 139, w: 58, h: 58, seats: 2, zone: "D" },
  { id: "D-3",   type: "round", x: 477, y: 139, w: 58, h: 58, seats: 2, zone: "D" },
  { id: "D-2",   type: "round", x: 558, y: 139, w: 58, h: 58, seats: 2, zone: "D" },
  { id: "D-1",   type: "booth", x: 450, y: 277, w: 72, h: 68, seats: 5, zone: "D" },
  { id: "D-9",   type: "rect",  x: 720, y: 267, w: 48, h: 48, seats: 4, zone: "D", isWindow: true },
  { id: "D-10",  type: "rect",  x: 720, y: 337, w: 48, h: 48, seats: 4, zone: "D", isWindow: true },
  // VIP
  { id: "VIP-2", type: "vip",   x: 9,   y: 337, w: 80, h: 52, seats: 10, zone: "VIP", isVip: true },
  { id: "VIP-1", type: "vip",   x: 9,   y: 485, w: 80, h: 52, seats: 10, zone: "VIP", isVip: true },
  // Zone A (right wall)
  { id: "A-1",   type: "round", x: 774, y: 416, w: 44, h: 44, seats: 2, zone: "A", isWindow: true },
  { id: "A-2",   type: "round", x: 774, y: 475, w: 44, h: 44, seats: 2, zone: "A", isWindow: true },
  { id: "A-3",   type: "round", x: 774, y: 535, w: 44, h: 44, seats: 2, zone: "A", isWindow: true },
  { id: "A-4",   type: "round", x: 774, y: 594, w: 44, h: 44, seats: 2, zone: "A", isWindow: true },
  { id: "A-5",   type: "round", x: 774, y: 673, w: 44, h: 44, seats: 2, zone: "A", isWindow: true },
  { id: "A-6",   type: "round", x: 774, y: 733, w: 44, h: 44, seats: 2, zone: "A", isWindow: true },
  { id: "A-7",   type: "round", x: 774, y: 792, w: 44, h: 44, seats: 2, zone: "A", isWindow: true },
  { id: "A-8",   type: "round", x: 774, y: 851, w: 44, h: 44, seats: 2, zone: "A", isWindow: true },
  // Zone B (lower hall)
  { id: "B-3",   type: "rect",  x: 18,  y: 693, w: 60, h: 62, seats: 4, zone: "B" },
  { id: "B-4",   type: "booth", x: 252, y: 693, w: 66, h: 62, seats: 4, zone: "B" },
  { id: "B-5",   type: "booth", x: 396, y: 693, w: 66, h: 62, seats: 4, zone: "B" },
  { id: "B-2",   type: "rect",  x: 18,  y: 792, w: 60, h: 62, seats: 4, zone: "B" },
  { id: "B-1",   type: "round", x: 90,  y: 871, w: 50, h: 50, seats: 4, zone: "B" },
  { id: "B-6",   type: "booth", x: 342, y: 812, w: 66, h: 62, seats: 4, zone: "B" },
  { id: "A-9",   type: "round", x: 540, y: 832, w: 50, h: 50, seats: 4, zone: "A" },
];

// ─── Colors per availability state ────────────────────────────────────────────
const COLORS = {
  available: {
    fill: "rgba(52,211,153,0.09)",  stroke: "rgba(52,211,153,0.58)",
    text: "rgba(110,235,185,0.88)", sub: "rgba(110,235,185,0.45)",
    chair: "rgba(52,211,153,0.20)", chairStroke: "rgba(52,211,153,0.38)",
  },
  reserved: {
    fill: "rgba(10,3,3,0.72)",      stroke: "rgba(90,15,15,0.40)",
    text: "rgba(255,255,255,0.18)", sub: "rgba(255,255,255,0.10)",
    chair: "rgba(70,10,10,0.35)",   chairStroke: "rgba(70,10,10,0.22)",
  },
  selected: {
    fill: "rgba(245,158,11,0.18)",  stroke: "rgba(245,158,11,0.85)",
    text: "rgba(253,215,120,0.92)", sub: "rgba(253,215,120,0.50)",
    chair: "rgba(245,158,11,0.30)", chairStroke: "rgba(245,158,11,0.50)",
  },
  none: {
    fill: "rgba(20,20,20,0.35)",    stroke: "rgba(60,60,60,0.22)",
    text: "rgba(255,255,255,0.14)", sub: "rgba(255,255,255,0.08)",
    chair: "rgba(50,50,50,0.20)",   chairStroke: "rgba(50,50,50,0.15)",
  },
} as const;
type ColorKey = keyof typeof COLORS;

// ─── SVG table shape (drawn centered at 0,0) ──────────────────────────────────
function TableShape({ type, w, h, col }: {
  type: TableType; w: number; h: number; col: typeof COLORS[ColorKey];
}) {
  const hw = w / 2, hh = h / 2;
  const sharedProps = { fill: col.fill, stroke: col.stroke, strokeWidth: 1.5 };

  if (type === "round") {
    return <circle cx={0} cy={0} r={Math.min(hw, hh)} {...sharedProps} />;
  }
  if (type === "rect" || type === "vip") {
    return <rect x={-hw} y={-hh} width={w} height={h} rx={7} {...sharedProps} />;
  }
  if (type === "booth") {
    // Arch: flat bottom, rounded top (banquette silhouette)
    const d = `M ${-hw},${hh} L ${-hw},${-hh * 0.1} Q ${-hw},${-hh} 0,${-hh} Q ${hw},${-hh} ${hw},${-hh * 0.1} L ${hw},${hh} Z`;
    return (
      <>
        <path d={d} {...sharedProps} />
        {/* sofa-back shading */}
        <path
          d={`M ${-hw + 4},${-hh * 0.15} Q ${-hw + 4},${-hh + 4} 0,${-hh + 4} Q ${hw - 4},${-hh + 4} ${hw - 4},${-hh * 0.15} L ${hw - 4},${-hh * 0.42} Q ${hw - 4},${-hh * 0.62} 0,${-hh * 0.62} Q ${-hw + 4},${-hh * 0.62} ${-hw + 4},${-hh * 0.42} Z`}
          fill={col.stroke.replace(/[\d.]+\)$/, "0.12)")}
          stroke="none"
        />
      </>
    );
  }
  return null;
}

// ─── Chair indicators (drawn centered at 0,0) ────────────────────────────────
function ChairMarks({ type, w, h, seats, col }: {
  type: TableType; w: number; h: number; seats: number; col: typeof COLORS[ColorKey];
}) {
  const cw = 10, ch = 5;
  const hw = w / 2, hh = h / 2;
  const r = Math.min(hw, hh);
  const cp = { fill: col.chair, stroke: col.chairStroke, strokeWidth: 0.5 };

  if (type === "round") {
    return (
      <>
        {Array.from({ length: seats }, (_, i) => {
          const θ = (i / seats) * Math.PI * 2 - Math.PI / 2;
          const dist = r + 8;
          const cx = dist * Math.cos(θ), cy = dist * Math.sin(θ);
          return (
            <rect
              key={i}
              x={cx - cw / 2} y={cy - ch / 2}
              width={cw} height={ch} rx={2}
              transform={`rotate(${(θ * 180) / Math.PI + 90}, ${cx}, ${cy})`}
              {...cp}
            />
          );
        })}
      </>
    );
  }

  if (type === "rect" || type === "vip") {
    const cols = seats <= 4 ? 2 : 3;
    const gap = w / (cols + 1);
    return (
      <>
        {Array.from({ length: cols }, (_, i) => {
          const x = -hw + gap * (i + 1) - cw / 2;
          return (
            <g key={i}>
              <rect x={x} y={-hh - ch - 3} width={cw} height={ch} rx={2} {...cp} />
              <rect x={x} y={hh + 3}       width={cw} height={ch} rx={2} {...cp} />
            </g>
          );
        })}
        {seats > 4 && (
          <>
            <rect x={-hw - ch - 3} y={-ch / 2} width={ch} height={cw} rx={2} {...cp} />
            <rect x={hw + 3}       y={-ch / 2} width={ch} height={cw} rx={2} {...cp} />
          </>
        )}
      </>
    );
  }

  if (type === "booth") {
    const cols = seats;
    const gap = w / (cols + 1);
    return (
      <>
        {Array.from({ length: cols }, (_, i) => (
          <rect
            key={i}
            x={-hw + gap * (i + 1) - cw / 2} y={hh + 3}
            width={cw} height={ch} rx={2}
            {...cp}
          />
        ))}
      </>
    );
  }

  return null;
}

// ─── Single table SVG group ────────────────────────────────────────────────────
interface TableGroupProps {
  entry: LayoutEntry;
  record: TableRecord | undefined;
  isSelected: boolean;
  onSelect: () => void;
  onHover: (id: string | null) => void;
  labels: { available: string; reserved: string; selected: string };
  allowReservedClick?: boolean;
}

function TableGroup({ entry, record, isSelected, onSelect, onHover, labels, allowReservedClick }: TableGroupProps) {
  const hasRecord = Boolean(record);
  const isAvail   = record?.availableForRequestedSlot ?? false;
  const ck: ColorKey = !hasRecord ? "none" : isSelected ? "selected" : isAvail ? "available" : "reserved";
  const col       = COLORS[ck];
  const canClick  = hasRecord && (isAvail || (allowReservedClick && !isAvail));
  const cx = entry.x + entry.w / 2;
  const cy = entry.y + entry.h / 2;
  const labelY = entry.type === "round" ? 3 : -2;
  const subY   = entry.type === "round" ? 14 : 10;

  return (
    // Outer g: static SVG translation to center point
    <g transform={`translate(${cx}, ${cy})`}>
      {/* Chair marks behind table (not animated) */}
      <ChairMarks type={entry.type} w={entry.w} h={entry.h} seats={entry.seats} col={col} />

      {/* Animated table body */}
      <motion.g
        animate={isSelected ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        whileHover={{ scale: canClick ? 1.10 : 1.02 }}
        whileTap={canClick ? { scale: 0.93 } : undefined}
        transition={isSelected
          ? { repeat: Infinity, duration: 2.2, ease: "easeInOut" }
          : { duration: 0.18, ease: "easeOut" }
        }
        style={{
          cursor: canClick ? "pointer" : hasRecord ? "not-allowed" : "default",
          originX: "0px",
          originY: "0px",
        }}
        onClick={canClick ? onSelect : undefined}
        onMouseEnter={() => hasRecord && onHover(entry.id)}
        onMouseLeave={() => onHover(null)}
        role={canClick ? "button" : undefined}
        aria-label={entry.id}
      >
        <TableShape type={entry.type} w={entry.w} h={entry.h} col={col} />

        {/* Reserved X */}
        {hasRecord && !isAvail && !isSelected && (
          <g opacity={0.55}>
            <line x1={-7} y1={-7} x2={7} y2={7}  stroke="#F87171" strokeWidth={1.4} strokeLinecap="round" />
            <line x1={7}  y1={-7} x2={-7} y2={7}  stroke="#F87171" strokeWidth={1.4} strokeLinecap="round" />
          </g>
        )}

        {/* Table label */}
        <text
          x={0} y={labelY}
          textAnchor="middle" dominantBaseline="middle"
          fill={col.text}
          fontSize={entry.w < 50 ? 8 : 9}
          fontWeight={600}
          fontFamily="system-ui, sans-serif"
          letterSpacing={0.4}
          style={{ userSelect: "none", pointerEvents: "none" }}
        >
          {entry.id}
        </text>

        {/* Capacity sub-label */}
        {record && (
          <text
            x={0} y={subY + (entry.type === "round" ? 8 : 10)}
            textAnchor="middle" dominantBaseline="middle"
            fill={col.sub}
            fontSize={7}
            fontFamily="system-ui, sans-serif"
            style={{ userSelect: "none", pointerEvents: "none" }}
          >
            {entry.seats}p
          </text>
        )}

        {/* Selected checkmark badge */}
        {isSelected && (
          <g transform={`translate(${entry.w / 2 - 3}, ${-entry.h / 2 - 3})`}>
            <circle r={8} fill="#F59E0B" />
            <polyline
              points="-3.5,0.5 -1,3 3.5,-2.5"
              stroke="#000" strokeWidth={1.6}
              fill="none" strokeLinecap="round" strokeLinejoin="round"
            />
          </g>
        )}

        {/* VIP star badge */}
        {entry.isVip && hasRecord && (
          <g transform={`translate(${entry.w / 2 - 4}, ${-entry.h / 2 - 5})`}>
            <rect x={-17} y={-7} width={34} height={13} rx={6} fill="#F59E0B" />
            <text
              x={0} y={3}
              textAnchor="middle"
              fill="#000" fontSize={6} fontWeight={700}
              fontFamily="system-ui, sans-serif"
              letterSpacing={1.2}
              style={{ userSelect: "none" }}
            >
              VIP
            </text>
          </g>
        )}
      </motion.g>
    </g>
  );
}

// ─── Room fixture box ─────────────────────────────────────────────────────────
function Fixture({ x, y, w, h, label, accent = false }: {
  x: number; y: number; w: number; h: number; label: string; accent?: boolean;
}) {
  return (
    <g>
      <rect
        x={x} y={y} width={w} height={h} rx={8}
        fill={accent ? "rgba(201,164,106,0.08)" : "rgba(255,255,255,0.03)"}
        stroke={accent ? "rgba(201,164,106,0.25)" : "rgba(255,255,255,0.07)"}
        strokeWidth={1}
      />
      <text
        x={x + w / 2} y={y + h / 2 + 3}
        textAnchor="middle"
        fill={accent ? "rgba(201,164,106,0.65)" : "rgba(255,255,255,0.22)"}
        fontSize={8} fontWeight={500}
        fontFamily="system-ui, sans-serif"
        letterSpacing={2}
        style={{ userSelect: "none" }}
      >
        {label.toUpperCase()}
      </text>
    </g>
  );
}

// ─── HTML tooltip (positioned via viewBox % coords) ───────────────────────────
function TooltipOverlay({ entry, record, isSelected, labels }: {
  entry: LayoutEntry;
  record: TableRecord;
  isSelected: boolean;
  labels: { available: string; reserved: string; selected: string };
}) {
  const isAvail = record.availableForRequestedSlot ?? false;
  const statusColor = isSelected ? "#FBBF24" : isAvail ? "#34D399" : "#F87171";
  const statusText  = isSelected ? labels.selected : isAvail ? labels.available : labels.reserved;

  const cx = entry.x + entry.w / 2;
  const cy = entry.y + entry.h / 2;
  const showBelow = cy < 130;

  return (
    <div
      className="pointer-events-none absolute z-50"
      style={{
        left: `${(cx / 900) * 100}%`,
        top: showBelow
          ? `${((cy + entry.h / 2 + 12) / 990) * 100}%`
          : `${((cy - entry.h / 2 - 12) / 990) * 100}%`,
        transform: showBelow ? "translate(-50%, 0)" : "translate(-50%, -100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: showBelow ? -6 : 6, scale: 0.88 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={  { opacity: 0, y: showBelow ? -6 : 6, scale: 0.88 }}
        transition={{ duration: 0.13 }}
        style={{
          background: "rgba(12,12,12,0.97)",
          border: "1px solid rgba(201,164,106,0.22)",
          borderRadius: 10,
          backdropFilter: "blur(14px)",
          padding: "10px 14px",
          minWidth: 148,
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        }}
      >
        <p style={{ color: "#fff", fontSize: 11, fontWeight: 600, lineHeight: 1 }}>
          {entry.isVip ? "VIP · " : ""}{entry.id}
        </p>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, marginTop: 4, lineHeight: 1 }}>
          {entry.seats} guests
        </p>
        <p style={{ color: statusColor, fontSize: 10, fontWeight: 500, marginTop: 6, lineHeight: 1 }}>
          ● {statusText}
        </p>
        {record.reservedTimes && record.reservedTimes.length > 0 && (
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 9, marginTop: 6, lineHeight: 1.4 }}>
            {record.reservedTimes.join(", ")}
          </p>
        )}
        {/* Arrow */}
        <div
          style={{
            position: "absolute",
            [showBelow ? "top" : "bottom"]: -5,
            left: "50%",
            transform: "translateX(-50%) rotate(45deg)",
            width: 8, height: 8,
            background: "#0C0C0C",
            borderRight: showBelow ? "none" : "1px solid rgba(201,164,106,0.22)",
            borderBottom: showBelow ? "1px solid rgba(201,164,106,0.22)" : "none",
            borderLeft: showBelow ? "1px solid rgba(201,164,106,0.22)" : "none",
            borderTop: showBelow ? "none" : "1px solid rgba(201,164,106,0.22)",
          }}
        />
      </motion.div>
    </div>
  );
}

// ─── Legend dot ───────────────────────────────────────────────────────────────
function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      <span className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">{label}</span>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export interface RestaurantFloorMapProps {
  tables:               TableRecord[];
  selectedTableId:      string | null;
  onSelect:             (tableId: string) => void;
  allowReservedClick?:  boolean;
}

export default function RestaurantFloorMap({ tables, selectedTableId, onSelect, allowReservedClick }: RestaurantFloorMapProps) {
  const { language } = useLanguage();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const copy = useMemo(() => ({
    en: {
      available: "Available", reserved: "Reserved", selected: "Selected",
      stage: "Stage", bar: "Bar", stairs: "Stairs", lift: "Lift", wc: "WC",
      scroll: "← scroll →",
    },
    mn: {
      available: "Сул", reserved: "Захиалгатай", selected: "Сонгосон",
      stage: "Тайз", bar: "Бар", stairs: "Шат", lift: "Лифт", wc: "Жорлон",
      scroll: "← гүйлгэх →",
    },
  }[language]), [language]);

  const tableByNumber = useMemo(
    () => new Map(tables.map((t) => [t.tableNumber, t])),
    [tables],
  );

  function recordFor(slotId: string): TableRecord | undefined {
    const dbNum = SLOT_TO_DBNUM[slotId];
    return dbNum ? tableByNumber.get(dbNum) : undefined;
  }

  const labels = { available: copy.available, reserved: copy.reserved, selected: copy.selected };
  const hoveredEntry  = hoveredId ? restaurantLayout.find((e) => e.id === hoveredId) ?? null : null;
  const hoveredRecord = hoveredId ? recordFor(hoveredId) ?? null : null;

  return (
    <div className="space-y-3">
      {/* Status legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-1">
        <LegendDot color="rgba(52,211,153,0.7)"  label={copy.available} />
        <LegendDot color="rgba(120,20,20,0.8)"   label={copy.reserved}  />
        <LegendDot color="rgba(245,158,11,0.75)" label={copy.selected}  />
        <span className="ml-auto text-[10px] text-neutral-700 sm:hidden">{copy.scroll}</span>
      </div>

      {/* Floor map */}
      <div
        className="relative w-full overflow-x-auto rounded-xl"
        style={{ border: "1px solid rgba(201,164,106,0.12)" }}
      >
        <div className="relative mx-auto" style={{ minWidth: 320, maxWidth: 900 }}>
          <svg
            viewBox="0 0 900 990"
            width="100%"
            height="auto"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block" }}
            aria-label="Restaurant floor plan"
          >
            <defs>
              <pattern id="rfm-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.8" fill="rgba(201,164,106,0.55)" />
              </pattern>
              <radialGradient id="rfm-ambient" cx="50%" cy="43%" r="55%">
                <stop offset="0%"   stopColor="rgba(201,164,106,0.05)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0)" />
              </radialGradient>
            </defs>

            {/* Background */}
            <rect width="900" height="990" fill="#070707" />
            <rect width="900" height="990" fill="url(#rfm-dots)" opacity="0.07" />
            <rect width="900" height="990" fill="url(#rfm-ambient)" />

            {/* Inner room border */}
            <rect x="12" y="12" width="876" height="966" rx="8"
              fill="none" stroke="rgba(201,164,106,0.07)" strokeWidth="1" />

            {/* Zone separator lines */}
            <line x1="9" y1="376" x2="891" y2="376" stroke="rgba(201,164,106,0.07)" strokeWidth="1" />
            <line x1="9" y1="634" x2="891" y2="634" stroke="rgba(201,164,106,0.07)" strokeWidth="1" />

            {/* Window accent lines (along wall edges) */}
            {/* Top wall */}
            <line x1="18"  y1="13" x2="288" y2="13" stroke="rgba(201,164,106,0.28)" strokeWidth="2" />
            <line x1="306" y1="13" x2="612" y2="13" stroke="rgba(201,164,106,0.28)" strokeWidth="2" />
            <line x1="630" y1="13" x2="738" y2="13" stroke="rgba(201,164,106,0.28)" strokeWidth="2" />
            {/* Right wall */}
            <line x1="887" y1="277" x2="887" y2="455" stroke="rgba(201,164,106,0.28)" strokeWidth="2" />
            <line x1="887" y1="713" x2="887" y2="891" stroke="rgba(201,164,106,0.28)" strokeWidth="2" />
            {/* Bottom wall */}
            <line x1="18"  y1="977" x2="216" y2="977" stroke="rgba(201,164,106,0.28)" strokeWidth="2" />
            <line x1="468" y1="977" x2="666" y2="977" stroke="rgba(201,164,106,0.28)" strokeWidth="2" />

            {/* Room fixtures */}
            <Fixture x={648} y={20}  w={140} h={72} label={copy.stage}  accent />
            <Fixture x={198} y={287} w={140} h={38} label={copy.stairs} />
            <Fixture x={90}  y={436} w={70}  h={34} label={copy.wc} />
            <Fixture x={252} y={416} w={76}  h={52} label={copy.lift} />
            <Fixture x={360} y={416} w={76}  h={52} label={copy.lift} />
            <Fixture x={495} y={455} w={120} h={50} label={copy.bar}    accent />
            <Fixture x={252} y={515} w={140} h={38} label={copy.stairs} />
            <Fixture x={90}  y={535} w={70}  h={34} label={copy.wc} />

            {/* All table groups */}
            {restaurantLayout.map((entry) => {
              const record     = recordFor(entry.id);
              const isSelected = record ? record.id === selectedTableId : false;
              return (
                <TableGroup
                  key={entry.id}
                  entry={entry}
                  record={record}
                  isSelected={isSelected}
                  labels={labels}
                  onSelect={() => { if (record) onSelect(record.id); }}
                  onHover={setHoveredId}
                  allowReservedClick={allowReservedClick}
                />
              );
            })}
          </svg>

          {/* Tooltip HTML overlay (tracks SVG viewBox coordinates) */}
          <AnimatePresence>
            {hoveredEntry && hoveredRecord && (
              <TooltipOverlay
                key={hoveredId!}
                entry={hoveredEntry}
                record={hoveredRecord}
                isSelected={hoveredRecord.id === selectedTableId}
                labels={labels}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Zone legend */}
      <div className="flex flex-wrap gap-x-5 gap-y-1.5 px-1">
        {[
          { key: "A", en: "Window Row",   mn: "Цонхны эгнээ",  color: "rgba(56,189,248,0.55)" },
          { key: "B", en: "Central Hall", mn: "Төв танхим",     color: "rgba(52,211,153,0.45)" },
          { key: "C", en: "Lounge",       mn: "Лоунж",          color: "rgba(251,191,36,0.45)" },
          { key: "D", en: "Main Dining",  mn: "Үндсэн танхим",  color: "rgba(248,113,113,0.42)" },
        ].map((z) => (
          <div key={z.key} className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-sm" style={{ background: z.color }} />
            <span className="text-[9px] uppercase tracking-[0.18em] text-neutral-600">
              {z.key} — {language === "mn" ? z.mn : z.en}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <Star className="h-2.5 w-2.5 fill-amber-500/60 text-amber-500" />
          <span className="text-[9px] uppercase tracking-[0.18em] text-neutral-600">VIP Private</span>
        </div>
      </div>
    </div>
  );
}
