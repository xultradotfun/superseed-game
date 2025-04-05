import { Howl } from "howler";
import { SOUND_MANIFEST, SoundCategory, SoundType } from "./sound-manifest";

export class SoundSystem {
  private sounds: Map<string, Howl> = new Map();
  private volumes: Record<SoundCategory, number> = {
    music: 0.4,
    effects: 0.6,
    ui: 0.5,
  };

  constructor() {
    // Pre-load all sounds
    Object.entries(SOUND_MANIFEST).forEach(([category, sounds]) => {
      Object.entries(sounds).forEach(([name, path]) => {
        const key = `${category}:${name}`;
        this.sounds.set(
          key,
          new Howl({
            src: [path],
            volume: this.volumes[category as SoundCategory],
          })
        );
      });
    });
  }

  play(category: SoundCategory, type: SoundType) {
    const key = `${category}:${type}`;
    const sound = this.sounds.get(key);
    if (sound) {
      sound.play();
    }
  }

  startAmbientMusic() {
    const key = "music:peaceful-garden";
    const music = this.sounds.get(key);
    if (music) {
      music.loop(true);
      music.play();
    }
  }

  stopMusic() {
    const key = "music:peaceful-garden";
    const music = this.sounds.get(key);
    if (music) {
      music.stop();
    }
  }

  setVolume(category: SoundCategory, volume: number) {
    this.volumes[category] = volume;
    Object.entries(SOUND_MANIFEST[category]).forEach(([name]) => {
      const key = `${category}:${name}`;
      const sound = this.sounds.get(key);
      if (sound) {
        sound.volume(volume);
      }
    });
  }
}

// Create a singleton instance
export const soundSystem = new SoundSystem();
