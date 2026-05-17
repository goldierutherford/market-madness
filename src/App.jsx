import React from "react";
import { useGameState } from "./hooks/useGameState";
import LoginScreen from "./components/LoginScreen";
import GameDashboard from "./components/GameDashboard";
import EndOfDayReport from "./components/EndOfDayReport";
import { Sparkles, AlertCircle } from "lucide-react";
import "./index.css";

function App() {
  const {
    gameState,
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
    setDifficulty
  } = useGameState();

  // 1. Beautiful Premium Loader
  if (loading) {
    return (
      <div className="loader-screen">
        <div className="loader-card">
          <div className="loader-spinner-wrapper">
            <div className="pulse-ring" />
            <div className="spinner-glow" />
          </div>
          <h2 className="loader-title">Loading Save State...</h2>
          <p className="loader-subtitle font-mono">Reconstructing store logs & catalogue databases</p>
        </div>
      </div>
    );
  }

  // 2. Main Routing Section
  return (
    <div className="app-root">
      {/* Dynamic Global Notifications */}
      {error && (
        <div className="global-error-banner">
          <AlertCircle className="banner-icon" />
          <span>{error}</span>
        </div>
      )}

      {!user ? (
        <LoginScreen />
      ) : (
        <>
          <GameDashboard
            gameState={gameState}
            availableCatalogue={availableCatalogue}
            buyWholesaleStock={buyWholesaleStock}
            setRetailPrice={setRetailPrice}
            simulateDay={simulateDay}
            user={user}
            endOfDayReport={endOfDayReport}
            closeReport={closeReport}
            hasJustUpgraded={hasJustUpgraded}
            setHasJustUpgraded={setHasJustUpgraded}
            unlockSpecificProducts={unlockSpecificProducts}
            skipUnlockProducts={skipUnlockProducts}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
          />
        </>
      )}
    </div>
  );
}

export default App;
