import React, { useState, useEffect, Suspense, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import Bank3DWorld from './Bank3DWorld';
import Town3DWorld from './Town3DWorld';
import ShopFacade3D from './ShopFacade3D';

// Error Boundary to catch WebGL context losses or offline font loading failures
class CinematicErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Cinematic skipped due to error:", error);
    // Push the state update to the next tick to avoid React rendering conflicts
    setTimeout(() => {
      if (this.props.onSkip) {
        this.props.onSkip();
      }
    }, 100);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-50 bg-slate-900 flex items-center justify-center text-slate-400 font-bold tracking-widest">
          LOADING...
        </div>
      );
    }
    return this.props.children;
  }
}

export default function BankCutscene({ bankBalance, processWeeklyDeposit, currentTier = 1 }) {
  const [phase, setPhase] = useState('closing_shop');
  const [isLeaving, setIsLeaving] = useState(false);
  const floatAmount = currentTier >= 3 ? 500 : 100;

  useEffect(() => {}, [phase]);

  const handleDepositClick = () => {
    setPhase('scooter_ride_prep');
    setIsLeaving(true); 
  };

  if (phase === 'closing_shop') {
    return (
      <CinematicErrorBoundary onSkip={() => setPhase('riding_to_bank')}>
        <div className="fixed inset-0 z-50 bg-sky-200">
          <Canvas shadows>
            <Suspense fallback={null}>
              <ShopFacade3D onTransitionComplete={() => setPhase('riding_to_bank')} />
            </Suspense>
          </Canvas>
        </div>
      </CinematicErrorBoundary>
    );
  }

  if (phase === 'riding_to_bank') {
    return (
      <CinematicErrorBoundary onSkip={() => setPhase('bank_scene')}>
        <div className="fixed inset-0 z-50 bg-sky-200">
          <Canvas shadows>
            <Suspense fallback={null}>
              <Town3DWorld direction="to_bank" onTransitionComplete={() => setPhase('bank_scene')} />
            </Suspense>
          </Canvas>
        </div>
      </CinematicErrorBoundary>
    );
  }

  if (phase === 'riding_home') {
    return (
      <CinematicErrorBoundary onSkip={() => processWeeklyDeposit(floatAmount)}>
        <div className="fixed inset-0 z-50 bg-orange-200">
          <Canvas shadows>
            <Suspense fallback={null}>
              <Town3DWorld direction="to_home" onTransitionComplete={() => processWeeklyDeposit(floatAmount)} />
            </Suspense>
          </Canvas>
        </div>
      </CinematicErrorBoundary>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <Suspense fallback={null}>
        <Bank3DWorld
          isLeaving={isLeaving}
          onAtCounter={() => setPhase('deposit_ui')}
          onLeaveComplete={() => setPhase('riding_home')} 
        />
      </Suspense>

      {phase === 'deposit_ui' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-8 rounded-2xl shadow-2xl pointer-events-auto text-center">
            <h2 className="text-3xl font-black text-white mb-2 tracking-wide">SUNDAY BANK TRIP</h2>
            <p className="text-slate-300 mb-6 text-lg">Deposit profits and set next week's float.</p>

            <div className="bg-black/50 rounded-xl p-6 mb-8 border border-slate-800">
              <p className="text-slate-400 uppercase text-sm font-bold tracking-wider mb-1">Current Balance</p>
              <p className="text-5xl font-black text-emerald-400">${bankBalance.toFixed(2)}</p>
            </div>

            <button
              onClick={handleDepositClick}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xl py-4 px-6 rounded-xl transition-transform hover:scale-105 active:scale-95"
            >
              DEPOSIT & KEEP ${floatAmount} FLOAT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
