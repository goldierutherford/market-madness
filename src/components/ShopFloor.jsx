import React from "react";
import ShelfItem from "./ShelfItem";
import ShopMascot from "./ShopMascot";
import Shopkeeper from "./Shopkeeper";
import AnimatedCustomer from "./AnimatedCustomer";
import { stockCatalogue } from "../hooks/useGameState";

export default function ShopFloor({ 
  inventory, 
  retailPrices, 
  dailyProfit, 
  activeCustomer = null 
}) {
  
  // Categorise items onto specific shelves
  const shelfCategories = [
    {
      name: "Fresh Produce Shelf 🍏🥒",
      itemIds: ["apple", "cucumber"],
      woodColour: "bg-amber-900 border-amber-950"
    },
    {
      name: "Bakery & Deli Shelf 🍞🧀",
      itemIds: ["bread", "cheese"],
      woodColour: "bg-orange-900 border-orange-950"
    },
    {
      name: "Floral & Specialty Shelf 💐",
      itemIds: ["flowers"],
      woodColour: "bg-yellow-950 border-amber-950"
    }
  ];

  // Helper to fetch set retail prices with fallback to default margin
  const getItemRetailPrice = (itemId) => {
    const item = stockCatalogue.find((i) => i.id === itemId);
    if (!item) return 0;
    return retailPrices[itemId] ?? (item.wholesaleCost * 1.5);
  };

  return (
    <div className="relative w-full min-h-[620px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-white/10 rounded-2xl p-6 overflow-hidden shadow-2xl flex flex-col justify-between">
      
      {/* Decorative Wall Grid Pattern */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      <div>
        
        {/* 1. SHOP COUNTER (Top Section: Wood-styled checkout with Stevie behind register) */}
        <div className="relative z-20 w-full mb-6 bg-gradient-to-b from-amber-800 to-amber-950 border-2 border-amber-950 rounded-xl p-4 shadow-xl flex items-center justify-between">
          {/* Wood panel background texture */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.8)_0%,transparent_100%)] rounded-lg pointer-events-none" />
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="text-3xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] animate-[pulse_3s_infinite]" role="img" aria-label="Till Register">
              📠
            </div>
            <div>
              <h4 className="text-xs font-bold font-mono tracking-widest text-amber-200 uppercase">Checkout Till</h4>
              <p className="text-[10px] text-amber-100/70">Stevie registers sales here</p>
            </div>
          </div>

          {/* Shopkeeper (Stevie) */}
          <div className="relative z-10 mr-4">
            <Shopkeeper />
          </div>
        </div>

        {/* 2. CUSTOMER CORRIDOR (Walking zone in front of the till) */}
        <div className="relative w-full h-32 mb-6 bg-slate-950/40 rounded-xl border border-white/5 flex items-center justify-center overflow-hidden">
          {/* Floor Tile Pattern */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          
          {activeCustomer ? (
            <AnimatedCustomer
              reaction={activeCustomer.reaction}
              customerEmoji={activeCustomer.emoji}
              itemEmoji={activeCustomer.itemEmoji}
              text={activeCustomer.text}
            />
          ) : (
            <div className="text-slate-500 text-xs font-mono select-none flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-700 animate-ping"></span>
              <span>Shop is quiet... awaiting next business day</span>
            </div>
          )}
        </div>

        {/* 3. THE SHELVES (Middle Sections) */}
        <div className="space-y-6 z-10 relative mb-12">
          {shelfCategories.map((cat, catIdx) => {
            
            // Build the list of active stock units on this shelf
            const itemsOnShelf = [];
            cat.itemIds.forEach((itemId) => {
              const item = stockCatalogue.find((i) => i.id === itemId);
              if (!item) return;
              
              const quantity = inventory[itemId] || 0;
              const retailPrice = getItemRetailPrice(itemId);

              for (let k = 0; k < quantity; k++) {
                itemsOnShelf.push({
                  uniqueKey: `${itemId}-${k}-${catIdx}`,
                  item,
                  retailPrice
                });
              }
            });

            return (
              <div key={catIdx} className="flex flex-col">
                {/* Category Header Label */}
                <div className="flex justify-between items-center px-2 mb-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Stock: {itemsOnShelf.length} units
                  </span>
                </div>

                {/* Shelf Wooden Bracket & Grid crate */}
                <div className="relative group">
                  <div className="flex flex-wrap gap-2.5 p-3 min-h-[86px] bg-slate-950/65 rounded-t-xl border-x border-t border-white/5 shadow-inner transition-all duration-300 group-hover:bg-slate-900/30">
                    {itemsOnShelf.length > 0 ? (
                      itemsOnShelf.map((shelfItem) => (
                        <ShelfItem
                          key={shelfItem.uniqueKey}
                          item={shelfItem.item}
                          retailPrice={shelfItem.retailPrice}
                        />
                      ))
                    ) : (
                      /* Out of stock chalkboard alert */
                      <div className="w-full flex items-center justify-center py-3">
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-950 border border-dashed border-red-900/30 rounded-lg text-slate-500 text-xs font-mono select-none">
                          <span>📦</span>
                          <span>No items stocked. Buy bulk wholesale to list.</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Oak Wood plank structure */}
                  <div className={`w-full h-3 rounded-b-xl border-b-2 ${cat.woodColour} shadow-lg flex items-center justify-between px-6`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40 shadow-inner"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40 shadow-inner"></div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* 4. BASEMENT FLOOR FOOTER (Mascot Bed + Stall Info) */}
      <div className="flex items-end justify-between mt-auto z-10 relative">
        
        {/* Footnote information panel */}
        <div className="flex items-center gap-2 p-2 px-3 bg-slate-900/60 backdrop-blur-sm border border-white/5 rounded-xl text-slate-400 max-w-[240px] select-none text-[10px] font-mono leading-tight">
          <span>ℹ️</span>
          <span>Daily Rent ($5-$50/day) is auto-deducted from bank balance at midnight.</span>
        </div>

        {/* Buster Mascot Spot */}
        <div className="transform translate-y-2 translate-x-2">
          <ShopMascot dailyProfit={dailyProfit} />
        </div>
      </div>

    </div>
  );
}
