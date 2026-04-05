import { clerkClient } from "@clerk/nextjs/server";

export async function GET(req, { params }) {
  const { username } = await params; // await ekle
  
  try {
    const client = await clerkClient();
    const users = await client.users.getUserList({ limit: 10 });
    
    const found = users.data.find(u => u.username === username);
    
    if (!found) {
      return Response.json({ found: false }, { status: 404 });
    }
    
    return Response.json({
      found: true,
      username: found.username,
      avatar: found.imageUrl,
      createdAt: found.createdAt,
    });
  } catch (err) {
    console.log("CLERK HATA:", err);
    return Response.json({ found: false }, { status: 404 });
  }
}   