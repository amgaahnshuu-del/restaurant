import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const NOTIFICATION_EMAIL = "monhenerel24@gmail.com";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      table_id,
      zone,
      table_number,
      customer_name,
      phone,
      reservation_date,
      reservation_time,
      duration_hours,
      guests,
      capacity,
    } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error: dbError } = await supabase
      .from("reservations")
      .insert({
        table_id,
        zone,
        table_number,
        customer_name,
        phone,
        reservation_date,
        reservation_time,
        duration_hours,
        guests: guests ? parseInt(String(guests), 10) : null,
        capacity,
        status: "confirmed",
      })
      .select()
      .single();

    if (dbError) {
      throw new Error(`DB error: ${dbError.message}`);
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (resendApiKey) {
      const zoneLabels: Record<string, string> = {
        A: "Window row",
        B: "Central hall",
        C: "Lounge and VIP",
        D: "Main dining",
      };

      const displayTime = String(reservation_time).slice(0, 5);
      const durationLabel = `${duration_hours} hour${duration_hours === 1 ? "" : "s"}`;
      const guestLabel = guests ? String(guests) : "Not specified";

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 20px; background: #ffffff; color: #1a1a1a;">
          <h1 style="margin: 0 0 8px; font-size: 28px;">Gusto Reservation</h1>
          <p style="margin: 0 0 24px; color: #8a6a33;">A new table reservation was created.</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px 0; color: #666; width: 160px;">Customer</td><td style="padding: 10px 0; font-weight: 600;">${customer_name}</td></tr>
            <tr><td style="padding: 10px 0; color: #666;">Phone</td><td style="padding: 10px 0; font-weight: 600;">${phone}</td></tr>
            <tr><td style="padding: 10px 0; color: #666;">Date</td><td style="padding: 10px 0; font-weight: 600;">${reservation_date}</td></tr>
            <tr><td style="padding: 10px 0; color: #666;">Time</td><td style="padding: 10px 0; font-weight: 600;">${displayTime}</td></tr>
            <tr><td style="padding: 10px 0; color: #666;">Duration</td><td style="padding: 10px 0; font-weight: 600;">${durationLabel}</td></tr>
            <tr><td style="padding: 10px 0; color: #666;">Guests</td><td style="padding: 10px 0; font-weight: 600;">${guestLabel}</td></tr>
            <tr><td style="padding: 10px 0; color: #666;">Zone</td><td style="padding: 10px 0; font-weight: 600;">${zoneLabels[zone] || zone}</td></tr>
            <tr><td style="padding: 10px 0; color: #666;">Table</td><td style="padding: 10px 0; font-weight: 600;">${table_id} (${capacity})</td></tr>
          </table>
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
          subject: `New reservation: ${customer_name} - ${table_id}`,
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
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
