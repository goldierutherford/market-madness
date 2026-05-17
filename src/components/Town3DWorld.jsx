import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Plane, Box, Text } from '@react-three/drei';
import Scooter3D from './Scooter3D';

const SHOP_NAMES = ['Florist', 'Scooter Repairs', 'Doctor', 'Bakery', 'Hardware', 'Post Office', 'Greengrocer', 'Newsagent'];

export default function Town3DWorld({ direction, onTransitionComplete }) {
  const mainScooterRef = useRef();
  const npcScooterRefs = useRef([]);

  // Generate simple roadside building facades
  const buildings = useMemo(() => {
    const arr = [];
    const colours = ['#fecaca', '#bbf7d0', '#bfdbfe', '#fde047', '#e9d5ff'];
    let nameIdx = 0;
    
    for (let i = 0; i < 15; i++) {
      const z = 10 - (i * 4); // Spacing along the Z-axis
      const heightLeft = 3 + Math.random() * 4;
      const heightRight = 3 + Math.random() * 4;
      
      const colourLeft = colours[Math.floor(Math.random() * colours.length)];
      const colourRight = colours[Math.floor(Math.random() * colours.length)];
      
      const shopNameLeft = SHOP_NAMES[nameIdx % SHOP_NAMES.length];
      nameIdx++;
      const shopNameRight = SHOP_NAMES[nameIdx % SHOP_NAMES.length];
      nameIdx++;
      
      // Left building
      arr.push({ x: -6, z, height: heightLeft, colour: colourLeft, shopName: shopNameLeft, side: 'left' });
      // Right building
      arr.push({ x: 6, z, height: heightRight, colour: colourRight, shopName: shopNameRight, side: 'right' });
    }
    return arr;
  }, []);

  const npcStarts = useMemo(() => [-10, -20, -35], []);

  useFrame((state, delta) => {
    const speed = 12; // Units per second

    if (mainScooterRef.current) {
      if (direction === 'to_bank') {
        mainScooterRef.current.position.z -= speed * delta;
        if (mainScooterRef.current.position.z <= -30) {
          if (onTransitionComplete) onTransitionComplete();
        }
      } else {
        mainScooterRef.current.position.z += speed * delta;
        if (mainScooterRef.current.position.z >= 12) {
          if (onTransitionComplete) onTransitionComplete();
        }
      }
    }

    // NPC Scooters move in the opposite direction
    npcScooterRefs.current.forEach((ref) => {
      if (ref) {
        if (direction === 'to_bank') {
          ref.position.z += speed * delta; // move towards camera
        } else {
          ref.position.z -= speed * delta; // move away from camera
        }
      }
    });
  });

  const startZ = direction === 'to_bank' ? 12 : -30;
  const mainX = direction === 'to_bank' ? -1.5 : 1.5;
  const npcDirection = direction === 'to_bank' ? 'to_home' : 'to_bank';
  const npcX = direction === 'to_bank' ? 1.5 : -1.5;

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={50} rotation={[0, 0, 0]} />
      
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 15, 10]} intensity={1.2} castShadow />

      {/* Main Road */}
      <Plane args={[8, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -20]} receiveShadow>
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </Plane>

      {/* Centre Dashed Line */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Plane key={i} args={[0.2, 2]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 10 - i * 4]} receiveShadow>
          <meshStandardMaterial color="#f8fafc" roughness={1} />
        </Plane>
      ))}

      {/* Pavements / Sidewalks */}
      <Plane args={[4, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[-6, 0.05, -20]} receiveShadow>
        <meshStandardMaterial color="#94a3b8" roughness={0.8} />
      </Plane>
      <Plane args={[4, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[6, 0.05, -20]} receiveShadow>
        <meshStandardMaterial color="#94a3b8" roughness={0.8} />
      </Plane>

      {/* Buildings */}
      {buildings.map((b, i) => {
        const isLeft = b.side === 'left';
        // Left buildings need to face right (rotation Y = Math.PI/2)
        // Right buildings need to face left (rotation Y = -Math.PI/2)
        const rotY = isLeft ? Math.PI / 2 : -Math.PI / 2;
        
        return (
          <group key={i} position={[b.x, 0, b.z]}>
            {/* Main Building Body */}
            <Box args={[3, b.height, 3]} position={[0, b.height / 2, 0]} castShadow receiveShadow>
              <meshStandardMaterial color={b.colour} roughness={0.6} />
            </Box>
            
            {/* Doorway */}
            <Box 
              args={[1.5, 2.5, 0.1]} 
              position={[isLeft ? 1.51 : -1.51, 1.25, 0]} 
              rotation={[0, rotY, 0]}
            >
              <meshStandardMaterial color="#333333" />
            </Box>
            
            {/* Shop Sign */}
            <Text
              position={[isLeft ? 1.52 : -1.52, 3, 0]}
              rotation={[0, rotY, 0]}
              fontSize={0.6}
              color="#1e293b"
              anchorX="center"
              anchorY="middle"
            >
              {b.shopName}
            </Text>
          </group>
        );
      })}

      {/* Main Scooter */}
      <group ref={mainScooterRef} position={[mainX, 0, startZ]}>
        <Scooter3D direction={direction} isNPC={false} />
      </group>

      {/* NPC Scooters */}
      {npcStarts.map((z, i) => (
        <group 
          key={i} 
          ref={(el) => (npcScooterRefs.current[i] = el)} 
          position={[npcX, 0, z]}
        >
          <Scooter3D direction={npcDirection} isNPC={true} />
        </group>
      ))}
    </>
  );
}
