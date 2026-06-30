"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, CircleCheckBig, Clock3, LoaderCircle, MapPin, Phone, Sparkles, Users, Star, CheckCircle2, CreditCard, Shield, Coffee } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { api, type TableRecord } from "@/lib/api";
import RestaurantFloorMap from "@/components/RestaurantFloorMap";

const getDateValue = (offsetDays = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getTodayValue = () => getDateValue(0);
const getMaxDateValue = () => getDateValue(10);

const combineDateAndTime = (date: string, time: string) => {
  const normalizedTime = time.length === 5 ? `${time}:00` : time;
  return `${date}T${normalizedTime}`;
};

const isDateWithinWindow = (value: string) => {
  if (!value) {
    return false;
  }

  const selected = new Date(value);
  const min = new Date(getDateValue(0));
  const max = new Date(getDateValue(10));
  return selected >= min && selected <= max;
};

const ReservationSection = () => {
  const { language } = useLanguage();
  const [tables, setTables] = useState<TableRecord[]>([]);
  const [reservationDate, setReservationDate] = useState(getTodayValue);
  const [reservationTime, setReservationTime] = useState("19:00");
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [guestCount, setGuestCount] = useState("2");
  const [note, setNote] = useState("");
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceError, setServiceError] = useState<string | null>(null);

  const copy = {
    en: {
      kicker: "Reservations",
      title: "Secure Your Table",
      title2: "Experience Elegance.",
      body: "Reserve your dining experience with us. Choose your preferred time and table for an unforgettable evening.",
      slotTitle: "Choose Date & Time",
      slotBody: "Select your preferred dining date and time slot",
      tablesTitle: "Select Your Table",
      tablesBody: "Pick from our available tables for an intimate dining experience",
      noTables: "No tables available for this time slot",
      selectedTable: "Your Selection",
      available: "Available",
      reserved: "Reserved",
      occupied: "Occupied",
      slotUnavailable: "Not Available",
      formTitle: "Complete Booking",
      formBody: "Fill in your details to confirm your reservation",
      name: "Full name",
      phone: "Phone number",
      guests: "Number of guests",
      note: "Special requests (optional)",
      submit: "Confirm Reservation",
      submitting: "Processing...",
      successTitle: "Reservation Confirmed!",
      successBody: (tableNumber: number) => `Table ${tableNumber} has been reserved for you. We look forward to welcoming you!`,
      chooseTable: "Please select a table to continue",
      required: "Please fill in all required fields",
      errorTitle: "Reservation Failed",
      serviceOffline: "Service temporarily unavailable",
      serviceUnavailable: "Unable to connect to reservation service",
      tableLabel: (table: TableRecord) => `Table ${table.tableNumber}`,
      capacityLabel: (table: TableRecord) => `Seats ${table.capacity_label}`,
      selectedSlot: (date: string, time: string) => `${date} at ${time}`,
      yourDetails: "Guest Information",
      confirm: "Complete Reservation",
      whyDine: "Why Dine With Us",
      features: [
        "Award-winning cuisine",
        "Elegant atmosphere",
        "Premium service",
        "Wine pairing available"
      ],
      guarantee: "No booking fees",
    },
    mn: {
      kicker: "Захиалга",
      title: "Ширээгээ",
      title2: "баталгаажуулаарай.",
      body: "Тансаг оройн хоолны туршлагыг бидэнтэй хамт төлөвлө. Цаг болон ширээгээ сонгоцгооё.",
      slotTitle: "Огноо & Цаг",
      slotBody: "Хүссэн огноо, цагаа сонгоно уу",
      tablesTitle: "Ширээ сонгох",
      tablesBody: "Боломжтой ширээнүүдээс сонголтоо хийнэ үү",
      noTables: "Энэ цагт сул ширээ байхгүй байна",
      selectedTable: "Таны сонголт",
      available: "Сул",
      reserved: "Захиалгатай",
      occupied: "Эзлэгдсэн",
      slotUnavailable: "Боломжгүй",
      formTitle: "Захиалга баталгаажуулах",
      formBody: "Доорх мэдээллээ бөглөнө үү",
      name: "Бүтэн нэр",
      phone: "Утасны дугаар",
      guests: "Зочдын тоо",
      note: "Тусгай хүсэлт (нэмэлт)",
      submit: "Захиалга баталгаажуулах",
      submitting: "Боловсруулж байна...",
      successTitle: "Захиалга амжилттай!",
      successBody: (tableNumber: number) => `${tableNumber}-р ширээ таны нэр дээр захиалагдлаа. Таныг хүлээн авахыг тэсэн ядан хүлээж байна!`,
      chooseTable: "Эхлээд ширээ сонгоно уу",
      required: "Шаардлагатай мэдээллээ бөглөнө үү",
      errorTitle: "Захиалга амжилтгүй",
      serviceOffline: "Үйлчилгээ түр ажиллахгүй байна",
      serviceUnavailable: "Захиалгын системд холбогдож чадсангүй",
      tableLabel: (table: TableRecord) => `${table.tableNumber}-р ширээ`,
      capacityLabel: (table: TableRecord) => `${table.capacity_label} хүний суудал`,
      selectedSlot: (date: string, time: string) => `${date} ${time}`,
      yourDetails: "Зочны мэдээлэл",
      confirm: "Захиалга баталгаажуулах",
      whyDine: "Яагаад бидэнтэй хамт?",
      features: [
        "Шагналт хоолнууд",
        "Тансаг орчин",
        "Өндөр түвшний үйлчилгээ",
        "Дарсны сонголт"
      ],
      guarantee: "Нэмэлт төлбөргүй",
    },
  }[language];

  const selectedTable = useMemo(
    () => tables.find((table) => table.id === selectedTableId) ?? null,
    [tables, selectedTableId],
  );

  const availableTables = useMemo(
    () => tables.filter((table) => table.availableForRequestedSlot),
    [tables],
  );

  const reservedTables = useMemo(
    () => tables.filter((table) => !table.availableForRequestedSlot),
    [tables],
  );

  const availableTableCount = useMemo(
    () => availableTables.length,
    [availableTables],
  );

  const loadTables = async () => {
    setIsLoading(true);

    if (!isDateWithinWindow(reservationDate)) {
      setServiceError("Select a reservation date 1-10 days from today.");
      setTables([]);
      setIsLoading(false);
      return;
    }

    try {
      const data = await api.getTables({
        date: reservationDate,
        time: reservationTime,
      });

      setTables(data.tables);
      setServiceError(null);

      if (!data.availableTableIds.includes(selectedTableId ?? "")) {
        setSelectedTableId((current) => (current && data.availableTableIds.includes(current) ? current : null));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : copy.serviceUnavailable;
      setServiceError(message);
      setTables([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadTables();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservationDate, reservationTime]);

  const handleSubmit = async () => {
    if (!selectedTable) {
      toast({
        title: copy.errorTitle,
        description: copy.chooseTable,
        variant: "destructive",
      });
      return;
    }

    if (!customerName.trim() || !phoneNumber.trim() || !reservationDate || !reservationTime || !guestCount) {
      toast({
        title: copy.errorTitle,
        description: copy.required,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await api.createReservation({
        customerName: customerName.trim(),
        phoneNumber: phoneNumber.trim(),
        reservationDate: combineDateAndTime(reservationDate, reservationTime),
        guestCount: Number(guestCount),
        note: note.trim() || null,
        tableId: selectedTable.id,
        source: "website",
      });

      toast({
        title: copy.successTitle,
        description: copy.successBody(selectedTable.tableNumber),
      });

      setCustomerName("");
      setPhoneNumber("");
      setGuestCount("2");
      setNote("");
      setSelectedTableId(null);
      await loadTables();
    } catch (error) {
      toast({
        title: copy.errorTitle,
        description: error instanceof Error ? error.message : copy.serviceUnavailable,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden py-20 sm:py-24 md:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-black">
      {/* Premium Dark Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-black to-neutral-950" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-400/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,theme(colors.amber.500/0.03)_1px,transparent_1px),linear-gradient(180deg,theme(colors.amber.500/0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/40" />
      </div>

      {/* Animated floating orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-[-10%] w-72 h-72 rounded-full bg-amber-500/8 blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 right-[-10%] w-80 h-80 rounded-full bg-amber-600/6 blur-3xl animate-float-slower" style={{ animationDelay: "-3s" }} />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-amber-400/5 blur-3xl animate-float" style={{ animationDelay: "-5s" }} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header Section - Premium styling */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-sm px-4 py-2 mb-6"
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-amber-400 font-semibold">
              {copy.kicker}
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light leading-[1.1] sm:leading-[1.05] tracking-tight"
          >
            <span className="text-white">{copy.title}</span>
            <span className="block text-amber-400 italic mt-2">{copy.title2}</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto mt-4 sm:mt-6 text-base sm:text-lg text-neutral-400 font-sans"
          >
            {copy.body}
          </motion.p>
        </div>

        {/* Main Reservation Flow */}
        <div className="grid gap-8 lg:gap-10">
          {/* Step 1: Date & Time Selection */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl sm:rounded-3xl border border-amber-500/20 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl overflow-hidden"
          >
            <div className="border-b border-amber-500/20 px-6 sm:px-8 py-4 sm:py-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <span className="text-amber-400 text-sm font-bold">1</span>
                </div>
                <h3 className="text-lg sm:text-xl font-light text-white tracking-wide">Select Date & Time</h3>
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-amber-400">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Choose Date
                  </label>
                  <input
                    type="date"
                    min={getTodayValue()}
                    max={getMaxDateValue()}
                    value={reservationDate}
                    onChange={(event) => setReservationDate(event.target.value)}
                    className="w-full rounded-xl border border-amber-500/20 bg-black/50 px-4 py-3 font-sans text-base text-white outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-amber-400">
                    <Clock3 className="h-3.5 w-3.5" />
                    Choose Time
                  </label>
                  <input
                    type="time"
                    value={reservationTime}
                    onChange={(event) => setReservationTime(event.target.value)}
                    className="w-full rounded-xl border border-amber-500/20 bg-black/50 px-4 py-3 font-sans text-base text-white outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-amber-400">
                    <Users className="h-3.5 w-3.5" />
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={guestCount}
                    onChange={(event) => setGuestCount(event.target.value)}
                    className="w-full rounded-xl border border-amber-500/20 bg-black/50 px-4 py-3 font-sans text-base text-white outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 2: Table Selection */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl sm:rounded-3xl border border-amber-500/20 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl overflow-hidden"
          >
            <div className="border-b border-amber-500/20 px-6 sm:px-8 py-4 sm:py-5">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <span className="text-amber-400 text-sm font-bold">2</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-light text-white tracking-wide">Select Your Table</h3>
                </div>
                <div className="text-sm text-neutral-400">
                  <span className="text-amber-400 font-semibold">{availableTableCount}</span> tables available
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-16">
                  <LoaderCircle className="h-7 w-7 animate-spin text-amber-400" />
                  <p className="text-neutral-500 text-xs uppercase tracking-[0.25em]">Loading floor plan…</p>
                </div>
              ) : serviceError ? (
                <div className="rounded-xl border border-red-500/20 bg-red-950/20 px-6 py-8 text-center">
                  <p className="text-red-400 text-sm">{serviceError}</p>
                </div>
              ) : tables.length ? (
                <RestaurantFloorMap
                  tables={tables}
                  selectedTableId={selectedTableId}
                  onSelect={(id) => setSelectedTableId(id)}
                />
              ) : (
                <div className="rounded-xl border border-dashed border-neutral-800 bg-black/30 px-6 py-12 text-center">
                  <p className="text-neutral-400 text-sm">{copy.noTables}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Step 3: Guest Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl sm:rounded-3xl border border-amber-500/20 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl overflow-hidden"
          >
            <div className="border-b border-amber-500/20 px-6 sm:px-8 py-4 sm:py-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <span className="text-amber-400 text-sm font-bold">3</span>
                </div>
                <h3 className="text-lg sm:text-xl font-light text-white tracking-wide">Complete Your Booking</h3>
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Form */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-amber-400 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(event) => setCustomerName(event.target.value)}
                      placeholder="John Smith"
                      className="w-full rounded-xl border border-amber-500/20 bg-black/50 px-4 py-3 text-white placeholder:text-neutral-500 outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-amber-400 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(event) => setPhoneNumber(event.target.value)}
                      placeholder="+976 1234 5678"
                      className="w-full rounded-xl border border-amber-500/20 bg-black/50 px-4 py-3 text-white placeholder:text-neutral-500 outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-amber-400 mb-2">Special Requests</label>
                    <textarea
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      rows={3}
                      placeholder="Dietary restrictions, special occasion, etc."
                      className="w-full rounded-xl border border-amber-500/20 bg-black/50 px-4 py-3 text-white placeholder:text-neutral-500 outline-none focus:border-amber-400 resize-none"
                    />
                  </div>
                </div>

                {/* Summary & Benefits */}
                <div className="space-y-6">
                  {selectedTable && (
                    <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="h-4 w-4 text-amber-400" />
                        <span className="text-xs uppercase tracking-[0.2em] text-amber-400">Your Selection</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Table:</span>
                          <span className="text-white font-medium">{copy.tableLabel(selectedTable)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Date & Time:</span>
                          <span className="text-white">{copy.selectedSlot(reservationDate, reservationTime)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Guests:</span>
                          <span className="text-white">{guestCount} persons</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="rounded-xl bg-neutral-900/50 border border-neutral-800 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="h-4 w-4 text-amber-400" />
                      <span className="text-xs uppercase tracking-[0.2em] text-amber-400">{copy.guarantee}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                      <CreditCard className="h-4 w-4" />
                      <span>No credit card required to reserve</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !selectedTable}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold uppercase tracking-[0.2em] text-sm transition-all hover:from-amber-600 hover:to-amber-700 hover:shadow-lg hover:shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <LoaderCircle className="h-5 w-5 animate-spin" />
                        {copy.submitting}
                      </div>
                    ) : (
                      copy.confirm
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-4"
          >
            {copy.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-black/30 px-4 py-3">
                <Coffee className="h-4 w-4 text-amber-400" />
                <span className="text-sm text-neutral-300">{feature}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, 20px); }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, -10px); }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float-slower 12s ease-in-out infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .bg-radial-gradient {
          background: radial-gradient(circle at center, transparent 0%, black 100%);
        }
      `}</style>
    </section>
  );
};

export default ReservationSection;