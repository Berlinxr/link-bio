import { Webhook } from "svix";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  // ... geri kalan aynı
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.log("Webhook doğrulama hatası:", err);
    return new Response("Unauthorized", { status: 401 });
  }

  const { type, data } = evt;

  if (type === "user.created") {
    await supabaseAdmin.from("users").insert({
      id: data.id,
      username: data.username,
      avatar_url: data.image_url,
    });
  }

  if (type === "user.updated") {
    await supabaseAdmin.from("users").update({
      username: data.username,
      avatar_url: data.image_url,
    }).eq("id", data.id);
  }

  if (type === "user.deleted") {
    await supabaseAdmin.from("users").delete().eq("id", data.id);
  }

  return new Response("OK", { status: 200 });
}