import { useState, useEffect, useMemo, useRef, memo } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Favorite } from "@mui/icons-material";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import juntosVideo from "../../assets/Amorcito.mp4";

dayjs.extend(duration);

import Mes1 from "../mes1/mes1";
import Mes2 from "../mes2/mes2";
import Mes3 from "../mes3/mes3";
import Mes4 from "../mes4/mes4";
import Mes5 from "../mes5/mes5";
import Mes6 from "../mes6/mes6";
import Mes7 from "../mes7/mes7";
import Mes8 from "../mes8/mes8";
import Mes9 from "../mes9/mes9";
import SanValentin from "../sanvalentin/sanvalentin";
import Cumple from "../cumple/Cumple";

const FECHA_INICIO = "2025-11-30";

// ─── FONDO ORIGINAL — todas las páginas excepto Home ─────────────────────────
const HeartsAnimation = memo(({ pageTheme }) => {
  const heartColors = {
    default: ["rgba(255,64,129,0.4)", "rgba(147,51,234,0.4)"],
    mes3: ["rgba(124,77,255,0.5)", "rgba(0,229,255,0.5)"],
    mes4: ["rgba(255,215,64,0.45)", "rgba(255,193,7,0.45)"],
    mes5: ["rgba(76,175,80,0.45)", "rgba(129,199,132,0.45)"],
    cumple: ["rgba(255,95,162,0.45)", "rgba(56,189,248,0.45)"],
  };
  const colors = heartColors[pageTheme] || heartColors.default;
  return (
    <>
      {[...Array(35)].map((_, i) => (
        <motion.div key={i}
          initial={{ y: "110vh", x: `${Math.random() * 100}vw`, opacity: 0 }}
          animate={{ y: "-20vh", opacity: [0, 0.4, 0], scale: [0.5, 1.2, 0.7], rotate: [0, 180, 360] }}
          transition={{ duration: Math.random() * 15 + 15, repeat: Infinity, delay: Math.random() * 25, ease: "linear" }}
          style={{ position: "absolute", color: i % 2 === 0 ? colors[0] : colors[1] }}
        >
          <Favorite sx={{ fontSize: Math.random() * 40 + 15 }} />
        </motion.div>
      ))}
    </>
  );
});

const GlobalBackground = ({ mode }) => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const routeThemes = {
  "/mes1": "default",
  "/mes2": "default",
  "/mes3": "mes3",
  "/mes4": "mes4",
  "/mes5": "mes5",
  "/mes6": "default",
  "/mes7": "default",
  "/mes8": "default",
   "/mes9": "default",
  "/cumple": "cumple",
  "/san-valentin": "default",
};

  const pageTheme = routeThemes[location.pathname] || "default";
  const bgs = {
    dark: {
      default: "radial-gradient(circle at 50% 50%,#1a0510 0%,#050505 100%)",
      mes3: "radial-gradient(circle at 50% 50%,#0a051a 0%,#050505 100%)",
      mes4: "radial-gradient(circle at 50% 50%,#2b2100 0%,#050505 100%)",
      mes5: "radial-gradient(circle at 50% 50%,#071a0d 0%,#050505 100%)",
      cumple: "radial-gradient(circle at 50% 50%,#12071e 0%,#050505 100%)",
    },
    light: {
      default: "radial-gradient(circle at 50% 50%,#fff0f5 0%,#ffd1dc 100%)",
      mes3: "radial-gradient(circle at 50% 50%,#f0ebff 0%,#d1c4e9 100%)",
      mes4: "radial-gradient(circle at 50% 50%,#fffdf3 0%,#f7efc8 100%)",
      mes5: "radial-gradient(circle at 50% 50%,#edfbe9 0%,#b9e4c9 100%)",
      cumple: "radial-gradient(circle at 50% 50%,#fff5fb 0%,#e9dcff 100%)",
    }
  };

  if (isHome) return null; // Home maneja su propio fondo inline

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      zIndex: -1, transition: "background 1.2s ease-in-out",
      background: bgs[mode][pageTheme], overflow: "hidden", pointerEvents: "none"
    }}>
      <HeartsAnimation pageTheme={pageTheme} />
    </div>
  );
};

