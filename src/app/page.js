"use client";
 
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faSteam, faGithub, faTwitter, faSpotify } from "@fortawesome/free-brands-svg-icons";
import {
  faUser, faPalette, faLink, faChartBar, faBolt, faCrown,
  faSignOut, faBell, faEdit, faEye, faShare, faPencil,
  faPlus, faTrash,  faBars, faXmark, faCheck,
  faFire, faGlobe, faLock, faPuzzlePiece
} from "@fortawesome/free-solid-svg-icons";
 
const STATS = [
  { value: "12K+", label: "Kullanıcı" },
  { value: "48K+", label: "Profil Görüntülenme" },
];
 
const FEATURES = [
  { icon: faBolt, title: "Anında Kurulum", desc: "Saniyeler içinde kendi profilini oluştur. Kayıt ol, link al, paylaş." },
  { icon: faPalette, title: "Tam Özelleştirme", desc: "Renkler, layoutlar, rozetler — her şey senin kontrolünde." },
  { icon: faLink, title: "Tüm Platformlar", desc: "Discord, GitHub, Spotify ve daha fazlasını tek linkte topla." },
  { icon: faChartBar, title: "Canlı İstatistikler", desc: "Profilini kaç kişinin gördüğünü gerçek zamanlı takip et." },
];
 
function AnimatedCounter({ target, duration = 1400 }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef(null);
  const ran = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !ran.current) {
        ran.current = true;
        const num = parseFloat(target.replace(/[^0-9.]/g, ""));
        const suffix = target.replace(/[0-9.]/g, "");
        let cur = 0;
        const steps = 50;
        const inc = num / steps;
        const iv = setInterval(() => {
          cur += inc;
          if (cur >= num) { setDisplay(target); clearInterval(iv); }
          else setDisplay((cur < 10 ? cur.toFixed(1) : Math.floor(cur)) + suffix);
        }, duration / steps);
        obs.disconnect();
      }
    }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{display}</span>;
}
 
