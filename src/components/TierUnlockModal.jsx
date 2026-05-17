import React from "react";
import { Sparkles, ArrowUpRight, CheckCircle, Store, Coins } from "lucide-react";
import { stockCatalogue } from "../hooks/useGameState";

export default function TierUnlockModal({ currentTier, onClose }) {
  // Define metadata for the tiers
  const tierInfo = {
    2: {
      name: "The Corner Shop",
      rent: "$15/day",
      customers: "25 visits per product",
      description: "Stevie has upgraded from a wooden stall to a brick-and-mortar storefront! Prepare for higher customer volumes and premium items.",
      emoji: "🏪"
    },
    3: {
      name: "The Premium Boutique",
      rent: "$50/day",
      customers: "50 visits per product",
      description: "Stevie has hit the high street! You are now managing a luxury boutique serving high-spending clientele with premium gear.",
      emoji: "🏢"
    }
  };

  const currentTierDetails = tierInfo[currentTier] || {
    name: "New Location Unlocked",
    rent: "Variable",
    customers: "Higher Volume",
    description: "Your business has progressed to the next level!",
    emoji: "🎉"
  };

  // Find newly unlocked items for this tier
  const newlyUnlockedItems = stockCatalogue.filter(
    (item) => item.tierRequired === currentTier
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none">
      
      {/* Self-contained CSS sparkles and scale-in animation classes */}
      <style>{`
        @keyframes scaleInCelebration {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes sparkleSlow {
          0%, 100% { transform: scale(1) translateY(0px); opacity: 0.3; }
          50% { transform: scale(1.3) translateY(-10px); opacity: 0.9; }
        }
        .animate-scale-in-celebration {
          animation: scaleInCelebration 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .confetti-sparkle {
          position: absolute;
          width: 8px;
          height: 8px;
          background: #f59e0b;
          border-radius: 50%;
          box-shadow: 0 0 12px #f59e0b;
          animation: sparkleSlow 3s ease-in-out infinite;
        }
      `}</style>

      {/* Celebration Confetti Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
        <div className="confetti-sparkle left-[10%] top-[20%]" style={{ animationDelay: "0.2s" }} />
        <div className="confetti-sparkle left-[80%] top-[15%]" style={{ animationDelay: "0.8s" }} />
        <div className="confetti-sparkle left-[25%] top-[70%]" style={{ animationDelay: "1.4s" }} />
        <div className="confetti-sparkle left-[75%] top-[65%]" style={{ animationDelay: "0.5s" }} />
        <div className="confetti-sparkle left-[45%] top-[10%]" style={{ animationDelay: "2.1s" }} />
      </div>

      {/* Main Celebration Card */}
      <div className="relative max-w-md w-full bg-slate-900 border border-amber-400/40 rounded-[2rem] p-8 text-center shadow-[0_0_60px_rgba(245,158,11,0.2)] animate-scale-in-celebration">
        
        {/* Glow Header Accent Emoji */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 to-amber-300 border-4 border-slate-900 flex items-center justify-center text-4xl shadow-2xl animate-bounce">
          {currentTierDetails.emoji}
        </div>

        <div className="mt-8 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-black text-amber-400 uppercase tracking-widest font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            Milestone Reached!
          </span>
          <h2 className="text-2xl font-black tracking-tight text-white mt-3 uppercase font-mono">
            Level Up!
          </h2>
          <p className="text-xs text-slate-300 mt-1.5">
            You have moved to a brand new location!
          </p>
        </div>

        {/* New Location Details Display */}
        <div className="p-4.5 rounded-2xl bg-slate-950/65 border border-white/5 mb-6 text-left">
          <div className="text-[9px] font-extrabold uppercase tracking-widest text-amber-400 font-mono">
            NEW LOCATION
          </div>
          <div className="text-lg font-black text-white mt-1 uppercase font-mono tracking-wide">
            {currentTierDetails.name}
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            {currentTierDetails.description}
          </p>
        </div>

        {/* Scaled Benefits Summary Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3 rounded-xl bg-slate-950/40 border border-white/5 text-left">
            <div className="flex items-center gap-1 text-emerald-400 font-bold text-[10px] uppercase font-mono">
              <ArrowUpRight className="w-3.5 h-3.5" />
              Traffic Up!
            </div>
            <p className="text-[10px] text-slate-300 mt-1 leading-normal">
              Customer flows upgraded to <strong className="text-white font-mono">{currentTierDetails.customers}</strong>!
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/40 border border-white/5 text-left">
            <div className="flex items-center gap-1 text-emerald-400 font-bold text-[10px] uppercase font-mono">
              <CheckCircle className="w-3.5 h-3.5" />
              New Items!
            </div>
            <p className="text-[10px] text-slate-300 mt-1 leading-normal">
              Premium high-margin wholesale items unlocked!
            </p>
          </div>
        </div>

        {/* Grid of newly unlocked wholesale items */}
        {newlyUnlockedItems.length > 0 && (
          <div className="mb-6">
            <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 font-mono">
              WHOLESALE ITEMS UNLOCKED
            </div>
            <div className="grid grid-cols-3 gap-2">
              {newlyUnlockedItems.map((item) => (
                <div key={item.id} className="flex flex-col items-center p-2.5 rounded-xl bg-slate-950/40 border border-white/5 hover:border-amber-400/20 transition-colors">
                  <span className="text-2xl" role="img" aria-label={item.name}>{item.emoji}</span>
                  <span className="text-[9px] text-slate-200 font-bold text-center mt-1 truncate max-w-full font-mono uppercase">
                    {item.name.replace("Beans", "").replace("Cheese", "").replace("Bouquet", "").trim()}
                  </span>
                  <span className="text-[8px] text-slate-500 font-mono mt-0.5">
                    Cost: ${item.wholesaleCost.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <button 
          onClick={onClose}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-widest font-mono shadow-lg transition-all active:scale-98 cursor-pointer"
        >
          Awesome! Let's trade!
        </button>

      </div>
    </div>
  );
}