// ─── CANVAS — partículas flotantes para el Home ───────────────────────────────
const ParticleCanvas = memo(({ mode }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let W, H;

    const isDark = mode === "dark";

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Partículas: mix de puntos y mini-corazones
    const N = 55;
    const particles = Array.from({ length: N }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2.2 + 0.6,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(Math.random() * 0.35 + 0.1),
      alpha: Math.random() * 0.5 + 0.15,
      isHeart: i % 7 === 0,
      size: Math.random() * 7 + 5,
      hue: isDark
        ? Math.random() > 0.5 ? "255,64,129" : "180,80,255"
        : Math.random() > 0.5 ? "220,30,90" : "150,60,220",
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.008 + 0.003,
    }));

    // Dibuja corazón centrado en (0,0), tamaño s
    const drawHeart = (ctx, s) => {
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.3);
      ctx.bezierCurveTo(s * 0.6, -s, s * 1.1, s * 0.1, 0, s * 0.8);
      ctx.bezierCurveTo(-s * 1.1, s * 0.1, -s * 0.6, -s, 0, -s * 0.3);
      ctx.closePath();
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.phase += p.speed;
        p.x += p.vx + Math.sin(p.phase) * 0.18;
        p.y += p.vy;
        if (p.y < -20) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -20) p.x = W + 10;
        if (p.x > W + 20) p.x = -10;

        ctx.save();
        ctx.globalAlpha = p.alpha * (0.7 + 0.3 * Math.sin(p.phase * 1.5));
        if (p.isHeart) {
          ctx.translate(p.x, p.y);
          ctx.rotate(Math.sin(p.phase * 0.5) * 0.3);
          ctx.fillStyle = `rgba(${p.hue},0.9)`;
          drawHeart(ctx, p.size);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.hue},0.85)`;
          ctx.fill();
        }
        ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [mode]);

  return (
    <canvas ref={canvasRef} style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      zIndex: -1, pointerEvents: "none",
    }} />
  );
});

// ─── ESTILOS ──────────────────────────────────────────────────────────────────
const injectStyles = () => {
  if (document.getElementById("lv4-styles")) return;
  const s = document.createElement("style");
  s.id = "lv4-styles";
  s.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');

    .lv4 {
      min-height:100vh;
      font-family:'Space Grotesk',sans-serif;
      padding-bottom:4rem;
    }
    .lv4 * { box-sizing:border-box; }

    /* ── variables de color ── */
    .lv4.dark {
      --c:#fff;
      --cm:rgba(255,255,255,0.42);
      --cs:rgba(255,255,255,0.1);
      --bg:rgba(255,255,255,0.04);
      --brd:rgba(255,255,255,0.09);
      --pink:#ff4081;
      --pink2:#ff80ab;
      --bg-base:linear-gradient(135deg,#0d0016 0%,#10000a 50%,#05080f 100%);
    }
    .lv4.light {
      --c:#120008;
      --cm:rgba(18,0,8,0.48);
      --cs:rgba(18,0,8,0.09);
      --bg:rgba(255,255,255,0.6);
      --brd:rgba(0,0,0,0.09);
      --pink:#d6185a;
      --pink2:#ff4081;
      --bg-base:linear-gradient(135deg,#fff0f6 0%,#fce8f0 50%,#f0eaff 100%);
    }

    /* ── fondo del home ── */
    .lv4-bg {
      position:fixed;top:0;left:0;width:100vw;height:100vh;
      z-index:-2;pointer-events:none;
      transition:background 0.8s ease;
    }
    .lv4.dark  .lv4-bg { background: linear-gradient(135deg,#0d0016 0%,#10000a 50%,#05080f 100%); }
    .lv4.light .lv4-bg { background: linear-gradient(135deg,#fff0f6 0%,#fce8f0 50%,#f0eaff 100%); }

    /* ── orbes ── */
    .lv4-orb {
      position:absolute;border-radius:50%;pointer-events:none;
      filter:blur(60px);
    }
    .lv4.dark .lv4-orb-1 {
      width:65vw;height:65vw;top:-15%;left:-15%;
      background:radial-gradient(circle,rgba(255,20,90,0.22) 0%,transparent 65%);
      animation:orb1 14s ease-in-out infinite alternate;
    }
    .lv4.dark .lv4-orb-2 {
      width:70vw;height:70vw;bottom:-10%;right:-15%;
      background:radial-gradient(circle,rgba(130,20,255,0.18) 0%,transparent 65%);
      animation:orb2 18s ease-in-out infinite alternate;
    }
    .lv4.dark .lv4-orb-3 {
      width:45vw;height:45vw;top:35%;left:25%;
      background:radial-gradient(circle,rgba(255,64,129,0.09) 0%,transparent 70%);
      animation:orb3 22s ease-in-out infinite alternate;
    }
    .lv4.light .lv4-orb-1 {
      width:65vw;height:65vw;top:-15%;left:-15%;
      background:radial-gradient(circle,rgba(255,80,150,0.28) 0%,transparent 65%);
      animation:orb1 14s ease-in-out infinite alternate;
    }
    .lv4.light .lv4-orb-2 {
      width:70vw;height:70vw;bottom:-10%;right:-15%;
      background:radial-gradient(circle,rgba(160,80,255,0.22) 0%,transparent 65%);
      animation:orb2 18s ease-in-out infinite alternate;
    }
    .lv4.light .lv4-orb-3 {
      width:45vw;height:45vw;top:35%;left:25%;
      background:radial-gradient(circle,rgba(255,64,129,0.14) 0%,transparent 70%);
      animation:orb3 22s ease-in-out infinite alternate;
    }
    @keyframes orb1 { from{transform:translate(0,0) scale(1)} to{transform:translate(12vw,8vh) scale(1.18)} }
    @keyframes orb2 { from{transform:translate(0,0) scale(1)} to{transform:translate(-9vw,-10vh) scale(1.12)} }
    @keyframes orb3 { from{transform:translate(0,0) scale(0.85)} to{transform:translate(6vw,7vh) scale(1.15)} }

    /* ── noise grain ── */
    .lv4-grain {
      position:fixed;top:0;left:0;width:100vw;height:100vh;
      z-index:-1;pointer-events:none;opacity:0.035;
      background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      background-size:180px 180px;
    }

    /* ── NAV ── */
    .lv4-nav {
      display:flex;justify-content:space-between;align-items:center;
      padding:1.5rem 1.5rem 0;position:relative;z-index:10;
    }
    .lv4-logo {
      font-family:'Space Mono',monospace;
      font-size:0.62rem;letter-spacing:0.22em;
      color:var(--pink);text-transform:uppercase;
    }
    .lv4-nav-center {
      font-family:'Space Mono',monospace;
      font-size:0.58rem;letter-spacing:0.12em;color:var(--cm);
    }
    .lv4-toggle {
      width:40px;height:40px;border-radius:10px;
      border:1px solid rgba(255,64,129,0.3);
      background:var(--bg);backdrop-filter:blur(12px);
      cursor:pointer;color:var(--c);font-size:1rem;
      display:flex;align-items:center;justify-content:center;
      transition:all 0.3s;
    }
    .lv4-toggle:hover { border-color:rgba(255,64,129,0.7);background:rgba(255,64,129,0.1); }

    /* ── HERO ── */
    .lv4-hero { padding:3rem 1.5rem 1.5rem; }
    .lv4-tag {
      display:inline-flex;align-items:center;gap:7px;
      font-family:'Space Mono',monospace;
      font-size:0.58rem;letter-spacing:0.2em;
      color:var(--pink);border:1px solid rgba(255,64,129,0.38);
      border-radius:4px;padding:0.28rem 0.75rem;margin-bottom:1.6rem;
    }
    .lv4-tag-dot {
      width:5px;height:5px;border-radius:50%;background:var(--pink);
      animation:blink 1.3s step-start infinite;
    }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

    .lv4-name {
      font-family:'Bebas Neue',sans-serif;
      font-size:clamp(5rem,23vw,13rem);
      line-height:0.87;letter-spacing:0.03em;
      color:var(--c);display:block;
    }
    .lv4.dark .lv4-name {
      text-shadow:0 0 80px rgba(255,30,100,0.3),0 0 160px rgba(255,30,100,0.12);
    }
    .lv4-name-outline {
      font-family:'Bebas Neue',sans-serif;
      font-size:clamp(5rem,23vw,13rem);
      line-height:0.87;letter-spacing:0.03em;
      -webkit-text-stroke:1.5px var(--pink2);
      color:transparent;display:block;margin-top:-0.04em;
    }
    .lv4-subtitle {
      font-family:'Space Grotesk',sans-serif;
      font-size:clamp(0.82rem,2.4vw,0.98rem);
      font-weight:300;color:var(--cm);
      margin-top:1.1rem;max-width:275px;line-height:1.65;
    }

    /* ── TICKER ── (CSS puro, sin motion wrapper que interfiera) */
    .lv4-ticker-outer {
      overflow:hidden;
      border-top:1px solid var(--brd);
      border-bottom:1px solid var(--brd);
      padding:0.7rem 0;margin:2rem 0;
      -webkit-mask-image:linear-gradient(90deg,transparent 0%,#000 7%,#000 93%,transparent 100%);
      mask-image:linear-gradient(90deg,transparent 0%,#000 7%,#000 93%,transparent 100%);
    }
    .lv4-ticker-track {
      display:flex;width:max-content;
      animation:ticker-loop 26s linear infinite;
      will-change:transform;
    }
    .lv4-ticker-outer:hover .lv4-ticker-track { animation-play-state:paused; }
    @keyframes ticker-loop {
      0%   { transform:translateX(0); }
      100% { transform:translateX(-50%); }
    }
    .lv4-ticker-half {
      display:flex;align-items:center;
      gap:2.5rem;padding-right:2.5rem;flex-shrink:0;
    }
    .lv4-ticker-item {
      font-family:'Space Mono',monospace;
      font-size:0.58rem;letter-spacing:0.18em;
      color:var(--cm);text-transform:uppercase;
      display:flex;align-items:center;gap:0.65rem;white-space:nowrap;
      flex-shrink:0;
    }
    .lv4-ticker-item .tk-accent { color:var(--pink); }
    .lv4-ticker-item .tk-bold {
      font-weight:700;color:var(--c);
    }

    /* ── CONTADOR ── */
    .lv4-counter {
      margin:0 1.5rem 2.5rem;
      display:grid;grid-template-columns:repeat(2,1fr);gap:0.7rem;
    }
    .lv4-cnt-big {
      grid-column:span 2;
      background:var(--bg);border:1px solid var(--brd);
      border-radius:18px;backdrop-filter:blur(18px);
      padding:1.5rem 1.8rem;
      display:flex;align-items:center;gap:1.2rem;
      position:relative;overflow:hidden;
    }
    .lv4-cnt-big::before {
      content:'';position:absolute;inset:0;border-radius:18px;
      background:linear-gradient(120deg,rgba(255,64,129,0.07) 0%,transparent 55%);
      pointer-events:none;
    }
    .lv4-cnt-big-num {
      font-family:'Bebas Neue',sans-serif;
      font-size:clamp(3.8rem,15vw,6.5rem);line-height:1;color:var(--c);
    }
    .lv4.dark .lv4-cnt-big-num { text-shadow:0 0 35px rgba(255,64,129,0.35); }
    .lv4-cnt-big-lbl {
      font-family:'Space Mono',monospace;font-size:0.58rem;
      letter-spacing:0.22em;color:var(--pink);text-transform:uppercase;display:block;
    }
    .lv4-cnt-big-sub { font-size:0.76rem;font-weight:300;color:var(--cm);margin-top:0.3rem; }

    .lv4-cnt-sm {
      background:var(--bg);border:1px solid var(--brd);
      border-radius:14px;backdrop-filter:blur(16px);
      padding:1.1rem 1.3rem;position:relative;overflow:hidden;
    }
    .lv4-cnt-sm-lbl {
      font-family:'Space Mono',monospace;font-size:0.52rem;
      letter-spacing:0.2em;color:var(--pink);text-transform:uppercase;display:block;margin-bottom:0.2rem;
    }
    .lv4-cnt-sm-num {
      font-family:'Bebas Neue',sans-serif;
      font-size:clamp(2.2rem,9vw,3.5rem);line-height:1;color:var(--c);
    }
    .lv4.dark .lv4-cnt-sm-num { text-shadow:0 0 22px rgba(255,64,129,0.22); }

    /* ── SECCIÓN CAPÍTULOS ── */
    .lv4-sec-hd {
      padding:0 1.5rem;margin-bottom:1rem;
      display:flex;align-items:center;gap:0.9rem;
    }
    .lv4-sec-line { flex:1;height:1px;background:var(--brd); }
    .lv4-sec-txt {
      font-family:'Space Mono',monospace;font-size:0.55rem;
      letter-spacing:0.28em;color:var(--cm);text-transform:uppercase;white-space:nowrap;
    }
    .lv4-grid {
      padding:0 1.5rem;
      display:grid;grid-template-columns:repeat(2,1fr);gap:0.7rem;
    }
    .lv4-card {
      border-radius:14px;border:1px solid var(--brd);
      background:var(--bg);backdrop-filter:blur(12px);
      padding:1.2rem 1.2rem 1rem;
      cursor:pointer;position:relative;overflow:hidden;
      transition:border-color 0.3s,transform 0.2s;
      display:flex;flex-direction:column;justify-content:space-between;
      min-height:118px;
    }
    .lv4-card:hover { border-color:rgba(255,64,129,0.5);transform:translateY(-3px); }
    .lv4-card-glow {
      position:absolute;top:-25px;right:-25px;
      width:90px;height:90px;border-radius:50%;
      opacity:0.14;pointer-events:none;
      transition:opacity 0.3s;filter:blur(20px);
    }
    .lv4-card:hover .lv4-card-glow { opacity:0.28; }
    .lv4-card-num {
      font-family:'Bebas Neue',sans-serif;
      font-size:2.6rem;line-height:1;color:var(--cs);display:block;
    }
    .lv4-card-title { font-size:0.85rem;font-weight:600;color:var(--c);display:block; }
    .lv4-card-desc  { font-size:0.72rem;font-weight:300;color:var(--cm);margin-top:0.12rem;display:block; }
    .lv4-card-arrow {
      position:absolute;bottom:0.9rem;right:1rem;
      font-size:0.72rem;color:rgba(255,64,129,0.55);
      font-family:'Space Mono',monospace;
      transition:color 0.3s,transform 0.3s;
    }
    .lv4-card:hover .lv4-card-arrow { color:var(--pink);transform:translate(3px,-3px); }

    /* ── CUMPLEAÑOS ── */
    .lv4-bday { margin:2rem 1.5rem 0; }
    .lv4-bday-btn {
      width:100%;border-radius:18px;
      border:1px solid rgba(255,64,129,0.38);
      background:var(--bg);backdrop-filter:blur(18px);
      padding:1.75rem 1.75rem;cursor:pointer;
      display:flex;align-items:center;gap:1.4rem;
      position:relative;overflow:hidden;
      transition:all 0.35s;text-align:left;
    }
    .lv4-bday-btn:hover { border-color:rgba(255,64,129,0.7);background:rgba(255,64,129,0.06); }
    .lv4-bday-scan {
      position:absolute;top:0;left:-100%;width:50%;height:100%;
      background:linear-gradient(90deg,transparent,rgba(255,64,129,0.08),transparent);
      animation:scan 2.6s linear infinite;
    }
    @keyframes scan { to { left:150%; } }
    .lv4-bday-cake { font-size:2.1rem;flex-shrink:0; }
    .lv4-bday-lbl {
      font-family:'Space Mono',monospace;font-size:0.55rem;
      letter-spacing:0.22em;color:var(--pink);text-transform:uppercase;
      display:block;margin-bottom:0.28rem;
    }
    .lv4-bday-title {
      font-family:'Bebas Neue',sans-serif;
      font-size:1.55rem;letter-spacing:0.04em;color:var(--c);
      display:block;line-height:1.1;
    }
    .lv4-bday-hint { font-size:0.74rem;font-weight:300;color:var(--cm);margin-top:0.28rem; }
    .lv4-bday-arrow {
      margin-left:auto;font-size:1.3rem;color:rgba(255,64,129,0.5);flex-shrink:0;
      transition:transform 0.3s,color 0.3s;
    }
    .lv4-bday-btn:hover .lv4-bday-arrow { transform:translateX(5px);color:var(--pink); }
  `;
  document.head.appendChild(s);
};

