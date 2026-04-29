"use client";
import { useState, useEffect } from "react";

export default function ValoWidget({ name, tag }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/valorant/svior-wfx`)
      .then(res => res.json())
      .then(d => setData(d));
  }, [name, tag]);

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div className="activity-card" style={{ padding: 0, border: "none", background: "none", minHeight: "auto" }}>
        <img
          className="activity-icon"
          src={data?.account?.data?.card?.small || "https://via.placeholder.com/60/000?text=V"}
          alt=""
        />
        <div className="activity-info">
          <h4>Valorant Stats</h4>
          <h2>{data?.account?.data?.name + "#" + data?.account?.data?.tag || "Hesap Bulunamadı"}</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>{"Rank: " + data?.rank || "-"}</span>
            <img 
  src={data?.rankIcon}
  style={{ width: "20px", height: "20px" }}
  alt="rank"
/>
          </div>
          <div style={{ display: "flex", gap: "4px", marginTop: "6px" }}>
            {data?.matches?.map((match, i) => {
              const myPlayer = match.players.all_players.find(p =>
                p.name === name && p.tag === tag
              );
              const myTeam = myPlayer?.team?.toLowerCase();
              const won = match.teams[myTeam]?.has_won;
              return (
                <div key={i} style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "3px",
                  background: won ? "#4ade80" : "#f87171"
                }} />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
