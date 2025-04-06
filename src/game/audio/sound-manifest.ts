export const SOUND_MANIFEST = {
  music: {
    "peaceful-garden": "/sounds/music/peaceful-garden.mp3",
  },
  effects: {
    "plant-seed": "/sounds/effects/plant-seed.mp3",
    "water-drop": "/sounds/effects/water-drop.mp3",
    grow: "/sounds/effects/grow.mp3",
    harvest: "/sounds/effects/harvest.mp3",
    "fully-grown": "/sounds/effects/fully-grown.mp3",
  },
  ui: {
    click: "/sounds/ui/click.mp3",
    hover: "/sounds/ui/hover.mp3",
    success: "/sounds/ui/success.mp3",
  },
} as const;

export type SoundCategory = keyof typeof SOUND_MANIFEST;
export type SoundType =
  | keyof (typeof SOUND_MANIFEST)["music"]
  | keyof (typeof SOUND_MANIFEST)["effects"]
  | keyof (typeof SOUND_MANIFEST)["ui"];
