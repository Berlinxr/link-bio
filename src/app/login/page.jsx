"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { signIn, setActive } = useSignIn();
  const router = useRouter();

  const [mouse, setMouse] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState({ x: -100, y: -100 });
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState("login");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const codeRefs = useRef([]);

  useEffect(() => {
    const onMove = (e) => {
      setMouse({ x: e.clientX, y: e.clientY });
      setTimeout(() => setTrail({ x: e.clientX, y: e.clientY }), 80);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  if (signIn.createdSessionId) {
    router.push("/dashboard");
    return;
  }

  try {
    await signIn.create({
      identifier: form.email,
      password: form.password,
    });

    if (signIn.status === "complete") {
      await setActive({ session: signIn.createdSessionId });
      router.push("/dashboard");
    } else if (signIn.status === "needs_first_factor") {
      const emailFactor = signIn.supportedFirstFactors?.find(
        (f) => f.strategy === "email_code"
      );
      if (emailFactor) {
        await signIn.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId: emailFactor.emailAddressId,
        });
      }
      setStep("verify");
    } else if (signIn.status === "needs_identifier") {
      router.push("/dashboard");
    } else {
      setError(`Beklenmeyen durum: ${signIn.status}`);
    }
  } catch (err) {
    const clerkError = err.errors?.[0];
    if (clerkError?.code === "session_exists") {
      router.push("/dashboard");
      return;
    }
    setError(clerkError?.longMessage || clerkError?.message || "Bir hata oluştu.");
  } finally {
    setLoading(false);
  }
};

  const handleCodeChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...code];
    next[i] = val.slice(-1);
    setCode(next);
    if (val && i < 5) codeRefs.current[i + 1]?.focus();
  };

  const handleCodeKeyDown = (i, e) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      codeRefs.current[i - 1]?.focus();
    }
  };

  const handleCodePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(""));
      codeRefs.current[5]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length < 6) { setError("Lütfen 6 haneli kodu girin."); return; }
    setLoading(true);
    setError("");

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code: fullCode,
      });

      if (signIn.status === "complete") {
        await setActive({ session: signIn.createdSessionId });
        router.push("/dashboard");
      } else {
        setError("Doğrulama tamamlanamadı. Tekrar deneyin.");
      }
    } catch (err) {
      const clerkError = err.errors?.[0];
      switch (clerkError?.code) {
        case "form_code_incorrect":
          setError("Kod hatalı. Lütfen tekrar deneyin.");
          break;
        case "verification_expired":
          setError("Kodun süresi doldu. Yeni kod isteyin.");
          break;
        default:
          setError(clerkError?.message || "Doğrulama başarısız.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setCode(["", "", "", "", "", ""]);
    try {
      const emailFactor = signIn.supportedFirstFactors?.find(
        (f) => f.strategy === "email_code"
      );
      await signIn.prepareFirstFactor({
        strategy: "email_code",
        emailAddressId: emailFactor?.emailAddressId,
      });
      codeRefs.current[0]?.focus();
    } catch {
      setError("Kod gönderilemedi. Lütfen tekrar deneyin.");
    }
  };

  const handleDiscordSignIn = async () => {
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_discord",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch {
      setError("Discord ile giriş yapılırken bir hata oluştu.");
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
          --error:#f87171;
        }
        html,body{min-height:100vh;overflow-x:hidden;}
        body{background:var(--bg);color:var(--text);font-family:var(--ff);}

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

        .card{width:100%;max-width:420px;background:var(--card);border:1px solid var(--border);border-radius:22px;overflow:hidden;backdrop-filter:blur(24px);animation:fadeUp .5s .1s ease both;}
        .card-top{height:2px;background:linear-gradient(90deg,transparent,var(--accent),var(--accent2),transparent);background-size:200% 100%;animation:slideGrad 3s linear infinite;}
        .card-body{padding:36px 36px 32px;}

        .card-title{font-size:22px;font-weight:800;letter-spacing:-.5px;margin-bottom:4px;}
        .card-sub{font-family:var(--mono);font-size:12px;color:var(--muted);margin-bottom:28px;}

        .field{margin-bottom:16px;}
        .field-label{font-family:var(--mono);font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:8px;display:block;}
        .field-input{width:100%;padding:12px 16px;border-radius:12px;background:rgba(2,12,27,.7);border:1px solid var(--border);color:var(--text);font-family:var(--mono);font-size:13px;outline:none;transition:border-color .2s,box-shadow .2s;cursor:text;}
        .field-input:focus{border-color:var(--border-h);box-shadow:0 0 0 3px rgba(56,189,248,.07);}
        .field-input::placeholder{color:var(--muted);}
        .field-input.input-error{border-color:rgba(248,113,113,.4);}

        .forgot{font-family:var(--mono);font-size:11px;color:var(--accent);text-decoration:none;display:block;text-align:right;margin-top:6px;transition:opacity .2s;cursor:pointer;}
        .forgot:hover{opacity:.7;}

        .error-box{background:rgba(248,113,113,.07);border:1px solid rgba(248,113,113,.2);border-radius:10px;padding:10px 14px;font-family:var(--mono);font-size:12px;color:var(--error);margin-bottom:16px;animation:fadeUp .3s ease both;}

        .submit-btn{width:100%;margin-top:24px;padding:14px;border-radius:13px;background:linear-gradient(135deg,#1d6fd4,#2563eb);border:none;color:#fff;font-family:var(--ff);font-size:15px;font-weight:700;cursor:pointer;transition:all .22s;letter-spacing:-.2px;box-shadow:0 8px 28px rgba(29,111,212,.3);}
        .submit-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 36px rgba(29,111,212,.45);}
        .submit-btn:active:not(:disabled){transform:translateY(0);}
        .submit-btn:disabled{opacity:.6;cursor:not-allowed;}
        .btn-loader{display:inline-block;width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;vertical-align:middle;}

        .divider{display:flex;align-items:center;gap:12px;margin:24px 0;color:var(--muted);font-family:var(--mono);font-size:11px;}
        .divider::before,.divider::after{content:'';flex:1;height:1px;background:var(--border);}

        .social-btn{width:100%;padding:12px;border-radius:12px;background:rgba(96,165,250,.04);border:1px solid var(--border);color:var(--text);font-family:var(--mono);font-size:13px;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:10px;}
        .social-btn:hover{background:rgba(96,165,250,.09);border-color:var(--border-h);}
        .social-icon{width:18px;height:18px;border-radius:4px;background:#5865F2;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;flex-shrink:0;}

        .switch-text{text-align:center;font-family:var(--mono);font-size:12px;color:var(--muted);margin-top:24px;}
        .switch-link{color:var(--accent);text-decoration:none;transition:opacity .2s;}
        .switch-link:hover{opacity:.7;}

        .verify-icon{width:52px;height:52px;border-radius:14px;background:rgba(56,189,248,.08);border:1px solid rgba(56,189,248,.18);display:flex;align-items:center;justify-content:center;font-size:24px;margin-bottom:18px;}
        .card-sub-em{color:var(--text);font-weight:600;}

        .code-row{display:flex;gap:8px;justify-content:center;margin:24px 0;}
        .code-input{width:46px;height:54px;border-radius:12px;background:rgba(2,12,27,.7);border:1px solid var(--border);color:var(--text);font-family:var(--mono);font-size:22px;font-weight:700;text-align:center;outline:none;transition:border-color .2s,box-shadow .2s;cursor:text;}
        .code-input:focus{border-color:var(--border-h);box-shadow:0 0 0 3px rgba(56,189,248,.1);}
        .code-input.filled{border-color:rgba(56,189,248,.3);background:rgba(56,189,248,.04);}

        .resend-row{text-align:center;font-family:var(--mono);font-size:12px;color:var(--muted);margin-top:16px;}
        .resend-btn{color:var(--accent);background:none;border:none;font-family:var(--mono);font-size:12px;cursor:pointer;padding:0;transition:opacity .2s;}
        .resend-btn:hover{opacity:.7;}

        .back-btn{display:flex;align-items:center;gap:6px;background:none;border:none;color:var(--muted);font-family:var(--mono);font-size:12px;cursor:pointer;margin-bottom:20px;padding:0;transition:color .2s;}
        .back-btn:hover{color:var(--text);}

        @keyframes fadeUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
        @keyframes slideGrad{0%{background-position:0% 0;}100%{background-position:200% 0;}}
        @keyframes spin{to{transform:rotate(360deg);}}
      `}</style>

      <div className="cur cur-dot" style={{ left: mouse.x, top: mouse.y }} />
      <div className="cur cur-ring" style={{ left: trail.x, top: trail.y }} />
      <div className="bg-grid" />
      <div className="orb" style={{ width:600,height:600,background:"radial-gradient(circle,rgba(29,78,216,.13),transparent 70%)",top:-150,left:-150 }} />
      <div className="orb" style={{ width:400,height:400,background:"radial-gradient(circle,rgba(56,189,248,.08),transparent 70%)",bottom:-80,right:-80 }} />

      <main className="page">
        <div className="logo-wrap">
          <div className="logo-mark">P</div>
          <div className="logo-name">profil.link</div>
          <div className="logo-tag">// hoş geldin</div>
        </div>

        <div className="card">
          <div className="card-top" />
          <div className="card-body">

            {step === "login" && (
              <>
                <div className="card-title">Giriş Yap</div>
                <div className="card-sub">Hesabına erişmek için bilgilerini gir</div>

                {error && <div className="error-box">⚠ {error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="field">
                    <label className="field-label">E-posta</label>
                    <input
                      className={`field-input${error ? " input-error" : ""}`}
                      type="email"
                      placeholder="sen@ornek.com"
                      value={form.email}
                      onChange={(e) => { setForm({ ...form, email: e.target.value }); setError(""); }}
                      required
                    />
                  </div>

                  <div className="field">
                    <label className="field-label">Şifre</label>
                    <input
                      className={`field-input${error ? " input-error" : ""}`}
                      type="password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => { setForm({ ...form, password: e.target.value }); setError(""); }}
                      required
                    />
                    <a href="/forgot-password" className="forgot">Şifreni mi unuttun?</a>
                  </div>

                  <button className="submit-btn" type="submit" disabled={loading}>
                    {loading ? <span className="btn-loader" /> : "Giriş Yap →"}
                  </button>
                </form>

                <div className="divider">ya da</div>

                <button className="social-btn" type="button" onClick={handleDiscordSignIn}>
                  <div className="social-icon">D</div>
                  Discord ile devam et
                </button>

                <div className="switch-text">
                  Hesabın yok mu?{" "}
                  <Link href="/register" className="switch-link">Kayıt ol</Link>
                </div>
              </>
            )}

            {step === "verify" && (
              <>
                <button className="back-btn" type="button" onClick={() => { setStep("login"); setError(""); setCode(["","","","","",""]); }}>
                  ← Geri dön
                </button>

                <div className="verify-icon">📬</div>
                <div className="card-title">E-postanı doğrula</div>
                <div className="card-sub">
                  <span className="card-sub-em">{form.email}</span> adresine 6 haneli kod gönderdik
                </div>

                {error && <div className="error-box">⚠ {error}</div>}

                <form onSubmit={handleVerify}>
                  <div className="code-row" onPaste={handleCodePaste}>
                    {code.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => (codeRefs.current[i] = el)}
                        className={`code-input${digit ? " filled" : ""}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(i, e.target.value)}
                        onKeyDown={(e) => handleCodeKeyDown(i, e)}
                        autoFocus={i === 0}
                      />
                    ))}
                  </div>

                  <button className="submit-btn" type="submit" disabled={loading || code.join("").length < 6}>
                    {loading ? <span className="btn-loader" /> : "Doğrula ve Giriş Yap →"}
                  </button>
                </form>

                <div className="resend-row">
                  Kod gelmedi mi?{" "}
                  <button className="resend-btn" type="button" onClick={handleResend}>
                    Tekrar gönder
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      </main>
    </>
  );
}