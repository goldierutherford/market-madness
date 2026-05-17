/**
 * Generates an SVG data URI representing a cozy cartoony face
 * to be projected as a decal on our 3D rounded character heads.
 * 
 * All coordinates are tailored to fit a 256x256 pixel grid,
 * drawing simple, cute, dark-brown facial features with transparent backgrounds.
 * 
 * @param {string} reaction - Reaction state ('neutral', 'bargain', 'acceptable', 'expensive', 'shopkeeper')
 * @returns {string} Base64 SVG data URI
 */
export function generateFaceTexture(reaction) {
  let svgContent = "";

  const themeColor = "#3b2314"; // Rich dark brown for cute Animal Crossing lines

  switch (reaction) {
    case "bargain":
      // 😍 equivalent: Star-shaped sparkling eyes, wide open happy 'D' mouth, cute blushing circles
      svgContent = `
        <!-- Blush Circles -->
        <circle cx="58" cy="134" r="16" fill="#f472b6" opacity="0.6" />
        <circle cx="198" cy="134" r="16" fill="#f472b6" opacity="0.6" />
        
        <!-- Left Star Eye -->
        <path d="M90,84 L95,100 L111,105 L95,110 L90,126 L85,110 L69,105 L85,100 Z" fill="#eab308" stroke="${themeColor}" stroke-width="5" stroke-linejoin="round" />
        
        <!-- Right Star Eye -->
        <path d="M166,84 L171,100 L187,105 L171,110 L166,126 L161,110 L145,105 L161,100 Z" fill="#eab308" stroke="${themeColor}" stroke-width="5" stroke-linejoin="round" />
        
        <!-- Wide 'D' Happy Mouth -->
        <path d="M102,142 Q128,182 154,142 Z" fill="#f43f5e" stroke="${themeColor}" stroke-width="6" stroke-linejoin="round" />
      `;
      break;

    case "acceptable":
      // 😊 equivalent: Closed happy arches for eyes (^ ^), cute 'w' shaped mouth, light blushing circles
      svgContent = `
        <!-- Soft Blush Circles -->
        <circle cx="56" cy="132" r="12" fill="#fda4af" opacity="0.5" />
        <circle cx="200" cy="132" r="12" fill="#fda4af" opacity="0.5" />
        
        <!-- Left Arch Eye -->
        <path d="M72,116 Q90,94 108,116" stroke="${themeColor}" stroke-width="9" stroke-linecap="round" fill="none" />
        
        <!-- Right Arch Eye -->
        <path d="M148,116 Q166,94 184,116" stroke="${themeColor}" stroke-width="9" stroke-linecap="round" fill="none" />
        
        <!-- Cute 'w' Mouth -->
        <path d="M116,146 Q128,156 128,146 Q128,156 140,146" stroke="${themeColor}" stroke-width="6" stroke-linecap="round" fill="none" />
      `;
      break;

    case "expensive":
      // 😠 equivalent: Angled angry eyebrows, small dot eyes, and an unhappy inverted 'v' mouth
      svgContent = `
        <!-- Left Angled Eyebrow -->
        <path d="M70,92 L110,108" stroke="${themeColor}" stroke-width="9" stroke-linecap="round" />
        
        <!-- Right Angled Eyebrow -->
        <path d="M186,92 L146,108" stroke="${themeColor}" stroke-width="9" stroke-linecap="round" />
        
        <!-- Left Eye Dot -->
        <circle cx="90" cy="122" r="9" fill="${themeColor}" />
        
        <!-- Right Eye Dot -->
        <circle cx="166" cy="122" r="9" fill="${themeColor}" />
        
        <!-- Inverted 'v' Frown Mouth -->
        <path d="M116,156 L128,144 L140,156" stroke="${themeColor}" stroke-width="6" stroke-linecap="round" fill="none" />
      `;
      break;

    case "shopkeeper":
      // Friendly blushing Chef face with cute mustache and happy arch eyes for Stevie
      svgContent = `
        <!-- Rosy Apron Blush -->
        <circle cx="56" cy="132" r="16" fill="#fb7185" opacity="0.6" />
        <circle cx="200" cy="132" r="16" fill="#fb7185" opacity="0.6" />
        
        <!-- Happy Arched Eyes -->
        <path d="M70,116 Q90,92 110,116" stroke="${themeColor}" stroke-width="9" stroke-linecap="round" fill="none" />
        <path d="M146,116 Q166,92 186,116" stroke="${themeColor}" stroke-width="9" stroke-linecap="round" fill="none" />
        
        <!-- Chef Mustache -->
        <path d="M112,138 Q120,136 128,142 Q136,136 144,138 Q150,146 142,144 Q128,146 114,144 Q106,146 112,138 Z" fill="${themeColor}" />
        
        <!-- Sweet Happy Smile -->
        <path d="M114,148 Q128,168 142,148" stroke="${themeColor}" stroke-width="6" stroke-linecap="round" fill="none" />
      `;
      break;

    case "neutral":
    default:
      // 😐 equivalent: Two vertical oval eyes and a simple flat/curved line smile
      svgContent = `
        <!-- Left Oval Eye -->
        <ellipse cx="90" cy="112" rx="10" ry="17" fill="${themeColor}" />
        
        <!-- Right Oval Eye -->
        <ellipse cx="166" cy="112" rx="10" ry="17" fill="${themeColor}" />
        
        <!-- Simple Cute Smile -->
        <path d="M112,148 Q128,158 144,148" stroke="${themeColor}" stroke-width="6" stroke-linecap="round" fill="none" />
      `;
      break;
  }

  // Create the transparent high-resolution parent SVG wrapping
  const completeSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
      ${svgContent.trim()}
    </svg>
  `;

  // Encode the SVG cleanly to safe base64 Data URL format (UTF-8 compatible)
  const base64 = btoa(unescape(encodeURIComponent(completeSvg.trim())));
  return `data:image/svg+xml;base64,${base64}`;
}
