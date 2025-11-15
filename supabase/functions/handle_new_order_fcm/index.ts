import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const fcmProjectId = Deno.env.get("FCM_PROJECT_ID");
    const fcmAccessToken = Deno.env.get("FCM_ACCESS_TOKEN");

    if (!supabaseUrl || !supabaseServiceKey || !fcmProjectId || !fcmAccessToken) {
      throw new Error("Missing environment variables");
    }
    const payload = await req.json();
    if (payload.type !== "INSERT") {
      return new Response(JSON.stringify({ status: "ignored" }), { status: 200 });
    }
    const order = payload.record;

    // Get owner's FCM token
    const response = await fetch(
      `${supabaseUrl}/rest/v1/users?id=eq.${order.owner_id}&select=fcm_token`,
      {
        headers: {
          Authorization: `Bearer ${supabaseServiceKey}`,
          "Content-Type": "application/json",
          apikey: supabaseServiceKey,
        },
      }
    );
    const users = await response.json();
    const fcmToken = users[0]?.fcm_token;
    if (!fcmToken) {
      return new Response(JSON.stringify({ status: "skipped", reason: "no_fcm_token" }), { status: 200 });
    }

    // Send FCM notification
    const fcmResponse = await fetch(
      `https://fcm.googleapis.com/v1/projects/${fcmProjectId}/messages:send`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${fcmAccessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: {
            token: fcmToken,
            notification: {
              title: "New Custom Order 👕",
              body: `Delivery by ${order.delivery_deadline}. ${order.currency} ${order.total_amount}`,
            },
            data: {
              order_id: order.id,
              product_id: order.product_id,
              total_amount: order.total_amount.toString(),
              action: "open_order_details"
            }
          }
        })
      }
    );
    if (!fcmResponse.ok) {
      const error = await fcmResponse.text();
      return new Response(JSON.stringify({ status: "error", message: error }), { status: 500 });
    }
    return new Response(JSON.stringify({ status: "ok", notification_sent: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ status: "error", message: error.message }), { status: 500 });
  }
});
