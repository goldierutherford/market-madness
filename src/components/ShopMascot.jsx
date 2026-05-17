import React from "react";

export default function ShopMascot({ dailyProfit }) {
  // Determine state based on daily profit
  let state = "sleeping"; // "sleeping", "happy", "sad"
  if (dailyProfit !== undefined && dailyProfit !== null) {
    if (dailyProfit > 0) {
      state = "happy";
    } else if (dailyProfit < 0) {
      state = "sad";
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl w-48 transition-all duration-300 hover:scale-105 select-none">
      
      {/* State Badge */}
      <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-white/5">
        Mascot: {state}
      </span>

      {/* Floating 💤 Emojis for sleeping state */}
      {state === "sleeping" && (
        <div className="absolute top-4 right-8 pointer-events-none">
          <span className="absolute text-sm font-bold text-indigo-400 animate-[floatZ_2s_infinite_ease-in-out]">💤</span>
          <span className="absolute text-xs font-bold text-indigo-300 animate-[floatZ_2.5s_infinite_ease-in-out_0.5s] translate-x-3 -translate-y-2">💤</span>
          <span className="absolute text-[10px] font-bold text-indigo-200 animate-[floatZ_3s_infinite_ease-in-out_1s] translate-x-6 -translate-y-4">💤</span>
        </div>
      )}

      {/* CSS Styles for Mascot Animations */}
      <style>{`
        @keyframes floatZ {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateY(-30px) scale(1.2); opacity: 0; }
        }
        @keyframes wag {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(25deg); }
        }
        @keyframes breathe {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.96) translateY(2px); }
        }
        @keyframes whimpering {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .anim-wag {
          animation: wag 0.2s infinite ease-in-out;
          transform-origin: 25px 65px;
        }
        .anim-breathe {
          animation: breathe 3s infinite ease-in-out;
          transform-origin: bottom;
        }
        .anim-sad {
          animation: whimpering 2.5s infinite ease-in-out;
        }
      `}</style>

      {/* Visual Mascot Dog Canvas */}
      <div className="w-32 h-32 flex items-center justify-center relative mt-2">
        {state === "happy" && (
          /* AWAKE & HAPPY WAGGY DOG */
          <svg viewBox="0 0 100 100" className="w-full h-full anim-breathe">
            {/* Tail (Wagging) */}
            <path 
              d="M20 70 C15 50, 5 55, 2 60 C5 65, 12 70, 20 70 Z" 
              fill="#1e293b" 
              stroke="#0f172a" 
              strokeWidth="1.5"
              className="anim-wag"
            />
            {/* Rear Leg */}
            <ellipse cx="32" cy="78" rx="8" ry="12" fill="#e2e8f0" stroke="#0f172a" strokeWidth="2"/>
            <circle cx="32" cy="85" r="4" fill="#1e293b" />
            
            {/* Body */}
            <ellipse cx="50" cy="70" rx="20" ry="15" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5"/>
            {/* Black Spot on Body */}
            <path d="M42 58 C35 62, 38 78, 48 78 C52 74, 48 60, 42 58 Z" fill="#1e293b" />
            
            {/* Front Legs */}
            <rect x="42" y="74" width="6" height="16" rx="3" fill="#ffffff" stroke="#0f172a" strokeWidth="2"/>
            <rect x="52" y="74" width="6" height="16" rx="3" fill="#ffffff" stroke="#0f172a" strokeWidth="2"/>
            
            {/* Head (Scruffy Hair Tufts) */}
            <g transform="translate(0, -5)">
              <circle cx="60" cy="48" r="18" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5"/>
              {/* Scruffy hair tufts */}
              <path d="M42 42 L38 40 L41 45 L37 45 L42 49" fill="none" stroke="#0f172a" strokeWidth="2.5" />
              <path d="M78 42 L82 40 L79 45 L83 45 L78 49" fill="none" stroke="#0f172a" strokeWidth="2.5" />
              
              {/* Black Patch over Eye */}
              <path d="M50 35 C42 40, 45 54, 56 54 C60 48, 56 36, 50 35 Z" fill="#1e293b" />
              
              {/* Happy Perked Ears */}
              <path d="M46 36 C42 20, 36 24, 40 34 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="2"/>
              <path d="M74 36 C78 20, 84 24, 80 34 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="2"/>
              
              {/* Eyes */}
              <circle cx="53" cy="46" r="3" fill="#ffffff" />
              <circle cx="53" cy="46" r="1.5" fill="#000" />
              <circle cx="67" cy="46" r="2" fill="#000" />
              
              {/* Snout & Nose */}
              <ellipse cx="64" cy="54" rx="7" ry="5" fill="#f1f5f9" stroke="#0f172a" strokeWidth="1.5"/>
              <polygon points="61,51 67,51 64,54" fill="#000" />
              
              {/* Happy Open Mouth & Tongue */}
              <path d="M60 56 Q64 62 68 56" fill="none" stroke="#0f172a" strokeWidth="2" />
              <path d="M62 58 Q64 64 66 58 Z" fill="#f43f5e" />
            </g>
          </svg>
        )}

        {state === "sad" && (
          /* HIDDEN / SAD WHIMPERING DOG */
          <svg viewBox="0 0 100 100" className="w-full h-full anim-sad">
            {/* Curled Body */}
            <circle cx="50" cy="72" r="22" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5"/>
            <path d="M38 58 C30 62, 35 84, 52 84 C62 82, 58 64, 50 58 Z" fill="#1e293b" />
            
            {/* Drooped Tail */}
            <path d="M30 82 C22 84, 18 78, 16 70 C19 72, 24 80, 30 82 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />

            {/* Drooped Head */}
            <g transform="translate(-4, 10)">
              <circle cx="62" cy="46" r="16" fill="#ffffff" stroke="#0f172a" strokeWidth="2"/>
              
              {/* Sad Drooped Ears */}
              <path d="M48 42 C40 48, 44 60, 50 54 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="2"/>
              <path d="M76 42 C84 48, 80 60, 74 54 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="2"/>
              
              {/* Sad Slanted Eyes */}
              <path d="M52 44 Q56 42 58 45" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M68 44 Q64 42 62 45" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="56" cy="47" r="1.5" fill="#0f172a" />
              <circle cx="64" cy="47" r="1.5" fill="#0f172a" />
              
              {/* Cute Tear */}
              <circle cx="53" cy="51" r="2" fill="#38bdf8" className="animate-pulse" />

              {/* Closed sad mouth */}
              <path d="M58 54 Q61 56 64 54" fill="none" stroke="#0f172a" strokeWidth="1.5" />
            </g>
          </svg>
        )}

        {state === "sleeping" && (
          /* SLEEPING DOG (CURLED UP) */
          <svg viewBox="0 0 100 100" className="w-full h-full anim-breathe">
            {/* Curled Body Nest */}
            <ellipse cx="50" cy="74" rx="26" ry="18" fill="#1e293b" stroke="#0f172a" strokeWidth="2.5"/>
            <ellipse cx="50" cy="72" rx="22" ry="14" fill="#ffffff" />
            
            {/* Paw tucked */}
            <circle cx="34" cy="76" r="4" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
            <circle cx="38" cy="78" r="4" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />

            {/* Black patches on back */}
            <path d="M40 60 Q50 64 55 58 Q60 70 40 72 Z" fill="#1e293b" />
            
            {/* Curled tucked head */}
            <g transform="translate(6, 12)">
              <circle cx="54" cy="48" r="14" fill="#ffffff" stroke="#0f172a" strokeWidth="2"/>
              <path d="M42 42 C38 48, 42 56, 46 52 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5"/>
              <path d="M66 42 C70 48, 66 56, 62 52 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5"/>
              
              {/* Sleeping curved eyes (zzZ) */}
              <path d="M47 48 Q50 51 53 48" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
              <path d="M57 48 Q60 51 63 48" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />

              {/* Tiny Nose */}
              <circle cx="55" cy="53" r="2" fill="#0f172a" />
            </g>
          </svg>
        )}
      </div>

      {/* Decorative text based on state */}
      <div className="mt-2 text-center">
        <h4 className="text-sm font-bold text-white">
          {state === "happy" && "Buster (Waggy!) 🐕"}
          {state === "sad" && "Buster (Whimpering) 🥺"}
          {state === "sleeping" && "Buster (Snoozing) 😴"}
        </h4>
        <p className="text-[11px] text-slate-400 mt-0.5">
          {state === "happy" && "Thrilled by your sales!"}
          {state === "sad" && "Daily overheads hurt..."}
          {state === "sleeping" && "Dreaming of sausages..."}
        </p>
      </div>
    </div>
  );
}
