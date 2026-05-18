import React from 'react';

// Pure CSS Tooltip
const Tooltip = ({ text }) => (
  <div className="relative group inline-block cursor-help z-50">
    <span className="text-slate-500 hover:text-amber-400 transition-colors font-black text-[10px] px-1.5 py-0.5 rounded-full border border-slate-600 hover:border-amber-400">?</span>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3 bg-slate-800 text-slate-200 text-xs rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none shadow-2xl border border-slate-500 text-center leading-relaxed normal-case tracking-normal">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-500"></div>
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-[7px] border-transparent border-t-slate-800"></div>
    </div>
  </div>
);

// Visual Gauge to teach pricing strategy
const PriceGauge = ({ currentPrice, wholesaleCost }) => {
  const price = Number(currentPrice) || 0;
  const ratio = price / wholesaleCost;
  
  let label = "Set a price!";
  let barColor = "bg-slate-600";
  let markerPosition = 0;

  if (price > 0) {
    markerPosition = Math.min((ratio / 4) * 100, 100); 
    if (ratio < 1) { label = "Losing Money!"; barColor = "bg-rose-500"; }
    else if (ratio <= 1.5) { label = "Bargain!"; barColor = "bg-emerald-300"; }
    else if (ratio <= 2.5) { label = "Sweet Spot"; barColor = "bg-emerald-500"; }
    else { label = "Too Expensive"; barColor = "bg-rose-500"; }
  }

  return (
    <div className="w-full bg-slate-950/50 p-4 rounded-xl border border-slate-800">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Market Check</span>
        <span className={`text-[10px] font-black uppercase tracking-wider ${price > 0 ? (ratio > 2.5 || ratio < 1 ? 'text-rose-400' : 'text-emerald-400') : 'text-slate-500'}`}>
          {label}
        </span>
      </div>
      <div className="h-3 w-full bg-slate-800 rounded-full relative overflow-hidden shadow-inner">
        <div className={`absolute top-0 left-0 h-full transition-all duration-300 rounded-full ${barColor}`} style={{ width: `${markerPosition}%` }} />
        <div className="absolute top-0 left-1/4 h-full w-[1px] bg-white/20"></div>
        <div className="absolute top-0 left-[62.5%] h-full w-[1px] bg-white/20"></div>
      </div>
    </div>
  );
};

