import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import FloorPlan, { type TableInfo, type TableStatus } from "@/components/FloorPlan";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { api } from "@/lib/api";

const generateTables = (): TableInfo[] => [
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `A-${i + 1}`,
    zone: "A",
    number: i + 1,
    status: "available" as TableStatus,
    capacity: "2 guests",
    isWindow: i >= 4 && i <= 7,
  })),
  { id: "A-9", zone: "A", number: 9, status: "available" as TableStatus, capacity: "4 guests" },
  { id: "B-1", zone: "B", number: 1, status: "available" as TableStatus, capacity: "2 guests", isWindow: true },
  { id: "B-2", zone: "B", number: 2, status: "available" as TableStatus, capacity: "4-6 guests", isWindow: true },
  { id: "B-3", zone: "B", number: 3, status: "available" as TableStatus, capacity: "4-6 guests", isWindow: true },
  { id: "B-4", zone: "B", number: 4, status: "available" as TableStatus, capacity: "4-6 guests" },
  { id: "B-5", zone: "B", number: 5, status: "available" as TableStatus, capacity: "4-6 guests" },
  { id: "B-6", zone: "B", number: 6, status: "available" as TableStatus, capacity: "4-6 guests", isWindow: true },
  { id: "C-1", zone: "C", number: 1, status: "available" as TableStatus, capacity: "2-4 guests" },
  { id: "C-2", zone: "C", number: 2, status: "available" as TableStatus, capacity: "2-4 guests" },
  { id: "C-3", zone: "C", number: 3, status: "available" as TableStatus, capacity: "2-4 guests", isWindow: true },
  { id: "C-4", zone: "C", number: 4, status: "available" as TableStatus, capacity: "2-4 guests", isWindow: true },
  { id: "VIP-1", zone: "C", number: 5, status: "available" as TableStatus, capacity: "8-12 guests", isVip: true },
  { id: "VIP-2", zone: "C", number: 6, status: "available" as TableStatus, capacity: "8-12 guests", isVip: true },
  { id: "D-1", zone: "D", number: 1, status: "available" as TableStatus, capacity: "6-8 guests" },
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `D-${i + 2}`,
    zone: "D",
    number: i + 2,
    status: "available" as TableStatus,
    capacity: "2-4 guests",
  })),
  { id: "D-7", zone: "D", number: 7, status: "available" as TableStatus, capacity: "4-6 guests", isWindow: true },
  { id: "D-8", zone: "D", number: 8, status: "available" as TableStatus, capacity: "4-6 guests", isWindow: true },
  { id: "D-9", zone: "D", number: 9, status: "available" as TableStatus, capacity: "2 guests", isWindow: true },
  { id: "D-10", zone: "D", number: 10, status: "available" as TableStatus, capacity: "2 guests", isWindow: true },
];

const reservationHours = ["17", "18", "19", "20", "21", "22", "23"];
const durationOptions = [1, 2, 3];

const toStorageTime = (hour: string) => `${hour.padStart(2, "0")}:00:00`;
const toDisplayTime = (hour: string) => `${hour.padStart(2, "0")}:00`;

