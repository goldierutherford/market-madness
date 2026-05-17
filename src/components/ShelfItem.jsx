import React from "react";

export default function ShelfItem({ item, retailPrice }) {
  // Safe parsing for retail price with double fallback
  const displayPrice = typeof retailPrice === "number" 
    ? retailPrice.toFixed(2) 
    : parseFloat(retailPrice || 0).toFixed(2);

  // Fallbacks for missing details
  const name = item?.name || "Product";
  const emoji = item?.emoji || "📦";

  return (
    <div className="relative group flex items-center justify-center w-12 h-12 m-1.5 rounded-xl bg-slate-800/50 border border-white/5 hover:bg-slate-700/60 hover:border-white/20 hover:-translate-y-1 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer select-none shadow-md">
      
      {/* Product Emoji with hover wiggles */}
      <span 
        className="text-2xl filter drop-shadow-[0_2.5px_4px_rgba(0,0,0,0.6)] group-hover:animate-bounce" 
        role="img" 
        aria-label={name}
      >
        {emoji}
      </span>

      {/* Absolute-Positioned Hanging Price Tag (UK English $ symbol) */}
      <div className="absolute -bottom-2 -right-1 flex items-center gap-0.5 px-1 py-0.5 bg-gradient-to-r from-amber-400 to-amber-500 text-[9px] font-extrabold text-slate-950 rounded-sm shadow-md border border-amber-300 transform -rotate-12 group-hover:rotate-0 transition-transform duration-200 pointer-events-none select-none">
        {/* Tiny String Hole */}
        <span className="w-1 h-1 rounded-full bg-slate-950/20 border border-slate-950/10"></span>
        <span>${displayPrice}</span>
      </div>

      {/* Hover Info Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-950 text-white text-[10px] font-semibold rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-30 shadow-2xl border border-white/10">
        <span className="font-bold text-amber-300 block leading-tight">{name}</span>
        <span className="text-slate-400 block text-[9px] mt-0.5">Price: ${displayPrice}</span>
      </div>
      
    </div>
  );
}
