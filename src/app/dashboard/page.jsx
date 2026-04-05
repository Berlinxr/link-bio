"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDiscord, faSteam, faGithub, faTwitter, faSpotify,
} from "@fortawesome/free-brands-svg-icons";
import {
  faUser, faPalette, faLink, faChartBar, faCrown,
  faSignOut, faBell, faEdit, faEye, faShare, faPencil,
  faPlus, faTrash, faBars, faXmark, faCheck,
  faFire, faGlobe, faLock,
} from "@fortawesome/free-solid-svg-icons";


const NAV_ITEMS = [
  { id: "overview", label: "Genel Bakış", icon: faChartBar },
  { id: "profile", label: "Profil", icon: faUser },
  { id: "links", label: "Linkler", icon: faLink },
  { id: "appearance", label: "Görünüm", icon: faPalette },
  { id: "premium", label: "Premium", icon: faCrown },
];

const SOCIAL_ICONS = [
  { id: "discord", icon: faDiscord, label: "Discord", color: "#5865F2", placeholder: "discord.gg/..." },
  { id: "github", icon: faGithub, label: "GitHub", color: "#6e7681", placeholder: "github.com/..." },
  { id: "twitter", icon: faTwitter, label: "Twitter", color: "#1d9bf0", placeholder: "twitter.com/..." },
  { id: "steam", icon: faSteam, label: "Steam", color: "#acdbf5", placeholder: "steamcommunity.com/..." },
  { id: "spotify", icon: faSpotify, label: "Spotify", color: "#1DB954", placeholder: "open.spotify.com/..." },
];

const THEMES = [
  { id: "dark", label: "Koyu", bg: "#121212", accent: "#b0b0b0" },
  { id: "blue", label: "Mavi", bg: "#020c1b", accent: "#38bdf8" },
  { id: "purple", label: "Mor", bg: "#0d0a1a", accent: "#a78bfa" },
  { id: "green", label: "Yeşil", bg: "#0a120a", accent: "#4ade80" },
];


function StatCard({ icon, label, value, sub }) {

  
  return (
    <div className="stat-card">
      <div className="stat-icon"><FontAwesomeIcon icon={icon} /></div>
      <div>
        <div className="stat-val">{value}</div>
        <div className="stat-label">{label}</div>
        {sub && <div className="stat-sub">{sub}</div>}
      </div>
    </div>
  );
}

function ActivityBar({ day, pct }) {
  return (
    <div className="act-bar-wrap" title={`${day}: ${pct}%`}>
      <div className="act-bar" style={{ height: pct + "%" }} />
      <div className="act-day">{day}</div>
    </div>
  );
}

