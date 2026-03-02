import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";

type TableStatus = "available" | "booked" | "selected";

type TableInfo = {
  id: string;
  zone: string;
  number: number;
  status: TableStatus;
  capacity: string;
  isWindow?: boolean;
};

const generateTables = (): TableInfo[] => {
  const tables: TableInfo[] = [];

  // A zone — Бар хэсэг: 9 ширээ (8x 2-хүн, 1x 4-хүн)
  for (let i = 1; i <= 9; i++) {
    tables.push({
      id: `A-${i}`,
      zone: "A",
      number: i,
      status: "available",
      capacity: i === 9 ? "4 хүн" : "2 хүн",
    });
  }

  // B zone — Төв зал: 6 ширээ (бүгд 4-6 хүн, B-1, B-2 цонхны тал)
  for (let i = 1; i <= 6; i++) {
    tables.push({
      id: `B-${i}`,
      zone: "B",
      number: i,
      status: "available",
      capacity: "4-6 хүн",
      isWindow: i <= 2,
    });
  }

  // C zone — Chill Zone: 5 ширээ (4 ердийн + 1 VIP 5-7 хүн)
  for (let i = 1; i <= 5; i++) {
    tables.push({
      id: `C-${i}`,
      zone: "C",
      number: i,
      status: "available",
      capacity: i === 5 ? "5-7 хүн (VIP)" : "2-4 хүн",
    });
  }

  // D zone — 11 ширээ (10 ердийн + 1 VIP 5-7 хүн)
  // D-1: 6-8 хүн, D-2~D-6: 2 хүн, D-7~D-10: цонхны тал 5-8 хүн, D-11: VIP
  for (let i = 1; i <= 11; i++) {
    const isWindow = i >= 7 && i <= 10;
    let capacity = "2 хүн";
    if (i === 1) capacity = "6-8 хүн";
    else if (i >= 7 && i <= 10) capacity = "5-8 хүн";
    else if (i === 11) capacity = "5-7 хүн (VIP)";

    tables.push({
      id: `D-${i}`,
      zone: "D",
      number: i,
      status: "available",
      capacity,
      isWindow,
    });
  }

  // Simulate some booked tables
  const bookedIds = new Set(["A-2", "A-5", "B-3", "C-1", "D-2", "D-8"]);
  return tables.map((t) => ({
    ...t,
    status: bookedIds.has(t.id) ? ("booked" as TableStatus) : t.status,
  }));
};

const zoneLabels: Record<string, string> = {
  A: "A бүс — Бар хэсэг",
  B: "B бүс — Төв зал",
  C: "C бүс — Chill Zone",
  D: "D бүс — Үндсэн зал",
};

const zoneDescriptions: Record<string, string> = {
  A: "9 ширээ · Гал тогооны өмнө",
  B: "6 ширээ · 2 ширээ цонхны талд",
  C: "5 ширээ · Намхан ширээ + 1 VIP (5-7 хүн)",
  D: "11 ширээ · 4 цонхны талд + 1 VIP (5-7 хүн)",
};

const zoneColors: Record<string, string> = {
  A: "border-primary/60",
  B: "border-blue-400/60",
  C: "border-emerald-400/60",
  D: "border-rose-400/60",
};

const zoneAccent: Record<string, string> = {
  A: "bg-primary/20 text-primary",
  B: "bg-blue-400/20 text-blue-300",
  C: "bg-emerald-400/20 text-emerald-300",
  D: "bg-rose-400/20 text-rose-300",
};

