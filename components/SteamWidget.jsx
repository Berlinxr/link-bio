"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faSteam, faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons";


export default function SteamWidget({steamId}) {
    const [data, setData] = useState(null);

useEffect(() => {
  fetch(`/api/steam/${steamId}`)
    .then(res => res.json())
    .then(d => setData(d));
}, [steamId]);

return (
          <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div className="activity-card" style={{ padding: 0, border: "none", background: "none", minHeight: "auto" }}>
              <img
                id="track-art"
                className="activity-icon"
                src={data?.profile?.avatar || "https://via.placeholder.com/60/000?text=S"}
                alt=""
              />
              <div className="activity-info">
                <h4>On Steam</h4>
                <h2>{data?.profile?.username || "Steam Hesabı Bulunamadı."}</h2>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <img 
                    src={`https://media.steampowered.com/steamcommunity/public/images/apps/${data?.lastPlayed?.appid}/${data?.lastPlayed?.img_icon_url}.jpg`}
                    style={{ width: "20px", height: "20px", borderRadius: "4px" }}
                    alt=""
                />
                <span>{data?.lastPlayed?.name || "-"} oynandı</span>
                </div>              </div>
            </div>

          </div>
);
}