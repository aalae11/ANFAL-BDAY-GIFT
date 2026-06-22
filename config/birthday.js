// Edit this file to personalize the whole birthday experience.
// Replace image paths with files placed in /public/images.
// Replace musicPath with your own audio file placed in /public/music.

function normalizeBasePath(value = "") {
  const cleaned = value.trim().replace(/^\/+|\/+$/g, "");
  return cleaned ? `/${cleaned}` : "";
}

const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH ?? "");
const assetPath = (path) => `${basePath}${path.startsWith("/") ? path : `/${path}`}`;

export const birthdayConfig = {
  personName: "ANFAL",
  musicPath: assetPath("/music/birthday-music.mp3"),
  theme: {
    black: "#030106",
    pink: "#ff79b5",
    purple: "#5c1f44",
    gold: "#e3bd72",
    glow: "#ffe7f1"
  },
  intro: {
    headsetText: "Wear headphones",
    subtitle: "A tiny pink plush world made only for you.",
    startLabel: "Start the surprise"
  },
  access: {
    code: "2306",
    title: "A little code for her world",
    hint: "Only the right numbers open this soft birthday place.",
    placeholder: "Code",
    submitLabel: "Open it",
    error: "Not that code. Try again softly."
  },
  gift: {
    eyebrow: "Tap the gift",
    title: "A tiny door to her gallery",
    hint: "Touch the pink gift when you are ready.",
    image: assetPath("/images/penguin-gift.gif")
  },
  gallerySecret: {
    hint: "Hold the focused photo",
    reveal: "This one feels impossible to stop looking at."
  },
  galleryCards: [
    {
      image: assetPath("/images/photo1.jpg"),
      title: "Soft light",
      quote: "Some faces don't need sunlight to glow."
    },
    {
      image: assetPath("/images/photo2.jpg"),
      title: "Quiet magic",
      quote: "Soft eyes, quiet magic."
    },
    {
      image: assetPath("/images/photo3.jpg"),
      title: "Unforgettable",
      quote: "A picture can be simple and still feel unforgettable."
    },
    {
      image: assetPath("/images/photo4.jpg"),
      title: "Stays in the mind",
      quote: "You have that kind of beauty that stays in the mind."
    },
    {
      image: assetPath("/images/photo5.jpg"),
      title: "Softer frame",
      quote: "Every frame feels softer with you in it."
    },
    {
      image: assetPath("/images/photo6.jpg"),
      title: "Tender color",
      quote: "Even the colors seem quieter around you."
    },
    {
      image: assetPath("/images/photo7.jpg"),
      title: "Blue calm",
      quote: "There is a calm kind of beauty in the way you look at the world."
    },
    {
      image: assetPath("/images/photo8.jpg"),
      title: "Little sparkle",
      quote: "A small smile from you can change the whole picture."
    },
    {
      image: assetPath("/images/photo9.jpg"),
      title: "Midnight softness",
      quote: "Soft light, dark hair, and a face that stays with you."
    },
    {
      image: assetPath("/images/photo10.jpg"),
      title: "Quiet elegance",
      quote: "Some pictures feel elegant without even trying."
    }
  ],
  story: [
    "This little world is made to celebrate the way you glow.",
    "Every picture of you carries its own quiet kind of magic.",
    "You deserve a birthday that feels soft, beautiful, and entirely yours.",
    "So this tiny cinematic place was made for you, ANFAL."
  ],
  letter: [
    "Happy Birthday ANFAL.",
    "I don't really know how to say everything perfectly, but I wanted to make something small for you because your birthday deserves to feel special.",
    "You have this calm beauty about you, the kind that stays in someone's mind without even trying. Your smile, your eyes, your presence, everything about you has a soft kind of light.",
    "I hope this new year of your life brings you happiness, peace, success, and beautiful days that make your heart feel full. You deserve good things and people who truly appreciate you.",
    "Maybe this is just a simple surprise, but it comes from a real place.",
    "Happy Birthday again, ANFAL.",
    "With all love,",
    "3alae"
  ],
  final: {
    headlinePrefix: "Happy Birthday,",
    subtext: "May this new year be gentle with you, bright for you, and full of the beauty you bring into every frame.",
    cakeImage: assetPath("/images/kitty-cake-clean.gif"),
    candlePrompt: "Hold the candle",
    wishReveal: "A wish for you: may every soft thing you hope for find its way to you."
  }
};
