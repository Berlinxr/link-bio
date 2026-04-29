"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faSteam, faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons";

export default function DiscordWidget({game}) {

return (
<div className="card activity-card" style={{ opacity: "1" }}>
            <img
              id="game-icon"
              className="activity-icon"
              src={
                game?.assets?.large_image
                  ? game.assets.large_image.includes("external")
                    ? `https://media.discordapp.net/external/${game.assets.large_image.split("mp:external/")[1]}`
                    : `https://cdn.discordapp.com/app-assets/${game.application_id}/${game.assets.large_image}.png`
                  : "https://via.placeholder.com/60/000?text=X"
              }
              alt=""
            />
            <div className="activity-info">
              <h4>Currently Playing</h4>
              <h2>{game?.name || "Not Active"}</h2>
              <p>{game?.details || "Offline Mode"}</p>
            </div>
          </div>
);
}
