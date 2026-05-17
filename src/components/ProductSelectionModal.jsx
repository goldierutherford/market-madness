import React, { useState } from "react";
import { Sparkles, Check, ShoppingBag, Gift } from "lucide-react";
import { stockCatalogue } from "../hooks/useGameState";

export default function ProductSelectionModal({ 
  gameState, 
  onUnlockProducts, 
  onSkip 
}) {
  const { 
    unlockedProductIds = ["apple", "cucumber", "bread"], 
    nextProductUnlockAt = 1000, 
    pendingProductPicks = 0,
    currentTier = 1
  } = gameState;

  // Find products in masterCatalogue matching the current tier which are not yet unlocked
  const selectableItems = stockCatalogue.filter(
    (item) => !unlockedProductIds.includes(item.id) && item.tierRequired <= currentTier
  );

  const [selectedIds, setSelectedIds] = useState([]);

  if (pendingProductPicks <= 0 || selectableItems.length === 0) return null;

  // The first unlock milestone is at $1000. 
  // In simulateDay(), when the player hits $1000, nextProductUnlockAt is incremented to 1500.
  const isFirstUnlock = nextProductUnlockAt === 1500; 

  const handleToggleSelect = (itemId) => {
    setSelectedIds((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      } else {
        if (prev.length >= 3) {
          // Cap selection count at 3 max
          return prev;
        }
        return [...prev, itemId];
      }
    });
  };

  const handleConfirm = () => {
    onUnlockProducts(selectedIds);
    setSelectedIds([]);
  };

  // At the $1000 milestone (nextProductUnlockAt === 1500), they MUST select exactly 3 items.
  // At other milestones, they can select between 1 and 3 items.
  const isConfirmDisabled = isFirstUnlock ? selectedIds.length !== 3 : selectedIds.length === 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none animate-[fadeIn_0.3s_ease-out]">
      <div className="relative max-w-xl w-full bg-slate-900 border border-amber-400/40 rounded-[2rem] p-8 text-center shadow-[0_0_60px_rgba(245,158,11,0.25)]">
        
        {/* Glow Header Accent Emoji */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 border-4 border-slate-900 flex items-center justify-center text-3xl shadow-2xl animate-bounce">
          🎁
        </div>

        <div className="mt-8 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-black text-amber-400 uppercase tracking-widest font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            Product Catalogue Expansion
          </span>
          <h2 className="text-xl font-black tracking-tight text-white mt-3 uppercase font-mono">
            Unlock New Stock!
          </h2>
          <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
            {isFirstUnlock 
              ? "Congratulations on reaching $1,000! Select exactly 3 new wholesale products to add to your storefront catalogue."
              : `Milestone reached! Choose up to 3 premium products to expand your store selection, or skip to focus on current products.`}
          </p>
        </div>

        {/* Selected Counter Badge */}
        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-950/65 border border-white/5 text-xs font-mono font-bold text-slate-300">
          Selected: <span className={selectedIds.length === (isFirstUnlock ? 3 : selectedIds.length) ? "text-amber-400 font-extrabold animate-pulse" : "text-white"}>{selectedIds.length}</span> of {isFirstUnlock ? "3 (Required)" : "3 (Max)"}
        </div>

        {/* Scrollable Item Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[280px] overflow-y-auto p-1.5 mb-6 custom-scrollbar">
          {selectableItems.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <div 
                key={item.id} 
                onClick={() => handleToggleSelect(item.id)}
                className={`group relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 cursor-pointer select-none ${
                  isSelected 
                    ? "bg-amber-500/10 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)] transform scale-102"
                    : "bg-slate-950/40 border-white/5 hover:border-white/20 hover:bg-slate-950/65"
                }`}
              >
                {/* Selector indicator */}
                <div className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                  isSelected 
                    ? "bg-amber-400 border-amber-400 text-slate-950 scale-100"
                    : "border-white/10 text-transparent scale-90"
                }`}>
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>

                <span className="text-3xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] transform group-hover:scale-110 transition-transform duration-300">
                  {item.emoji}
                </span>
                
                <span className="text-[10px] text-slate-200 font-bold text-center mt-2 truncate max-w-full font-mono uppercase tracking-wide">
                  {item.name}
                </span>

                <span className="text-[9px] text-slate-400 font-mono mt-0.5">
                  Cost: ${item.wholesaleCost.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {!isFirstUnlock && (
            <button 
              onClick={onSkip}
              className="flex-1 py-3 px-6 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-white/10 text-slate-400 hover:text-white font-black text-xs uppercase tracking-widest font-mono transition-colors active:scale-98 cursor-pointer"
            >
              Skip for Now
            </button>
          )}
          <button 
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            className={`flex-1 py-3 px-6 rounded-2xl font-black text-xs uppercase tracking-widest font-mono shadow-lg transition-all active:scale-98 cursor-pointer ${
              isConfirmDisabled 
                ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-transparent"
                : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950"
            }`}
          >
            Confirm Selection
          </button>
        </div>

      </div>
    </div>
  );
}
