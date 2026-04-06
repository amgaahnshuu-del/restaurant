import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import FloorPlan, { type TableInfo, type TableStatus } from "@/components/FloorPlan";

const generateTables = (): TableInfo[] => [
  // A zone — Бар хэсэг: 9 ширээ (2 хүн, A-9 = 4 хүн)
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `A-${i + 1}`, zone: "A", number: i + 1, status: "available" as TableStatus,
    capacity: "2 хүн", isWindow: i >= 4 && i <= 7,
  })),
  { id: "A-9", zone: "A", number: 9, status: "available" as TableStatus, capacity: "4 хүн" },

  // B zone — Төв зал: 6 ширээ
  { id: "B-1", zone: "B", number: 1, status: "available" as TableStatus, capacity: "2 хүн", isWindow: true },
  { id: "B-2", zone: "B", number: 2, status: "available" as TableStatus, capacity: "4-6 хүн", isWindow: true },
  { id: "B-3", zone: "B", number: 3, status: "available" as TableStatus, capacity: "4-6 хүн", isWindow: true },
  { id: "B-4", zone: "B", number: 4, status: "available" as TableStatus, capacity: "4-6 хүн" },
  { id: "B-5", zone: "B", number: 5, status: "available" as TableStatus, capacity: "4-6 хүн" },
  { id: "B-6", zone: "B", number: 6, status: "available" as TableStatus, capacity: "4-6 хүн", isWindow: true },

  // C zone — Chill Zone: 4 ширээ
  { id: "C-1", zone: "C", number: 1, status: "available" as TableStatus, capacity: "2-4 хүн" },
  { id: "C-2", zone: "C", number: 2, status: "available" as TableStatus, capacity: "2-4 хүн" },
  { id: "C-3", zone: "C", number: 3, status: "available" as TableStatus, capacity: "2-4 хүн", isWindow: true },
  { id: "C-4", zone: "C", number: 4, status: "available" as TableStatus, capacity: "2-4 хүн", isWindow: true },

  // VIP rooms
  { id: "VIP-1", zone: "C", number: 5, status: "available" as TableStatus, capacity: "8-12 хүн", isVip: true },
  { id: "VIP-2", zone: "C", number: 6, status: "available" as TableStatus, capacity: "8-12 хүн", isVip: true },

  // D zone — Үндсэн зал: 10 ширээ
  { id: "D-1", zone: "D", number: 1, status: "available" as TableStatus, capacity: "6-8 хүн" },
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `D-${i + 2}`, zone: "D", number: i + 2, status: "available" as TableStatus, capacity: "2-4 хүн",
  })),
  { id: "D-7", zone: "D", number: 7, status: "available" as TableStatus, capacity: "4-6 хүн", isWindow: true },
  { id: "D-8", zone: "D", number: 8, status: "available" as TableStatus, capacity: "4-6 хүн", isWindow: true },
  { id: "D-9", zone: "D", number: 9, status: "available" as TableStatus, capacity: "2 хүн", isWindow: true },
  { id: "D-10", zone: "D", number: 10, status: "available" as TableStatus, capacity: "2 хүн", isWindow: true },
];

const zoneLabels: Record<string, string> = {
  A: "A бүс — Бар хэсэг",
  B: "B бүс — Төв зал",
  C: "C бүс — Chill Zone",
  D: "D бүс — Үндсэн зал",
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedTable) {
      toast({ title: "Ширээ сонгоно уу", description: "Захиалга хийхийн тулд ширээ сонгоно уу.", variant: "destructive" });
      return;
    }
    if (!name.trim() || !phone.trim() || !date) {
      toast({ title: "Мэдээлэл дутуу", description: "Бүх талбарыг бөглөнө үү.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-reservation", {
        body: {
          table_id: selectedTable.id,
          zone: selectedTable.zone,
          table_number: selectedTable.number,
          customer_name: name,
          phone,
          reservation_date: date,
          guests,
          capacity: selectedTable.capacity,
        },
      });

      if (error) throw error;

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
    } catch (error: any) {
      console.error("Reservation error:", error);
      toast({
        title: "Алдаа гарлаа",
        description: "Захиалга хийхэд алдаа гарлаа. Дахин оролдоно уу.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  

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
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {[
            { label: "Сул", className: "bg-white/[0.03] border-white/[0.08]" },
            { label: "Сонгосон", className: "bg-primary/20 border-primary/50 ring-2 ring-primary/30" },
            { label: "Захиалагдсан", className: "bg-muted/20 border-muted-foreground/10 opacity-30" },
            { label: "Цонхны талд", className: "bg-white/[0.03] border-white/[0.08] border-dashed" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2.5">
              <div className={`w-7 h-7 rounded-lg border ${item.className}`} />
              <span className="font-sans text-[11px] tracking-[0.15em] uppercase text-muted-foreground/70">
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
          className="mb-12"
        >
          <FloorPlan tables={tables} onTableClick={handleTableClick} />
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
              <div className="border border-white/[0.08] rounded-xl p-6 md:p-10 bg-gradient-to-br from-card/90 via-card/70 to-card/90 backdrop-blur-sm shadow-2xl shadow-black/20 mb-4">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-primary font-medium">
                      {zoneLabels[selectedTable.zone]} — {selectedTable.number}-р ширээ ({selectedTable.capacity})
                      {selectedTable.isWindow ? " · Цонх" : ""}
                    </span>
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Нэр"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={100}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-5 py-4 font-body text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all duration-300"
                    />
                    <input
                      type="tel"
                      placeholder="Утасны дугаар"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      maxLength={20}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-5 py-4 font-body text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all duration-300"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-5 py-4 font-body text-foreground focus:border-primary/50 focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all duration-300"
                    />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-5 py-4 font-body text-foreground focus:border-primary/50 focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all duration-300 appearance-none"
                    >
                      <option value="" className="bg-card text-foreground">Зочдын тоо</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <option key={n} value={n} className="bg-card text-foreground">
                          {n} хүн
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary via-primary/90 to-primary/80 rounded-lg px-8 py-4 font-sans text-[11px] tracking-[0.25em] uppercase text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/25 active:scale-[0.99] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Илгээж байна..." : "Захиалга баталгаажуулах"}
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
