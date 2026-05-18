/**
 * Generates random, cute, and highly conversational British-themed dialogue
 * for customers based on their price reaction and item name.
 * 
 * @param {string} reaction - Customer reaction type ('bargain', 'acceptable', 'expensive', 'VIP')
 * @param {string} itemName - The display name of the item
 * @returns {string} Fully formatted speech phrase
 */
export function generateCustomerPhrase(reaction, itemName) {
  // Safe lowercased name fallback
  const resolvedItem = itemName ? itemName.toLowerCase() : "item";

  const phrases = {
    bargain: [
      "Blimey! What a bargain for this [ITEM]!",
      "An absolute steal for this splendid [ITEM]!",
      "I'm chuffed to bits with this cheap [ITEM]!",
      "Brilliant! The price on this [ITEM] is marvellous!",
      "Absolutely smashing! I will definitely take the [ITEM]!",
      "Splendid! This [ITEM] is exceptionally cheap today!",
      "Oh wow! What a spectacular deal for a [ITEM]!"
    ],
    acceptable: [
      "This [ITEM] looks rather lovely.",
      "A fair price for this [ITEM], indeed.",
      "I suppose I will purchase this [ITEM] today.",
      "A very decent [ITEM] for a sensible price.",
      "It is quite a nice [ITEM]. I shall take it.",
      "Exactly what I was looking for! A lovely [ITEM]!",
      "This [ITEM] matches my shopping list perfectly!"
    ],
    expensive: [
      "Goodness gracious! That is way too dear for this [ITEM]!",
      "Who on earth would pay that much for a simple [ITEM]?!",
      "Goodness me, I shall pass on this overpriced [ITEM].",
      "You must be having a laugh with the price of this [ITEM]!",
      "Crikey! I cannot possibly justify buying this [ITEM].",
      "Oh dear! That is a bit too pricey for my pocket!",
      "My word! That [ITEM] costs a pretty penny!",
      "Golly gosh! I can't afford that for a [ITEM]!"
    ],
    VIP: [
      "Outstanding! Only the finest [ITEM] for a VIP!",
      "Exquisite! A truly magnificent [ITEM] at a premium rate!",
      "Marvellous! This luxurious [ITEM] is simply top drawer!",
      "Splendid! I shall gladly buy this [ITEM] with absolute style!"
    ]
  };

  // Safe classification fallback
  let category = reaction ? reaction.toLowerCase() : "acceptable";
  if (category === "too expensive" || category === "too cheap" || category === "expensive") {
    category = "expensive";
  } else if (category === "vip") {
    category = "VIP";
  } else if (category === "bargain") {
    category = "bargain";
  } else {
    category = "acceptable";
  }

  const list = phrases[category] || phrases.acceptable;
  const randomIndex = Math.floor(Math.random() * list.length);
  const selectedTemplate = list[randomIndex];

  return selectedTemplate.replace("[ITEM]", resolvedItem);
}
