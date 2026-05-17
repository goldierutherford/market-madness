import { useState, useEffect, useCallback } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase.config";

// The static stock catalogue containing the wholesale items with UK English spelling and USD costs.
export const stockCatalogue = [
  // Tier 1 (Defaults / Basic - 5 items)
  { id: "apple", name: "Crisp Gala Apple", emoji: "🍏", wholesaleCost: 0.40, tierRequired: 1 },
  { id: "cucumber", name: "Organic Cucumber", emoji: "🥒", wholesaleCost: 0.60, tierRequired: 1 },
  { id: "bread", name: "Artisan Sourdough Bread", emoji: "🍞", wholesaleCost: 1.20, tierRequired: 1 },
  { id: "watermelon", name: "Sweet Watermelon Slice", emoji: "🍉", wholesaleCost: 0.80, tierRequired: 1 },
  { id: "toycar", name: "Miniature Toy Car", emoji: "🚗", wholesaleCost: 2.50, tierRequired: 1 },
  
  // Tier 2 (Requires Tier 2 - 5 items)
  { id: "cheese", name: "Mature Cheddar Cheese", emoji: "🧀", wholesaleCost: 2.00, tierRequired: 2 },
  { id: "flowers", name: "Spring Flower Bouquet", emoji: "💐", wholesaleCost: 3.50, tierRequired: 2 },
  { id: "coffee", name: "Organic Coffee Beans", emoji: "☕", wholesaleCost: 1.80, tierRequired: 2 },
  { id: "book", name: "Classic Fiction Book", emoji: "📖", wholesaleCost: 5.00, tierRequired: 2 },
  { id: "plant", name: "Potted House Plant", emoji: "🪴", wholesaleCost: 4.50, tierRequired: 2 },
  
  // Tier 3 (Requires Tier 3 - 5 items)
  { id: "headphones", name: "Wireless Headphones", emoji: "🎧", wholesaleCost: 15.00, tierRequired: 3 },
  { id: "watch", name: "Smart Fitness Watch", emoji: "⌚", wholesaleCost: 40.00, tierRequired: 3 },
  { id: "sneakers", name: "Premium Running Sneakers", emoji: "👟", wholesaleCost: 75.00, tierRequired: 3 },
  { id: "sunglasses", name: "Designer Sunglasses", emoji: "🕶️", wholesaleCost: 20.00, tierRequired: 3 },
  { id: "laptop", name: "Sleek Ultrabook Laptop", emoji: "💻", wholesaleCost: 450.00, tierRequired: 3 }
];

