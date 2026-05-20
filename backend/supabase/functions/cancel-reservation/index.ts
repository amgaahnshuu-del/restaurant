import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone } = await req.json();

    if (!phone) {
      return new Response(JSON.stringify({ error: "phone is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    const today = new Date().toISOString().split("T")[0];

    const { data: reservations, error: lookupError } = await supabase
      .from("reservations")
      .select("id, table_id, reservation_date, reservation_time, duration_hours, status")
      .eq("phone", phone)
      .eq("status", "confirmed")
      .gte("reservation_date", today)
      .order("reservation_date", { ascending: true })
      .order("reservation_time", { ascending: true })
      .order("created_at", { ascending: false });

    if (lookupError) {
      throw new Error(`Lookup error: ${lookupError.message}`);
    }

    const now = new Date();
    const reservation = (reservations ?? []).find((item) => {
      const start = new Date(`${item.reservation_date}T${item.reservation_time}`);
      const end = new Date(start);
      end.setHours(end.getHours() + item.duration_hours);
      return end > now;
    });

    if (!reservation) {
      return new Response(JSON.stringify({ error: "Reservation not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data, error: updateError } = await supabase
      .from("reservations")
      .update({ status: "cancelled" })
      .eq("id", reservation.id)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Update error: ${updateError.message}`);
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
