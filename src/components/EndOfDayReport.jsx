import React from 'react';

// Pure CSS Tooltip using Tailwind group-hover
const Tooltip = ({ text }) => (
  <div className="relative group inline-block ml-3 cursor-help">
    <span className="text-slate-500 hover:text-amber-400 transition-colors font-black text-sm px-1.5 py-0.5 rounded-full border border-slate-600 hover:border-amber-400">?</span>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 bg-slate-800 text-slate-200 text-xs rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none shadow-2xl border border-slate-600 text-center leading-relaxed">
      {text}
      {/* Downward pointing triangle for the speech bubble effect */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-600"></div>
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-[7px] border-transparent border-t-slate-800"></div>
    </div>
  </div>
);

// Reusable row for ledger stats
const StatRow = ({ label, value, tooltip, isDeduction = false, isTotal = false }) => (
  <div className={`flex justify-between items-center py-2.5 ${isTotal ? 'border-t-2 border-slate-700 pt-4 mt-2 font-black text-2xl' : 'text-slate-300 text-lg font-medium'}`}>
    <div className="flex items-center">
      <span className={isTotal ? 'text-white tracking-wide' : ''}>{label}</span>
      {tooltip && <Tooltip text={tooltip} />}
    </div>
    <span className={`${isTotal ? (value >= 0 ? 'text-emerald-400' : 'text-rose-400') : (isDeduction ? 'text-rose-400' : 'text-white')} font-mono`}>
      {isDeduction ? '-' : ''}${Math.abs(value).toFixed(2)}
    </span>
  </div>
);

export default function EndOfDayReport({ report, onClose }) {
  if (!report) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 p-10 rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-visible">
       <div className="overflow-y-auto max-h-[calc(90vh-5rem)]">
        
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-amber-400 mb-2 tracking-tight">DAY {report.daySimulated} DONE!</h2>
          <p className="text-slate-400 font-medium">Let's check the books.</p>
        </div>

        {/* The Ledger */}
        <div className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800 mb-8 shadow-inner">
          <StatRow 
            label="Money In" 
            value={report.dailyRevenue} 
            tooltip="Revenue: Every single dollar handed to you by customers today." 
          />
          <StatRow 
            label="Stock Costs" 
            value={report.dailyCOGS} 
            isDeduction={true}
            tooltip="COGS (Cost of Goods Sold): The money you originally spent buying the items that you sold today." 
          />
          
          <div className="border-t border-slate-800/50 my-2"></div>
          
          <StatRow 
            label="Trading Profit" 
            value={report.dailyGrossProfit} 
            tooltip="Gross Profit: What you made from selling your stock, before paying your bills." 
          />
          
          <div className="border-t border-slate-800/50 my-2"></div>
          
          <StatRow 
            label="Shop Rent" 
            value={report.rentDeducted} 
            isDeduction={true}
            tooltip="Fixed Costs: The daily cost of running your stall or shop." 
          />
          
          {report.marketingSpendToday > 0 && (
            <StatRow 
              label="Marketing Flyer" 
              value={report.marketingSpendToday} 
              isDeduction={true}
              tooltip="Marketing: Money spent trying to get more customers to visit." 
            />
          )}

          <StatRow 
            label="Final Profit" 
            value={report.netProfit} 
            isTotal={true}
            tooltip="Net Profit: The actual money you get to keep and grow your business with!" 
          />
        </div>

        {/* Cash Flow Summary */}
        <div className="bg-slate-800 rounded-xl p-4 mb-8 text-center border border-slate-700">
          <p className="text-slate-300 text-sm font-bold tracking-wider uppercase mb-2">Bank Balance Check</p>
          <div className="flex justify-center items-baseline gap-4">
            <span className="text-slate-400 line-through font-mono text-lg">${report.startingBalance.toFixed(2)}</span>
            <span className="text-slate-500">➔</span>
            <span className="text-3xl font-black text-emerald-400 font-mono">${report.endingBalance.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black text-xl py-4 rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        >
          START NEXT DAY
        </button>
       </div>
      </div>
    </div>
  );
}