// Horizontal Row Layout for Products
const ProductRow = ({ item, inventory, currentPrice, onBuy, onPriceChange, bankBalance }) => {
  const stock = inventory[item.id] || 0;
  const batchCost = Number((item.wholesaleCost * 10).toFixed(2));
  const canAfford = bankBalance >= batchCost;
  const priceNum = Number(currentPrice) || 0;
  const profitPerItem = Math.max(-item.wholesaleCost, priceNum - item.wholesaleCost);

  const handleDecrease = () => onPriceChange(item.id, Math.max(0, Math.round((priceNum - 0.10) * 100) / 100).toFixed(2));
  const handleIncrease = () => onPriceChange(item.id, (Math.round((priceNum + 0.10) * 100) / 100).toFixed(2));

  return (
    <div className="bg-slate-800 border-2 border-slate-600 rounded-3xl p-6 mb-6 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl hover:border-slate-400 transition-colors">
      
      <div className="flex items-center gap-5 w-full lg:w-1/4 min-w-[240px]">
        <span className="text-6xl drop-shadow-md">{item.emoji}</span>
        <div>
          <h3 className="text-white font-black text-base uppercase tracking-wide leading-tight mb-2">{item.name}</h3>
          <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 shadow-inner">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mr-2">Stock:</span>
            <span className={stock > 0 ? 'text-emerald-400 font-black text-sm' : 'text-rose-400 font-black text-sm'}>{stock}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between bg-slate-900/40 p-4 rounded-2xl border border-slate-700/50 w-full lg:w-1/4 min-w-[220px]">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Cost Per Item</span>
            <Tooltip text="The wholesale price you pay the supplier to buy one unit of this stock." />
          </div>
          <span className="text-white font-mono font-bold text-sm">${item.wholesaleCost.toFixed(2)}</span>
        </div>
        
        <button 
          onClick={() => onBuy(item.id, 10, item.wholesaleCost)}
          disabled={!canAfford}
          className={`text-xs font-black px-4 py-2.5 rounded-xl transition-transform shadow-md ${canAfford ? 'bg-indigo-500 hover:bg-indigo-400 text-white hover:scale-105 active:scale-95' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
        >
          BUY 10 (-${batchCost.toFixed(2)})
        </button>
      </div>

      <div className="flex items-center justify-between bg-slate-900/40 p-4 rounded-2xl border border-slate-700/50 w-full lg:w-1/4 min-w-[240px]">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Profit Per Item</span>
            <Tooltip text="What you make on every unit sold after subtracting the wholesale cost. Retail Price minus Cost!" />
          </div>
          <span className={`font-mono font-black text-sm ${profitPerItem >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {profitPerItem < 0 ? '-' : ''}${Math.abs(profitPerItem).toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 rounded-xl border border-slate-600 p-1.5 shadow-inner">
          <button onClick={handleDecrease} className="w-10 h-10 flex items-center justify-center bg-slate-800 hover:bg-slate-600 rounded-lg text-slate-300 hover:text-white transition-colors font-black text-2xl select-none active:scale-95">-</button>
          <span className="w-20 text-center text-sm text-amber-400 font-black font-mono select-none">${priceNum.toFixed(2)}</span>
          <button onClick={handleIncrease} className="w-10 h-10 flex items-center justify-center bg-slate-800 hover:bg-slate-600 rounded-lg text-slate-300 hover:text-white transition-colors font-black text-2xl select-none active:scale-95">+</button>
        </div>
      </div>

      <div className="w-full lg:w-1/4">
        <PriceGauge currentPrice={currentPrice} wholesaleCost={item.wholesaleCost} />
      </div>

    </div>
  );
};

export default function TheBooks({ 
  gameState, 
  availableCatalogue, 
  stockCatalogue,
  buyWholesaleStock, 
  setRetailPrice, 
  onSimulateDay, 
  isSimulating,
  neonSignTier,
  upgradeNeonSign,
  marketingActive,
  launchMarketing
}) {
  const handleBuy = (id, qty, cost) => buyWholesaleStock(id, qty, cost);
  const handlePrice = (id, price) => setRetailPrice(id, price);
  const neonUpgradeCost = neonSignTier === 0 ? 150 : neonSignTier === 1 ? 300 : neonSignTier === 2 ? 600 : null;
  const catalogue = availableCatalogue || stockCatalogue || [];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-black/85 backdrop-blur-md">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-[2.5rem] shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header - Fixed Height */}
        <div className="bg-slate-950 p-6 sm:p-8 border-b-2 border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-6 shrink-0 z-10 shadow-lg">
          <div className="text-center sm:text-left">
            <h2 className="text-4xl font-black text-amber-400 tracking-tight uppercase">Shop Setup: Day {gameState.currentDay}</h2>
            <p className="text-slate-400 text-sm font-bold mt-2 tracking-wide">Configure procurement and pricing parameters in a row ledger.</p>
          </div>
          <div className="bg-slate-800 border-2 border-emerald-900/50 px-8 py-4 rounded-3xl text-center shadow-inner">
            <p className="text-slate-400 text-[10px] font-black tracking-widest uppercase mb-1">Cash on Hand</p>
            <p className="text-4xl font-black text-emerald-400 font-mono drop-shadow-sm">${gameState.bankBalance.toFixed(2)}</p>
          </div>
        </div>

        {/* Scrollable Content - Shrink wraps when small, scrolls when large */}
        <div className="p-6 sm:p-10 overflow-y-auto bg-slate-900/50">
          <div className="mb-8">
            {catalogue.map(item => (
              <ProductRow 
                key={item.id}
                item={item}
                inventory={gameState.inventory}
                currentPrice={gameState.retailPrices[item.id]}
                onBuy={handleBuy}
                onPriceChange={handlePrice}
                bankBalance={gameState.bankBalance}
              />
            ))}
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-amber-500 font-black tracking-widest uppercase text-sm px-2">Marketing & Upgrades</h3>
            <div className="flex flex-wrap gap-6">
              {neonUpgradeCost && (
                <div className="flex-1 min-w-[280px] bg-indigo-950/40 border-2 border-indigo-700/50 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 text-center shadow-md">
                  <div className="flex items-center gap-2">
                    <p className="text-indigo-300 font-black text-sm uppercase tracking-wide">Neon Sign Upgrade</p>
                    <Tooltip text={`Attracts more customers! Buy the Tier ${neonSignTier + 1} Upgrade.`}/>
                  </div>
                  <button onClick={upgradeNeonSign} disabled={gameState.bankBalance < neonUpgradeCost} className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-sm font-black px-8 py-3 rounded-xl transition-transform hover:scale-105 active:scale-95 shadow-md w-full max-w-[200px]">
                    BUY FOR ${neonUpgradeCost}
                  </button>
                </div>
              )}
              {!marketingActive && (
                <div className="flex-1 min-w-[280px] bg-rose-950/40 border-2 border-rose-700/50 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 text-center shadow-md">
                  <div className="flex items-center gap-2">
                    <p className="text-rose-300 font-black text-sm uppercase tracking-wide">Flyer Campaign</p>
                    <Tooltip text="Spend $10 today to hand out flyers. It brings in extra customers for this day only!"/>
                  </div>
                  <button onClick={launchMarketing} disabled={gameState.bankBalance < 10} className="bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-sm font-black px-8 py-3 rounded-xl transition-transform hover:scale-105 active:scale-95 shadow-md w-full max-w-[200px]">
                    PAY $10
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer - Fixed Height */}
        <div className="bg-slate-950 p-6 sm:p-8 border-t-2 border-slate-700 shrink-0 z-10 shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.6)]">
          <button onClick={onSimulateDay} disabled={isSimulating} className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-600 text-black font-black text-3xl py-6 rounded-2xl transition-transform hover:scale-[1.01] active:scale-[0.99] shadow-2xl flex items-center justify-center tracking-wide">
            {isSimulating ? 'SIMULATING DAY...' : 'OPEN STORE & START TRADING'}
          </button>
        </div>
        
      </div>
    </div>
  );
}
