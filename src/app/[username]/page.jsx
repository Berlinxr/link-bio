"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { username } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/user/${username}`)
      .then(res => res.json())
      .then(data => {
        if (data.found) {
          setProfileUser(data);
        } else {
          setNotFound(true);
        }
        setLoading(false);
      });
  }, [username]);

  if (loading) return <div>Yükleniyor...</div>;
  
  if (notFound) return (
    <div>
      <h1>@{username} bulunamadı</h1>
      <p>Bu kullanıcı henüz kayıt olmamış.</p>
    </div>
  );

  return (
    <div>
      <img src={profileUser.avatar} alt={profileUser.username} />
      <h1>@{profileUser.username}</h1>
    </div>
  );
}