import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import Bank3DWorld from './Bank3DWorld';
import Town3DWorld from './Town3DWorld';

export default function BankCutscene({ bankBalance, processWeeklyDeposit }) {
  const [phase, setPhase] = useState('riding_to_bank');
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {}, [phase]);

  const handleDepositClick = () => {
    setPhase('scooter_ride_prep');
    setIsLeaving(true); 
  };

  if (phase === 'riding_to_bank') {
    return (
      <div className="fixed inset-0 z-50 bg-sky-200">
        <Canvas shadows>
          <Town3DWorld direction="to_bank" onTransitionComplete={() => setPhase('bank_scene')} />
        </Canvas>
      </div>
    );
  }

  if (phase === 'riding_home') {
    return (
      <div className="fixed inset-0 z-50 bg-orange-200">
        <Canvas shadows>
          <Town3DWorld direction="to_home" onTransitionComplete={() => processWeeklyDeposit(100)} />
        </Canvas>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <Canvas shadows>
        <Bank3DWorld
          isLeaving={isLeaving}
          onAtCounter={() => setPhase('deposit_ui')}
          onLeaveComplete={() => setPhase('riding_home')} 
        />
      </Canvas>

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
              DEPOSIT & KEEP $100 FLOAT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