export function useGameState() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasJustUpgraded, setHasJustUpgraded] = useState(false);
  const [difficulty, setDifficulty] = useState("Easy");
  const [neonSignTier, setNeonSignTier] = useState(0);
  const [marketingSpendToday, setMarketingSpendToday] = useState(0);
  const [marketingActive, setMarketingActive] = useState(false);

  // Core mathematical game state
  const [gameState, setGameState] = useState({
    currentDay: 1,
    bankBalance: 500,
    currentTier: 1, // Tier 1: "Market Stall" (Rent: $5/day)
    inventory: {}, // itemId -> quantity
    retailPrices: {}, // itemId -> price (e.g. apple -> 0.80)
    endOfDayReport: null,
    unlockedProductIds: ["apple", "cucumber", "bread"], // Starting default active items
    nextProductUnlockAt: 1000,
    pendingProductPicks: 0,
    isGoldenEmporium: false,
    isBankDay: false,
    retainedEarnings: 0
  });

  // Keep track of the results from the most recent day simulated
  const [endOfDayReport, setEndOfDayReport] = useState(null);

  // Derived catalog filtering based on unlocked active products and current tier location limits
  const availableCatalogue = stockCatalogue.filter(
    (item) => (gameState.unlockedProductIds || ["apple", "cucumber", "bread"]).includes(item.id) &&
              item.tierRequired <= gameState.currentTier
  );

  // Sync state from Firestore on user login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setLoading(true);
        try {
          const docRef = doc(db, "saves", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            const loadedState = {
              currentDay: data.currentDay ?? 1,
              bankBalance: data.bankBalance ?? 500,
              currentTier: data.currentTier ?? 1,
              inventory: data.inventory ?? {},
              retailPrices: data.retailPrices ?? {},
              endOfDayReport: data.endOfDayReport ?? null,
              unlockedProductIds: data.unlockedProductIds ?? ["apple", "cucumber", "bread"],
              nextProductUnlockAt: data.nextProductUnlockAt ?? 1000,
              pendingProductPicks: data.pendingProductPicks ?? 0,
              isGoldenEmporium: data.isGoldenEmporium ?? false,
              isBankDay: data.isBankDay ?? false,
              retainedEarnings: data.retainedEarnings ?? 0
            };
            setGameState(loadedState);
            setNeonSignTier(data.neonSignTier ?? 0);
            setMarketingActive(data.marketingActive ?? false);
            if (loadedState.endOfDayReport) {
              setEndOfDayReport(loadedState.endOfDayReport);
            }
          } else {
            // First time play: create initial save
            const defaultState = {
              currentDay: 1,
              bankBalance: 500,
              currentTier: 1,
              inventory: {},
              retailPrices: {},
              endOfDayReport: null,
              unlockedProductIds: ["apple", "cucumber", "bread"],
              nextProductUnlockAt: 1000,
              pendingProductPicks: 0,
              isGoldenEmporium: false,
              isBankDay: false,
              retainedEarnings: 0
            };
            await setDoc(docRef, defaultState);
            setGameState(defaultState);
          }
        } catch (err) {
          console.error("Error loading cloud save:", err);
          setError("Failed to load game save from cloud. Playing locally.");
        } finally {
          setLoading(false);
        }
      } else {
        // Reset to initial offline state
        setGameState({
          currentDay: 1,
          bankBalance: 500,
          currentTier: 1,
          inventory: {},
          retailPrices: {},
          endOfDayReport: null,
          unlockedProductIds: ["apple", "cucumber", "bread"],
          nextProductUnlockAt: 1000,
          pendingProductPicks: 0,
          isGoldenEmporium: false,
          isBankDay: false,
          retainedEarnings: 0
        });
        setNeonSignTier(0);
        setMarketingSpendToday(0);
        setMarketingActive(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Save game state directly to cloud helper
  const saveGameToCloud = useCallback(async (stateToSave, currentUser, activeNeonTier = neonSignTier, activeMarketing = marketingActive) => {
    const activeUser = currentUser || user;
    if (!activeUser) return;
    try {
      const docRef = doc(db, "saves", activeUser.uid);
      await setDoc(docRef, {
        ...stateToSave,
        neonSignTier: activeNeonTier,
        marketingActive: activeMarketing
      });
    } catch (err) {
      console.error("Error saving game to cloud:", err);
    }
  }, [user, neonSignTier, marketingActive]);

  // Buy stock from the Wholesale Market
  const buyWholesaleStock = useCallback((itemId, quantity, cost) => {
    if (quantity <= 0) return;
    const totalCost = quantity * cost;

    setGameState((prev) => {
      if (prev.bankBalance < totalCost) {
        alert("Insufficient funds in bank balance to buy this quantity!");
        return prev;
      }

      const updatedInventory = { ...prev.inventory };
      updatedInventory[itemId] = (updatedInventory[itemId] || 0) + quantity;

      const updatedPrices = { ...prev.retailPrices };
      if (updatedPrices[itemId] === undefined || updatedPrices[itemId] === 0) {
        updatedPrices[itemId] = Number((cost * 1.5).toFixed(2));
      }

      const updatedState = {
        ...prev,
        bankBalance: Number((prev.bankBalance - totalCost).toFixed(2)),
        inventory: updatedInventory,
        retailPrices: updatedPrices
      };

      // Proactively sync state changes
      if (user) {
        saveGameToCloud(updatedState, user);
      }

      return updatedState;
    });
  }, [user, saveGameToCloud]);

  // Set the listing price for stock
  const setRetailPrice = useCallback((itemId, price) => {
    const numericalPrice = Number(price);
    if (isNaN(numericalPrice) || numericalPrice < 0) return;

    setGameState((prev) => {
      const updatedPrices = { ...prev.retailPrices };
      updatedPrices[itemId] = numericalPrice;

      const updatedState = {
        ...prev,
        retailPrices: updatedPrices
      };

      if (user) {
        saveGameToCloud(updatedState, user);
      }

      return updatedState;
    });
  }, [user, saveGameToCloud]);

  // Unlock specific product IDs (manual choice) and reset pending picks
  const unlockSpecificProducts = useCallback((itemIdsArray) => {
    setGameState((prev) => {
      const currentUnlocked = prev.unlockedProductIds || ["apple", "cucumber", "bread"];
      const nextUnlocked = Array.from(new Set([...currentUnlocked, ...itemIdsArray]));
      const updatedState = {
        ...prev,
        unlockedProductIds: nextUnlocked,
        pendingProductPicks: 0
      };
      if (user) {
        saveGameToCloud(updatedState, user);
      }
      return updatedState;
    });
  }, [user, saveGameToCloud]);

  // Skip expanding catalog choice for non-mandatory stages
  const skipUnlockProducts = useCallback(() => {
    setGameState((prev) => {
      const updatedState = {
        ...prev,
        pendingProductPicks: 0
      };
      if (user) {
        saveGameToCloud(updatedState, user);
      }
      return updatedState;
    });
  }, [user, saveGameToCloud]);

  // Simulate sales and transition day
  const simulateDay = useCallback(() => {
    setGameState((prev) => {
      const workingInventory = { ...prev.inventory };
      const workingRetailPrices = { ...prev.retailPrices };
      
      let totalRevenue = 0;
      let dailyCOGS = 0;
      const feedbackLog = [];
      const itemsSoldThisDay = {};

      // Tier-scaled operating rent and customer traffic parameters
      let fixedCosts = 5;
      let customerVisitsPerItem = 15;

      if (prev.currentTier === 2) {
        fixedCosts = 15;
        customerVisitsPerItem = 25;
      } else if (prev.currentTier === 3) {
        fixedCosts = 50;
        customerVisitsPerItem = 50;
      }

      // Customer Volume Multiplier Logic
      let multiplier = 1.0 + (0.2 * neonSignTier);
      if (marketingActive) {
        multiplier += 0.3;
      }
      customerVisitsPerItem = Math.floor(customerVisitsPerItem * multiplier);

      // Filter available catalogue at this exact moment
      const currentActiveList = stockCatalogue.filter(
        (item) => (prev.unlockedProductIds || ["apple", "cucumber", "bread"]).includes(item.id) &&
                  item.tierRequired <= prev.currentTier
      );

      // Performance Tracking: capture starting stock before simulation runs
      const startingStock = {};
      currentActiveList.forEach((item) => {
        startingStock[item.id] = prev.inventory[item.id] || 0;
      });

      currentActiveList.forEach((item) => {
        const inStock = workingInventory[item.id] || 0;
        const retailPrice = workingRetailPrices[item.id] ?? 0;

        if (inStock > 0) {
          // Verify price configuration warning
          if (retailPrice === 0) {
            feedbackLog.push({
              itemId: item.id,
              emoji: item.emoji,
              type: "Too Cheap",
              message: `⚠️ Your ${item.name} is currently listed for $0.00! Customers loved the free giveaway but you earned nothing.`
            });
          }

          let soldCount = 0;
          let tooExpensiveCount = 0;
          let bargainCount = 0;
          let acceptableCount = 0;
          let vipSoldCount = 0;

          for (let i = 0; i < customerVisitsPerItem; i++) {
            // Check if we ran out of stock during the day's visits
            const currentStock = workingInventory[item.id] ?? 0;
            if (currentStock <= 0) {
              feedbackLog.push({
                itemId: item.id,
                emoji: item.emoji,
                type: "SoldOut",
                message: `😢 A customer wanted to buy a ${item.name} but it was sold out!`
              });
              break;
            }

            // VIP customer calculation: 10% chance only if Tier 3
            const isVIP = prev.currentTier === 3 && Math.random() < 0.10;
            let willingnessMultiplier;
            
            if (isVIP) {
              willingnessMultiplier = 3.0;
            } else {
              switch (difficulty) {
                case "Easy":
                  willingnessMultiplier = 1.5 + Math.random() * 1.0;
                  break;
                case "Medium":
                  willingnessMultiplier = 1.2 + Math.random() * 0.8;
                  break;
                case "Hard":
                  willingnessMultiplier = 1.05 + Math.random() * 0.45;
                  break;
                default:
                  willingnessMultiplier = 1.5 + Math.random() * 1.0;
              }
            }
            
            const maxWillingness = item.wholesaleCost * willingnessMultiplier;

            if (retailPrice <= maxWillingness) {
              // Complete transaction
              workingInventory[item.id] -= 1;
              totalRevenue += retailPrice;
              dailyCOGS += item.wholesaleCost;
              soldCount += 1;

              if (isVIP) {
                vipSoldCount += 1;
              } else if (retailPrice <= maxWillingness * 0.75) {
                bargainCount += 1;
              } else {
                acceptableCount += 1;
              }
            } else {
              tooExpensiveCount += 1;
            }
          }

          if (soldCount > 0) {
            itemsSoldThisDay[item.id] = soldCount;
            if (vipSoldCount > 0) {
              feedbackLog.push({
                itemId: item.id,
                emoji: item.emoji,
                type: "VIP",
                isVIP: true,
                message: `👑 VIP customer bought ${item.name} for $${retailPrice.toFixed(2)} with absolute style! (${vipSoldCount} premium sales)`
              });
            }
            if (bargainCount > 0) {
              feedbackLog.push({
                itemId: item.id,
                emoji: item.emoji,
                type: "Bargain",
                message: `😍 Customers thought ${item.name} at $${retailPrice.toFixed(2)} was an absolute bargain! (${bargainCount} purchased)`
              });
            }
            if (acceptableCount > 0) {
              feedbackLog.push({
                itemId: item.id,
                emoji: item.emoji,
                type: "Acceptable",
                message: `😊 Customers bought your ${item.name} for $${retailPrice.toFixed(2)} with no complaints. (${acceptableCount} purchased)`
              });
            }
          }

          if (tooExpensiveCount > 0) {
            feedbackLog.push({
              itemId: item.id,
              emoji: item.emoji,
              type: "Too Expensive",
              message: `😠 ${tooExpensiveCount} customers walked away because your ${item.name} ($${retailPrice.toFixed(2)}) was too expensive!`
            });
          }
        }
      });

      // Analysis Engine: Generate insights array after customer loop finishes
      const insights = [];
      currentActiveList.forEach((item) => {
        const startQty = startingStock[item.id] || 0;
        const soldQty = itemsSoldThisDay[item.id] || 0;

        if (startQty > 0) {
          if (soldQty === 0) {
            insights.push({
              itemId: item.id,
              name: item.name,
              emoji: item.emoji,
              type: "expensive",
              message: `Customers refused to buy ${item.name}. Your markup is too high for the current market.`
            });
          } else if (soldQty === startQty) {
            insights.push({
              itemId: item.id,
              name: item.name,
              emoji: item.emoji,
              type: "soldout",
              message: `You completely sold out of ${item.name}! Demand is high—try raising the price tomorrow to maximise profit.`
            });
          } else if (soldQty > 0 && soldQty < startQty) {
            insights.push({
              itemId: item.id,
              name: item.name,
              emoji: item.emoji,
              type: "steady",
              message: `${item.name} sold steadily at a fair price. Good job finding the sweet spot!`
            });
          }
        }
      });

      // Accounting and financial balance updates
      const dailyRevenue = Number(totalRevenue.toFixed(2));
      const roundedCOGS = Number(dailyCOGS.toFixed(2));
      const dailyGrossProfit = Number((dailyRevenue - roundedCOGS).toFixed(2));
      const rentDeducted = fixedCosts;
      const netProfit = Number((dailyGrossProfit - rentDeducted - marketingSpendToday).toFixed(2));

      // Balance gets updated with liquid cash flow (Revenue - Rent)
      const newBalance = Number((prev.bankBalance + dailyRevenue - rentDeducted).toFixed(2));
      const nextDay = prev.currentDay + 1;

      // Milestone / Tier Level Progression check
      let nextTier = prev.currentTier;
      let upgraded = false;

      if (prev.currentTier === 1 && newBalance >= 100) {
        nextTier = 2;
        upgraded = true;
      } else if (prev.currentTier === 2 && newBalance >= 3000) {
        nextTier = 3;
        upgraded = true;
      }

      if (upgraded) {
        setHasJustUpgraded(true);
      }

      // Dynamic Product Unlock Check (every $500 milestone starting at 1000)
      let currentNextUnlock = prev.nextProductUnlockAt ?? 1000;
      let picks = prev.pendingProductPicks ?? 0;
      
      if (newBalance >= currentNextUnlock) {
        picks = 3;
        // Keep incrementing by 500 if they leapfrogged multiple milestones
        while (newBalance >= currentNextUnlock) {
          currentNextUnlock += 500;
        }
      }

      // Check for Tier 3 VIP Golden Emporium unlock boolean
      const reachedGoldenEmporium = newBalance >= 3000;

      // Calculate remaining inventory valuation at wholesale cost
      const remainingStockValuation = Object.entries(workingInventory).reduce((total, [itemId, qty]) => {
        const item = stockCatalogue.find((i) => i.id === itemId);
        if (item && qty > 0) {
          return total + (qty * item.wholesaleCost);
        }
        return total;
      }, 0);

      const reportData = {
        daySimulated: prev.currentDay,
        dailyRevenue,
        dailyCOGS: roundedCOGS,
        dailyGrossProfit,
        rentDeducted,
        marketingSpendToday,
        netProfit,
        startingBalance: prev.bankBalance,
        endingBalance: newBalance,
        netLiquidChange: Number((newBalance - prev.bankBalance).toFixed(2)),
        remainingStockValuation: Number(remainingStockValuation.toFixed(2)),
        feedback: feedbackLog,
        itemsSold: itemsSoldThisDay,
        insights // Export the generated insights array
      };

      // Bank trigger: checks if the day that just concluded is the end of Sunday (Day 7, 14, 21, etc.)
      const isBankDayTrigger = (prev.currentDay % 7 === 0);

      const updatedState = {
        ...prev,
        currentDay: nextDay,
        bankBalance: newBalance,
        currentTier: nextTier,
        inventory: workingInventory,
        endOfDayReport: reportData,
        nextProductUnlockAt: currentNextUnlock,
        pendingProductPicks: picks,
        isGoldenEmporium: reachedGoldenEmporium,
        isBankDay: isBankDayTrigger,
        retainedEarnings: prev.retainedEarnings ?? 0
      };

      // Set the report for display in the component
      setEndOfDayReport(reportData);

      // Auto-save to cloud
      if (user) {
        saveGameToCloud(updatedState, user, neonSignTier, false);
      }

      return updatedState;
    });

    setMarketingActive(false);
    setMarketingSpendToday(0);
  }, [user, saveGameToCloud, difficulty, neonSignTier, marketingActive, marketingSpendToday]);

  const closeReport = useCallback(() => {
    setEndOfDayReport(null);
  }, []);

  // Process the weekly deposit at the Royal Savings Bank
  const processWeeklyDeposit = useCallback((floatAmount) => {
    setGameState((prev) => {
      const balanceToDeposit = prev.bankBalance - floatAmount;
      const depositAmount = balanceToDeposit > 0 ? balanceToDeposit : 0;

      const updatedState = {
        ...prev,
        bankBalance: floatAmount,
        retainedEarnings: Number(((prev.retainedEarnings ?? 0) + depositAmount).toFixed(2)),
        isBankDay: false
      };

      if (user) {
        saveGameToCloud(updatedState, user);
      }

      return updatedState;
    });
  }, [user, saveGameToCloud]);

  // Purchase/Upgrade Neon Sign
  const upgradeNeonSign = useCallback(() => {
    setGameState((prev) => {
      let cost = 0;
      if (neonSignTier === 0) cost = 150;
      else if (neonSignTier === 1) cost = 300;
      else if (neonSignTier === 2) cost = 600;
      else return prev; // Max tier reached

      if (prev.bankBalance < cost) {
        alert(`Insufficient funds to upgrade the Neon Sign! Needs $${cost}`);
        return prev;
      }

      const nextTier = neonSignTier + 1;
      const updatedState = {
        ...prev,
        bankBalance: Number((prev.bankBalance - cost).toFixed(2))
      };
      setNeonSignTier(nextTier);
      if (user) {
        saveGameToCloud(updatedState, user, nextTier, marketingActive);
      }
      return updatedState;
    });
  }, [user, saveGameToCloud, neonSignTier, marketingActive]);

  // Launch Flyer Campaign
  const launchMarketing = useCallback(() => {
    setGameState((prev) => {
      if (prev.bankBalance < 15) {
        alert("Insufficient funds to launch the Flyer Campaign!");
        return prev;
      }
      const updatedState = {
        ...prev,
        bankBalance: Number((prev.bankBalance - 15).toFixed(2))
      };
      setMarketingActive(true);
      setMarketingSpendToday(15);
      if (user) {
        saveGameToCloud(updatedState, user, neonSignTier, true);
      }
      return updatedState;
    });
  }, [user, saveGameToCloud, neonSignTier]);

  return {
    gameState,
    isBankDay: gameState.isBankDay ?? false,
    retainedEarnings: gameState.retainedEarnings ?? 0,
    processWeeklyDeposit,
    stockCatalogue,
    availableCatalogue,
    buyWholesaleStock,
    setRetailPrice,
    simulateDay,
    endOfDayReport,
    closeReport,
    hasJustUpgraded,
    setHasJustUpgraded,
    unlockSpecificProducts,
    skipUnlockProducts,
    loading,
    error,
    user,
    difficulty,
    setDifficulty,
    
    // Marketing & Upgrades Exports
    neonSignTier,
    setNeonSignTier,
    marketingActive,
    setMarketingActive,
    marketingSpendToday,
    setMarketingSpendToday,
    upgradeNeonSign,
    launchMarketing
  };
}
