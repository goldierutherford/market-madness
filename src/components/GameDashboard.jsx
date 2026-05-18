import React, { useState, useEffect } from "react";
import { auth } from "../firebase.config";
import { signOut } from "firebase/auth";
import { 
  LogOut, 
  Coins, 
  Calendar, 
  Store,
  BookOpen,
  Landmark,
  RotateCcw
} from "lucide-react";
import Shop3DWorld from "./Shop3DWorld";
import TheBooks from "./TheBooks";
import EndOfDayReport from "./EndOfDayReport";
import TierUnlockModal from "./TierUnlockModal";
import ProductSelectionModal from "./ProductSelectionModal";
import BankCutscene from "./BankCutscene";

export default function GameDashboard({ 
  gameState, 
  availableCatalogue,
  buyWholesaleStock,
  setRetailPrice,
  simulateDay,
  resetGame, // Passed in from hook
  user,
  endOfDayReport,
  closeReport,
  hasJustUpgraded,
  setHasJustUpgraded,
  unlockSpecificProducts,
  skipUnlockProducts,
  difficulty,
  setDifficulty,
  isBankDay,
  retainedEarnings,
  processWeeklyDeposit,
  neonSignTier,
  marketingActive,
  upgradeNeonSign,
  launchMarketing
}) {
  const { currentDay, bankBalance, inventory, retailPrices } = gameState;

  const [isBooksOpen, setIsBooksOpen] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeCustomer, setActiveCustomer] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [sequenceStep, setSequenceStep] = useState("playing");
  const [visualInventory, setVisualInventory] = useState(() => ({ ...gameState.inventory }));

  useEffect(() => {
    if (!isSimulating && sequenceStep === "playing") {
      setVisualInventory(gameState.inventory);
    }
  }, [gameState.inventory, isSimulating, sequenceStep]);

  useEffect(() => {
    if (endOfDayReport) {
      setIsSimulating(true);
      setShowReportModal(false);
      setIsBooksOpen(false); 

      const preSimInventory = { ...gameState.inventory };
      if (endOfDayReport.itemsSold) {
        Object.entries(endOfDayReport.itemsSold).forEach(([itemId, qty]) => {
          preSimInventory[itemId] = (preSimInventory[itemId] || 0) + qty;
        });
      }
      setVisualInventory(preSimInventory);

      const feedbackList = endOfDayReport.feedback || [];
      let queuedCustomers = [];

      if (feedbackList.length === 0) {
        queuedCustomers = [{
          id: "empty-shop-cust-3d",
          reaction: "expensive",
          emoji: "🧔",
          itemEmoji: "🏪",
          itemId: null,
          text: "The shelves are completely empty! Stevie has no stock."
        }];
      } else {
        queuedCustomers = feedbackList.map((fb, idx) => {
          let reaction = "acceptable";
          const customerEmojis = ["🧑🌾", "👩⚕️", "👨💼", "👩🎨", "🧔", "👵", "🧑🚀", "👩🍳"];
          const emoji = customerEmojis[idx % customerEmojis.length];

          if (fb.type === "VIP" || fb.isVIP) reaction = "VIP";
          else if (fb.type === "Bargain") reaction = "bargain";
          else if (fb.type === "Too Expensive" || fb.type === "Too Cheap" || fb.type === "SoldOut") reaction = "expensive";

          const rawMsg = fb.message || "";
          const text = rawMsg.length > 35 ? rawMsg.substring(0, 32) + "..." : rawMsg;

          return {
            id: `cust-3d-${idx}-${Math.random()}`,
            reaction,
            emoji,
            itemEmoji: fb.emoji || "🍏",
            itemId: fb.itemId,
            text,
            isVIP: fb.isVIP || fb.type === "VIP",
            isChildPair: Math.random() < 0.05 // 5% chance to spawn the parent/child joke sequence
          };
        }).slice(0, 5);
      }

      let currentIdx = 0;

      const runCustomerQueue3D = () => {
        if (currentIdx < queuedCustomers.length) {
          const nextCustomer = queuedCustomers[currentIdx];
          const isLastCustomer = currentIdx === queuedCustomers.length - 1;
          setActiveCustomer(nextCustomer);

          if (nextCustomer && nextCustomer.itemId) {
            setTimeout(() => {
              setVisualInventory((prev) => {
                const updated = { ...prev };
                if (updated[nextCustomer.itemId] > 0) updated[nextCustomer.itemId] -= 1;
                return updated;
              });
            }, 1500);
          }

          currentIdx++;

          // Dynamic timer to eliminate the dead air after the final customer leaves
          const animationExitTime = nextCustomer.isChildPair ? 12500 : 4500;
          const standardGap = nextCustomer.isChildPair ? 16000 : 6000;
          const duration = isLastCustomer ? animationExitTime : standardGap;
          
          setTimeout(runCustomerQueue3D, duration);
        } else {
          setActiveCustomer(null);
          setIsSimulating(false);
          setSequenceStep("walkingToDesk");
        }
      };

      runCustomerQueue3D();

    } else {
      setActiveCustomer(null);
      setIsSimulating(false);
      setShowReportModal(false);
      setSequenceStep("playing");
    }
  }, [endOfDayReport]);

  const handleDeskReached = () => {
    setSequenceStep("zooming");
    setTimeout(() => {
      setSequenceStep("showingStats");
      setShowReportModal(true);
    }, 1500);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  const handleTriggerSimulate = () => {
    setIsBooksOpen(false);
    simulateDay();
  };

  // Restrict difficulty changes to Day 1
  const canChangeDifficulty = currentDay === 1 && !isSimulating && sequenceStep === "playing";

  if (isBankDay && !endOfDayReport) {
    return (
      <BankCutscene 
        bankBalance={bankBalance} 
        processWeeklyDeposit={processWeeklyDeposit} 
      />
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#020408] text-white font-primary select-none">
      
      <Shop3DWorld 
        inventory={visualInventory}
        retailPrices={retailPrices}
        activeCustomer={activeCustomer}
        currentTier={gameState.currentTier}
        isGoldenEmporium={gameState.isGoldenEmporium}
        isEndOfDay={sequenceStep === "walkingToDesk" || sequenceStep === "zooming" || sequenceStep === "showingStats"}
        onDeskReached={handleDeskReached}
        sequenceStep={sequenceStep}
        neonSignTier={neonSignTier}
        marketingActive={marketingActive}
      />

      <header className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between p-3 rounded-2xl bg-slate-950/75 border border-white/10 backdrop-blur-md shadow-2xl pointer-events-auto">
        <div className="flex items-center gap-3">
          <Store className="w-6 h-6 text-amber-400 animate-pulse" />
          <div className="text-left">
            <h2 className="text-sm font-black tracking-widest bg-gradient-to-r from-amber-400 to-white bg-clip-text text-transparent uppercase font-mono">
              Market Madness 3D
            </h2>
            <p className="text-[9px] text-slate-400">
              Clerk Stevie is ready behind the till counter
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Difficulty Setting Pills Selector */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-900/90 border border-white/5 text-[9px] mr-2">
            <button
              onClick={() => canChangeDifficulty && setDifficulty("Easy")}
              disabled={!canChangeDifficulty}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                difficulty === "Easy"
                  ? "bg-emerald-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              } ${!canChangeDifficulty ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              title="Easy difficulty: Higher customer willingness to pay (1.5x - 2.5x)"
            >
              Easy
            </button>
            <button
              onClick={() => canChangeDifficulty && setDifficulty("Medium")}
              disabled={!canChangeDifficulty}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                difficulty === "Medium"
                  ? "bg-amber-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              } ${!canChangeDifficulty ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              title="Medium difficulty: Balanced customer willingness to pay (1.2x - 2.0x)"
            >
              Medium
            </button>
            <button
              onClick={() => canChangeDifficulty && setDifficulty("Hard")}
              disabled={!canChangeDifficulty}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                difficulty === "Hard"
                  ? "bg-rose-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              } ${!canChangeDifficulty ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              title="Hard difficulty: Tight customer willingness to pay (1.05x - 1.5x)"
            >
              Hard
            </button>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/80 border border-white/5 text-[10px]">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-bold font-mono">Day {endOfDayReport ? endOfDayReport.daySimulated : currentDay}</span>
          </div>

          {retainedEarnings > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/80 border border-white/5 text-[10px] text-amber-400" title="Safely deposited vault balance">
              <Landmark className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span className="font-bold font-mono">${retainedEarnings.toFixed(2)}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/80 border border-white/5 text-[10px]">
            <Coins className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="font-bold font-mono text-emerald-400">${bankBalance.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBooksOpen(true)}
            disabled={isSimulating || sequenceStep !== "playing"}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md transition-all duration-200 cursor-pointer ${(isSimulating || sequenceStep !== "playing") ? "opacity-50 cursor-not-allowed" : ""}`}
            title="Open financial ledger books to buy stock or edit pricing"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Open Books</span>
          </button>

          <button 
            onClick={() => {
              if (window.confirm("Are you sure you want to restart your business from Day 1? You will lose all your money, stock, and upgrades!")) {
                resetGame(difficulty);
                setSequenceStep("playing");
                setIsSimulating(false);
                setActiveCustomer(null);
                setShowReportModal(false);
                setIsBooksOpen(true);
              }
            }}
            className="p-2 rounded-xl bg-slate-800/40 hover:bg-rose-900/80 border border-white/10 text-slate-400 hover:text-rose-400 transition-colors shadow-md cursor-pointer"
            title="Restart Game from Day 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button 
            onClick={handleLogout} 
            className="p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-white/10 text-slate-400 hover:text-rose-400 transition-colors shadow-md cursor-pointer"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {isBooksOpen && sequenceStep === "playing" && (
        <TheBooks
          gameState={gameState}
          stockCatalogue={availableCatalogue}
          buyWholesaleStock={buyWholesaleStock}
          setRetailPrice={setRetailPrice}
          onClose={() => setIsBooksOpen(false)}
          onSimulateDay={handleTriggerSimulate}
          isSimulating={isSimulating}
          neonSignTier={neonSignTier}
          marketingActive={marketingActive}
          upgradeNeonSign={upgradeNeonSign}
          launchMarketing={launchMarketing}
        />
      )}

      {sequenceStep === "showingStats" && showReportModal && endOfDayReport && (
        <div className="absolute inset-0 z-50 transition-all duration-700 backdrop-blur-md bg-slate-950/40 flex items-center justify-center p-4">
          <EndOfDayReport 
            report={endOfDayReport} 
            gameState={gameState}
            onClose={() => {
              setShowReportModal(false);
              closeReport();
              setSequenceStep("playing");
              if (!hasJustUpgraded) {
                setIsBooksOpen(true); 
              }
            }} 
          />
        </div>
      )}

      {hasJustUpgraded && (
        <TierUnlockModal 
          currentTier={gameState.currentTier}
          onClose={() => {
            setHasJustUpgraded(false);
            setIsBooksOpen(true); 
          }}
        />
      )}

      {gameState.pendingProductPicks > 0 && (
        <ProductSelectionModal 
          gameState={gameState}
          onUnlockProducts={unlockSpecificProducts}
          onSkip={skipUnlockProducts}
        />
      )}

    </div>
  );
}