// ─── DATOS ────────────────────────────────────────────────────────────────────
const CHAPTERS = [
  { path: "/mes1", num: "01", title: "Mes Uno", desc: "Donde todo comenzó", glow: "#6a11cb" },
  { path: "/mes2", num: "02", title: "Mes Dos", desc: "Nuestra conexión real", glow: "#f5576c" },
  { path: "/mes3", num: "03", title: "Mes Tres", desc: "Seguimos creciendo juntos", glow: "#7c4dff" },
  { path: "/mes4", num: "04", title: "Mes Cuatro", desc: "Un capítulo dorado", glow: "#f4b400" },
  { path: "/mes5", num: "05", title: "Mes Cinco", desc: "Crecemos juntos", glow: "#43cea2" },
  { path: "/mes6", num: "06", title: "Mes Seis", desc: "El amor sigue creciendo", glow: "#ff6a88" },
  { path: "/mes7", num: "07", title: "Mes Siete", desc: "Siete meses de nosotros", glow: "#ff6b35" },
  { path: "/mes8", num: "08", title: "Mes Ocho", desc: "Ocho meses de nosotros", glow: "#9c27b0" },
  { path: "/mes9", num: "09", title: "Mes Nueve", desc: "Nueve meses de nosotros", glow: "#e91e63" },
];

