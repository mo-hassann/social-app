import { Webhook } from "svix";
import { headers } from "next/headers";
import type { WebhookEvent, UserJSON } from "@clerk/nextjs/server";
import client from "@/lib/client";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local");
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  // Do something with the payload
  // For this guide, you simply log the payload to the console
  const { id, email_addresses, first_name, image_url } = evt?.data as UserJSON;

  const eventType = evt.type;
  console.log("EVENT TYPE: ", eventType);
  if (eventType === "user.created" || eventType === "user.updated") {
    try {
      client.api.user.create.$post({ json: { id, email: email_addresses[0]?.email_address, name: first_name, pictureLink: image_url } });
      return new Response("user created successful", { status: 200 });
    } catch (error) {
      const cause = (error instanceof Error && error.message) || undefined;
      console.log("SERVER ERROR. CAUSE: ", cause);
      return new Response("something went wrong while creating the user", { status: 400 });
    }
  }
}