const ReservationSection = () => {
  const { language } = useLanguage();
  const copy = {
    en: {
      zoneLabels: {
        A: "Window row",
        B: "Central hall",
        C: "Lounge and VIP",
        D: "Main dining",
      },
      chooseTitle: "Choose a table first",
      chooseBody: "Select an available table from the floor plan before continuing.",
      missingTitle: "Missing details",
      missingBody: "Please complete your name, phone number, reservation date, and reservation time.",
      bookedTitle: "Table already booked",
      confirmedTitle: "Reservation confirmed",
      errorTitle: "Something went wrong",
      cancelMissingTitle: "Missing phone number",
      cancelMissingBody: "Enter the reservation phone number to cancel the latest active booking.",
      cancelTitle: "Reservation cancelled",
      cancelErrorTitle: "Cancellation failed",
      cancelErrorBody: "We could not find an active upcoming reservation for that phone number.",
      kicker: "Reservations",
      hero1: "Pick your table",
      hero2: "with confidence.",
      heroBody: "Browse the layout, choose an available seat, and send your request in just a few steps.",
      legend: [
        { label: "Available", className: "border-border/80 bg-white/80" },
        { label: "Selected", className: "border-primary/50 bg-primary/20 ring-2 ring-primary/30" },
        { label: "Booked", className: "border-muted-foreground/10 bg-muted/20 opacity-30" },
        { label: "Window table", className: "border-border/80 bg-white/80 border-dashed" },
      ],
      loading: "Loading floor plan...",
      yourName: "Your name",
      phone: "Phone number",
      duration: "hour",
      guests: "Number of guests",
      confirm: "Confirm Reservation",
      submitting: "Submitting...",
      cancelPrompt: "Need to cancel?",
      cancelHeading: "Cancel an existing reservation",
      cancelBody: "Enter the reservation phone number and we will cancel the latest upcoming confirmed booking for that guest.",
      cancelling: "Cancelling...",
      cancelButton: "Cancel Reservation",
      window: "window",
      guestLabel: (count: number) => `${count} guest${count > 1 ? "s" : ""}`,
    },
    mn: {
      zoneLabels: {
        A: "Цонхны эгнээ",
        B: "Төв танхим",
        C: "Лоунж ба VIP",
        D: "Үндсэн танхим",
      },
      chooseTitle: "Эхлээд ширээгээ сонгоно уу",
      chooseBody: "Үргэлжлүүлэхийн өмнө сул ширээ сонгоно уу.",
      missingTitle: "Мэдээлэл дутуу байна",
      missingBody: "Нэр, утас, өдөр, цагаа бүрэн оруулна уу.",
      bookedTitle: "Ширээ аль хэдийн захиалагдсан байна",
      confirmedTitle: "Захиалга баталгаажлаа",
      errorTitle: "Алдаа гарлаа",
      cancelMissingTitle: "Утасны дугаар дутуу байна",
      cancelMissingBody: "Цуцлах захиалгын утасны дугаарыг оруулна уу.",
      cancelTitle: "Захиалга цуцлагдлаа",
      cancelErrorTitle: "Цуцлах боломжгүй байна",
      cancelErrorBody: "Энэ дугаартай идэвхтэй захиалга олдсонгүй.",
      kicker: "Захиалга",
      hero1: "Ширээгээ",
      hero2: "итгэлтэй сонгоорой.",
      heroBody: "Заалаа харж, сул ширээ сонгоод хэдхэн алхмаар хүсэлтээ илгээнэ.",
      legend: [
        { label: "Сул", className: "border-border/80 bg-white/80" },
        { label: "Сонгосон", className: "border-primary/50 bg-primary/20 ring-2 ring-primary/30" },
        { label: "Захиалгатай", className: "border-muted-foreground/10 bg-muted/20 opacity-30" },
        { label: "Цонхны ширээ", className: "border-border/80 bg-white/80 border-dashed" },
      ],
      loading: "Ширээний төлөв ачаалж байна...",
      yourName: "Таны нэр",
      phone: "Утасны дугаар",
      duration: "цаг",
      guests: "Зочдын тоо",
      confirm: "Захиалга Баталгаажуулах",
      submitting: "Илгээж байна...",
      cancelPrompt: "Цуцлах уу?",
      cancelHeading: "Байгаа захиалгаа цуцлах",
      cancelBody: "Утасны дугаараа оруулбал хамгийн ойрын идэвхтэй захиалгыг цуцална.",
      cancelling: "Цуцалж байна...",
      cancelButton: "Захиалга Цуцлах",
      window: "цонх",
      guestLabel: (count: number) => `${count} зочин`,
    },
  }[language];

  const [tables, setTables] = useState<TableInfo[]>(generateTables);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19");
  const [durationHours, setDurationHours] = useState("2");
  const [guests, setGuests] = useState("");
  const [cancelPhone, setCancelPhone] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [serviceError, setServiceError] = useState<string | null>(null);

  const applyBookedTables = (bookedIds: Set<string>) => {
    setTables((prev) =>
      prev.map((table) => {
        if (bookedIds.has(table.id)) {
          return { ...table, status: "booked" as TableStatus };
        }

        if (table.status === "booked") {
          return { ...table, status: "available" as TableStatus };
        }

        return table;
      }),
    );
  };

  const loadReservations = async (reservationDate?: string, reservationHour?: string, selectedDuration = Number(durationHours)) => {
    const targetDate = reservationDate || new Date().toISOString().split("T")[0];

    try {
      const data = await api.getReservations({
        date: targetDate,
        time: reservationHour || time,
        durationHours: selectedDuration,
      });

      setServiceError(null);
      applyBookedTables(new Set(data.bookedTableIds));
    } catch (error) {
      setServiceError(
        error instanceof Error
          ? error.message
          : "Reservation service is temporarily unavailable. Please try again shortly.",
      );
      applyBookedTables(new Set());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  useEffect(() => {
    if (!date) {
      return;
    }

    setIsLoading(true);
    loadReservations(date, time, Number(durationHours));
  }, [date, time, durationHours]);

  const selectedTable = tables.find((table) => table.status === "selected");

  const handleTableClick = (id: string) => {
    setTables((prev) =>
      prev.map((table) => {
        if (table.id === id && table.status === "selected") {
          return { ...table, status: "available" as TableStatus };
        }

        if (table.id === id && table.status === "available") {
          return { ...table, status: "selected" as TableStatus };
        }

        if (table.status === "selected") {
          return { ...table, status: "available" as TableStatus };
        }

        return table;
      }),
    );
  };

  const handleSubmit = async () => {
    if (serviceError) {
      toast({
        title: copy.errorTitle,
        description: serviceError,
        variant: "destructive",
      });
      return;
    }

    if (!selectedTable) {
      toast({
        title: copy.chooseTitle,
        description: copy.chooseBody,
        variant: "destructive",
      });
      return;
    }

    if (!name.trim() || !phone.trim() || !date || !time) {
      toast({
        title: copy.missingTitle,
        description: copy.missingBody,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await api.createReservation({
        table_id: selectedTable.id,
        zone: selectedTable.zone,
        table_number: selectedTable.number,
        customer_name: name.trim(),
        phone: phone.trim(),
        reservation_date: date,
        reservation_time: toStorageTime(time),
        duration_hours: Number(durationHours),
        guests,
        capacity: selectedTable.capacity,
      });

      setTables((prev) =>
        prev.map((table) => (table.id === selectedTable.id ? { ...table, status: "booked" as TableStatus } : table)),
      );
      setName("");
      setPhone("");
      setDate("");
      setTime("19");
      setDurationHours("2");
      setGuests("");

      toast({
        title: copy.confirmedTitle,
        description:
          language === "en"
            ? `${copy.zoneLabels[selectedTable.zone as keyof typeof copy.zoneLabels]}, table ${selectedTable.number} (${selectedTable.capacity}) has been reserved for ${date} at ${toDisplayTime(time)} for ${durationHours} hour${durationHours === "1" ? "" : "s"}.`
            : `${copy.zoneLabels[selectedTable.zone as keyof typeof copy.zoneLabels]} ${selectedTable.number}-р ширээ ${date} ${toDisplayTime(time)} цагаас ${durationHours} ${copy.duration} захиалагдлаа.`,
      });
    } catch (error) {
      console.error("Reservation error:", error);
      const message = error instanceof Error ? error.message : "We could not complete the reservation. Please try again.";

      if (message.toLowerCase().includes("already booked")) {
        setTables((prev) =>
          prev.map((table) => (table.id === selectedTable.id ? { ...table, status: "booked" as TableStatus } : table)),
        );
        toast({
          title: copy.bookedTitle,
          description:
            language === "en"
              ? `Table ${selectedTable.id} is no longer available for ${date} at ${toDisplayTime(time)}. Please choose another table.`
              : `${selectedTable.id} ширээ ${date} ${toDisplayTime(time)} цагт сул биш байна. Өөр ширээ сонгоно уу.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: copy.errorTitle,
          description: message,
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelReservation = async () => {
    if (serviceError) {
      toast({
        title: copy.cancelErrorTitle,
        description: serviceError,
        variant: "destructive",
      });
      return;
    }

    if (!cancelPhone.trim()) {
      toast({
        title: copy.cancelMissingTitle,
        description: copy.cancelMissingBody,
        variant: "destructive",
      });
      return;
    }

    setIsCancelling(true);

    try {
      const normalizedPhone = cancelPhone.trim();
      const data = await api.cancelReservation(normalizedPhone);
      const cancelledReservation = data.reservation;

      setCancelPhone("");

      if (
        cancelledReservation?.reservation_date &&
        date === cancelledReservation.reservation_date &&
        (!time || toStorageTime(time) === cancelledReservation.reservation_time)
      ) {
        setIsLoading(true);
        await loadReservations(cancelledReservation.reservation_date, time, Number(durationHours));
      }

      if (cancelledReservation?.table_id) {
        setTables((prev) =>
          prev.map((table) =>
            table.id === cancelledReservation.table_id && table.status === "booked"
              ? { ...table, status: "available" as TableStatus }
              : table,
          ),
        );
      }

      toast({
        title: copy.cancelTitle,
        description: cancelledReservation?.table_id
          ? language === "en"
            ? `Table ${cancelledReservation.table_id} is now available again for ${cancelledReservation.reservation_date} at ${String(cancelledReservation.reservation_time).slice(0, 5)}.`
            : `${cancelledReservation.table_id} ширээ ${cancelledReservation.reservation_date} ${String(cancelledReservation.reservation_time).slice(0, 5)} цагаас дахин сул боллоо.`
          : language === "en"
            ? "The latest active reservation for that phone number has been cancelled."
            : "Энэ дугаартай хамгийн ойрын идэвхтэй захиалга цуцлагдлаа.",
      });
    } catch (error) {
      console.error("Cancellation error:", error);
      toast({
        title: copy.cancelErrorTitle,
        description: error instanceof Error ? error.message : copy.cancelErrorBody,
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <section id="reservation" className="px-4 py-20 md:px-8 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-10 text-center"
        >
          <span className="section-kicker">{copy.kicker}</span>
          <h2 className="mt-5 text-4xl font-light text-foreground md:text-5xl lg:text-6xl">
            {copy.hero1}
            <span className="italic text-primary"> {copy.hero2}</span>
          </h2>
          <p className="section-description mt-4">{copy.heroBody}</p>
        </motion.div>

        <div className="mb-8 flex flex-wrap justify-center gap-6">
          {copy.legend.map((item) => (
            <div key={item.label} className="flex items-center gap-2.5">
              <div className={`h-7 w-7 rounded-lg border ${item.className}`} />
              <span className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground/70">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {serviceError && (
          <div className="mb-6 rounded-[24px] border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-center shadow-[0_16px_40px_hsl(40_60%_50%/.08)] dark:border-amber-400/20 dark:bg-amber-400/10">
            <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-amber-800 dark:text-amber-200">
              Reservation service offline
            </p>
            <p className="mt-2 font-body text-sm leading-7 text-foreground/80">{serviceError}</p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mb-8"
        >
          {isLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-background/70 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                <span className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                  {copy.loading}
                </span>
              </div>
            </div>
          )}
          <FloorPlan tables={tables} onTableClick={handleTableClick} />
        </motion.div>

        <AnimatePresence>
          {selectedTable && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden"
            >
              <div className="mb-4 rounded-[28px] border border-white/70 bg-gradient-to-br from-white via-[hsl(40_38%_97%)] to-[hsl(34_36%_94%)] p-6 shadow-[0_24px_60px_hsl(28_25%_35%/.1)] backdrop-blur-sm dark:border-white/10 dark:bg-gradient-to-br dark:from-[hsl(22_12%_14%)] dark:via-[hsl(20_10%_11%)] dark:to-[hsl(18_12%_9%)] dark:shadow-[0_24px_60px_hsl(0_0%_0%/.3)] md:p-10">
                <div className="mb-8 text-center">
                  <div className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/10 px-5 py-2.5">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                    <span className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-primary">
                      {copy.zoneLabels[selectedTable.zone as keyof typeof copy.zoneLabels]} - table {selectedTable.number} ({selectedTable.capacity})
                      {selectedTable.isWindow ? ` - ${copy.window}` : ""}
                    </span>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      type="text"
                      placeholder={copy.yourName}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={100}
                      className="w-full rounded-lg border border-border/80 bg-white/80 px-5 py-4 font-body text-foreground transition-all duration-300 placeholder:text-muted-foreground/50 focus:border-primary/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04] dark:focus:bg-white/[0.08]"
                    />
                    <input
                      type="tel"
                      placeholder={copy.phone}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      maxLength={20}
                      className="w-full rounded-lg border border-border/80 bg-white/80 px-5 py-4 font-body text-foreground transition-all duration-300 placeholder:text-muted-foreground/50 focus:border-primary/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04] dark:focus:bg-white/[0.08]"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-lg border border-border/80 bg-white/80 px-5 py-4 font-body text-foreground transition-all duration-300 focus:border-primary/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04] dark:focus:bg-white/[0.08]"
                    />
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-border/80 bg-white/80 px-5 py-4 font-body text-foreground transition-all duration-300 focus:border-primary/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04] dark:focus:bg-white/[0.08]"
                    >
                      {reservationHours.map((hour) => (
                        <option key={hour} value={hour} className="bg-card text-foreground">
                          {toDisplayTime(hour)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <select
                      value={durationHours}
                      onChange={(e) => setDurationHours(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-border/80 bg-white/80 px-5 py-4 font-body text-foreground transition-all duration-300 focus:border-primary/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04] dark:focus:bg-white/[0.08]"
                    >
                      {durationOptions.map((hours) => (
                        <option key={hours} value={hours} className="bg-card text-foreground">
                          {hours} {copy.duration}
                          {hours > 1 && language === "en" ? "s" : ""}
                        </option>
                      ))}
                    </select>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-border/80 bg-white/80 px-5 py-4 font-body text-foreground transition-all duration-300 focus:border-primary/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04] dark:focus:bg-white/[0.08]"
                    >
                      <option value="" className="bg-card text-foreground">
                        {copy.guests}
                      </option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((count) => (
                        <option key={count} value={count} className="bg-card text-foreground">
                          {copy.guestLabel(count)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !!serviceError}
                    className="w-full rounded-lg bg-gradient-to-r from-primary via-primary/90 to-primary/80 px-8 py-4 font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-primary-foreground transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isSubmitting ? copy.submitting : copy.confirm}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-8 rounded-[28px] border border-white/70 bg-white/82 p-6 shadow-[0_20px_52px_hsl(28_25%_35%/.08)] dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_20px_40px_hsl(0_0%_0%/.2)] md:p-8"
        >
          <div className="mb-6 text-center">
            <p className="font-sans text-[11px] uppercase tracking-[0.24em] text-primary/75">{copy.cancelPrompt}</p>
            <h3 className="mt-3 text-2xl text-foreground">{copy.cancelHeading}</h3>
            <p className="mx-auto mt-3 max-w-2xl font-body text-sm leading-7 text-muted-foreground/70">{copy.cancelBody}</p>
          </div>

          <div className="grid gap-4">
            <input
              type="tel"
              placeholder={copy.phone}
              value={cancelPhone}
              onChange={(e) => setCancelPhone(e.target.value)}
              maxLength={20}
              className="w-full rounded-lg border border-border/80 bg-white/80 px-5 py-4 font-body text-foreground transition-all duration-300 placeholder:text-muted-foreground/50 focus:border-primary/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04] dark:focus:bg-white/[0.08]"
            />
          </div>

          <button
            onClick={handleCancelReservation}
            disabled={isCancelling || !!serviceError}
            className="mt-5 w-full rounded-lg border border-primary/25 bg-primary/10 px-8 py-4 font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isCancelling ? copy.cancelling : copy.cancelButton}
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default ReservationSection;