export default function HomePage() {
  const [mounted] = useState(false);
  const [username, setUsername] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
 

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        :root{
          --bg:#000000;
          --card:rgba(255,255,255,.04);
          --border:rgba(255,255,255,.08);
          --border-h:rgba(255,255,255,.2);
          --accent:#ffffff;
          --accent2:#cccccc;
          --blue:#ffffff;
          --text:#ffffff;
          --muted:rgba(255,255,255,.5);
          --ff:'Syne',sans-serif;
          --mono:'DM Mono',monospace;
        }
        html,body{
          min-height:100vh;
          overflow-x:hidden;
          scroll-behavior:smooth;
        }

        body{
          background:var(--bg);
          color:var(--text);
          font-family:var(--ff);
        }

 
        .bg-grid{
          position:fixed;
          inset:0;
          pointer-events:none;
          z-index:0;
          background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px);
          background-size:52px 52px;
        }

        .bg-orb{
          position:fixed;
          border-radius:50%;
          filter:blur(90px);
          pointer-events:none;
          z-index:0;
        }
 
        nav{
          position:fixed;
          top:0;
          left:0;
          right:0;
          z-index:100;
          padding:18px 48px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          background:rgba(2,12,27,.75);
          backdrop-filter:blur(20px);
          border-bottom:1px solid var(--border);
         }
        
        .logo {
          display: flex;
          align-items: center;
          gap: 8px; /* svg ile yazı arası boşluk */
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -.5px;
          background: linear-gradient(135deg,var(--blue),var(--accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-decoration: none;
        }

        .nav-links{display:flex;align-items:center;gap:28px;}
        .nav-link{font-size:13px;color:var(--muted);text-decoration:none;font-family:var(--mono);letter-spacing:.04em;transition:color .2s;}
        .nav-link:hover{color:var(--text);}
        .nav-cta{font-size:13px;font-weight:600;padding:8px 20px;border-radius:10px;background:linear-gradient(135deg,rgba(103, 103, 103, 0.1),rgba(51, 51, 51, 0.1));border:1px solid var(--border-h);color:var(--accent);text-decoration:none;transition:all .2s;font-family:var(--mono);}
        .nav-cta:hover{background:linear-gradient(135deg,rgba(52, 52, 52, 0.1),rgba(52, 52, 52, 0.2));}
 
        .hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:120px 24px 80px;position:relative;z-index:1;}
        .hero-badge{display:inline-flex;align-items:center;gap:8px;font-family:var(--mono);font-size:11px;letter-spacing:.1em;padding:6px 16px;border-radius:20px;margin-bottom:32px;background:rgba(56,189,248,.06);border:1px solid rgba(56,189,248,.18);color:var(--accent);text-transform:uppercase;animation:fadeUp .6s ease both;}
        .badge-dot{width:6px;height:6px;border-radius:50%;background:var(--accent);animation:blink 1.5s ease-in-out infinite;}
        .hero-title{font-size:clamp(46px,8vw,88px);font-weight:800;letter-spacing:-2.5px;line-height:1;margin-bottom:24px;animation:fadeUp .6s .1s ease both;}
        .hero-title span{background:linear-gradient(135deg,var(--blue) 0%,var(--accent) 50%,var(--accent2) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
        .hero-sub{font-size:clamp(15px,2vw,18px);color:var(--muted);max-width:520px;line-height:1.7;margin-bottom:48px;animation:fadeUp .6s .2s ease both;}
 
        .claim-wrap{display:flex;align-items:center;background:rgba(4,18,40,.9);border:1px solid ${inputFocused ? "rgba(255,255,255,0.25)" : "var(--border)"};border-radius:14px;padding:6px 6px 6px 20px;max-width:420px;width:100%;transition:border-color .2s,box-shadow .2s;box-shadow:${inputFocused ? "0 0 0 2px rgba(255,255,255,0.06)" : "none"};animation:fadeUp .6s .3s ease both;backdrop-filter:blur(12px);}
        .claim-prefix{font-family:var(--mono);font-size:13px;color:var(--accent);white-space:nowrap;margin-right:4px;user-select:none;}
        .claim-input{flex:1;background:transparent;border:none;outline:none;font-family:var(--mono);font-size:13px;color:var(--text);padding:8px 0;min-width:0;}
        .claim-input::placeholder{color:var(--muted);}
        .claim-btn{padding:10px 20px;border-radius:10px;background:linear-gradient(135deg, #606060 , #7b7b7b);border:none;color:#fff;font-family:var(--mono);font-size:13px;font-weight:600;white-space:nowrap;}
        .claim-btn:hover{background:linear-gradient(135deg, #a7a7a7 , #aeaeae );transform:translateY(-1px);}
 
        .stats-section {
          position: relative;
          z-index: 1;
          padding: 0 24px 80px;
          display: flex;
          justify-content: center;
        }

        .stats-grid {
          display: flex;
          gap: 1px;
          background: rgba(180,180,180,.1);
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid rgba(180,180,180,.1);
          max-width: 600px;
          width: 100%;
        }

        .stat-box {
          flex: 1;
          padding: 28px 20px;
          text-align: center;
          background: rgba(40,40,40,.85);
          transition: background .2s;
        }

        .stat-box:hover {
          background: rgba(70,70,70,.4);
        }

        .stat-val {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -1px;
          display: block;
          background: linear-gradient(135deg,#999999,#b0b0b0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-label {
          font-family: var(--mono);
          font-size: 11px;
          color: rgba(200,200,200,.5);
          text-transform: uppercase;
          letter-spacing: .1em;
          margin-top: 4px;
          display: block;
        } 
        .features-section{position:relative;z-index:1;padding:0 24px 100px;max-width:900px;margin:0 auto;}
        .section-label{text-align:center;font-family:var(--mono);font-size:11px;text-transform:uppercase;letter-spacing:.15em;color:var(--accent);margin-bottom:16px;}
        .section-title{text-align:center;font-size:clamp(28px,4vw,40px);font-weight:800;letter-spacing:-1px;margin-bottom:56px;}
        .features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;}
        .feature-card{background:var(--card);border:1px solid var(--border);border-radius:18px;padding:28px 24px;transition:all .25s ease;backdrop-filter:blur(16px);position:relative;overflow:hidden;}
        .feature-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(56,189,248,.05),transparent);opacity:0;transition:opacity .3s;}
        .feature-card:hover{border-color:var(--border-h);transform:translateY(-4px);box-shadow:0 20px 60px rgba(0,0,0,.3);}
        .feature-card:hover::before{opacity:1;}
        .feat-icon{font-size:28px;margin-bottom:16px;display:block;}
        .feat-title{font-size:16px;font-weight:700;margin-bottom:8px;}
        .feat-desc{font-size:13px;color:var(--muted);line-height:1.65;font-family:var(--mono);}
 
        .preview-section{position:relative;z-index:1;padding:0 24px 120px;display:flex;flex-direction:column;align-items:center;}
        .preview-card{width:100%;max-width:340px;background:rgba(18, 18, 18, 0.8);border:1px solid var(--border);border-radius:22px;overflow:hidden;backdrop-filter:blur(24px);box-shadow:0 40px 100px rgba(0,0,0,.5);animation:float 6s ease-in-out infinite;}
        .preview-top-line{height:2px;background:linear-gradient(90deg,transparent,var(--accent),var(--accent2),transparent);background-size:200% 100%;animation:slideGrad 3s linear infinite;}
        .preview-banner{height:80px;background:linear-gradient(135deg,#111 0%,#222 50%,#111 100%);position:relative;overflow:hidden;}
        .preview-banner::after{content:'';position:absolute;inset:0;background:repeating-linear-gradient(45deg,transparent,transparent 20px,rgba(96,165,250,.04) 20px,rgba(96,165,250,.04) 21px);}
        .preview-body{padding:0 22px 22px;}
        .preview-avatar{width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#1a4d8c,#2d7dd2);position:relative;border:3px solid rgba(4,18,40,.9);margin-top:-32px;margin-bottom:10px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;box-shadow:0 0 0 2px rgba(255,255,255,.15);}
        .preview-name{font-size:18px;font-weight:800;margin-bottom:2px;}
        .preview-bio{font-family:var(--mono);font-size:11px;color:var(--muted);margin-bottom:16px;}
        .preview-links{display:flex;gap:8px;}
        .preview-link{width:32px;height:32px;border-radius:8px;background:rgba(255,255,255,.05);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;font-family:var(--mono);color:var(--blue);transition:all .2s;}
        .preview-link:hover{background:rgba(148, 148, 148, 0.14);border-color:var(--border-h);}
 
        .cta-section{position:relative;z-index:1;padding:0 24px 100px;text-align:center;}
        .cta-box{max-width:580px;margin:0 auto;padding:64px 40px;background:rgba(33, 33, 33, 0.6);border:1px solid var(--border);border-radius:24px;backdrop-filter:blur(20px);position:relative;overflow:hidden;}
        .cta-box::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(255, 255, 255, 0.08) 0%,transparent 70%);pointer-events:none;}
        .cta-title{font-size:clamp(24px,4vw,36px);font-weight:800;letter-spacing:-1px;margin-bottom:12px;}
        .cta-sub{color:var(--muted);font-size:14px;font-family:var(--mono);margin-bottom:32px;line-height:1.6;}
        .cta-big-btn{display:inline-block;padding:14px 40px;border-radius:14px;font-size:15px;font-weight:700;text-decoration:none;background:linear-gradient(135deg,#444,#888);color:#fff;transition:all .25s;letter-spacing:-.2px;box-shadow:0 14px 40px rgba(255,255,255,.35);}
        .cta-big-btn:hover{transform:translateY(-2px);box-shadow:0 14px 40px rgba(255,255,255,.2);}
 
        footer{position:relative;z-index:1;border-top:1px solid var(--border);padding:28px 48px;display:flex;align-items:center;justify-content:space-between;font-family:var(--mono);font-size:11.5px;color:var(--muted);}
 
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        @keyframes blink{0%,100%{opacity:1;}50%{opacity:.3;}}
        @keyframes float{0%,100%{transform:translateY(0) rotate(-1deg);}50%{transform:translateY(-14px) rotate(1deg);}}
        @keyframes slideGrad{0%{background-position:0% 0;}100%{background-position:200% 0;}}
      `}</style>
 

 
      <div className="bg-grid" />
      <div className="bg-orb" style={{ width:700,height:700,background:"radial-gradient(circle,rgba(255, 255, 255, 0.72),transparent 70%)",top:-200,left:-200 }} />
      <div className="bg-orb" style={{ width:500,height:500,background:"radial-gradient(circle,rgba(255, 255, 255, 0.72),transparent 70%)",bottom:-100,right:-100 }} />
 
      <nav>
        <a href="/" className="logo">  <svg 
  width="25" 
  height="25" 
  viewBox="0 0 512 512"
>
  <path
    d="M496.123,167.12c-4.457-12.064-9.825-23.73-15.992-34.864c-11.674-21.088-26.21-40.373-43.13-57.261 c-0.413-0.413-0.754-0.762-1.167-1.175h-0.028c-0.48-0.476-0.937-0.936-1.445-1.404l-0.035-0.024 c-1.449-1.445-2.948-2.881-4.457-4.223C384.25,25.859,323.069,0.002,255.998,0.002c-38.948,0-75.912,8.722-108.972,24.302 c-2.27,1.071-4.532,2.174-6.754,3.31c-24.25,12.309-46.277,28.356-65.281,47.381c-27.793,27.761-49.214,61.951-61.924,100.11 c-0.639,1.921-1.27,3.873-1.861,5.817l-0.076,0.215c-0.405,1.317-0.793,2.682-1.174,4.032c-0.944,3.23-1.806,6.46-2.592,9.754 c-0.31,1.135-0.563,2.278-0.818,3.437C2.262,216.882,0,236.183,0,256c0,70.627,28.682,134.73,74.991,181.007 c26.06,26.048,57.75,46.531,93.075,59.483c1.099,0.405,2.222,0.81,3.36,1.182c6.75,2.381,13.655,4.468,20.659,6.27 c1.222,0.31,2.468,0.619,3.718,0.889c19.314,4.69,39.488,7.166,60.194,7.166c70.634,0,134.725-28.674,181.003-74.991 c8.492-8.468,16.36-17.524,23.559-27.127C492.834,367.055,512,313.706,512,256C512,224.771,506.385,194.818,496.123,167.12z M94.789,417.221C53.512,375.897,28.015,319,28.015,256c0-11.643,0.87-23.056,2.552-34.206 c7.766,5.429,21.932,13.024,22.111,13.064c0.531,0.167,1.142,0.254,1.881,0.254c1.147,0,2.524-0.206,3.948-0.436 c1.504-0.222,3.036-0.444,4.254-0.444c0.381,0,0.742,0.016,1.028,0.071c0.527,0.238,1.393,2.238,1.849,3.31 c0.945,2.159,1.913,4.396,3.905,5.373c1.849,0.936,5.849,1.421,11.71,2.047c1.941,0.215,3.925,0.453,4.944,0.619 c0.381,0.698,0.845,2.405,1.151,3.596c0.893,3.349,1.778,6.77,4.329,8.294c2.116,1.294,9.016,7.857,12.866,11.722 c0.508,0.492,1.146,0.746,1.809,0.746c0.425,0,0.889-0.103,1.27-0.357c0.306-0.175,7.027-4.111,9.373-5.579 c0.488,0.158,1.353,0.706,2.139,1.381c0.123,3.69,0.591,15.897,0.614,18.365c-0.432,1.532-5.555,6.856-11.206,11.634 c-0.559,0.468-0.9,1.127-0.92,1.833c-0.024,0.698-0.636,16.817,0,23.294c0.666,6.563,11.436,19.389,14.333,22.722 c1.226,3.326,4.567,12.175,5.842,14.072c1.273,1.912,14.19,11.603,22.495,17.738v38.19c0,4.278,1.671,7.071,3.004,9.341 c0.818,1.349,1.452,2.413,1.452,3.381v26.746c0,3.477,1.012,6.326,2.416,8.738C133.911,450.3,112.868,435.269,94.789,417.221z M453.413,161.755c-4.464-3.174-11.465-4.452-11.465-4.452l-5.099-0.651c-2.544-5.088-1.27-16.547-10.182-14.008 c-8.921,2.555-38.214,7.642-44.583,8.92c-6.361,1.27-14.008,11.452-19.099,19.096c-5.099,7.642-19.106,31.848-21.654,35.666 c-2.544,3.817-3.822,28.024-3.822,34.381c0,6.381,28.028,33.127,36.936,34.396c8.917,1.27,33.11-5.095,39.484-6.365 c6.369-1.286,10.186,7.635,15.282,7.635c5.095,0,11.464,2.547,6.368,10.206c-5.095,7.619-5.095,11.444,0,16.54 c5.096,5.103,15.282,24.206,8.913,39.492c-6.369,15.277-1.265,22.912,2.552,29.285c0.73,1.222,1.5,2.92,2.318,4.92 c-9.178,14.635-19.976,28.19-32.151,40.404c-41.321,41.262-98.218,66.762-161.213,66.762c-21.044,0-41.389-2.866-60.726-8.167 c0.08-0.318,0.155-0.674,0.21-1.04c0.321-2.388-0.666-4.166-1.686-5.42c1.429-0.683,2.572-1.778,3.385-3.239 c1.23-2.238,1.432-4.984,1.23-7.151l1.238,0.024c3.107,0,6.679-0.286,9.428-2.246c4.504-3.206,4.588-9.984,3.742-14.69 c0.329,0.143,0.666,0.301,0.972,0.396c0.35,0.143,0.735,0.175,1.123,0.175c4.076,0,8.584-7.326,9.798-12.175 c0.464-1.778,2.167-5.714,3.83-9.548c3.893-9.04,6.234-14.722,5.782-17.547c0.067-1.778,7.052-7.342,13.261-8.588 c7.366-1.468,9.988-4.174,12.766-13.23c2.651-8.595,3.953-22.912,3.266-29.032c-0.202-2.007,4.142-8.119,7.055-12.166 c4.735-6.682,7.619-10.952,7.619-14.286c0-7.698-6.475-12.889-11.341-16.134c-4.837-3.23-13.321-3.976-18.952-4.445 c-1.575-0.135-2.953-0.254-3.592-0.388c-0.583-0.12-1.603-1.23-2.417-2.088c-1.754-1.889-4.158-4.46-7.98-4.944 c-0.432-0.056-0.885-0.072-1.317-0.072c-2.428,0-4.584,0.762-6.698,1.5c-1.885,0.683-3.671,1.334-5.448,1.334 c-0.544,0-1.048-0.063-1.556-0.191c-0.944-0.198-1.306-0.46-1.378-0.46c0.02-0.428,0.838-1.865,2.845-3.199 c1.941-1.293,3.778-4.15,1.663-10.627c-1.503-4.666-4.285-9.079-5.396-10.73c-4-6.007-11.29-6.007-13.683-6.007 c-2.191,0-4.333,0.214-6.528,0.404l-0.476,0.016c-2.219,0-3.516-1.952-6.04-6.079c-1.429-2.342-3.035-4.961-5.266-7.659 c-4.849-5.81-11.618-6.58-17.631-6.58c-0.794,0-1.556,0-2.298,0.032c-0.634,0-1.25,0.016-1.829,0.016 c-0.814,0-1.556-0.016-2.198-0.103c-2.21-0.278-5.5-1.96-8.401-3.452c-3.182-1.635-6.19-3.191-8.738-3.548l-0.635-0.047 c-3.643,0-7.766,4.23-13.651,10.643c-1.46,1.587-3.341,3.642-4.337,4.507c-0.198-0.23-0.457-0.523-0.655-0.778 c-1.071-1.365-2.527-3.158-5.103-4.031c-0.556-0.183-1.119-0.286-1.678-0.286c-2.012,0-3.512,1.159-4.818,2.158 c-1.163,0.873-2.159,1.612-3.362,1.612c-0.706,0-1.524-0.246-2.468-0.754c-3.512-1.92-2.346-9.278-1.425-15.183 c0.436-2.714,0.845-5.27,0.845-7.421c0-4.888-2.889-5.42-4.103-5.42c-1.174,0-2.321,0.406-3.646,0.929 c-1.5,0.54-3.235,1.182-5.044,1.182c-0.814,0-1.576-0.135-2.314-0.388c-1.452-0.476-2.095-0.984-2.194-1.286 c-0.357-0.977,1.528-3.85,2.9-5.968c0.636-0.969,1.302-1.985,1.937-3.024c2.655-4.42,4.032-7.682,2.623-10.151 c-0.87-1.492-2.465-2.27-4.762-2.27c-0.885,0-1.88,0.103-3.055,0.333c-0.866,0.158-1.683,0.238-2.497,0.238 c-1.094,0-1.936-0.151-2.674-0.278c-0.69-0.11-1.222-0.214-1.686-0.214c-3.512,0-3.944,3.491-4.127,5c-0.655,5.301-3.838,8-9.417,8 c-0.413,0-0.809-0.024-1.246-0.048c-5.937-0.381-8.464-4.595-8.464-14.016c0-4.095,0.643-5.174,2.548-8.388 c0.944-1.548,2.118-3.508,3.543-6.381c3.155-6.294,5.655-7.468,8.837-8.936c0.94-0.445,1.912-0.896,2.909-1.469 c0.762-0.46,1.397-0.658,1.853-0.658c0.337,0,0.687,0.135,1.302,0.341c0.845,0.317,1.984,0.722,3.492,0.722 c0.432,0,0.888-0.015,1.396-0.087c4.687-0.801,5.679-3.548,6.548-5.968c0.108-0.254,0.202-0.524,0.338-0.865 c0.25,0.087,0.504,0.15,0.762,0.198c2.064,0.595,5.504,1.556,11.055,1.556c1.833,0,3.159,0.023,4.127,0.08 c-0.69,3.492-0.666,10.222,6.234,18.087c2.27,2.571,4.262,3.769,6.294,3.769c6.528,0,7.08-11,7.08-23.238 c0-7.396,2.805-9.42,11.107-15.349l0.54-0.397c4.508-3.198,7.187-7,9.778-10.674c2.806-3.96,5.448-7.707,10.42-10.802 c4.666-2.944,11.948-6.175,18.98-9.334c8.123-3.611,15.786-7.031,19.385-9.904c4.127-3.317,3.309-8.508,2.643-12.722 c-0.866-5.414-0.611-6.532,1.556-7.176c3.568-1.008,7.389-1.602,11.44-2.238c5.802-0.913,11.818-1.857,17.988-4.182 c6.405-2.388,7.889-5.809,8.016-8.278c0.234-4.174-3.366-7.516-6.516-9.095c-1.378-0.691-1.536-4.072-1.635-7.072 c-0.151-3.833-0.301-7.777-2.778-10.222c-1.397-1.428-3.186-2.143-5.25-2.143c-2.698,0-5.6,1.19-8.961,2.611 c-2.222,0.912-4.714,1.928-7.364,2.69c-0.286,0.08-0.536,0.135-0.738,0.135c-0.996,0-1.707-2.071-2.592-4.976 c-1.361-4.294-3.369-10.722-10.424-10.722c-0.79,0-1.659,0.072-2.572,0.254c-8.992,1.801-11.107,11.444-12.631,18.491 c-0.54,2.532-1.377,6.373-2.119,6.881c-5.298,0-7.004,3.381-8.662,6.666c-1.048,2.096-2.238,4.461-4.56,6.778 c-1.425,1.429-2.413,1.818-2.698,1.85c-0.432-0.405-1.092-3.508,1.682-9.048c1.174-2.325,2.496-5.714,0.866-8.484 c-1.913-3.238-6.44-3.452-11.667-3.642c-2.087-0.103-4.254-0.183-6.42-0.46c-4.131-0.516-5.218-1.564-5.27-1.786 c0-0.103,0.052-0.818,1.175-2.198c34.055-20.246,73.836-31.888,116.38-31.888c51.586,0,99.082,17.103,137.292,45.968 c-0.595,2.389-2.527,5.865-4.202,8.794c-2.543,4.468-1.269,7.016-1.269,7.016s12.103-1.913,14.643-3.182 c0.896-0.444,1.706-1.762,2.302-3.357c1.297,1.095,2.567,2.198,3.809,3.357c-3.028,2.745-6.281,5.626-7.381,6.372 c-1.905,1.262-8.274,3.182-10.825,4.444c-2.548,1.278,7.638,5.739,7.638,7.643c0,1.913,0,10.826-3.821,11.452 c-3.817,0.643-21.643,0.643-21.643,0.643s-5.738,20.374-4.464,22.286c1.274,1.92,9.552,6.381,14.65,5.746 c5.092-0.658,16.559-6.365,16.559-6.365l5.088-11.46l10.186-10.85c0,0,7.643,3.182,10.194,0.643 c2.544-2.54,7.642-5.079,7.642-5.079s5.096,9.539,8.278,10.818l0.615,0.278l0.016,0.039c3.679,5.064,7.115,10.278,10.318,15.659 l0.032,0.04v0.024l0.047,0.112c0.175,0.373,0.358,0.706,0.588,0.921c5.218,8.841,9.885,18.031,13.904,27.547 C462.088,167.255,457.274,164.501,453.413,161.755z"
    fill="#ffffff"
    stroke="#FFFFFF"
    strokeWidth="3"
  />
</svg> NotReally</a>
        <div className="nav-links">
          <a href="#features" className="nav-link">Özellikler</a>
          <a href="#preview" className="nav-link">Önizleme</a>
          <a href="#preview" className="nav-link">Premium</a>
          <a href="/register" className="nav-cta">Kayıt Ol →</a>
        </div>
      </nav>
 
      <section className="hero">
        <div className="hero-badge">
          <span className="badge-dot" /> Yeni nesil profil linkleri
        </div>
        <h1 className="hero-title">
          Tek Link,<br /><span>Tüm Dünya.</span>
        </h1>
        <p className="hero-sub">
          Discord'undan GitHub'a, Spotify'dan Steam'e — hepsini tek, şık bir profil sayfasında topla. Saniyeler içinde hazır.
        </p>
        <div className="claim-wrap">
          <span className="claim-prefix">notreally.xyz/</span>
          <input
            className="claim-input"
            placeholder="kullanıcı-adın"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
          />
          <button className="claim-btn">Hemen Al →</button>
        </div>
      </section>
 
      <section className="stats-section">
        <div className="stats-grid">
          {STATS.map((s) => (
            <div key={s.label} className="stat-box">
              <span className="stat-val">{mounted ? <AnimatedCounter target={s.value} /> : s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>
 
      <section className="features-section" id="features">
        <p className="section-label">Neden biz?</p>
        <h2 className="section-title">İhtiyacın olan her şey,<br />tek bir yerde</h2>
        <div className="features-grid">
        {FEATURES.map((f) => (
          <div key={f.title} className="feature-card">
            <span className="feat-icon">
              <FontAwesomeIcon icon={f.icon} />
            </span>
            <div className="feat-title">{f.title}</div>
            <p className="feat-desc">{f.desc}</p>
          </div>
        ))}
        </div>
      </section>
 
      <section className="preview-section" id="preview">
        <p className="section-label" style={{ marginBottom:16 }}>Canlı önizleme</p>
        <h2 className="section-title" style={{ marginBottom:48 }}>Profilin Nasıl Gözüksün?</h2>
        <div className="preview-card">
            <div className="preview-banner" />
          <div className="preview-top-line" />
          <div className="preview-body">
            <div className="preview-avatar"><img className="w-full h-full object-cover rounded-full" src={"https://files.berlinxr.cfd/dc.png"} /></div>

            <div className="preview-name">Savior</div>
            <div className="preview-bio">developer · designer · dreamer</div>
            <div className="preview-links">
              {[faDiscord, faSteam,   faGithub, faTwitter, faSpotify].map((l) => (
                <div key={l} className="preview-link"><FontAwesomeIcon icon={l} /></div>
              ))}
            </div>
          </div>
        </div>
      </section>
 
      <section className="cta-section">
        <div className="cta-box">
          <h2 className="cta-title">Profilini şimdi oluştur</h2>
          <p className="cta-sub">Ücretsiz. Reklamsız. Sınırsız paylaşım.</p>
          <a href="/register" className="cta-big-btn">Başlamak için tıkla →</a>
        </div>
      </section>
 
      <footer>
        <span>© 2025 profil.link</span>
        <span>mavi tema · next.js ile yapıldı</span>
      </footer>
    </>
  );
}