// Items del ticker — suficientes para que la mitad llene la pantalla
const TICK = [
  { text: "Te Amo", bold: true },
  { text: "30 · Nov · 2025", bold: false },
  { text: "Diana", bold: true },
  { text: "Para siempre", bold: false },
  { text: "Nuestro universo", bold: false },
  { text: "Juntos", bold: true },
  { text: "♥", bold: false },
  { text: "Te Amo", bold: true },
  { text: "30 · Nov · 2025", bold: false },
  { text: "Diana", bold: true },
  { text: "Para siempre", bold: false },
  { text: "Nuestro universo", bold: false },
  { text: "Juntos", bold: true },
  { text: "♥", bold: false },
];

// ─── HOME ──────────────────────────────────────────────────────────────────────
function Home({ mode, toggleMode }) {
  const nav = useNavigate();
  const [time, setTime] = useState({});

  useEffect(() => {
    injectStyles();

    const tick = () => {
      const start = dayjs(FECHA_INICIO);
      const now = dayjs();

      const meses = now.diff(start, "month");
      const dias = now.diff(start.add(meses, "month"), "day");

      const restante = now.diff(
        start.add(meses, "month").add(dias, "day")
      );

      const dur = dayjs.duration(restante);

      setTime({
        meses,
        dias,
        horas: dur.hours(),
        minutos: dur.minutes(),
        segundos: dur.seconds(),
      });
    };

    tick();
    const id = setInterval(tick, 1000);

    return () => clearInterval(id);
  }, []);

  const pad = n => String(n ?? 0).padStart(2, "0");
  const fade = (delay = 0) => ({ initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] } });

  return (
    <div className={`lv4 ${mode}`}>

      {/* FONDO DEL HOME */}
      <div className="lv4-bg">
        <div className="lv4-orb lv4-orb-1" />
        <div className="lv4-orb lv4-orb-2" />
        <div className="lv4-orb lv4-orb-3" />
      </div>
      <div className="lv4-grain" />

      {/* PARTÍCULAS CANVAS */}
      <ParticleCanvas mode={mode} />

      {/* NAV */}
      <motion.div className="lv4-nav" {...fade(0)}>
        <div className="lv4-logo">♥ Nuestro Universo</div>
        <div className="lv4-nav-center">30.11.2025</div>
        <button className="lv4-toggle" onClick={toggleMode}>{mode === "dark" ? "☀️" : "🌙"}</button>
      </motion.div>

      {/* HERO */}
      <div className="lv4-hero">
        <motion.div {...fade(0.1)}>
          <div className="lv4-tag">
            <span className="lv4-tag-dot" />
            En vivo · desde noviembre 2025
          </div>
        </motion.div>
        <motion.div {...fade(0.2)}>
          <span className="lv4-name">DIANA</span>
          <span className="lv4-name-outline">TE AMO</span>
        </motion.div>
        <motion.p className="lv4-subtitle" {...fade(0.45)}>
          Cada día contigo es la página más bonita de esta historia.
        </motion.p>
      </div>
          {/* CARTA + VIDEO */}
<motion.div
  {...fade(0.6)}
  style={{
    margin: "1.6rem 1.5rem 0",
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    alignItems: "stretch",
  }}
>
  {/* CARTA */}
  <div
    style={{
      flex: "1 1 320px",
      maxWidth: "420px",
      borderRadius: "16px",
      border: "1px solid var(--brd)",
      background: "var(--bg)",
      backdropFilter: "blur(16px)",
      padding: "1.4rem 1.5rem",
    }}
  >
    <span
      style={{
        fontFamily: "'Bebas Neue',sans-serif",
        fontSize: "2.4rem",
        lineHeight: "0.6",
        color: "var(--pink)",
        opacity: 0.5,
        display: "block",
      }}
    >
      "
    </span>
    <p
      style={{
        fontSize: "0.88rem",
        fontWeight: 300,
        fontStyle: "italic",
        color: "var(--c)",
        lineHeight: 1.7,
        marginTop: "0.4rem",
      }}
    >
      Si algun dia vuelves aqui para recordar o te hace falta amor... recuerda que yo siempre tendre un amor inmenso por ti y si quieres volver a mi lado, siempre estare aqui para ti. Te amo con todo mi corazon y espero que nunca lo olvides, si volviera a nacer volveria a elegirte millones de veces, te amo hoy, mañana y siempre amor mio.
    </p>
    <span
      style={{
        fontFamily: "'Space Mono',monospace",
        fontSize: "0.56rem",
        letterSpacing: "0.18em",
        color: "var(--pink)",
        textTransform: "uppercase",
        marginTop: "0.9rem",
        display: "block",
      }}
    >
      — Tu amor eterno, Eithan
    </span>
  </div>

  {/* VIDEO */}
  <motion.div
    whileHover={{ y: -3, borderColor: "rgba(255,64,129,0.7)" }}
    transition={{ duration: 0.25 }}
    style={{
      flex: "1 1 320px",
      maxWidth: "420px",
      position: "relative",
      overflow: "hidden",
      borderRadius: "16px",
      border: "1px solid rgba(255,64,129,0.35)",
      background: "var(--bg)",
      backdropFilter: "blur(16px)",
      padding: "1rem 1rem 1.1rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.8rem",
    }}
  >
    {/* resplandor */}
    <div
      style={{
        position: "absolute",
        top: "-40px",
        right: "-40px",
        width: "140px",
        height: "140px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,64,129,0.35), transparent 70%)",
        filter: "blur(18px)",
        pointerEvents: "none",
      }}
    />

    {/* encabezado */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
        zIndex: 1,
      }}
    >
      <span
        style={{
          fontFamily: "'Space Mono',monospace",
          fontSize: "0.56rem",
          letterSpacing: "0.2em",
          color: "var(--pink)",
          textTransform: "uppercase",
        }}
      >
        En este tiempo, por favor no dejes de amarme amor mio
      </span>
      <motion.span
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        style={{ color: "var(--pink)", display: "inline-block" }}
      >
        ♥
      </motion.span>
    </div>

    {/* marco del video */}
    <div
      style={{
        position: "relative",
        zIndex: 1,
        borderRadius: "12px",
        overflow: "hidden",
        background: "#000",
        border: "1px solid var(--brd)",
        boxShadow: "0 8px 30px rgba(255,64,129,0.18)",
      }}
    >
      <video
        src={juntosVideo}
        controls
        playsInline
        preload="metadata"
        // poster="/portada-video.jpg"
        style={{
          display: "block",
          width: "100%",
          maxHeight: "60vh",
          objectFit: "contain",
          background: "#000",
        }}
      />
    </div>

    <p
      style={{
        position: "relative",
        zIndex: 1,
        fontSize: "0.74rem",
        fontWeight: 300,
        fontStyle: "italic",
        color: "var(--cm)",
        textAlign: "center",
        margin: 0,
      }}
    >
      Estoy seguro que volveremos a ser estos dos, no te tardes tanto por favor, yo te estare esparando mi vida entera si es necesarioe, te prometo amarte por el resto de mis dias, te amo y te extraño cada dia más mi vida hermosa ♥
    </p>
  </motion.div>
