export type Language = "en" | "mn";

export const LANGUAGE_COOKIE_NAME = "gusto-language";
export const LANGUAGE_STORAGE_KEY = "gusto-language";

export const resolveLanguage = (value?: string | null): Language => (value === "mn" ? "mn" : "en");

export const isLanguage = (value: unknown): value is Language => value === "en" || value === "mn";

export const readBrowserLanguage = (): Language => {
  if (typeof window === "undefined") {
    return "en";
  }

  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored === "en" || stored === "mn") {
    return stored;
  }

  const cookie = document.cookie
    .split("; ")
    .find((value) => value.startsWith(`${LANGUAGE_COOKIE_NAME}=`))
    ?.split("=")
    .slice(1)
    .join("=");

  return resolveLanguage(cookie ? decodeURIComponent(cookie) : null);
};

export const formatCapacity = (value: string, language: Language) => {
  const normalized = value.trim();
  if (normalized.endsWith("зочин")) {
    const base = normalized.replace(/\s*зочин$/i, "").trim();
    return language === "en" ? `${base} guests` : normalized;
  }

  const base = normalized.replace(/\s*guests?$/i, "").trim();

  if (!base) {
    return normalized;
  }

  return language === "en" ? `${base} guests` : `${base} зочин`;
};

export const translateApiMessage = (message: string, language: Language) => {
  if (language === "en") {
    return message;
  }

  const translations: Array<[RegExp, (match: RegExpMatchArray) => string]> = [
    [/^Login failed\.$/, () => "Нэвтрэхэд алдаа гарлаа."],
    [/^Invalid email or password\.$/, () => "И-мэйл эсвэл нууц үг буруу байна."],
    [/^This sign-in is reserved for admin accounts\.$/, () => "Энэ нэвтрэлт зөвхөн админ бүртгэлд зориулагдсан."],
    [/^This sign-in is reserved for customer accounts\.$/, () => "Энэ нэвтрэлт зөвхөн хэрэглэгчийн бүртгэлд зориулагдсан."],
    [/^Invalid login payload\.$/, () => "Нэвтрэлтийн өгөгдөл буруу байна."],
    [/^Could not create your account\.$/, () => "Бүртгэл үүсгэж чадсангүй."],
    [/^Invalid registration payload\.$/, () => "Бүртгэлийн өгөгдөл буруу байна."],
    [/^An account with that email already exists\.$/, () => "Энэ имэйлтэй бүртгэл аль хэдийн байна."],
    [/^That phone number is already linked to another account\.$/, () => "Энэ утасны дугаар өөр бүртгэлтэй холбогдсон байна."],
    [/^That account already exists\.$/, () => "Энэ бүртгэл аль хэдийн байна."],
    [/^Failed to create account\.$/, () => "Бүртгэл үүсгэж чадсангүй."],
    [/^Failed to login\.$/, () => "Нэвтэрч чадсангүй."],
    [/^Invalid reservation hour\.$/, () => "Захиалгын цаг буруу байна."],
    [/^Invalid reservation query\.$/, () => "Захиалгын хайлтын өгөгдөл буруу байна."],
    [/^Invalid reservation payload\.$/, () => "Захиалгын өгөгдөл буруу байна."],
    [/^Failed to fetch reservations\.$/, () => "Захиалгыг татаж чадсангүй."],
    [/^Failed to create reservation\.$/, () => "Захиалга үүсгэж чадсангүй."],
    [/^Invalid reservation date\.$/, () => "Захиалгын огноо буруу байна."],
    [/^No active upcoming reservation found for that phone number\.$/, () => "Энэ дугаартай идэвхтэй захиалга олдсонгүй."],
    [/^Invalid cancellation payload\.$/, () => "Цуцлах өгөгдөл буруу байна."],
    [/^Failed to cancel reservation\.$/, () => "Захиалга цуцалж чадсангүй."],
    [/^Unauthorized\.$/, () => "Зөвшөөрөлгүй."],
    [/^Database connection failed\.$/, () => "Өгөгдлийн сантай холбогдож чадсангүй."],
    [
      /^Restaurant reservation service is temporarily unavailable\. Please make sure the database is running and try again\.$/,
      () => "Рестораны захиалгын үйлчилгээ түр хугацаанд ажиллахгүй байна. Өгөгдлийн сан ажиллаж байгаа эсэхийг шалгаад дахин оролдоно уу.",
    ],
    [/^Request failed\.$/, () => "Хүсэлт амжилтгүй боллоо."],
    [/^Reservation service is temporarily unavailable\.$/, () => "Захиалгын үйлчилгээ түр хугацаанд ажиллахгүй байна."],
    [/^Invalid table query\.$/, () => "Ширээний хайлтын өгөгдөл буруу байна."],
    [/^Invalid table payload\.$/, () => "Ширээний өгөгдөл буруу байна."],
    [/^Failed to fetch tables\.$/, () => "Ширээнүүдийг татаж чадсангүй."],
    [/^Failed to create table\.$/, () => "Ширээ үүсгэж чадсангүй."],
    [/^That table number already exists\.$/, () => "Энэ ширээний дугаар аль хэдийн бүртгэлтэй байна."],
    [/^Table not found\.$/, () => "Ширээ олдсонгүй."],
    [/^Invalid reservation date\.$/, () => "Захиалгын огноо буруу байна."],
    [/^Reservation not found\.$/, () => "Захиалга олдсонгүй."],
    [/^Failed to update reservation\.$/, () => "Захиалгыг шинэчилж чадсангүй."],
    [/^Failed to delete reservation\.$/, () => "Захиалгыг устгаж чадсангүй."],
    [/^Another reservation already exists for that table and time\.$/, () => "Энэ ширээ болон цагт өөр захиалга байна."],
    [
      /^Table (.+) is already booked for that time\.$/,
      (match) => `Ширээ ${match[1]} тэр цагт аль хэдийн захиалагдсан байна.`,
    ],
    [
      /^Website reservations must start as pending\.$/,
      () => "Website захиалга эхлээд pending төлөвтэй байх ёстой.",
    ],
  ];

  for (const [pattern, translate] of translations) {
    const match = message.match(pattern);
    if (match) {
      return translate(match);
    }
  }

  return message;
};
