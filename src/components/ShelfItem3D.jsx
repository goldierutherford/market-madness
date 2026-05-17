import React, { useMemo } from "react";
import { Decal, useTexture } from "@react-three/drei";

// Dynamic SVG emoji generator to create offline-safe high-resolution decals for items
const generateItemTexture = (emoji) => {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">
      <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-size="80">${emoji}</text>
    </svg>
  `;
  const base64 = btoa(unescape(encodeURIComponent(svgString)));
  return `data:image/svg+xml;base64,${base64}`;
};

// Pre-preload all item texture maps globally to eliminate Suspense unmounting / blinking
useTexture.preload(generateItemTexture("🍏"));
useTexture.preload(generateItemTexture("🥒"));
useTexture.preload(generateItemTexture("🍞"));
useTexture.preload(generateItemTexture("🍉"));
useTexture.preload(generateItemTexture("🚗"));
useTexture.preload(generateItemTexture("🧀"));
useTexture.preload(generateItemTexture("💐"));
useTexture.preload(generateItemTexture("☕"));
useTexture.preload(generateItemTexture("📖"));
useTexture.preload(generateItemTexture("🪴"));
useTexture.preload(generateItemTexture("🎧"));
useTexture.preload(generateItemTexture("⌚"));
useTexture.preload(generateItemTexture("👟"));
useTexture.preload(generateItemTexture("🕶️"));
useTexture.preload(generateItemTexture("💻"));


// Item geometric and colour visual configurations for Chibi styling
const getItemVisuals = (itemId) => {
  switch (itemId) {
    case "apple":
      return { isSphere: true, size: 0.08, color: "#ef4444" }; // Red apple sphere
    case "watermelon":
      return { isSphere: true, size: 0.1, color: "#22c55e" }; // Green watermelon sphere
    case "flowers":
      return { isSphere: true, size: 0.1, color: "#ec4899" }; // Pink floral sphere
    case "cucumber":
      return { isSphere: false, args: [0.06, 0.06, 0.22], color: "#15803d" }; // Green cylinder box
    case "bread":
      return { isSphere: false, args: [0.18, 0.12, 0.18], color: "#b45309" }; // Golden sourdough box
    case "cheese":
      return { isSphere: false, args: [0.16, 0.1, 0.16], color: "#facc15" }; // Cheese wedge box
    case "coffee":
      return { isSphere: false, args: [0.12, 0.16, 0.12], color: "#78350f" }; // Coffee bean package
    case "toycar":
      return { isSphere: false, args: [0.16, 0.1, 0.12], color: "#3b82f6" }; // Toy car box
    case "book":
      return { isSphere: false, args: [0.14, 0.18, 0.06], color: "#a855f7" }; // Book stack
    case "plant":
      return { isSphere: true, size: 0.09, color: "#10b981" }; // Potted plant sphere
    case "headphones":
      return { isSphere: false, args: [0.15, 0.15, 0.1], color: "#1e293b" }; // Headphone case
    case "watch":
      return { isSphere: false, args: [0.12, 0.12, 0.12], color: "#06b6d4" }; // Smartwatch block
    case "sneakers":
      return { isSphere: false, args: [0.18, 0.09, 0.11], color: "#f97316" }; // Sneaker box
    case "sunglasses":
      return { isSphere: false, args: [0.15, 0.07, 0.09], color: "#475569" }; // Sunglasses case
    case "laptop":
      return { isSphere: false, args: [0.22, 0.03, 0.16], color: "#94a3b8" }; // Laptop silver slab
    default:
      return { isSphere: false, args: [0.14, 0.14, 0.14], color: "#cbd5e1" }; // General box package
  }
};

export default function ShelfItem3D({ itemId, emoji, position }) {
  const visual = useMemo(() => getItemVisuals(itemId), [itemId]);
  
  const textureUrl = useMemo(() => generateItemTexture(emoji), [emoji]);
  const itemTexture = useTexture(textureUrl);

  // Position the decal slightly in front of the parent mesh to prevent clipping
  const decalPosition = useMemo(() => {
    if (visual.isSphere) {
      return [0, 0, visual.size + 0.01];
    }
    // For boxes, Z offset is half of the depth (Z argument index 2)
    return [0, 0, (visual.args[2] || 0.14) / 2 + 0.005];
  }, [visual]);

  const decalScale = useMemo(() => {
    if (visual.isSphere) {
      return [visual.size * 1.5, visual.size * 1.5, visual.size * 1.5];
    }
    const maxDim = Math.max(visual.args[0], visual.args[1]);
    return [maxDim * 0.9, maxDim * 0.9, maxDim * 0.9];
  }, [visual]);

  return (
    <mesh position={position} castShadow receiveShadow>
      {visual.isSphere ? (
        <sphereGeometry args={[visual.size, 16, 16]} />
      ) : (
        <boxGeometry args={visual.args} />
      )}
      <meshStandardMaterial color={visual.color} roughness={0.4} metalness={0.1} />

      {/* Dynamic Item Decal on the front (+Z) face */}
      <Decal 
        position={decalPosition} 
        rotation={[0, 0, 0]} 
        scale={decalScale}
      >
        <meshBasicMaterial 
          map={itemTexture} 
          transparent 
          polygonOffset 
          polygonOffsetFactor={-10} 
        />
      </Decal>
    </mesh>
  );
}
