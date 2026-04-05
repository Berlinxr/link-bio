"use client";
 
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faSteam, faGithub, faTwitter, faSpotify } from "@fortawesome/free-brands-svg-icons";
 
const STATS = [
  { value: "12K+", label: "Kullanıcı" },
  { value: "48K+", label: "Profil Görüntülenme" },
];
 
const FEATURES = [
  { icon: "⚡", title: "Anında Kurulum", desc: "Saniyeler içinde kendi profilini oluştur. Kayıt, link al, paylaş." },
  { icon: "🎨", title: "Tam Özelleştirme", desc: "Renkler, layoutlar, rozetler — her şey senin kontrolünde." },
  { icon: "🔗", title: "Tüm Platformlar", desc: "Discord, GitHub, Spotify ve daha fazlasını tek linkte topla." },
  { icon: "📊", title: "Canlı İstatistikler", desc: "Profilini kaç kişinin gördüğünü gerçek zamanlı takip et." },
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
          --bg:#121212;
          --card:rgba(40,40,40,.7);
          --border:rgba(180,180,180,.1);
          --border-h:rgba(180,180,180,.3);
          --accent:#b0b0b0;
          --accent2:#888888;
          --blue:#999999;
          --text:#e0e0e0;
          --muted:rgba(200,200,200,.5);
          --ff:'Syne',sans-serif;
          --mono:'DM Mono',monospace;
        }
        html,body{min-height:100vh;overflow-x:hidden;scroll-behavior:smooth;}
        body{background:var(--bg);color:var(--text);font-family:var(--ff);}

 
        .bg-grid{position:fixed;inset:0;pointer-events:none;z-index:0;
          background-image:linear-gradient(rgba(30,77,140,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(30,77,140,.06) 1px,transparent 1px);
          background-size:52px 52px;}
        .bg-orb{position:fixed;border-radius:50%;filter:blur(90px);pointer-events:none;z-index:0;}
 
        nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:18px 48px;display:flex;align-items:center;justify-content:space-between;background:rgba(2,12,27,.75);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);}
        .logo{font-size:20px;font-weight:800;letter-spacing:-.5px;background:linear-gradient(135deg,var(--blue),var(--accent));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;text-decoration:none;}
        .nav-links{display:flex;align-items:center;gap:28px;}
        .nav-link{font-size:13px;color:var(--muted);text-decoration:none;font-family:var(--mono);letter-spacing:.04em;transition:color .2s;}
        .nav-link:hover{color:var(--text);}
        .nav-cta{font-size:13px;font-weight:600;padding:8px 20px;border-radius:10px;background:linear-gradient(135deg,rgba(56,189,248,.1),rgba(129,140,248,.1));border:1px solid var(--border-h);color:var(--accent);text-decoration:none;transition:all .2s;font-family:var(--mono);}
        .nav-cta:hover{background:linear-gradient(135deg,rgba(56,189,248,.2),rgba(129,140,248,.2));}
 
        .hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:120px 24px 80px;position:relative;z-index:1;}
        .hero-badge{display:inline-flex;align-items:center;gap:8px;font-family:var(--mono);font-size:11px;letter-spacing:.1em;padding:6px 16px;border-radius:20px;margin-bottom:32px;background:rgba(56,189,248,.06);border:1px solid rgba(56,189,248,.18);color:var(--accent);text-transform:uppercase;animation:fadeUp .6s ease both;}
        .badge-dot{width:6px;height:6px;border-radius:50%;background:var(--accent);animation:blink 1.5s ease-in-out infinite;}
        .hero-title{font-size:clamp(46px,8vw,88px);font-weight:800;letter-spacing:-2.5px;line-height:1;margin-bottom:24px;animation:fadeUp .6s .1s ease both;}
        .hero-title span{background:linear-gradient(135deg,var(--blue) 0%,var(--accent) 50%,var(--accent2) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
        .hero-sub{font-size:clamp(15px,2vw,18px);color:var(--muted);max-width:520px;line-height:1.7;margin-bottom:48px;animation:fadeUp .6s .2s ease both;}
 
        .claim-wrap{display:flex;align-items:center;background:rgba(4,18,40,.9);border:1px solid ${inputFocused ? "rgba(56,189,248,.45)" : "var(--border)"};border-radius:14px;padding:6px 6px 6px 20px;max-width:420px;width:100%;transition:border-color .2s,box-shadow .2s;box-shadow:${inputFocused ? "0 0 0 3px rgba(56,189,248,.08)" : "none"};animation:fadeUp .6s .3s ease both;backdrop-filter:blur(12px);}
        .claim-prefix{font-family:var(--mono);font-size:13px;color:var(--accent);white-space:nowrap;margin-right:4px;user-select:none;}
        .claim-input{flex:1;background:transparent;border:none;outline:none;font-family:var(--mono);font-size:13px;color:var(--text);padding:8px 0;min-width:0;}
        .claim-input::placeholder{color:var(--muted);}
        .claim-btn{padding:10px 20px;border-radius:10px;background:linear-gradient(135deg,#1d6fd4,#2563eb);border:none;color:#fff;font-family:var(--mono);font-size:13px;font-weight:600;white-space:nowrap;transition:all .2s;letter-spacing:.02em;}
        .claim-btn:hover{background:linear-gradient(135deg,#2d7dd2,#3b82f6);transform:translateY(-1px);}
 
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
        .preview-card{width:100%;max-width:340px;background:rgba(4,18,40,.8);border:1px solid var(--border);border-radius:22px;overflow:hidden;backdrop-filter:blur(24px);box-shadow:0 40px 100px rgba(0,0,0,.5);animation:float 6s ease-in-out infinite;}
        .preview-top-line{height:2px;background:linear-gradient(90deg,transparent,var(--accent),var(--accent2),transparent);background-size:200% 100%;animation:slideGrad 3s linear infinite;}
        .preview-banner{height:80px;background:linear-gradient(135deg,#0a1a40 0%,#1a3a70 50%,#0d2550 100%);position:relative;overflow:hidden;}
        .preview-banner::after{content:'';position:absolute;inset:0;background:repeating-linear-gradient(45deg,transparent,transparent 20px,rgba(96,165,250,.04) 20px,rgba(96,165,250,.04) 21px);}
        .preview-body{padding:0 22px 22px;}
        .preview-avatar{width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#1a4d8c,#2d7dd2);position:relative;border:3px solid rgba(4,18,40,.9);margin-top:-32px;margin-bottom:10px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;box-shadow:0 0 0 2px rgba(56,189,248,.2);}
        .preview-name{font-size:18px;font-weight:800;margin-bottom:2px;}
        .preview-bio{font-family:var(--mono);font-size:11px;color:var(--muted);margin-bottom:16px;}
        .preview-links{display:flex;gap:8px;}
        .preview-link{width:32px;height:32px;border-radius:8px;background:rgba(96,165,250,.07);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;font-family:var(--mono);color:var(--blue);transition:all .2s;}
        .preview-link:hover{background:rgba(96,165,250,.14);border-color:var(--border-h);}
 
        .cta-section{position:relative;z-index:1;padding:0 24px 100px;text-align:center;}
        .cta-box{max-width:580px;margin:0 auto;padding:64px 40px;background:rgba(4,18,40,.6);border:1px solid var(--border);border-radius:24px;backdrop-filter:blur(20px);position:relative;overflow:hidden;}
        .cta-box::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(56,189,248,.08) 0%,transparent 70%);pointer-events:none;}
        .cta-title{font-size:clamp(24px,4vw,36px);font-weight:800;letter-spacing:-1px;margin-bottom:12px;}
        .cta-sub{color:var(--muted);font-size:14px;font-family:var(--mono);margin-bottom:32px;line-height:1.6;}
        .cta-big-btn{display:inline-block;padding:14px 40px;border-radius:14px;font-size:15px;font-weight:700;text-decoration:none;background:linear-gradient(135deg,#1d6fd4,#2563eb);color:#fff;transition:all .25s;letter-spacing:-.2px;box-shadow:0 8px 32px rgba(29,111,212,.35);}
        .cta-big-btn:hover{transform:translateY(-2px);box-shadow:0 14px 40px rgba(29,111,212,.5);}
 
        footer{position:relative;z-index:1;border-top:1px solid var(--border);padding:28px 48px;display:flex;align-items:center;justify-content:space-between;font-family:var(--mono);font-size:11.5px;color:var(--muted);}
 
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        @keyframes blink{0%,100%{opacity:1;}50%{opacity:.3;}}
        @keyframes float{0%,100%{transform:translateY(0) rotate(-1deg);}50%{transform:translateY(-14px) rotate(1deg);}}
        @keyframes slideGrad{0%{background-position:0% 0;}100%{background-position:200% 0;}}
      `}</style>
 

 
      {/* BG */}
      <div className="bg-grid" />
      <div className="bg-orb" style={{ width:700,height:700,background:"radial-gradient(circle,rgba(29,78,216,.14),transparent 70%)",top:-200,left:-200 }} />
      <div className="bg-orb" style={{ width:500,height:500,background:"radial-gradient(circle,rgba(56,189,248,.09),transparent 70%)",bottom:-100,right:-100 }} />
 
      {/* NAV */}
      <nav>
        <a href="/" className="logo">NotReally</a>
        <div className="nav-links">
          <a href="#features" className="nav-link">Özellikler</a>
          <a href="#preview" className="nav-link">Önizleme</a>
          <a href="#preview" className="nav-link">Premium</a>
          <a href="/register" className="nav-cta">Kayıt Ol →</a>
        </div>
      </nav>
 
      {/* HERO */}
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
 
      {/* STATS */}
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
 
      {/* FEATURES */}
      <section className="features-section" id="features">
        <p className="section-label">Neden biz?</p>
        <h2 className="section-title">İhtiyacın olan her şey,<br />tek bir yerde</h2>
        <div className="features-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card">
              <span className="feat-icon">{f.icon}</span>
              <div className="feat-title">{f.title}</div>
              <p className="feat-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
 
      {/* PREVIEW */}
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
 
      {/* CTA */}
      <section className="cta-section">
        <div className="cta-box">
          <h2 className="cta-title">Profilini şimdi oluştur</h2>
          <p className="cta-sub">Ücretsiz. Reklamsız. Sınırsız paylaşım.</p>
          <a href="/register" className="cta-big-btn">Başlamak için tıkla →</a>
        </div>
      </section>
 
      {/* FOOTER */}
      <footer>
        <span>© 2025 profil.link</span>
        <span>mavi tema · next.js ile yapıldı</span>
      </footer>
    </>
  );
}