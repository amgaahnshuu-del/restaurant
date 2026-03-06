import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const NOTIFICATION_EMAIL = "monhenerel24@gmail.com";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { table_id, zone, table_number, customer_name, phone, reservation_date, guests, capacity } = await req.json();

    // Save to database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error: dbError } = await supabase.from("reservations").insert({
      table_id,
      zone,
      table_number,
      customer_name,
      phone,
      reservation_date,
      guests: guests ? parseInt(guests) : null,
      capacity,
      status: "confirmed",
    }).select().single();

    if (dbError) {
      throw new Error(`DB error: ${dbError.message}`);
    }

    // Send email via Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (resendApiKey) {
      const zoneLabels: Record<string, string> = {
        A: "A бүс — Бар хэсэг",
        B: "B бүс — Төв зал",
        C: "C бүс — Chill Zone",
        D: "D бүс — Үндсэн зал",
      };

      const emailHtml = `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #ffffff;">
          <div style="text-align: center; border-bottom: 2px solid #c5a572; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="color: #1a1a1a; font-size: 28px; margin: 0;">GUSTO</h1>
            <p style="color: #c5a572; font-size: 12px; letter-spacing: 3px; margin-top: 8px;">ШИНЭ ЗАХИАЛГА</p>
          </div>
          
          <div style="background: #faf8f5; border: 1px solid #e8e0d4; padding: 24px; margin-bottom: 20px;">
            <h2 style="color: #1a1a1a; font-size: 18px; margin: 0 0 16px;">Захиалгын мэдээлэл</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #888; width: 140px;">Нэр:</td><td style="padding: 8px 0; color: #1a1a1a; font-weight: bold;">${customer_name}</td></tr>
              <tr><td style="padding: 8px 0; color: #888;">Утас:</td><td style="padding: 8px 0; color: #1a1a1a; font-weight: bold;">${phone}</td></tr>
              <tr><td style="padding: 8px 0; color: #888;">Огноо:</td><td style="padding: 8px 0; color: #1a1a1a; font-weight: bold;">${reservation_date}</td></tr>
              <tr><td style="padding: 8px 0; color: #888;">Зочдын тоо:</td><td style="padding: 8px 0; color: #1a1a1a; font-weight: bold;">${guests || "—"}</td></tr>
              <tr><td style="padding: 8px 0; color: #888;">Бүс:</td><td style="padding: 8px 0; color: #1a1a1a; font-weight: bold;">${zoneLabels[zone] || zone}</td></tr>
              <tr><td style="padding: 8px 0; color: #888;">Ширээ:</td><td style="padding: 8px 0; color: #1a1a1a; font-weight: bold;">${table_id} (${capacity})</td></tr>
            </table>
          </div>
          
          <p style="color: #888; font-size: 12px; text-align: center;">Энэ имэйл автоматаар илгээгдсэн болно.</p>
        </div>
      `;

      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "Gusto Reservation <onboarding@resend.dev>",
          to: [NOTIFICATION_EMAIL],
          subject: `Шинэ захиалга: ${customer_name} — ${table_id}`,
          html: emailHtml,
        }),
      });

      if (!emailRes.ok) {
        console.error("Email send failed:", await emailRes.text());
      }
    } else {
      console.log("RESEND_API_KEY not set, skipping email notification");
    }

    return new Response(JSON.stringify({ success: true, reservation: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
