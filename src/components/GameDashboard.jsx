import React, { useState, useEffect } from "react";
import { auth } from "../firebase.config";
import { stockCatalogue } from "../hooks/useGameState";
import { signOut } from "firebase/auth";
import { 
  LogOut, 
  Coins, 
  Calendar, 
  Store,
  BookOpen,
  Landmark
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

  // View control: whether the 2D management books ledger overlay is open
  const [isBooksOpen, setIsBooksOpen] = useState(true);

  // Simulation staging states
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeCustomer, setActiveCustomer] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  // Sequence orchestration steps: 'playing', 'walkingToDesk', 'zooming', 'showingStats'
  const [sequenceStep, setSequenceStep] = useState("playing");

  // Local visual inventory that syncs with R3F customer arrival animations
  const [visualInventory, setVisualInventory] = useState(() => ({ ...gameState.inventory }));

  // Proactively sync visual shelves with real inventory when not simulating (e.g. on restocking)
  useEffect(() => {
    if (!isSimulating && sequenceStep === "playing") {
      setVisualInventory(gameState.inventory);
    }
  }, [gameState.inventory, isSimulating, sequenceStep]);

  // Handle the customer walking staging queue in 3D when a trading day completes
  useEffect(() => {
    if (endOfDayReport) {
      setIsSimulating(true);
      setShowReportModal(false);
      setIsBooksOpen(false); // Automatically shut the ledger to let players watch the 3D floor

      // Build the initial pre-simulation inventory so we can visually deduct units in real-time
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
        // Fallback disappointed client for empty shelves
        queuedCustomers = [{
          id: "empty-shop-cust-3d",
          reaction: "expensive",
          emoji: "🧔",
          itemEmoji: "🏪",
          itemId: null,
          text: "The shelves are completely empty! Stevie has no stock."
        }];
      } else {
        // Map feedbacks to custom clients, capped at 5 to keep gameplay brisk
        queuedCustomers = feedbackList.map((fb, idx) => {
          let reaction = "acceptable";
          const customerEmojis = ["🧑‍🌾", "👩‍⚕️", "👨‍💼", "👩‍🎨", "🧔", "👵", "🧑‍🚀", "👩‍🍳"];
          const emoji = customerEmojis[idx % customerEmojis.length];

          if (fb.type === "VIP" || fb.isVIP) {
            reaction = "VIP";
          } else if (fb.type === "Bargain") {
            reaction = "bargain";
          } else if (fb.type === "Too Expensive" || fb.type === "Too Cheap" || fb.type === "SoldOut") {
            reaction = "expensive";
          }

          const rawMsg = fb.message || "";
          const text = rawMsg.length > 35 ? rawMsg.substring(0, 32) + "..." : rawMsg;

          return {
            id: `cust-3d-${idx}-${Math.random()}`,
            reaction,
            emoji,
            itemEmoji: fb.emoji || "🍏",
            itemId: fb.itemId,
            text,
            isVIP: fb.isVIP || fb.type === "VIP"
          };
        }).slice(0, 5);
      }

      let currentIdx = 0;

      const runCustomerQueue3D = () => {
        if (currentIdx < queuedCustomers.length) {
          const nextCustomer = queuedCustomers[currentIdx];
          setActiveCustomer(nextCustomer);

          // State Sync: Decrement visual stock from shelves right as the customer hits the counter (1.5 seconds)
          if (nextCustomer && nextCustomer.itemId) {
            setTimeout(() => {
              setVisualInventory((prev) => {
                const updated = { ...prev };
                if (updated[nextCustomer.itemId] > 0) {
                  updated[nextCustomer.itemId] -= 1;
                }
                return updated;
              });
            }, 1500);
          }

          currentIdx++;
          // Stagger customer appearance every 6.0s (corresponds perfectly to the Z-axis exit turnaround animation cycle)
          setTimeout(runCustomerQueue3D, 6000);
        } else {
          // Finish customer queue, clear active customer, and transition to workstation walking state
          setActiveCustomer(null);
          setIsSimulating(false);
          setSequenceStep("walkingToDesk");
        }
      };

      // Initiate 3D sequence
      runCustomerQueue3D();

    } else {
      setActiveCustomer(null);
      setIsSimulating(false);
      setShowReportModal(false);
      setSequenceStep("playing");
    }
  }, [endOfDayReport]);

  // Triggered when Stevie reaches the desk coordinate point to trigger camera zoom
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

  // Performance Guardrail: If it is a Bank Day and we are not in the middle of showing the daily simulation report,
  // cleanly unmount the shop canvas and render the 3D Bank world instead!
  if (isBankDay && !endOfDayReport) {
    return (
      <BankCutscene 
        bankBalance={bankBalance} 
        processWeeklyDeposit={processWeeklyDeposit} 
      />
    );
  }

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-[#020408] text-white font-primary select-none">
      
      {/* 1. 3D VIRTUAL WORLD BACKGROUND LAYER */}
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


      {/* 2. ABSOLUTE HUD OVERLAY PANEL (Top HUD Header) */}
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

        {/* Dashboard Status HUD counters */}
        <div className="flex items-center gap-2">
          {/* Difficulty Setting Pills Selector */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-900/90 border border-white/5 text-[9px] mr-2">
            <button
              onClick={() => !isSimulating && sequenceStep === "playing" && setDifficulty("Easy")}
              disabled={isSimulating || sequenceStep !== "playing"}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                difficulty === "Easy"
                  ? "bg-emerald-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              } ${(isSimulating || sequenceStep !== "playing") ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              title="Easy difficulty: Higher customer willingness to pay (1.5x - 2.5x)"
            >
              Easy
            </button>
            <button
              onClick={() => !isSimulating && sequenceStep === "playing" && setDifficulty("Medium")}
              disabled={isSimulating || sequenceStep !== "playing"}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                difficulty === "Medium"
                  ? "bg-amber-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              } ${(isSimulating || sequenceStep !== "playing") ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              title="Medium difficulty: Balanced customer willingness to pay (1.2x - 2.0x)"
            >
              Medium
            </button>
            <button
              onClick={() => !isSimulating && sequenceStep === "playing" && setDifficulty("Hard")}
              disabled={isSimulating || sequenceStep !== "playing"}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                difficulty === "Hard"
                  ? "bg-rose-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              } ${(isSimulating || sequenceStep !== "playing") ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
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

        {/* Right Action buttons */}
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
            onClick={handleLogout} 
            className="p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-white/10 text-slate-400 hover:text-rose-400 transition-colors shadow-md cursor-pointer"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 3. SIMULATION TACTILE RUNNING BANNER */}
      {isSimulating && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 px-5 py-2.5 bg-slate-950/80 border border-amber-500/30 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 animate-bounce">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></div>
          <span className="text-xs font-mono font-black text-amber-200 uppercase tracking-widest">
            Simulating Customer Walk-ins...
          </span>
        </div>
      )}

      {/* 4. MANAGEMENT LEDGER BOOKS OVERLAY */}
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

      {/* 5. MIDNIGHT FINANCIAL STATEMENT MODAL */}
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
                setIsBooksOpen(true); // Automatically reopen ledger unless they just upgraded locations!
              }
            }} 
          />
        </div>
      )}

      {/* 6. LOCATION TIER UPGRADE CELEBRATION MODAL */}
      {hasJustUpgraded && (
        <TierUnlockModal 
          currentTier={gameState.currentTier}
          onClose={() => {
            setHasJustUpgraded(false);
            setIsBooksOpen(true); // Open the ledger book for their new shop!
          }}
        />
      )}

      {/* 7. DYNAMIC PRODUCT SELECTION MODAL */}
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