const ReservationSection = () => {
  const [tables, setTables] = useState<TableInfo[]>(generateTables);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("");

  const selectedTable = tables.find((t) => t.status === "selected");

  const handleTableClick = (id: string) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id === id && t.status === "available") return { ...t, status: "selected" as TableStatus };
        if (t.status === "selected") return { ...t, status: "available" as TableStatus };
        return t;
      })
    );
  };

  const handleSubmit = () => {
    if (!selectedTable) {
      toast({ title: "Ширээ сонгоно уу", description: "Захиалга хийхийн тулд ширээ сонгоно уу.", variant: "destructive" });
      return;
    }
    if (!name.trim() || !phone.trim() || !date) {
      toast({ title: "Мэдээлэл дутуу", description: "Бүх талбарыг бөглөнө үү.", variant: "destructive" });
      return;
    }

    setTables((prev) =>
      prev.map((t) => (t.id === selectedTable.id ? { ...t, status: "booked" as TableStatus } : t))
    );
    setName("");
    setPhone("");
    setDate("");
    setGuests("");
    toast({
      title: "Захиалга амжилттай!",
      description: `${zoneLabels[selectedTable.zone]}, ${selectedTable.number}-р ширээ (${selectedTable.capacity}) захиалагдлаа.`,
    });
  };

  const zones = ["A", "B", "C", "D"];

  return (
    <section id="захиалга" className="py-32 px-4 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="font-sans text-xs tracking-[0.4em] uppercase text-primary divider-ornament">
            Захиалга
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground mt-8 mb-6">
            Ширээ <span className="italic text-primary">захиалах</span>
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto">
            Хүссэн ширээгээ сонгоод захиалгаа баталгаажуулна уу.
          </p>
        </motion.div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 mb-10">
          {[
            { label: "Сул", className: "bg-secondary border-border" },
            { label: "Сонгосон", className: "bg-primary/30 border-primary ring-2 ring-primary/40" },
            { label: "Захиалагдсан", className: "bg-muted/50 border-muted-foreground/20 opacity-50" },
            { label: "Цонхны талд", className: "bg-secondary border-border border-dashed" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-md border ${item.className}`} />
              <span className="font-sans text-xs tracking-wider uppercase text-muted-foreground">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Floor Plan */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="border border-border rounded-sm p-4 md:p-8 mb-12 bg-card/50"
        >
          {/* Kitchen */}
          <div className="text-center mb-8">
            <div className="inline-block px-12 py-3 bg-secondary border border-border rounded-sm">
              <span className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground">
                🍳 Гал тогоо
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {zones.map((zone) => {
              const zoneTables = tables.filter((t) => t.zone === zone);
              return (
                <div
                  key={zone}
                  className={`border ${zoneColors[zone]} rounded-sm p-4 md:p-6`}
                >
                  <div className="mb-2">
                    <span className={`inline-block px-3 py-1 rounded-sm text-xs font-sans tracking-wider uppercase ${zoneAccent[zone]}`}>
                      {zoneLabels[zone]}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mb-4 font-sans tracking-wide">
                    {zoneDescriptions[zone]}
                  </p>
                  <div className={`grid ${zone === "D" ? "grid-cols-5" : zone === "A" ? "grid-cols-3 sm:grid-cols-5" : "grid-cols-3 sm:grid-cols-4"} gap-3`}>
                    {zoneTables.map((table) => {
                      const isBooked = table.status === "booked";
                      const isSelected = table.status === "selected";
                      return (
                        <button
                          key={table.id}
                          onClick={() => handleTableClick(table.id)}
                          disabled={isBooked}
                          title={`${table.id} — ${table.capacity}${table.isWindow ? " (Цонхны талд)" : ""}`}
                          className={`
                            relative aspect-square rounded-md flex flex-col items-center justify-center gap-0.5 transition-all duration-300 font-sans
                            ${table.isWindow ? "border-2 border-dashed" : "border-2"}
                            ${isBooked
                              ? "bg-muted/30 border-muted-foreground/20 opacity-40 cursor-not-allowed"
                              : isSelected
                              ? "bg-primary/20 border-primary ring-2 ring-primary/50 scale-105 shadow-lg shadow-primary/20"
                              : "bg-secondary border-border hover:border-primary/50 hover:bg-primary/10 cursor-pointer"
                            }
                          `}
                        >
                          <span className="text-base">🪑</span>
                          <span className={`text-[9px] tracking-wider uppercase font-medium ${
                            isBooked ? "text-muted-foreground/50" : isSelected ? "text-primary" : "text-muted-foreground"
                          }`}>
                            {table.id}
                          </span>
                          <span className={`text-[8px] ${
                            isBooked ? "text-muted-foreground/30" : "text-muted-foreground/70"
                          }`}>
                            {table.capacity}
                          </span>
                          {isBooked && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="text-destructive/60 text-lg">✕</span>
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Booking Form */}
        <AnimatePresence>
          {selectedTable && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden"
            >
              <div className="border border-primary/30 rounded-sm p-6 md:p-8 bg-card/80 mb-4">
                <div className="text-center mb-6">
                  <span className="font-sans text-xs tracking-[0.2em] uppercase text-primary">
                    {zoneLabels[selectedTable.zone]} — {selectedTable.number}-р ширээ ({selectedTable.capacity})
                    {selectedTable.isWindow ? " · Цонхны талд" : ""}
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Нэр"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={100}
                      className="w-full bg-transparent border border-border px-6 py-4 font-body text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                    />
                    <input
                      type="tel"
                      placeholder="Утасны дугаар"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      maxLength={20}
                      className="w-full bg-transparent border border-border px-6 py-4 font-body text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-transparent border border-border px-6 py-4 font-body text-foreground focus:border-primary focus:outline-none transition-colors"
                    />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full bg-transparent border border-border px-6 py-4 font-body text-foreground focus:border-primary focus:outline-none transition-colors appearance-none"
                    >
                      <option value="" className="bg-card">Зочдын тоо</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <option key={n} value={n} className="bg-card">
                          {n} хүн
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-gold-gradient px-8 py-4 font-sans text-xs tracking-[0.2em] uppercase text-primary-foreground hover:opacity-90 transition-opacity duration-300"
                  >
                    Захиалга баталгаажуулах
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ReservationSection;
