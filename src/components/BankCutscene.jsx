import { useState, useEffect } from "react";
import Bank3DWorld from "./Bank3DWorld";
import { Landmark, ShieldCheck, TrendingUp } from "lucide-react";

export default function BankCutscene({ bankBalance, processWeeklyDeposit }) {
  // Phase sequence tracker: 'bank_scene', 'deposit_ui', 'scooter_ride_prep', 'scooter_ride'
  const [phase, setPhase] = useState("bank_scene");

  // Safety net math: Ensure the player actually has enough funds.
  // The deposit amount is the current bankBalance minus the $100.00 float.
  const floatAmount = 100.00;
  const depositAmount = Math.max(0, bankBalance - floatAmount);

  // Trigger deposit process upon completion of scooter ride animation
  useEffect(() => {
    if (phase === "scooter_ride") {
      const timer = setTimeout(() => {
        // Officially transfer funds and reset simulation to Monday morning
        processWeeklyDeposit(floatAmount);
      }, 3000); // 3 seconds matching the CSS animation duration
      
      return () => clearTimeout(timer);
    }
  }, [phase, processWeeklyDeposit, floatAmount]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 overflow-hidden font-sans">
      
      {/* 1. RENDER 3D BANK WORLD LAYER */}
      {phase !== "scooter_ride" && (
        <div className="absolute inset-0 w-full h-full z-0">
          <Bank3DWorld 
            onAtCounter={() => setPhase("deposit_ui")} 
            isLeaving={phase === "scooter_ride_prep"}
            onLeaveComplete={() => setPhase("scooter_ride")}
          />
        </div>
      )}

      {/* Subtle cinematic vignette filter overlay */}
      {phase !== "scooter_ride" && (
        <div className="absolute inset-0 bg-radial-vignette pointer-events-none z-10" />
      )}

      {/* Header Overlay showing Arthur's current status */}
      {phase !== "scooter_ride" && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center text-center select-none pointer-events-none font-mono">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-950/80 px-3 py-1 rounded-full border border-white/5 backdrop-blur-md">
            {phase === "bank_scene" 
              ? "Travelling to the Vault..." 
              : (phase === "deposit_ui" ? "Arrived at Royal Savings Bank" : "Leaving the Vault...")}
          </span>
        </div>
      )}

      {/* Glassmorphic Deposit Modal Card - Fades in once Stevie reaches the counter */}
      {phase === "deposit_ui" && (
        <div className="relative z-30 w-full max-w-sm mx-4 animate-fade-in-up">
          {/* Decorative glowing background pulse behind the card */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-orange-500/20 blur-xl opacity-80" />

          {/* Main Card */}
          <div className="relative rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-xl p-6 text-white shadow-2xl flex flex-col items-center">
            
            {/* Top Vault Icon Badge */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 mb-4 animate-bounce-slow">
              <Landmark className="w-6 h-6 text-slate-950" />
            </div>

            {/* Header Title */}
            <h2 className="text-lg font-black text-center tracking-tight text-white mb-1">
              Weekly Vault Deposit
            </h2>
            <p className="text-[11px] text-slate-400 text-center px-2 mb-5">
              Secure your store profits in the high-security bank vault before the new trading week begins.
            </p>

            {/* Math/Balance Sheet Panel */}
            <div className="w-full bg-slate-900/60 rounded-xl border border-white/5 p-4 mb-6 flex flex-col gap-3">
              
              {/* Total Register Balance */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Register Cash</span>
                <span className="font-mono font-bold text-slate-200">${bankBalance.toFixed(2)}</span>
              </div>

              {/* Float retained */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-slate-400 font-medium">Monday Shop Float</span>
                </div>
                <span className="font-mono font-bold text-amber-500">-${floatAmount.toFixed(2)}</span>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/5 my-1" />

              {/* Final Deposit Calculation */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-black text-white flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    Vault Deposit
                  </span>
                  <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">
                    Authorised Transfer
                  </span>
                </div>
                <span className="text-lg font-black font-mono text-emerald-400">
                  ${depositAmount.toFixed(2)}
                </span>
              </div>

            </div>

            {/* Safety Warning */}
            <div className="flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5 mb-6 w-full">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex flex-col text-[10px] text-slate-300 leading-tight">
                <span className="font-bold text-emerald-400">Funds Secured</span>
                Vault deposits cannot be spent by customers or lost during standard daily shop operations.
              </div>
            </div>

            {/* Large Tactile Deposit Button */}
            <button
              onClick={() => setPhase("scooter_ride_prep")}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <span>Confirm & Deposit ${depositAmount.toFixed(2)}</span>
            </button>

          </div>
        </div>
      )}

      {/* 2. RENDER 2D SCOOTER RIDE PHASE */}
      {phase === "scooter_ride" && (
        <>
          {/* Starry Night Sky Gradient */}
          <div className="bg-gradient-to-b from-[#020617] via-[#0b1329] to-[#1e293b] w-full h-full absolute inset-0 z-0" />

          {/* Twinkling Stars */}
          <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
            <div className="absolute top-[10%] left-[15%] w-1.5 h-1.5 bg-white rounded-full animate-ping" />
            <div className="absolute top-[18%] left-[45%] w-1 h-1 bg-white rounded-full animate-pulse" />
            <div className="absolute top-[25%] left-[75%] w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-[12%] left-[85%] w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute top-[35%] left-[28%] w-1.5 h-1.5 bg-white rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
            <div className="absolute top-[42%] left-[60%] w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          </div>

          {/* Golden Crescent Moon */}
          <div className="absolute top-[12%] right-[15%] w-16 h-16 rounded-full shadow-[10px_10px_0_0_#fbbf24] z-0 filter drop-shadow-[0_0_15px_rgba(251,191,36,0.3)] pointer-events-none" />

          {/* Chibi Town Skyline Silhouettes */}
          <div className="absolute bottom-32 left-0 right-0 h-40 z-0 pointer-events-none flex items-end justify-between opacity-35 px-4">
            <div className="w-16 h-28 bg-slate-900 rounded-t-xl relative">
              <div className="absolute top-4 left-3 w-2 h-3 bg-amber-400/80 rounded-sm" />
              <div className="absolute top-12 left-3 w-2 h-3 bg-amber-400/80 rounded-sm" />
              <div className="absolute top-4 right-3 w-2 h-3 bg-amber-400/80 rounded-sm" />
            </div>
            <div className="w-24 h-36 bg-slate-900 rounded-t-2xl relative mx-1">
              <div className="absolute top-6 left-4 w-3 h-4 bg-amber-400/80 rounded-sm" />
              <div className="absolute top-16 left-4 w-3 h-4 bg-amber-400/80 rounded-sm" />
              <div className="absolute top-6 right-4 w-3 h-4 bg-amber-400/80 rounded-sm animate-pulse" />
            </div>
            <div className="w-20 h-24 bg-slate-900 rounded-t-lg relative">
              <div className="absolute top-4 left-4 w-2 h-2 bg-amber-400/80 rounded-sm" />
              <div className="absolute top-4 right-4 w-2 h-2 bg-amber-400/80 rounded-sm" />
            </div>
            <div className="w-14 h-32 bg-slate-900 rounded-t-xl relative hidden md:block">
              <div className="absolute top-8 left-3 w-2 h-3 bg-amber-400/80 rounded-sm animate-pulse" />
              <div className="absolute top-16 left-3 w-2 h-3 bg-amber-400/80 rounded-sm" />
            </div>
          </div>

          {/* Narrative Text Overlay */}
          <div className="absolute top-[20%] z-20 text-center select-none flex flex-col items-center gap-4 px-6 animate-fade-in-up">
            <h1 className="text-2xl font-black tracking-widest text-amber-300 font-mono uppercase filter drop-shadow-[0_2px_8px_rgba(251,191,36,0.2)]">
              Heading Back to the Shop
            </h1>
            <p className="text-xs text-slate-300 font-medium max-w-sm leading-relaxed">
              Takings safely deposited in the vault. Stevie is riding home under the starry night sky, ready to start a fresh trading week on Monday morning!
            </p>
            {/* Modern subtle loading bar */}
            <div className="w-48 h-1.5 bg-slate-950 border border-white/5 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full w-full animate-scooter-bar" />
            </div>
          </div>

          {/* The Road and Animate Scooter driving left */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-slate-900/90 border-t-4 border-slate-800 z-10 flex items-center overflow-hidden">
            {/* Scrolling Road Markers */}
            <div className="absolute inset-0 w-full flex items-center justify-around pointer-events-none opacity-40">
              <div className="h-1.5 w-10 bg-amber-400 rounded-full animate-pulse" />
              <div className="h-1.5 w-10 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="h-1.5 w-10 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              <div className="h-1.5 w-10 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
              <div className="h-1.5 w-10 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '0.8s' }} />
            </div>

            <div className="scooter-container flex items-center justify-center">
              {/* Scooter Graphic 🛵 */}
              <span className="text-[64px] filter drop-shadow-[0_4px_10px_rgba(251,191,36,0.3)]">🛵</span>
              {/* Exhaust puff animation */}
              <span className="exhaust-smoke">💨</span>
            </div>
          </div>
        </>
      )}

      {/* Pure CSS Styles for visual aesthetics and keyframe animations */}
      <style>{`
        .bg-radial-vignette {
          background: radial-gradient(circle, transparent 50%, rgba(2, 6, 23, 0.75) 100%);
        }
        
        .animate-bounce-slow {
          animation: bounceSlow 3s infinite ease-in-out;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* 2D Side-scrolling scooter styles */
        .scooter-container {
          position: absolute;
          bottom: 24px;
          width: 90px;
          height: 90px;
          animation: driveLeft 3.0s linear forwards, bob 0.15s infinite ease-in-out;
        }

        .exhaust-smoke {
          position: absolute;
          right: -25px;
          bottom: 12px;
          font-size: 20px;
          animation: puff 0.3s infinite ease-in-out;
        }

        .animate-scooter-bar {
          animation: scooterBar 3.0s linear forwards;
        }

        @keyframes driveLeft {
          0% {
            left: 115%;
          }
          100% {
            left: -20%;
          }
        }

        @keyframes bob {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-4px) rotate(-1.5deg);
          }
        }

        @keyframes puff {
          0% {
            transform: scale(0.6) translate(0, 0);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.4) translate(15px, 5px);
            opacity: 0;
          }
        }

        @keyframes scooterBar {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        @keyframes bounceSlow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>

    </div>
  );
}
