"use client";
import { useUser } from "@clerk/nextjs";

export default function Controle() {
  const { user, isSignedIn, isLoaded } = useUser();

  // 🔥 BU ŞART
  if (!isLoaded) return <p>Yükleniyor...</p>;

  if (!isSignedIn) return <p>Giriş yapılmamış</p>;

  return (
    <div>
      <h1>Merhaba {user.username}</h1>
      <p>Email: {user.emailAddresses[0].emailAddress}</p>
    </div>
  );
}