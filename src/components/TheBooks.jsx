import React, { useState } from "react";
import { stockCatalogue as defaultStockCatalogue } from "../hooks/useGameState";
import { 
  ShoppingBag, 
  Sliders, 
  X, 
  Plus, 
  Minus,
  Coins,
  Bookmark,
  TrendingUp,
  AlertTriangle
} from "lucide-react";

export default function TheBooks({ 
  gameState, 
  buyWholesaleStock, 
  setRetailPrice, 
  onClose,
  onSimulateDay,
  isSimulating,
  stockCatalogue = defaultStockCatalogue,
  neonSignTier,
  marketingActive,
  upgradeNeonSign,
  launchMarketing
}) {
  const { bankBalance, inventory, retailPrices } = gameState;

  // Local state to track bulk purchase quantites (default to 10 for quick fills)
  const [purchaseQuantities, setPurchaseQuantities] = useState(
    stockCatalogue.reduce((acc, item) => ({ ...acc, [item.id]: 10 }), {})
  );

  // Local state for pricing fields to ensure smooth typing
  const [tempRetailPrices, setTempRetailPrices] = useState(
    stockCatalogue.reduce((acc, item) => ({ 
      ...acc, 
      [item.id]: retailPrices[item.id] || (item.wholesaleCost * 1.5).toFixed(2) 
    }), {})
  );

  const updatePurchaseQty = (itemId, amount) => {
    setPurchaseQuantities((prev) => {
      const newQty = Math.max(1, (prev[itemId] || 0) + amount);
      return { ...prev, [itemId]: newQty };
    });
  };

  const handleQtyChange = (itemId, val) => {
    const qty = parseInt(val, 10);
    setPurchaseQuantities((prev) => ({
      ...prev,
      [itemId]: isNaN(qty) ? 1 : Math.max(1, qty)
    }));
  };

  const handlePriceChange = (itemId, val) => {
    setTempRetailPrices((prev) => ({
      ...prev,
      [itemId]: val
    }));
    
    const numPrice = parseFloat(val);
    if (!isNaN(numPrice) && numPrice >= 0) {
      setRetailPrice(itemId, numPrice);
    }
  };

  const calculateMarginMetrics = (item, retailPriceStr) => {
    const rPrice = parseFloat(retailPriceStr) || 0;
    if (rPrice <= 0) return { profit: 0, markup: 0 };
    const profit = rPrice - item.wholesaleCost;
    const markup = (profit / item.wholesaleCost) * 100;
    return { profit, markup };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none">
      
      {/* Ledger Container */}
      <div className="relative w-full max-w-6xl bg-[#090b0f] border border-amber-500/25 rounded-3xl shadow-[0_0_60px_rgba(245,158,11,0.12)] overflow-hidden flex flex-col h-[85vh] max-h-[800px]">
        
        {/* FIXED HEADER */}
        <header className="flex items-center justify-between p-6 bg-slate-900/80 border-b border-white/10 relative z-30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md">
              <Bookmark className="w-5.5 h-5.5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-widest font-mono text-amber-200 uppercase">
                Shop Management Ledger Books
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure procurement and pricing list parameters in a unified row ledger
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Cash Display HUD */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-950 border border-white/10 shadow-inner">
              <Coins className="w-4 h-4 text-emerald-400 animate-pulse" />
              <div className="text-right">
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest font-mono leading-none">Bank Balance</p>
                <p className="text-sm font-extrabold text-emerald-400 font-mono mt-0.5 leading-none">
                  ${bankBalance.toFixed(2)}
                </p>
              </div>
            </div>
            
            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Close books"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* UNIFIED SCROLLABLE SINGLE COLUMN */}
        <main className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4 scrollbar-thin pb-28">
          {stockCatalogue.map((item) => {
            const qty = purchaseQuantities[item.id] || 10;
            const totalCost = qty * item.wholesaleCost;
            const canAfford = bankBalance >= totalCost;
            const qtyInStock = inventory[item.id] || 0;
            const retailPriceStr = tempRetailPrices[item.id] ?? (item.wholesaleCost * 1.5).toFixed(2);
            const { profit, markup } = calculateMarginMetrics(item, retailPriceStr);

            // Price elasticity styling configs
            let priceAlert = "✨ Sweet Spot";
            let alertColor = "text-emerald-400";
            let barColor = "bg-emerald-500 animate-pulse";
            if (markup > 90) {
              priceAlert = "⚠️ High Price";
              alertColor = "text-amber-400";
              barColor = "bg-amber-500";
            } else if (markup < 40) {
              priceAlert = "📉 Thin Margins";
              alertColor = "text-sky-400";
              barColor = "bg-sky-500";
            }

            return (
              <div 
                key={item.id} 
                className="w-full rounded-2xl bg-slate-900/40 hover:bg-slate-900/60 border border-white/5 hover:border-white/10 p-5 transition-all duration-200 hover:shadow-lg"
              >
                {/* CSS GRID: Unified Row layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                  
                  {/* COLUMN 1: PRODUCT INFO (lg:col-span-3) */}
                  <div className="lg:col-span-3 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center text-3xl shadow-md filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]">
                      {item.emoji}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-100 uppercase tracking-wide">{item.name}</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">Wholesale cost: ${item.wholesaleCost.toFixed(2)}/unit</p>
                      
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold font-mono ${qtyInStock > 0 ? "bg-indigo-950 text-indigo-300 border border-indigo-900" : "bg-rose-950 text-rose-300 border border-rose-900"}`}>
                          Stocked: {qtyInStock} units
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* COLUMN 2: PROCUREMENT DIALS (lg:col-span-4) */}
                  <div className="lg:col-span-4 flex items-center gap-3 bg-slate-950/60 p-3 rounded-xl border border-white/5 justify-between">
                    <div className="text-left">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider font-mono">Wholesale Buy</p>
                      <p className="text-xs font-bold text-slate-200 mt-0.5 font-mono">Batch Size</p>
                    </div>

                    {/* Numeric counter dial */}
                    <div className="flex items-center bg-slate-900 border border-white/10 rounded-lg overflow-hidden h-8">
                      <button 
                        onClick={() => updatePurchaseQty(item.id, -5)} 
                        className="px-2.5 h-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input 
                        type="number" 
                        min="1" 
                        value={qty} 
                        onChange={(e) => handleQtyChange(item.id, e.target.value)}
                        className="w-12 text-center bg-transparent border-none text-xs font-extrabold font-mono text-slate-100 focus:outline-none"
                      />
                      <button 
                        onClick={() => updatePurchaseQty(item.id, 5)} 
                        className="px-2.5 h-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => buyWholesaleStock(item.id, qty, item.wholesaleCost)}
                      disabled={!canAfford}
                      className={`h-8 px-4 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-200 ${canAfford ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md active:scale-95 cursor-pointer" : "bg-slate-800 text-slate-500 cursor-not-allowed"}`}
                    >
                      {canAfford ? `Buy [$${totalCost.toFixed(2)}]` : "No Cash"}
                    </button>
                  </div>

                  {/* COLUMN 3: RETAIL PRICE SETTINGS (lg:col-span-2) */}
                  <div className="lg:col-span-2 flex flex-col gap-1 bg-slate-950/40 p-3 rounded-xl border border-white/5">
                    <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest font-mono">Retail Price</label>
                    <div className="relative flex items-center bg-slate-950 border border-white/10 rounded-lg overflow-hidden h-8 px-2 mt-0.5">
                      <span className="text-xs font-bold text-slate-500 font-mono">$</span>
                      <input
                        type="number"
                        step="0.05"
                        min="0"
                        value={retailPriceStr}
                        onChange={(e) => handlePriceChange(item.id, e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-transparent border-none text-xs font-black font-mono text-slate-100 focus:outline-none pl-1"
                      />
                    </div>
                  </div>

                  {/* COLUMN 4: ANALYTICS & SENSITIVITY (lg:col-span-3) */}
                  <div className="lg:col-span-3 flex flex-col gap-2 bg-slate-950/20 p-3 rounded-xl border border-white/5">
                    
                    {/* Read-only Margins data */}
                    <div className="flex justify-between items-center text-[10px] border-b border-white/5 pb-1.5">
                      <span className="text-slate-400 font-mono">Profit Margin:</span>
                      <span className={`font-mono font-black ${profit >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        ${profit.toFixed(2)} ({markup.toFixed(1)}%)
                      </span>
                    </div>

                    {/* Elasticity Advice Bar */}
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                          style={{ width: `${Math.min(100, Math.max(0, markup))}%` }}
                        />
                      </div>
                      <span className={`text-[9px] font-bold font-mono whitespace-nowrap ${alertColor}`}>
                        {priceAlert}
                      </span>
                    </div>

                  </div>

                </div>
              </div>
            );
          })}

          {/* MARKETING & UPGRADES SECTION */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <h3 className="text-sm font-black tracking-widest font-mono text-amber-200 uppercase mb-5 flex items-center gap-2">
              <span>📢 Marketing & Upgrades</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Card 1: Local Flyer Campaign */}
              <div className="rounded-2xl bg-slate-900/40 hover:bg-slate-900/60 border border-white/5 hover:border-white/10 p-5 transition-all duration-200 flex flex-col justify-between h-full">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-black text-slate-100 uppercase tracking-wider font-mono">
                        Local Flyer Campaign
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Daily Expense
                      </p>
                    </div>
                    <span className="text-xs font-mono font-extrabold text-emerald-400 bg-emerald-950/55 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-bold">
                      $15
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-3 font-medium leading-relaxed">
                    Distribute vibrant product pamphlets around the local chibi town centre. <span className="text-emerald-400 font-semibold font-mono">Boosts foot traffic by 30% for TODAY ONLY.</span>
                  </p>
                </div>
                
                <div className="mt-5 pt-4 border-t border-white/5">
                  {marketingActive ? (
                    <span className="inline-flex w-full items-center justify-center px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                      ✨ Campaign Active!
                    </span>
                  ) : (
                    <button
                      onClick={launchMarketing}
                      className="w-full h-10 rounded-xl text-[10px] font-black uppercase tracking-widest bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-200 active:scale-95 cursor-pointer shadow-md shadow-indigo-600/10 font-bold"
                    >
                      Launch Campaign
                    </button>
                  )}
                </div>
              </div>

              {/* Card 2: Neon Store Sign Upgrades */}
              <div className="rounded-2xl bg-slate-900/40 hover:bg-slate-900/60 border border-white/5 hover:border-white/10 p-5 transition-all duration-200 flex flex-col justify-between h-full">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-black text-slate-100 uppercase tracking-wider font-mono">
                        Neon Store Sign
                      </h4>
                      <p className="text-[10px] text-amber-400 font-mono font-bold mt-1">
                        Current Level: {neonSignTier} / 3
                      </p>
                    </div>
                    <span className="text-xs font-mono font-extrabold text-emerald-400 bg-emerald-950/55 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                      {neonSignTier === 0 ? "$150" : (neonSignTier === 1 ? "$300" : (neonSignTier === 2 ? "$600" : "MAX"))}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 mt-3 font-medium leading-relaxed space-y-2">
                    <p>
                      Install and upgrade a glowing gas-discharge neon sign high on the back wall of the store.
                    </p>
                    <div className="bg-slate-950/30 p-2.5 rounded-lg border border-white/[0.04] font-mono text-[10px] space-y-1">
                      <div className={neonSignTier >= 1 ? "text-emerald-400 font-bold" : "text-slate-500"}>
                        Level 1: Simple Red OPEN sign (+20% volume)
                      </div>
                      <div className={neonSignTier >= 2 ? "text-emerald-400 font-bold" : "text-slate-500"}>
                        Level 2: Pink OPEN + Cyan outline (+40% volume)
                      </div>
                      <div className={neonSignTier >= 3 ? "text-emerald-400 font-bold" : "text-slate-500"}>
                        Level 3: Rotating Stars SUPER MARKET (+60% volume)
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-5 pt-4 border-t border-white/5">
                  {neonSignTier >= 3 ? (
                    <span className="inline-flex w-full items-center justify-center px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.1)] font-mono">
                      👑 MAX LEVEL REACHED
                    </span>
                  ) : (
                    <button
                      onClick={upgradeNeonSign}
                      className="w-full h-10 rounded-xl text-[10px] font-black uppercase tracking-widest bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-200 active:scale-95 cursor-pointer shadow-md shadow-indigo-600/10 font-bold font-mono"
                    >
                      {neonSignTier === 0 ? "Buy & Install ($150)" : `Upgrade to Level ${neonSignTier + 1} ($${neonSignTier === 1 ? 300 : 600})`}
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </main>

        {/* FIXED FOOTER */}
        <footer className="relative z-30 shrink-0 p-6 bg-slate-900/90 border-t border-white/10 flex items-center justify-between">
          <div className="text-[10px] text-slate-400 max-w-[450px] font-mono leading-relaxed">
            📘 <span className="text-slate-200 font-semibold">Ledger Tip:</span> Wholesale stock loads into your visual inventory shelves. Listing retail prices within the <span className="text-emerald-400 font-semibold">Sweet Spot (40% - 90% markup)</span> encourages high daily traffic and fast turnovers.
          </div>
          
          <button
            onClick={onSimulateDay}
            disabled={isSimulating}
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-slate-950 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 transition-all duration-300 shadow-xl shadow-emerald-500/10 cursor-pointer active:scale-95 text-xs uppercase tracking-widest font-mono"
          >
            <span>Open Store & Start Trading</span>
          </button>
        </footer>

      </div>

    </div>
  );
}
