import React from "react";

export default function Shopkeeper() {
  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      
      {/* CSS Blinking and Breathing Animations */}
      <style>{`
        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        @keyframes breathKeeper {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes handTap {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(5deg); }
        }
        .anim-blink {
          animation: blink 4s infinite ease-in-out;
          transform-origin: center;
        }
        .anim-breath-keeper {
          animation: breathKeeper 2.5s infinite ease-in-out;
          transform-origin: bottom;
        }
        .anim-hand-tap {
          animation: handTap 1.2s infinite ease-in-out;
          transform-origin: left bottom;
        }
      `}</style>

      {/* Visual Shopkeeper Canvas (SVG) */}
      <div className="w-24 h-24 flex items-center justify-center anim-breath-keeper">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
          {/* Shoulders & Apron */}
          <path d="M20 90 C25 70, 75 70, 80 90 Z" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" />
          {/* White Chef Apron Front strap */}
          <rect x="42" y="72" width="16" height="20" fill="#f1f5f9" rx="2" />
          <path d="M36 72 L42 76" stroke="#f1f5f9" strokeWidth="2" />
          <path d="M64 72 L58 76" stroke="#f1f5f9" strokeWidth="2" />

          {/* Neck */}
          <rect x="46" y="58" width="8" height="10" fill="#fbcfe8" rx="2" />

          {/* Head */}
          <circle cx="50" cy="46" r="16" fill="#fbcfe8" stroke="#1e293b" strokeWidth="1.5" />

          {/* Hair / Headband (UK English styling: nice vibrant colours) */}
          <path d="M34 46 C34 32, 66 32, 66 46 C66 30, 34 30, 34 46 Z" fill="#d946ef" />
          {/* Sideburns */}
          <path d="M34 42 L36 48 L39 46 Z" fill="#1e293b" />
          <path d="M66 42 L64 48 L61 46 Z" fill="#1e293b" />

          {/* Shopkeeper Chef Hat */}
          <path d="M32 34 C30 20, 70 20, 68 34 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
          <rect x="36" y="30" width="28" height="6" fill="#f1f5f9" rx="1" />
          <circle cx="50" cy="22" r="8" fill="#ffffff" />
          
          {/* Eyes (Blinking) */}
          <g className="anim-blink">
            <circle cx="44" cy="45" r="2" fill="#000000" />
            <circle cx="56" cy="45" r="2" fill="#000000" />
            <circle cx="45" cy="44" r="0.7" fill="#ffffff" />
            <circle cx="57" cy="44" r="0.7" fill="#ffffff" />
          </g>

          {/* Blushing cheeks */}
          <circle cx="40" cy="49" r="2" fill="#f43f5e" opacity="0.5" />
          <circle cx="60" cy="49" r="2" fill="#f43f5e" opacity="0.5" />

          {/* Snout & Cute smile */}
          <path d="M47 50 Q50 53 53 50" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />

          {/* Gold Coin / Counter Accent */}
          <circle cx="82" cy="74" r="3" fill="#eab308" className="anim-hand-tap" />
        </svg>
      </div>

      {/* Shopkeeper Name Signboard */}
      <div className="mt-1 flex flex-col items-center">
        <span className="text-[10px] font-bold tracking-widest font-mono text-pink-400 uppercase">
          Shopkeeper
        </span>
        <span className="text-xs font-bold text-white mt-0.5">
          Stevie 🧑‍🍳
        </span>
      </div>

    </div>
  );
}
