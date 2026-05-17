import React from "react";

export default function AnimatedCustomer({ 
  reaction, 
  customerEmoji = "🧑‍🌾", 
  itemEmoji = "🍏",
  text
}) {
  // Map reaction props to specific visual elements
  let reactionEmoji = "😊";
  let defaultText = "Good price!";
  let bubbleBg = "from-emerald-500 to-emerald-600";
  let textColour = "text-emerald-100";

  if (reaction === "bargain") {
    reactionEmoji = "😍";
    defaultText = "What a bargain!";
    bubbleBg = "from-pink-500 to-rose-600";
    textColour = "text-rose-100";
  } else if (reaction === "expensive") {
    reactionEmoji = "😠";
    defaultText = "Too expensive!";
    bubbleBg = "from-amber-500 to-amber-600 border-amber-300";
    textColour = "text-amber-100";
  }

  const displayText = text || defaultText;

  return (
    <div className="relative flex flex-col items-center justify-center select-none w-full max-w-sm mx-auto z-40">
      
      {/* Pure CSS Keyframes for Interactive Walk-In Sequence */}
      <style>{`
        @keyframes customerWalk {
          0% {
            transform: translateX(-100vw) scale(0.9);
            opacity: 0;
          }
          16% {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
          84% {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateX(100vw) scale(0.9);
            opacity: 0;
          }
        }

        @keyframes bubblePop {
          0%, 19% {
            transform: scale(0) translateY(10px);
            opacity: 0;
          }
          22% {
            transform: scale(1.1) translateY(0);
            opacity: 1;
          }
          25%, 80% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
          83%, 100% {
            transform: scale(0) translateY(-10px);
            opacity: 0;
          }
        }

        @keyframes characterBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        .anim-customer-walk {
          animation: customerWalk 2.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        .anim-bubble-pop {
          animation: bubblePop 2.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .anim-character-bob {
          animation: characterBob 0.6s infinite ease-in-out;
        }
      `}</style>

      {/* The Animated Wrapper walking across the floor */}
      <div className="anim-customer-walk flex flex-col items-center relative">
        
        {/* 1. Speech Bubble (Pops up with reaction emoji after entering) */}
        <div className="anim-bubble-pop mb-4 relative z-50">
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r ${bubbleBg} shadow-2xl border border-white/20`}>
            {/* Pointer Pin */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-inherit transform rotate-45 border-r border-b border-white/25 z-0" />
            
            {/* Reaction Emoji Badge */}
            <span className="text-2xl filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)] animate-pulse">
              {reactionEmoji}
            </span>
            
            {/* Content text */}
            <div className="flex flex-col text-left">
              <span className={`text-[11px] font-bold tracking-tight uppercase leading-none font-mono ${textColour} opacity-80`}>
                Customer Reaction
              </span>
              <span className="text-xs font-bold text-white mt-1 leading-tight font-primary">
                "{displayText}"
              </span>
            </div>
            
            {/* Targeted Stock Unit Icon */}
            <span className="text-base bg-black/35 w-6 h-6 rounded-full flex items-center justify-center border border-white/10" title="Item of Interest">
              {itemEmoji}
            </span>
          </div>
        </div>

        {/* 2. Customer Avatar */}
        <div className="anim-character-bob flex flex-col items-center">
          <div className="relative w-20 h-20 bg-slate-800/80 rounded-full border-2 border-amber-400/50 flex items-center justify-center shadow-xl backdrop-blur-sm">
            
            {/* Pulsing light rings */}
            <div className="absolute inset-0 rounded-full border border-amber-400/20 animate-ping opacity-30" />
            
            {/* Big customer emoji */}
            <span className="text-5xl filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]" role="img" aria-label="Customer">
              {customerEmoji}
            </span>
            
            {/* Mini bag accessory */}
            <span className="absolute bottom-0 right-0 text-xl bg-slate-950/80 p-0.5 rounded-full border border-white/10" role="img" aria-label="Shopping Bag">
              🛍️
            </span>
          </div>

          {/* Visual Shadow beneath customer */}
          <div className="w-14 h-2 bg-black/60 rounded-full filter blur-[1px] mt-1.5 opacity-70 animate-pulse" />
        </div>

      </div>

    </div>
  );
}