</motion.div>

      {/* ── TICKER — CSS puro, sin motion en el wrapper ── */}
      <div className="lv4-ticker-outer">
        <div className="lv4-ticker-track">
          {/* mitad A */}
          <div className="lv4-ticker-half">
            {TICK.map((t, i) => (
              <div key={"a" + i} className="lv4-ticker-item">
                <span className="tk-accent">✦</span>
                <span className={t.bold ? "tk-bold" : ""}>{t.text}</span>
              </div>
            ))}
          </div>
          {/* mitad B — idéntica, para loop sin salto */}
          <div className="lv4-ticker-half">
            {TICK.map((t, i) => (
              <div key={"b" + i} className="lv4-ticker-item">
                <span className="tk-accent">✦</span>
                <span className={t.bold ? "tk-bold" : ""}>{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTADOR */}
      <motion.div className="lv4-counter" {...fade(0.55)}>
        <div className="lv4-cnt-big">
          <AnimatePresence mode="wait">
            <motion.span key={time.meses} className="lv4-cnt-big-num"
              initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 12, opacity: 0 }} transition={{ duration: 0.28 }}>
              {pad(time.meses)}
            </motion.span>
          </AnimatePresence>
          <div>
            <span className="lv4-cnt-big-lbl">Meses juntos</span>
            <div className="lv4-cnt-big-sub">y siguen sumando ♥</div>
          </div>
        </div>
        {[
          { val: time.dias, lbl: "Días" },
          { val: time.horas, lbl: "Horas" },
          { val: time.minutos, lbl: "Minutos" },
          { val: time.segundos, lbl: "Segundos" },
        ].map(({ val, lbl }) => (
          <div key={lbl} className="lv4-cnt-sm">
            <span className="lv4-cnt-sm-lbl">{lbl}</span>
            <AnimatePresence mode="wait">
              <motion.span key={val} className="lv4-cnt-sm-num"
                initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} transition={{ duration: 0.22 }}>
                {pad(val)}
              </motion.span>
            </AnimatePresence>
          </div>
        ))}
      </motion.div>

      {/* CAPÍTULOS */}
      <motion.div {...fade(0.7)}>
        <div className="lv4-sec-hd">
          <div className="lv4-sec-line" />
          <span className="lv4-sec-txt">Nuestros capítulos</span>
          <div className="lv4-sec-line" />
        </div>
        <div className="lv4-grid">
          {CHAPTERS.map((ch, i) => (
            <motion.div key={ch.path} className="lv4-card"
              onClick={() => nav(ch.path)}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.75 + i * 0.06, duration: 0.4 }}
              whileTap={{ scale: 0.97 }}>
              <div className="lv4-card-glow" style={{ background: ch.glow }} />
              <span className="lv4-card-num">{ch.num}</span>
              <div>
                <span className="lv4-card-title">{ch.title}</span>
                <span className="lv4-card-desc">{ch.desc}</span>
              </div>
              <span className="lv4-card-arrow">↗</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CUMPLEAÑOS */}
      <motion.div className="lv4-bday" {...fade(1.1)}>
        <motion.div className="lv4-bday-btn" onClick={() => nav("/cumple")}
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <div className="lv4-bday-scan" />
          <motion.span className="lv4-bday-cake"
            animate={{ rotate: [0, -8, 8, -5, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}>
            🎂
          </motion.span>
          <div>
            <span className="lv4-bday-lbl">✦ Surprise unlocked</span>
            <span className="lv4-bday-title">Feliz Cumpleaños</span>
            <p className="lv4-bday-hint">Toca para abrir tu sorpresa especial ♥</p>
          </div>
          <span className="lv4-bday-arrow">→</span>
        </motion.div>
      </motion.div>

    </div>
  );
}