export default function Dashboard() {
  const { user, isSignedIn, isLoaded } = useUser();



  const USER = {
    username: user?.username || "kullanici",
    tag: "#0001",
    bio: "developer · designer · dreamer",
    avatar: user?.imageUrl || "https://files.berlinxr.cfd/dc.png",
    views: 1832,
    followers: 241,
    profileUrl: `notreally.xyz/${user?.username || ""}`,
    plan: "free",
  };

  const [active, setActive] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [links, setLinks] = useState({ discord: "", github: "", twitter: "", steam: "", spotify: "" });
  const [bio, setBio] = useState(USER.bio);
  const [username, setUsername] = useState(USER.username);
  const [selectedTheme, setSelectedTheme] = useState("dark");
  const [profilePublic, setProfilePublic] = useState(true);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(USER.profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activity = [
    { day: "Pzt", pct: 40 }, { day: "Sal", pct: 65 }, { day: "Çar", pct: 30 },
    { day: "Per", pct: 80 }, { day: "Cum", pct: 55 }, { day: "Cmt", pct: 90 }, { day: "Paz", pct: 72 },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        :root{
          --bg:#121212;--sidebar:rgba(18,18,18,.95);--card:rgba(28,28,28,.9);
          --border:rgba(180,180,180,.09);--border-h:rgba(180,180,180,.22);
          --accent:#b0b0b0;--accent2:#888;--blue:#999;
          --text:#e0e0e0;--muted:rgba(200,200,200,.45);
          --green:#4ade80;--red:#f87171;
          --ff:'Syne',sans-serif;--mono:'DM Mono',monospace;
        }
        html,body{min-height:100vh;overflow-x:hidden;}
        body{background:var(--bg);color:var(--text);font-family:var(--ff);}

        .layout{display:flex;min-height:100vh;}

        /* ── Sidebar ── */
        .sidebar{
          width:240px;flex-shrink:0;
          background:rgba(14,14,14,.98);
          border-right:1px solid var(--border);
          display:flex;flex-direction:column;
          position:fixed;top:0;left:0;bottom:0;z-index:50;
          transition:transform .25s ease;
        }
        @media(max-width:768px){
          .sidebar{transform:translateX(-100%);}
          .sidebar.open{transform:translateX(0);}
        }

        .sidebar-logo{
          padding:24px 20px 20px;
          border-bottom:1px solid var(--border);
          display:flex;align-items:center;gap:10px;
        }
        .logo-icon{
          width:34px;height:34px;border-radius:10px;
          background:linear-gradient(135deg,#333,#555);
          display:flex;align-items:center;justify-content:center;
          font-size:15px;font-weight:800;color:#e0e0e0;
        }
        .logo-text{font-size:16px;font-weight:800;letter-spacing:-.4px;color:var(--text);}

        .sidebar-user{
          padding:16px 20px;border-bottom:1px solid var(--border);
          display:flex;align-items:center;gap:10px;
        }
        .s-avatar{
          width:36px;height:36px;border-radius:50%;overflow:hidden;
          border:1.5px solid var(--border-h);flex-shrink:0;
        }
        .s-avatar img{width:100%;height:100%;object-fit:cover;}
        .s-name{font-size:13px;font-weight:700;line-height:1.2;}
        .s-tag{font-family:var(--mono);font-size:10px;color:var(--muted);}

        .sidebar-nav{flex:1;padding:12px 10px;display:flex;flex-direction:column;gap:2px;}
        .nav-item{
          display:flex;align-items:center;gap:10px;
          padding:10px 12px;border-radius:10px;
          font-size:13px;font-weight:600;color:var(--muted);
          cursor:pointer;transition:all .18s;border:none;background:none;width:100%;text-align:left;
        }
        .nav-item:hover{color:var(--text);background:rgba(255,255,255,.04);}
        .nav-item.active{color:var(--text);background:rgba(255,255,255,.07);}
        .nav-item svg{width:14px;opacity:.7;}
        .nav-item.active svg{opacity:1;}
        .nav-item.premium-item{color:#b8a050 !important;}
        .nav-item.premium-item:hover,.nav-item.premium-item.active{background:rgba(184,160,80,.08);}

        .sidebar-footer{padding:14px 10px;border-top:1px solid var(--border);}
        .logout-btn{
          display:flex;align-items:center;gap:10px;padding:10px 12px;
          border-radius:10px;font-size:13px;color:var(--muted);
          cursor:pointer;transition:all .18s;border:none;background:none;width:100%;
        }
        .logout-btn:hover{color:#f87171;background:rgba(248,113,113,.06);}

        /* ── Main ── */
        .main{flex:1;margin-left:240px;display:flex;flex-direction:column;min-height:100vh;}
        @media(max-width:768px){.main{margin-left:0;}}

        .topbar{
          position:sticky;top:0;z-index:40;
          padding:14px 28px;display:flex;align-items:center;justify-content:space-between;
          background:rgba(12,12,12,.9);backdrop-filter:blur(16px);
          border-bottom:1px solid var(--border);
        }
        .topbar-left{display:flex;align-items:center;gap:12px;}
        .hamburger{background:none;border:none;color:var(--muted);cursor:pointer;font-size:16px;display:none;}
        @media(max-width:768px){.hamburger{display:block;}}
        .page-title{font-size:16px;font-weight:800;letter-spacing:-.3px;}
        .topbar-right{display:flex;align-items:center;gap:10px;}

        .icon-btn{
          width:34px;height:34px;border-radius:9px;
          background:rgba(255,255,255,.04);border:1px solid var(--border);
          display:flex;align-items:center;justify-content:center;
          font-size:13px;color:var(--muted);cursor:pointer;transition:all .18s;
        }
        .icon-btn:hover{color:var(--text);border-color:var(--border-h);}

        .profile-pill{
          display:flex;align-items:center;gap:8px;padding:5px 12px 5px 5px;
          border-radius:30px;background:rgba(255,255,255,.04);border:1px solid var(--border);
          font-size:12px;font-weight:600;cursor:pointer;transition:all .18s;
        }
        .profile-pill:hover{border-color:var(--border-h);}
        .pill-avatar{width:24px;height:24px;border-radius:50%;overflow:hidden;}
        .pill-avatar img{width:100%;height:100%;object-fit:cover;}

        /* ── Content ── */
        .content{padding:28px;flex:1;}

        /* ── Overview ── */
        .stats-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:24px;}
        .stat-card{
          background:var(--card);border:1px solid var(--border);border-radius:14px;
          padding:18px 20px;display:flex;align-items:center;gap:14px;
          transition:border-color .2s;
        }
        .stat-card:hover{border-color:var(--border-h);}
        .stat-icon{
          width:38px;height:38px;border-radius:10px;
          background:rgba(255,255,255,.05);border:1px solid var(--border);
          display:flex;align-items:center;justify-content:center;
          font-size:14px;color:var(--accent);flex-shrink:0;
        }
        .stat-val{font-size:22px;font-weight:800;letter-spacing:-.5px;line-height:1;}
        .stat-label{font-family:var(--mono);font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;margin-top:3px;}
        .stat-sub{font-family:var(--mono);font-size:10px;color:var(--green);margin-top:2px;}

        .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;}
        @media(max-width:900px){.grid-2{grid-template-columns:1fr;}}

        .panel{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:20px 22px;}
        .panel-title{font-size:13px;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:8px;}
        .panel-title svg{color:var(--muted);font-size:12px;}

        /* activity chart */
        .act-chart{display:flex;align-items:flex-end;gap:6px;height:80px;padding-bottom:22px;position:relative;}
        .act-bar-wrap{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;height:100%;justify-content:flex-end;}
        .act-bar{width:100%;border-radius:4px 4px 0 0;background:linear-gradient(180deg,#555,#333);min-height:4px;transition:background .2s;}
        .act-bar-wrap:hover .act-bar{background:linear-gradient(180deg,#888,#555);}
        .act-day{font-family:var(--mono);font-size:9px;color:var(--muted);position:absolute;bottom:0;}

        /* profile preview mini */
        .mini-profile{
          background:rgba(10,10,10,.8);border:1px solid var(--border);border-radius:14px;overflow:hidden;
        }
        .mini-banner{height:56px;background:linear-gradient(135deg,#1a1a1a,#2a2a2a);position:relative;}
        .mini-body{padding:0 16px 16px;}
        .mini-av{
          width:48px;height:48px;border-radius:50%;overflow:hidden;
          border:2px solid rgba(18,18,18,.9);margin-top:-24px;margin-bottom:8px;
        }
        .mini-av img{width:100%;height:100%;object-fit:cover;}
        .mini-name{font-size:14px;font-weight:800;margin-bottom:2px;}
        .mini-bio{font-family:var(--mono);font-size:10px;color:var(--muted);margin-bottom:10px;}
        .mini-links{display:flex;gap:6px;}
        .mini-link{
          width:26px;height:26px;border-radius:6px;
          background:rgba(255,255,255,.05);border:1px solid var(--border);
          display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--accent);
        }

        .url-row{
          display:flex;align-items:center;gap:8px;
          background:rgba(10,10,10,.8);border:1px solid var(--border);
          border-radius:10px;padding:10px 14px;margin-bottom:16px;
        }
        .url-text{font-family:var(--mono);font-size:12px;color:var(--muted);flex:1;}
        .url-text span{color:var(--text);}
        .url-btn{
          padding:5px 12px;border-radius:7px;font-size:11px;font-weight:600;
          font-family:var(--mono);border:none;cursor:pointer;transition:all .18s;
        }
        .url-view{background:rgba(255,255,255,.07);color:var(--text);}
        .url-copy{background:rgba(180,180,180,.1);color:var(--accent);}
        .url-view:hover,.url-copy:hover{opacity:.8;}

        /* ── Form stuff ── */
        .section-head{font-size:15px;font-weight:800;margin-bottom:4px;letter-spacing:-.3px;}
        .section-sub{font-family:var(--mono);font-size:11px;color:var(--muted);margin-bottom:20px;}

        .form-group{margin-bottom:16px;}
        .form-label{font-family:var(--mono);font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:7px;display:block;}
        .form-input{
          width:100%;padding:11px 14px;border-radius:11px;
          background:rgba(10,10,10,.8);border:1px solid var(--border);
          color:var(--text);font-family:var(--mono);font-size:13px;
          outline:none;transition:border-color .2s;
        }
        .form-input:focus{border-color:var(--border-h);}
        .form-input::placeholder{color:var(--muted);}
        textarea.form-input{resize:vertical;min-height:80px;}

        .toggle-row{
          display:flex;align-items:center;justify-content:space-between;
          padding:14px 16px;background:rgba(10,10,10,.6);
          border:1px solid var(--border);border-radius:11px;margin-bottom:12px;
        }
        .toggle-info{font-size:13px;font-weight:600;}
        .toggle-desc{font-family:var(--mono);font-size:10px;color:var(--muted);margin-top:2px;}
        .toggle{
          width:40px;height:22px;border-radius:11px;
          background:${profilePublic ? "rgba(180,180,180,.4)" : "rgba(255,255,255,.1)"};
          position:relative;cursor:pointer;border:none;transition:background .2s;flex-shrink:0;
        }
        .toggle::after{
          content:'';position:absolute;width:16px;height:16px;border-radius:50%;
          background:#e0e0e0;top:3px;
          left:${profilePublic ? "21px" : "3px"};transition:left .2s;
        }

        /* links */
        .link-card{
          display:flex;align-items:center;gap:12px;
          padding:12px 16px;background:rgba(10,10,10,.7);
          border:1px solid var(--border);border-radius:12px;margin-bottom:10px;
          transition:border-color .2s;
        }
        .link-card:hover{border-color:var(--border-h);}
        .link-icon-wrap{
          width:34px;height:34px;border-radius:9px;
          display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;
        }
        .link-name{font-size:12px;font-weight:700;margin-bottom:2px;}
        .link-input{
          flex:1;background:rgba(255,255,255,.04);border:1px solid var(--border);
          border-radius:8px;padding:7px 10px;
          font-family:var(--mono);font-size:11px;color:var(--text);outline:none;
          transition:border-color .2s;
        }
        .link-input:focus{border-color:var(--border-h);}
        .link-input::placeholder{color:var(--muted);}

        /* themes */
        .themes-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:24px;}
        @media(max-width:600px){.themes-grid{grid-template-columns:repeat(2,1fr);}}
        .theme-btn{
          padding:14px;border-radius:12px;border:1.5px solid var(--border);
          cursor:pointer;transition:all .2s;text-align:center;
          display:flex;flex-direction:column;align-items:center;gap:8px;
          background:rgba(10,10,10,.7);
        }
        .theme-btn.selected{border-color:rgba(180,180,180,.5);background:rgba(255,255,255,.05);}
        .theme-circle{width:28px;height:28px;border-radius:50%;border:2px solid rgba(255,255,255,.1);}
        .theme-label{font-size:11px;font-weight:600;color:var(--muted);}
        .theme-btn.selected .theme-label{color:var(--text);}

        /* premium */
        .premium-card{
          background:linear-gradient(135deg,rgba(28,24,8,.9),rgba(20,16,4,.9));
          border:1px solid rgba(184,160,80,.2);border-radius:18px;padding:28px;
          margin-bottom:16px;position:relative;overflow:hidden;
        }
        .premium-card::before{
          content:'';position:absolute;inset:0;
          background:radial-gradient(ellipse at 80% 20%,rgba(184,160,80,.07),transparent 60%);
          pointer-events:none;
        }
        .premium-badge{
          display:inline-flex;align-items:center;gap:6px;
          font-family:var(--mono);font-size:10px;text-transform:uppercase;letter-spacing:.1em;
          color:#b8a050;background:rgba(184,160,80,.1);border:1px solid rgba(184,160,80,.2);
          border-radius:20px;padding:4px 12px;margin-bottom:16px;
        }
        .premium-title{font-size:22px;font-weight:800;letter-spacing:-.5px;margin-bottom:8px;}
        .premium-sub{font-family:var(--mono);font-size:12px;color:var(--muted);line-height:1.65;margin-bottom:20px;}
        .premium-features{display:flex;flex-direction:column;gap:8px;margin-bottom:24px;}
        .pf-item{display:flex;align-items:center;gap:10px;font-size:13px;}
        .pf-item svg{color:#b8a050;font-size:11px;flex-shrink:0;}
        .premium-btn{
          display:inline-block;padding:12px 32px;border-radius:12px;
          background:linear-gradient(135deg,#b8a050,#9a8040);
          color:#1a1400;font-weight:700;font-size:14px;border:none;cursor:pointer;
          transition:all .2s;letter-spacing:-.2px;
        }
        .premium-btn:hover{opacity:.9;transform:translateY(-1px);}

        /* save btn */
        .save-btn{
          padding:11px 28px;border-radius:11px;font-size:13px;font-weight:700;
          background:rgba(255,255,255,.09);border:1px solid var(--border-h);
          color:var(--text);cursor:pointer;transition:all .2s;font-family:var(--ff);
          display:flex;align-items:center;gap:8px;
        }
        .save-btn:hover{background:rgba(255,255,255,.14);}
        .save-btn.saved{background:rgba(74,222,128,.1);border-color:rgba(74,222,128,.25);color:#4ade80;}

        .divider{height:1px;background:var(--border);margin:20px 0;}

        /* overlay */
        .overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:45;display:none;}
        @media(max-width:768px){.overlay.open{display:block;}}
      `}</style>

      <div className="layout">
        {/* Overlay */}
        <div className={`overlay${sidebarOpen ? " open" : ""}`} onClick={() => setSidebarOpen(false)} />

        {/* SIDEBAR */}
        <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
          <div className="sidebar-logo">
            <div className="logo-icon">N</div>
            <div className="logo-text">NotReally</div>
          </div>

          <div className="sidebar-user">
            <div className="s-avatar">
              <img src={USER.avatar} alt="avatar" />
            </div>
            <div>
              <div className="s-name">{USER.username}</div>
              <div className="s-tag">{USER.tag}</div>
            </div>
          </div>

          <nav className="sidebar-nav">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`nav-item${active === item.id ? " active" : ""}${item.id === "premium" ? " premium-item" : ""}`}
                onClick={() => { setActive(item.id); setSidebarOpen(false); }}
              >
                <FontAwesomeIcon icon={item.icon} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <button className="logout-btn">
              <FontAwesomeIcon icon={faSignOut} />
              Çıkış Yap
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main">
          {/* TOPBAR */}
          <div className="topbar">
            <div className="topbar-left">
              <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <FontAwesomeIcon icon={sidebarOpen ? faXmark : faBars} />
              </button>
              <div className="page-title">
                {NAV_ITEMS.find(n => n.id === active)?.label}
              </div>
            </div>
            <div className="topbar-right">
              <div className="icon-btn"><FontAwesomeIcon icon={faBell} /></div>
              <div className="profile-pill">
                <div className="pill-avatar"><img src={USER.avatar} alt="" /></div>
                {USER.username}
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="content">

            {/* ── OVERVIEW ── */}
            {active === "overview" && (
              <>
                <div className="stats-row">
                  <StatCard icon={faEye} label="Profil Görüntülenme" value="1,832" sub="↑ %12 bu hafta" />
                  <StatCard icon={faUser} label="Takipçi" value="241" sub="↑ 18 yeni" />
                  <StatCard icon={faFire} label="Günlük Ziyaret" value="94" sub="bugün" />
                  <StatCard icon={faGlobe} label="Benzersiz Ziyaretçi" value="3.1K" />
                </div>

                <div className="grid-2">
                  <div className="panel">
                    <div className="panel-title"><FontAwesomeIcon icon={faChartBar} /> Haftalık Aktivite</div>
                    <div className="act-chart">
                      {activity.map((a, i) => (
                        <div key={i} className="act-bar-wrap">
                          <div className="act-bar" style={{ height: a.pct + "%" }} />
                          <div className="act-day" style={{ position: "static", marginTop: 4 }}>{a.day}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="panel">
                    <div className="panel-title"><FontAwesomeIcon icon={faUser} /> Profil Önizleme</div>
                    <div className="url-row">
                      <div className="url-text">notreally.xyz/<span>{USER.username.toLowerCase()}</span></div>
                      <button className="url-btn url-copy" onClick={handleCopy}>
                        {copied ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faPencil} />}
                      </button>
                      <button className="url-btn url-view" onClick={() => {}}>
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button className="url-btn url-copy" onClick={handleCopy}>
                        {copied ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faShare} />}
                      </button>

                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── PROFİL ── */}
            {active === "profile" && (
              <>
                <div className="section-head">Profil Bilgileri</div>
                <div className="section-sub">Profilinde görünecek bilgileri düzenle</div>

                <div className="form-group">
                  <label className="form-label">Kullanıcı Adı</label>
                  <input className="form-input" value={username} onChange={e => setUsername(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea className="form-input" value={bio} onChange={e => setBio(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Konum</label>
                  <input className="form-input" placeholder="İstanbul, Türkiye" />
                </div>
                <div className="form-group">
                  <label className="form-label">Website</label>
                  <input className="form-input" placeholder="https://..." />
                </div>

                <div className="divider" />

                <div className="toggle-row" onClick={() => setProfilePublic(!profilePublic)}>
                  <div>
                    <div className="toggle-info">
                      <FontAwesomeIcon icon={profilePublic ? faGlobe : faLock} style={{ marginRight: 8, fontSize: 12 }} />
                      Profil {profilePublic ? "Herkese Açık" : "Gizli"}
                    </div>
                    <div className="toggle-desc">Profilini herkes görebilsin mi?</div>
                  </div>
                  <button className="toggle" style={{ background: profilePublic ? "rgba(180,180,180,.4)" : "rgba(255,255,255,.08)" }} />
                </div>

                <button className={`save-btn${saved ? " saved" : ""}`} onClick={handleSave}>
                  <FontAwesomeIcon icon={saved ? faCheck : faEdit} />
                  {saved ? "Kaydedildi!" : "Değişiklikleri Kaydet"}
                </button>
              </>
            )}

            {/* ── LİNKLER ── */}
            {active === "links" && (
              <>
                <div className="section-head">Sosyal Linkler</div>
                <div className="section-sub">Profilinde gösterilecek platformları ekle</div>

                {SOCIAL_ICONS.map((s) => (
                  <div key={s.id} className="link-card">
                    <div className="link-icon-wrap" style={{ background: s.color + "18", color: s.color }}>
                      <FontAwesomeIcon icon={s.icon} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="link-name">{s.label}</div>
                      <input
                        className="link-input"
                        placeholder={s.placeholder}
                        value={links[s.id]}
                        onChange={e => setLinks({ ...links, [s.id]: e.target.value })}
                      />
                    </div>
                    <div style={{ fontSize: 12, color: links[s.id] ? "#4ade80" : "var(--muted)", flexShrink: 0 }}>
                      <FontAwesomeIcon icon={links[s.id] ? faCheck : faPlus} />
                    </div>
                  </div>
                ))}

                <div className="divider" />

                <button className={`save-btn${saved ? " saved" : ""}`} onClick={handleSave}>
                  <FontAwesomeIcon icon={saved ? faCheck : faEdit} />
                  {saved ? "Kaydedildi!" : "Değişiklikleri Kaydet"}
                </button>
              </>
            )}

            {/* ── GÖRÜNÜM ── */}
            {active === "appearance" && (
              <>
                <div className="section-head">Tema</div>
                <div className="section-sub">Profilin için bir renk teması seç</div>

                <div className="themes-grid">
                  {THEMES.map((t) => (
                    <div
                      key={t.id}
                      className={`theme-btn${selectedTheme === t.id ? " selected" : ""}`}
                      onClick={() => setSelectedTheme(t.id)}
                    >
                      <div className="theme-circle" style={{ background: `linear-gradient(135deg, ${t.bg}, ${t.accent})` }} />
                      <div className="theme-label">{t.label}</div>
                    </div>
                  ))}
                </div>

                <div className="divider" />

                <div className="section-head" style={{ marginBottom: 4 }}>Layout</div>
                <div className="section-sub">Profil düzeni</div>

                <div className="themes-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
                  {["Klasik", "Kompakt", "Geniş"].map((l) => (
                    <div key={l} className={`theme-btn${l === "Klasik" ? " selected" : ""}`}>
                      <div className="theme-label" style={{ fontSize: 13, color: "var(--text)" }}>{l}</div>
                    </div>
                  ))}
                </div>

                <div className="divider" />

                <button className={`save-btn${saved ? " saved" : ""}`} onClick={handleSave}>
                  <FontAwesomeIcon icon={saved ? faCheck : faPalette} />
                  {saved ? "Kaydedildi!" : "Temayı Kaydet"}
                </button>
              </>
            )}

            {/* ── PREMİUM ── */}
            {active === "premium" && (
              <>
                <div className="premium-card">
                  <div className="premium-badge"><FontAwesomeIcon icon={faCrown} /> Premium</div>
                  <div className="premium-title">Profilini üst seviyeye taşı</div>
                  <div className="premium-sub">
                    Özel temalar, sınırsız link, gelişmiş istatistikler ve çok daha fazlası.
                  </div>
                  <div className="premium-features">
                    {["Özel CSS & Tema Editörü", "Sınırsız Sosyal Link", "Gelişmiş Ziyaretçi İstatistikleri", "Özel Domain Desteği", "Reklamsız Profil", "Öncelikli Destek"].map(f => (
                      <div key={f} className="pf-item">
                        <FontAwesomeIcon icon={faCheck} />
                        {f}
                      </div>
                    ))}
                  </div>
                  <button className="premium-btn">
                    <FontAwesomeIcon icon={faCrown} style={{ marginRight: 8 }} />
                    Premium'a Geç — ₺49/ay
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
}