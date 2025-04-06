import { Howl } from "howler";
import { SOUND_MANIFEST, SoundCategory, SoundType } from "./sound-manifest";

export class SoundSystem {
  private sounds: Map<string, Howl> = new Map();
  private volumes: Record<SoundCategory, number> = {
    music: 0.4,
    effects: 0.8, // Increased effects volume
    ui: 0.5,
  };

  constructor() {
    // Pre-load all sounds
    Object.entries(SOUND_MANIFEST).forEach(([category, sounds]) => {
      Object.entries(sounds).forEach(([name, path]) => {
        const key = `${category}:${name}`;
        const sound = new Howl({
          src: [path],
          volume: this.volumes[category as SoundCategory],
          onloaderror: (id, error) => {
            console.error(`Error loading sound ${key}:`, error);
          },
          onplayerror: (id, error) => {
            console.error(`Error playing sound ${key}:`, error);
          },
        });
        this.sounds.set(key, sound);
      });
    });
  }

  play(category: SoundCategory, type: SoundType) {
    const key = `${category}:${type}`;
    const sound = this.sounds.get(key);
    if (sound) {
      if (!sound.state() || sound.state() === "unloaded") {
        console.warn(`Sound ${key} not loaded, loading now...`);
        sound.load();
      }

      try {
        console.log(`Playing sound: ${key}`);
        const id = sound.play();

        // Ensure the sound plays to completion
        sound.once("end", () => {
          console.log(`Sound ${key} finished playing`);
        });

        sound.once("stop", () => {
          console.log(`Sound ${key} stopped`);
        });

        return id;
      } catch (error) {
        console.error(`Error playing sound ${key}:`, error);
      }
    } else {
      console.warn(`Sound not found: ${category}:${type}`);
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
