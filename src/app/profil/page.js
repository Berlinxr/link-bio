"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faSteam, faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons";

export default function HomePage() {
  const DISCORD_ID = "755408159849447555";

  const [userData, setUserData] = useState({
    discord_user: { username: "Identity", global_name: "", avatar: "" },
    discord_status: "offline",
    activities: [],
    listening_to_spotify: false,
    spotify: {
      song: "Currently Playing Nothing...",
      artist: "Spotify Offline",
      album_art_url: "https://via.placeholder.com/60/000?text=.",
      timestamps: { start: 0, end: 0 },
    },
  });

  const updateData = async () => {
    try {
      const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
      const { data } = await response.json();
      setUserData(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    updateData();
    const interval = setInterval(updateData, 2000);
    return () => clearInterval(interval);
  }, []);

  const user = userData.discord_user;
  const ext = user.avatar?.startsWith("a_") ? ".gif" : ".png";
  const avatarUrl = user.avatar
    ? `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${user.avatar}${ext}?size=512`
    : null; // Boş string yerine null

  const custom = userData.activities.find(a => a.type === 4);
  const game = userData.activities.find(a => a.type === 0);

  const spotifyProgress = userData.listening_to_spotify
    ? Math.min(
        ((Date.now() - userData.spotify.timestamps.start) /
          (userData.spotify.timestamps.end - userData.spotify.timestamps.start)) *
          100,
        100
      )
    : 0;

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;400;900&display=swap');

        :root {
          --pure-black: #000000;
          --deep-gray: #080808;
          --border: rgba(255, 255, 255, 0.05);
          --text-main: #ffffff;
          --text-dim: #444444;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        body {
          background-color: var(--pure-black);
          color: var(--text-main);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0;
          overflow: hidden;
        }

        .dashboard-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          min-height: 100vh;
        }

        .dashboard {
          display: grid;
          grid-template-columns: 320px 400px;
          grid-template-rows: auto auto;
          gap: 15px;
          width: 95%;
          max-width: 750px;
          animation: fadeIn 1s ease-out;
          place-items: center;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .card {
          background: var(--deep-gray);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 25px;
          transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .card:hover {
          background-color: #fff;
          border-color: rgb(243, 243, 243);
          transform: translateY(-2px);
        }

        .profile-main {
          grid-row: span 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 30px 0;
        }

        #discord-avatar {
          width: 120px;
          height: 120px;
          border-radius: 30px;
          border: 1px solid var(--border);
          margin-top: 10px;
        }

        .name-box h1 {
          font-size: 1.8rem;
          font-weight: 900;
          letter-spacing: -1px;
          margin-top: 15px;
        }

        .name-box p {
          color: var(--text-dim);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 3px;
          margin-top: 5px;
        }

        .actions {
          margin-top: auto;
          display: flex;
          gap: 25px;
          justify-content: center;
          align-items: center;
          padding-top: 20px;
        }

        .actions a {
          color: #222;
          font-size: 1.3rem;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .actions a:hover {
          color: #fff;
          transform: scale(1.25);
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.4));
        }

        .activity-card {
          display: flex;
          align-items: center;
          gap: 15px;
          min-height: 110px;
        }

        .activity-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          object-fit: cover;
          background: #111;
        }

        .activity-info h4 {
          font-size: 0.6rem;
          color: var(--text-dim);
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .activity-info h2 {
          font-size: 0.95rem;
          font-weight: 700;
        }

        .activity-info p {
          font-size: 0.75rem;
          color: #666;
        }

        .spotify-bar-container {
          width: 100%;
          height: 2px;
          background: #151515;
          margin-top: 15px;
          border-radius: 2px;
        }

        #spotify-fill {
          height: 100%;
          background: #fff;
          width: 0%;
          border-radius: 2px;
          transition: width 1s linear;
        }

        .status-footer {
          grid-column: span 2;
          text-align: center;
          font-size: 0.75rem;
          color: #1a1a1a;
          margin-top: 10px;
        }

        .status-dot {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          margin-right: 6px;
        }

        .online {
          background: #fff;
          box-shadow: 0 0 8px #fff;
        }
        .idle {
          background: #333;
        }
        .dnd {
          background: #111;
          border: 1px solid #fff;
        }
        .offline {
          background: #050505;
        }

        @media (max-width: 600px) {
          .dashboard {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="dashboard-wrapper">
        <div className="dashboard">
          <div className="card profile-main">
            <div className="top-content">
              {avatarUrl && <img id="discord-avatar" src={avatarUrl} alt="Avatar" />}
              <div className="name-box">
                <h1>{user.global_name || user.username}</h1>
                <p>Not Really</p>
              </div>
            </div>

            <div className="actions">
            {[
                {icon: faDiscord, link: "https://discord.com/users/755408159849447555"},
                {icon: faSteam, link: "https://discord.com/users/755408159849447555"},
                {icon: faInstagram, link: "https://discord.com/users/755408159849447555"},
            ].map((social) => (
            <a key={social} href={social.link} target="_blank" rel="noreferrer">
                <FontAwesomeIcon icon={social.icon} />
              </a>
            ))}
            </div>
          </div>

          <div className="card activity-card" style={{ opacity: game ? "1" : "0.3" }}>
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

          <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div className="activity-card" style={{ padding: 0, border: "none", background: "none", minHeight: "auto" }}>
              <img
                id="track-art"
                className="activity-icon"
                src={userData.listening_to_spotify ? userData.spotify.album_art_url : "https://via.placeholder.com/60/000?text=."}
                alt=""
              />
              <div className="activity-info">
                <h4>On Repeat</h4>
                <h2>{userData.listening_to_spotify ? userData.spotify.song : "Currently Playing Nothing..."}</h2>
                <p>{userData.listening_to_spotify ? userData.spotify.artist : "Spotify Offline"}</p>
              </div>
            </div>
            <div className="spotify-bar-container">
              <div id="spotify-fill" style={{ width: `${spotifyProgress}%` }}></div>
            </div>
          </div>

          <div className="status-footer">
            <span className={`status-dot ${userData.discord_status}`}></span>
            <span>{custom?.state || "Initializing..."}</span>
          </div>
        </div>
      </div>
    </>
  );
}