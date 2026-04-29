"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faSteam, faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons";

export default function SpotiWidget({spotify, listening, spotifyProgress}) {

return (
          <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div className="activity-card" style={{ padding: 0, border: "none", background: "none", minHeight: "auto" }}>
              <img
                id="track-art"
                className="activity-icon"
                src={listening ? spotify.album_art_url : "https://via.placeholder.com/60/000?text=."}
                alt=""
              />
              <div className="activity-info">
                <h4>On Repeat</h4>
                <h2>{listening ? spotify.song : "Currently Playing Nothing..."}</h2>
                <p>{listening ? spotify.artist : "Spotify Offline"}</p>
              </div>
            </div>
            <div className="spotify-bar-container">
              <div id="spotify-fill" style={{ width: `${spotifyProgress}%` }}></div>
            </div>
          </div>
);
}
