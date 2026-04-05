import { clerkClient } from "@clerk/clerk-sdk-node";

export async function POST(request) {
  try {
    const { email, password, username } = await request.json();

    const user = await clerkClient.users.createUser({
      emailAddress: [email],
      password,
      username,
    });

    return new Response(
      JSON.stringify({ success: true, userId: user.id }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}