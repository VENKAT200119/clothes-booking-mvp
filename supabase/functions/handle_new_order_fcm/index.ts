/// <reference lib="deno" />
import { serve } from "https://deno.land/std@0.208.0/http/server.ts"

serve(async (req: Request) => {
  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    const fcmProjectId = Deno.env.get("FCM_PROJECT_ID")
    const fcmAccessToken = Deno.env.get("FCM_ACCESS_TOKEN")

    // Validate environment variables
    if (!supabaseUrl || !supabaseServiceKey || !fcmProjectId || !fcmAccessToken) {
      console.error("Missing environment variables")
      return new Response(
        JSON.stringify({ error: "Missing environment variables" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    }

    // Parse webhook payload
    const payload = await req.json()

    // Only process INSERT events
    if (payload.type !== "INSERT") {
      console.log(`Ignoring ${payload.type} event`)
      return new Response(
        JSON.stringify({ status: "ignored", type: payload.type }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    }

    const order = payload.record

    // Fetch owner's FCM token from Supabase
    const userResponse = await fetch(
      `${supabaseUrl}/rest/v1/users?id=eq.${order.owner_id}&select=fcm_token`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${supabaseServiceKey}`,
          "Content-Type": "application/json",
          apikey: supabaseServiceKey,
        },
      }
    )

    if (!userResponse.ok) {
      console.error(`Failed to fetch user: ${userResponse.statusText}`)
      return new Response(
        JSON.stringify({ error: "Failed to fetch user" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    }

    const users = await userResponse.json()
    const fcmToken = users[0]?.fcm_token

    if (!fcmToken) {
      console.log(`No FCM token for owner ${order.owner_id}`)
      return new Response(
        JSON.stringify({ status: "skipped", reason: "no_fcm_token" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    }

    // Send FCM notification
    const fcmResponse = await fetch(
      `https://fcm.googleapis.com/v1/projects/${fcmProjectId}/messages:send`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${fcmAccessToken}`,
          "Content-Type": "application/json",
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
              action: "open_order_details",
            },
          },
        }),
      }
    )

    if (!fcmResponse.ok) {
      const errorText = await fcmResponse.text()
      console.error(`FCM error [${fcmResponse.status}]: ${errorText}`)
      return new Response(
        JSON.stringify({ status: "error", message: errorText }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    }

    console.log(`✓ Notification sent to owner ${order.owner_id}`)
    return new Response(
      JSON.stringify({ status: "ok", notification_sent: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error(`Error: ${error.message}`)
    return new Response(
      JSON.stringify({ status: "error", message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
})
