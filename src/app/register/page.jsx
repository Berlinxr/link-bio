"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSignIn } from "@clerk/nextjs";

export default function RegisterPage() {

  const {signIn, isLoaded, setActive} = useSignIn();
  const router = useRouter();
  const [mouse, setMouse] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState({ x: -100, y: -100 });
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onMove = (e) => {
      setMouse({ x: e.clientX, y: e.clientY });
      setTimeout(() => setTrail({ x: e.clientX, y: e.clientY }), 80);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const pwStrength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const pwColors = ["#ef4444", "#f97316", "#eab308", "#22c55e"];
  const pwLabels = ["Zayıf", "Orta", "İyi", "Güçlü"];

const handleSubmit = async (e) => {
  e.preventDefault();

  // 1️⃣ kullanıcı oluştur
  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    alert("Kayıt hatası: " + data.error);
    return;
  }

  // 2️⃣ login
  if (!isLoaded) return;

  const result = await signIn.create({
    identifier: form.email,
    password: form.password,
  });

if (result.status === "complete") {
  await setActive({ session: result.createdSessionId });

  setTimeout(() => {
    router.push("/control");
  }, 150);
}
};

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        :root{
          --bg:#020c1b;--card:rgba(4,18,40,.75);--border:rgba(96,165,250,.1);
          --border-h:rgba(96,165,250,.32);--accent:#38bdf8;--accent2:#818cf8;
          --blue:#60a5fa;--text:#e8f4ff;--muted:rgba(180,210,255,.5);
          --ff:'Syne',sans-serif;--mono:'DM Mono',monospace;
        }
        html,body{min-height:100vh;overflow-x:hidden;}
        body{background:var(--bg);color:var(--text);font-family:var(--ff);cursor:none;}
 
        .cur{position:fixed;pointer-events:none;z-index:9999;border-radius:50%;}
        .cur-dot{width:8px;height:8px;background:var(--accent);top:-4px;left:-4px;}
        .cur-ring{width:34px;height:34px;border:1.5px solid rgba(56,189,248,.28);top:-17px;left:-17px;}
 
        .bg-grid{position:fixed;inset:0;pointer-events:none;z-index:0;
          background-image:linear-gradient(rgba(30,77,140,.06) 1px,transparent 1px),
          linear-gradient(90deg,rgba(30,77,140,.06) 1px,transparent 1px);
          background-size:52px 52px;}
        .orb{position:fixed;border-radius:50%;filter:blur(90px);pointer-events:none;z-index:0;}
 
        .page{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 20px;position:relative;z-index:1;}
 
        .logo-wrap{display:flex;flex-direction:column;align-items:center;gap:12px;margin-bottom:36px;animation:fadeUp .5s ease both;}
        .logo-mark{width:56px;height:56px;border-radius:16px;background:linear-gradient(135deg,#1a4d8c,#2d7dd2);border:1px solid rgba(96,165,250,.25);display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:800;box-shadow:0 0 32px rgba(56,189,248,.18);color:#fff;letter-spacing:-1px;font-family:var(--ff);}
        .logo-name{font-size:22px;font-weight:800;letter-spacing:-.5px;background:linear-gradient(135deg,var(--blue),var(--accent));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
        .logo-tag{font-family:var(--mono);font-size:11px;color:var(--muted);letter-spacing:.08em;}
 
        .card{width:100%;max-width:440px;background:var(--card);border:1px solid var(--border);border-radius:22px;overflow:hidden;backdrop-filter:blur(24px);animation:fadeUp .5s .1s ease both;}
        .card-top{height:2px;background:linear-gradient(90deg,transparent,var(--accent),var(--accent2),transparent);background-size:200% 100%;animation:slideGrad 3s linear infinite;}
        .card-body{padding:36px 36px 32px;}
 
        .card-title{font-size:22px;font-weight:800;letter-spacing:-.5px;margin-bottom:4px;}
        .card-sub{font-family:var(--mono);font-size:12px;color:var(--muted);margin-bottom:28px;}
 
        .field{margin-bottom:16px;}
        .field-label{font-family:var(--mono);font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:8px;display:block;}
        .field-row{position:relative;}
        .field-prefix{position:absolute;left:14px;top:50%;transform:translateY(-50%);font-family:var(--mono);font-size:12px;color:var(--accent);pointer-events:none;user-select:none;}
        .field-input{width:100%;padding:12px 16px;border-radius:12px;background:rgba(2,12,27,.7);border:1px solid var(--border);color:var(--text);font-family:var(--mono);font-size:13px;outline:none;transition:border-color .2s,box-shadow .2s;}
        .field-input.has-prefix{padding-left:88px;}
        .field-input:focus{border-color:var(--border-h);box-shadow:0 0 0 3px rgba(56,189,248,.07);}
        .field-input::placeholder{color:var(--muted);}
 
        .pw-strength{margin-top:8px;}
        .pw-bars{display:flex;gap:4px;margin-bottom:5px;}
        .pw-bar{flex:1;height:3px;border-radius:4px;background:rgba(96,165,250,.1);transition:background .3s;}
        .pw-label{font-family:var(--mono);font-size:10px;color:var(--muted);}
 
        .terms{font-family:var(--mono);font-size:11px;color:var(--muted);line-height:1.6;margin-top:4px;}
        .terms a{color:var(--accent);text-decoration:none;}
        .terms a:hover{opacity:.7;}
 
        .submit-btn{width:100%;margin-top:24px;padding:14px;border-radius:13px;background:linear-gradient(135deg,#1d6fd4,#2563eb);border:none;color:#fff;font-family:var(--ff);font-size:15px;font-weight:700;cursor:none;transition:all .22s;letter-spacing:-.2px;box-shadow:0 8px 28px rgba(29,111,212,.3);position:relative;overflow:hidden;}
        .submit-btn:hover{transform:translateY(-2px);box-shadow:0 12px 36px rgba(29,111,212,.45);}
        .submit-btn:disabled{opacity:.6;transform:none;}
        .btn-loader{display:inline-block;width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;vertical-align:middle;}
 
        .divider{display:flex;align-items:center;gap:12px;margin:24px 0;color:var(--muted);font-family:var(--mono);font-size:11px;}
        .divider::before,.divider::after{content:'';flex:1;height:1px;background:var(--border);}
        .social-btn{width:100%;padding:12px;border-radius:12px;background:rgba(96,165,250,.04);border:1px solid var(--border);color:var(--text);font-family:var(--mono);font-size:13px;cursor:none;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:10px;}
        .social-btn:hover{background:rgba(96,165,250,.09);border-color:var(--border-h);}
        .social-icon{width:18px;height:18px;border-radius:4px;background:#5865F2;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;}
 
        .switch-text{text-align:center;font-family:var(--mono);font-size:12px;color:var(--muted);margin-top:24px;}
        .switch-link{color:var(--accent);text-decoration:none;transition:opacity .2s;}
        .switch-link:hover{opacity:.7;}
 
        /* Success state */
        .success-wrap{text-align:center;padding:20px 0;}
        .success-icon{font-size:52px;margin-bottom:20px;display:block;animation:popIn .4s cubic-bezier(.34,1.56,.64,1) both;}
        .success-title{font-size:22px;font-weight:800;margin-bottom:8px;}
        .success-sub{font-family:var(--mono);font-size:12px;color:var(--muted);line-height:1.7;margin-bottom:28px;}
        .success-btn{display:inline-block;padding:12px 32px;border-radius:12px;background:linear-gradient(135deg,#1d6fd4,#2563eb);color:#fff;font-family:var(--mono);font-size:13px;font-weight:600;text-decoration:none;transition:all .2s;box-shadow:0 6px 20px rgba(29,111,212,.3);}
        .success-btn:hover{transform:translateY(-2px);}
 
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
        @keyframes slideGrad{0%{background-position:0% 0;}100%{background-position:200% 0;}}
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes popIn{from{opacity:0;transform:scale(.5);}to{opacity:1;transform:scale(1);}}
      `}</style>
      {/* Cursor ve background */}
      <div className="cur cur-dot" style={{ left: mouse.x, top: mouse.y }} />
      <div className="cur cur-ring" style={{ left: trail.x, top: trail.y }} />
      <div className="bg-grid" />
      <div className="orb" style={{ width:600,height:600,background:"radial-gradient(circle,rgba(29,78,216,.13),transparent 70%)",top:-150,right:-150 }} />
      <div className="orb" style={{ width:400,height:400,background:"radial-gradient(circle,rgba(129,140,248,.08),transparent 70%)",bottom:-80,left:-80 }} />

      <main className="page">
        <div className="logo-wrap">
          <div className="logo-mark">P</div>
          <div className="logo-name">profil.link</div>
          <div className="logo-tag">// hesap oluştur</div>
        </div>

        <div className="card">
          <div className="card-top" />
          <div className="card-body">
            <div className="card-title">Kayıt Ol</div>
            <div className="card-sub">Profilini oluşturmak için birkaç saniye yeterli</div>

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="field-label">Kullanıcı Adı</label>
                <div className="field-row">
                  <span className="field-prefix">profil.link/</span>
                  <input
                    className="field-input has-prefix"
                    type="text"
                    placeholder="kullanici-adin"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label className="field-label">E-posta</label>
                <input
                  className="field-input"
                  type="email"
                  placeholder="sen@ornek.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="field">
                <label className="field-label">Şifre</label>
                <input
                  className="field-input"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                {form.password && (
                  <div className="pw-strength">
                    <div className="pw-bars">
                      {[0,1,2,3].map((i) => (
                        <div
                          key={i}
                          className="pw-bar"
                          style={{ background: i < pwStrength ? pwColors[pwStrength - 1] : undefined }}
                        />
                      ))}
                    </div>
                    <span className="pw-label" style={{ color: pwColors[pwStrength - 1] }}>
                      {pwLabels[pwStrength - 1]}
                    </span>
                  </div>
                )}
              </div>

              <div className="field">
                <label className="field-label">Şifre Tekrar</label>
                <input
                  className="field-input"
                  type="password"
                  placeholder="••••••••"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  style={{ borderColor: form.confirm && form.confirm !== form.password ? "rgba(239,68,68,.5)" : undefined }}
                  required
                />
              </div>

              <p className="terms">
                Kayıt olarak{" "}
                <a href="/terms">Kullanım Şartları</a>'nı ve{" "}
                <a href="/privacy">Gizlilik Politikası</a>'nı kabul etmiş olursunuz.
              </p>

              <button className="submit-btn" type="submit" disabled={loading || (form.confirm && form.confirm !== form.password)}>
                {loading ? <span className="btn-loader" /> : "Hesap Oluştur →"}
              </button>
            </form>

            <div className="divider">ya da</div>

            <button className="social-btn" type="button">
              <div className="social-icon">D</div>
              Discord ile kayıt ol
            </button>

            <div className="switch-text">
              Zaten hesabın var mı?{" "}
              <Link href="/login" className="switch-link">Giriş yap</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}