// ─── ROOT ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [mode, setMode] = useState(() => localStorage.getItem("userTheme") || "dark");
  useEffect(() => { localStorage.setItem("userTheme", mode); }, [mode]);
  const toggleMode = () => setMode(m => m === "dark" ? "light" : "dark");

  const theme = useMemo(() => createTheme({
    palette: { mode, primary: { main: "#ff69b4" } },
    typography: { fontFamily: "Space Grotesk, sans-serif" },
  }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <GlobalBackground mode={mode} />
        <Routes>
          <Route path="/" element={<Home mode={mode} toggleMode={toggleMode} />} />
          <Route path="/mes1" element={<Mes1 mode={mode} toggleMode={toggleMode} />} />
          <Route path="/mes2" element={<Mes2 mode={mode} toggleMode={toggleMode} />} />
          <Route path="/mes3" element={<Mes3 mode={mode} toggleMode={toggleMode} />} />
          <Route path="/mes4" element={<Mes4 mode={mode} toggleMode={toggleMode} />} />
          <Route path="/mes5" element={<Mes5 mode={mode} toggleMode={toggleMode} />} />
          <Route path="/mes6" element={<Mes6 mode={mode} toggleMode={toggleMode} />} />
          <Route path="/mes7" element={<Mes7 mode={mode} toggleMode={toggleMode} />} />
          <Route path="/mes8" element={<Mes8 mode={mode} toggleMode={toggleMode} />} />
          <Route path="/mes9" element={<Mes9 mode={mode} toggleMode={toggleMode} />} />
          <Route path="/san-valentin" element={<SanValentin mode={mode} />} />
          <Route path="/cumple" element={<Cumple mode={mode} toggleMode={toggleMode} />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}