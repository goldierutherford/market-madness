import React from "react";
import { 
  X, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  DollarSign, 
  UserPlus, 
  Coins, 
  Home, 
  ChevronRight,
  Info
} from "lucide-react";
import { stockCatalogue } from "../hooks/useGameState";

export default function EndOfDayReport({ report, gameState, onClose }) {
  if (!report) return null;

  const { 
    daySimulated, 
    dailyRevenue = report.totalRevenue ?? 0, 
    dailyCOGS = report.dailyCOGS ?? 0, 
    dailyGrossProfit = report.dailyGrossProfit ?? ((report.totalRevenue ?? 0) - dailyCOGS), 
    rentDeducted = report.fixedCosts ?? 5, 
    marketingSpendToday = report.marketingSpendToday ?? 0,
    netProfit = report.netProfit ?? 0, 
    feedback = [], 
    itemsSold = {},
    insights = []
  } = report;
  const isProfitable = netProfit >= 0;

  // Get live stats or fallbacks from saved report parameters
  const currentBankBalance = gameState?.bankBalance ?? report.endingBalance ?? 500;
  
  // Calculate remaining stock asset valuation at wholesale cost
  const currentStockValuation = Object.entries(gameState?.inventory || report.remainingInventory || {}).reduce((total, [itemId, qty]) => {
    const item = stockCatalogue.find((i) => i.id === itemId);
    if (item && qty > 0) {
      return total + (qty * item.wholesaleCost);
    }
    return total;
  }, 0);

  // Cash flow change: Up or Down (revenue minus rent)
  const cashFlowChange = report.netLiquidChange ?? (dailyRevenue - rentDeducted);
  const isUp = cashFlowChange >= 0;

  // Calculate total units sold
  const totalUnitsSold = Object.values(itemsSold).reduce((a, b) => a + b, 0);

  return (
    <div className="report-overlay" onClick={onClose}>
      <div className="report-modal animate-scale-in" onClick={(e) => e.stopPropagation()}>
        {/* Modal Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          <X className="close-icon" />
        </button>

        {/* Report Header */}
        <div className="report-header">
          <div className="day-badge">Day {daySimulated} Complete</div>
          <h2 className="report-title">Daily Trading Statement</h2>
          <p className="report-subtitle">Trading statement and customer consensus feedback</p>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar mb-2 space-y-6">
          {/* Step-by-Step Vertical Financial Receipt (Accrual Accounting) */}
          <div className="bg-slate-950/40 border border-white/[0.06] rounded-2xl p-6 backdrop-blur-md font-mono text-sm max-w-xl mx-auto shadow-2xl relative overflow-hidden w-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-indigo-500 to-pink-500" />
            
            <div className="text-center mb-6">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">DAILY ACCRUAL RECEIPT</span>
              <h3 className="text-lg font-bold text-white mt-1">STALL TRANSACTION JOURNAL</h3>
              <p className="text-[10px] text-slate-400">Market Stall Tier 1 • Financial Accounting</p>
            </div>

            <div className="space-y-4">
              {/* Row 1: Total Sales Revenue */}
              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-slate-200">Total Sales Revenue</span>
                  <span className="text-[10px] text-slate-400 leading-normal">Gross cash generated from selling {totalUnitsSold} products today.</span>
                </div>
                <span className="text-white font-bold text-right whitespace-nowrap">${dailyRevenue.toFixed(2)}</span>
              </div>

              {/* Row 2: Cost of Stock Sold (COGS) */}
              <div className="flex justify-between items-start gap-4 text-rose-400">
                <div className="flex flex-col text-left">
                  <span className="font-semibold">Minus Cost of Stock Sold (COGS)</span>
                  <span className="text-[10px] text-rose-400/80 leading-normal">Wholesale procurement cost of stock items that successfully sold.</span>
                </div>
                <span className="font-bold text-right whitespace-nowrap">-${dailyCOGS.toFixed(2)}</span>
              </div>

              <div className="border-t border-dashed border-slate-700/60 my-2" />

              {/* Row 3: Gross Profit */}
              <div className="flex justify-between items-start gap-4 text-emerald-400">
                <div className="flex flex-col text-left">
                  <span className="font-semibold">= Gross Profit</span>
                  <span className="text-[10px] text-emerald-400/80 leading-normal">Trading earnings left over after subtracting wholesale stock expenses.</span>
                </div>
                <span className="font-bold text-right whitespace-nowrap">${dailyGrossProfit.toFixed(2)}</span>
              </div>

              {/* Row 4: Stall Rent */}
              <div className="flex justify-between items-start gap-4 text-rose-400">
                <div className="flex flex-col text-left">
                  <span className="font-semibold">Minus Stall Rent</span>
                  <span className="text-[10px] text-rose-400/80 leading-normal">Daily stall space rental overhead and municipal operating fee.</span>
                </div>
                <span className="font-bold text-right whitespace-nowrap">-${rentDeducted.toFixed(2)}</span>
              </div>

              {/* Row 4.5: Marketing Expense */}
              {marketingSpendToday > 0 && (
                <div className="flex justify-between items-start gap-4 text-rose-400 mt-2">
                  <div className="flex flex-col text-left">
                    <span className="font-semibold">Minus Marketing Expense</span>
                    <span className="text-[10px] text-rose-400/80 leading-normal">Daily flyer campaigns used to boost localized customer volume.</span>
                  </div>
                  <span className="font-bold text-right whitespace-nowrap">-${marketingSpendToday.toFixed(2)}</span>
                </div>
              )}

              <div className="border-t-2 border-double border-slate-600/80 my-2" />

              {/* Row 5: Net Profit/Loss */}
              <div className={`flex justify-between items-center p-3 rounded-xl border ${isProfitable ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" : "bg-rose-500/10 border-rose-500/20 text-rose-300"}`}>
                <div className="flex flex-col text-left">
                  <span className="font-extrabold uppercase tracking-wide text-xs">Net Profit / Loss</span>
                  <span className="text-[9px] opacity-80 leading-normal">Final daily earnings added to (or lost from) your balance.</span>
                </div>
                <span className="text-2xl font-black text-right whitespace-nowrap">
                  {isProfitable ? "+" : ""}${netProfit.toFixed(2)}
                </span>
              </div>

              {/* Premium Divider */}
              <div className="border-t border-dashed border-slate-700/60 my-4" />

              {/* Financial Position Snapshot Header */}
              <div className="text-center mb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 font-mono">FINANCIAL POSITION SNAPSHOT</span>
              </div>

              {/* Snapshot Grid */}
              <div className="grid grid-cols-3 gap-3">
                {/* Closing Bank Balance */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-center flex flex-col justify-between min-h-[72px]">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-mono">Bank Balance</span>
                  <span className="text-sm font-black text-white mt-1 block font-mono whitespace-nowrap">
                    ${currentBankBalance.toFixed(2)}
                  </span>
                  <span className="text-[8px] font-mono text-slate-500 block mt-0.5">
                    Liquid Cash
                  </span>
                </div>

                {/* Cash Flow Change (Up / Down) */}
                <div className={`p-3 rounded-xl border text-center flex flex-col justify-between min-h-[72px] ${isUp ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-400" : "bg-rose-500/5 border-rose-500/10 text-rose-400"}`}>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-mono">Cash Flow</span>
                  <span className="text-sm font-black mt-1 flex items-center justify-center gap-0.5 font-mono">
                    {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {isUp ? "UP" : "DOWN"}
                  </span>
                  <span className="text-[8px] font-mono text-slate-400 block mt-0.5 font-bold">
                    {isUp ? "+" : "-"}${Math.abs(cashFlowChange).toFixed(2)}
                  </span>
                </div>

                {/* Total Stock Asset Value */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-center flex flex-col justify-between min-h-[72px]">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-mono">Stock Assets</span>
                  <span className="text-sm font-black text-amber-400 mt-1 block font-mono whitespace-nowrap">
                    ${currentStockValuation.toFixed(2)}
                  </span>
                  <span className="text-[8px] font-mono text-slate-500 block mt-0.5">
                    Wholesale Val.
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* 📊 Market Insights (Stevie's Daily Retail Analysis Advice) */}
          <div className="bg-slate-950/40 border border-white/[0.06] rounded-2xl p-5 backdrop-blur-md max-w-xl mx-auto shadow-2xl w-full text-left">
            <h3 className="text-xs font-extrabold text-white flex items-center gap-2 mb-3 tracking-wider uppercase font-mono">
              <span className="text-amber-400">📊</span>
              <span>Market Insights</span>
              <span className="text-[8px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-mono uppercase tracking-wider ml-auto">
                Stevie's Advice
              </span>
            </h3>

            {insights.length === 0 ? (
              <div className="text-[10px] text-slate-400 bg-slate-900/40 p-4 rounded-xl border border-white/5 text-center leading-relaxed font-mono">
                No active inventory was stocked in store slots today to generate retail insights. Buy and list goods tomorrow to trigger audit recommendations!
              </div>
            ) : (
              <div className="space-y-2">
                {insights.map((insight, idx) => {
                  let borderColour = "border-sky-500/20 bg-sky-500/5";
                  let textColour = "text-sky-300";
                  let icon = (
                    <div className="w-5 h-5 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 font-black text-xs font-mono shrink-0 select-none">
                      ✓
                    </div>
                  );

                  if (insight.type === "expensive") {
                    borderColour = "border-rose-500/20 bg-rose-500/5";
                    textColour = "text-rose-300";
                    icon = (
                      <div className="w-5 h-5 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 font-black text-xs font-mono shrink-0 select-none">
                        ⚠
                      </div>
                    );
                  } else if (insight.type === "soldout") {
                    borderColour = "border-emerald-500/20 bg-emerald-500/5";
                    textColour = "text-emerald-300";
                    icon = (
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-xs font-mono shrink-0 select-none">
                        ↑
                      </div>
                    );
                  }

                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 p-3 rounded-xl border ${borderColour} transition-all hover:scale-[1.01]`}
                    >
                      <span className="text-lg shrink-0 mt-0.5 select-none">{insight.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[10px] font-black text-white uppercase font-mono tracking-wider">
                          {insight.name}
                        </h4>
                        <p className={`text-[10px] ${textColour} leading-normal mt-0.5 font-sans font-medium`}>
                          {insight.message}
                        </p>
                      </div>
                      {icon}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Customer Reaction Feed */}
          <div className="feedback-section">
            <h3 className="feedback-title-label">
              Customer Feedback Log
            </h3>

            {feedback.length === 0 ? (
              <div className="empty-feedback-card">
                <Info className="empty-info-icon" />
                <div className="empty-feedback-text">
                  <h4>No Customer Activity Recorded</h4>
                  <p>
                    You did not have any inventory in stock or listing prices set.
                    Buy wholesale products and configure your retail rates to attract visitors tomorrow!
                  </p>
                </div>
              </div>
            ) : (
              <div className="feedback-list custom-scrollbar">
                {feedback.map((log, index) => {
                  let statusClass = "feedback-acceptable";
                  if (log.type === "Bargain") statusClass = "feedback-bargain";
                  if (log.type === "Too Expensive") statusClass = "feedback-expensive";
                  if (log.type === "Too Cheap") statusClass = "feedback-cheap";
                  if (log.type === "SoldOut") statusClass = "feedback-soldout";

                  return (
                    <div key={index} className={`feedback-bubble-card ${statusClass}`}>
                      <div className="bubble-left">
                        <span className="feedback-emoji">{log.emoji}</span>
                        <p className="feedback-message">{log.message}</p>
                      </div>
                      <span className={`feedback-badge-tag ${statusClass}`}>
                        {log.type}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Next Day Trigger Action */}
        <div className="report-footer-actions">
          <button onClick={onClose} className="btn btn-close-modal">
            <span>Progress to Day {daySimulated + 1}</span>
            <ChevronRight className="btn-icon" />
          </button>
        </div>
      </div>
    </div>
  );
}
