import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Text } from '@react-three/drei';
import * as THREE from 'three';
import Scooter3D from './Scooter3D';
import Customer3D from './Customer3D';
import TrafficLight3D from './TrafficLight3D';

const SHOP_NAMES = ['Florist', 'Repairs', 'Doctor', 'Bakery', 'Hardware', 'Post Office'];
const NPC_COLOURS = ['#f87171', '#60a5fa', '#c084fc', '#fbbf24', '#2dd4bf'];
const REACTIONS = ['neutral', 'bargain', 'acceptable', 'expensive'];

export default function Town3DWorld({ direction, onTransitionComplete }) {
  const [lightState, setLightState] = useState('red');
  const playerScooterRef = useRef();
  const crossTrafficRef = useRef();
  const pedestriansRef = useRef([]);
  const journey = useRef({ phase: 'approach' });

  const npcs = useMemo(() => {
    return Array.from({ length: 4 }).map((_, i) => ({
      color: NPC_COLOURS[Math.floor(Math.random() * NPC_COLOURS.length)],
      reaction: REACTIONS[Math.floor(Math.random() * REACTIONS.length)],
      startX: i % 2 === 0 ? -6 : 6,
      startZ: -5 - (Math.random() * 20),
    }));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLightState('green'), 2500);
    return () => clearTimeout(timer);
  }, []);

  useFrame((state, delta) => {
    if (playerScooterRef.current) {
      const p = playerScooterRef.current.position;
      const isGoingToBank = direction === 'to_bank';
      const endZ = isGoingToBank ? -35 : 12;
      const stopLineZ = isGoingToBank ? -11 : -19; 

      if (journey.current.phase === 'approach') {
        p.z = THREE.MathUtils.lerp(p.z, stopLineZ, 0.05);
        if (Math.abs(p.z - stopLineZ) < 1.5 && lightState === 'green') {
          journey.current.phase = 'depart';
        }
      } else if (journey.current.phase === 'depart') {
        p.z = THREE.MathUtils.lerp(p.z, endZ, 0.03);
        if (Math.abs(p.z - endZ) < 1.0) onTransitionComplete();
      }
    }

    if (crossTrafficRef.current && lightState === 'red') {
      crossTrafficRef.current.position.x += 25 * delta; 
    }

    pedestriansRef.current.forEach((ped, i) => {
      if (ped) {
        const waddleTarget = npcs[i].startX > 0 ? 7 : -7;
        ped.position.x = THREE.MathUtils.lerp(ped.position.x, waddleTarget, 0.01);
      }
    });
  });

  const playerLaneX = direction === 'to_bank' ? -1.5 : 1.5;
  const playerStartZ = direction === 'to_bank' ? 12 : -35;

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 8, 15]} fov={50} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 10]} intensity={1.2} castShadow />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -15]} receiveShadow>
        <planeGeometry args={[8, 50]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -15]}>
        <planeGeometry args={[0.2, 50]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -15]} receiveShadow>
        <planeGeometry args={[40, 6]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      <TrafficLight3D state={lightState} position={[-4.5, 0, -12]} rotation={[0, Math.PI / 4, 0]} />

      {SHOP_NAMES.map((name, i) => {
        const isLeft = i % 2 === 0;
        const xPos = isLeft ? -7 : 7;
        const zPos = -5 - (i * 5);
        const rotationY = isLeft ? Math.PI / 2 : -Math.PI / 2;
        const bldgColor = NPC_COLOURS[i % NPC_COLOURS.length];

        return (
          <group key={i} position={[xPos, 0, zPos]} rotation={[0, rotationY, 0]}>
            <mesh position={[0, 3, 0]} castShadow>
              <boxGeometry args={[4, 6, 4]} />
              <meshStandardMaterial color={bldgColor} />
            </mesh>
            <mesh position={[0, 1.25, 2.01]}>
              <boxGeometry args={[1.5, 2.5, 0.1]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            <Text position={[0, 3.5, 2.05]} fontSize={0.6} color="#ffffff" outlineWidth={0.05} outlineColor="#000000">
              {name}
            </Text>
          </group>
        );
      })}

      <group ref={playerScooterRef} position={[playerLaneX, 0, playerStartZ]}>
        <Scooter3D direction={direction} isNPC={false} scooterColour="#fbbf24" />
      </group>
      <group ref={crossTrafficRef} position={[-20, 0, -15]} rotation={[0, Math.PI / 2, 0]}>
        <Scooter3D direction="to_bank" isNPC={true} scooterColour="#ef4444" faceReaction="acceptable" />
      </group>

      {npcs.map((npc, i) => (
        <group key={i} ref={(el) => (pedestriansRef.current[i] = el)} position={[npc.startX, 0, npc.startZ]} rotation={[0, npc.startX > 0 ? -Math.PI/2 : Math.PI/2, 0]}>
          <Customer3D reaction={npc.reaction} itemName="Shopping" />
        </group>
      ))}
    </>
  );
}
