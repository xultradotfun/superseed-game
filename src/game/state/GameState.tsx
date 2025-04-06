"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { soundSystem } from "@/game/audio/SoundSystem";
import { Vector3 } from "three";

export type PlantType =
  | "LuminaBloom"
  | "EthereumEssence"
  | "OPStackOrchid"
  | "DeFiDandelion";

export type Plant = {
  id: string;
  type: PlantType;
  position: [number, number, number];
  growthStage: number;
  lastWatered: number;
};

type Plants = Record<string, Plant>;

type Inventory = {
  [K in PlantType]: number;
};

const generateId = () => Math.random().toString(36).substring(7);

const generateNewPlant = (position: Vector3, type: PlantType): Plant => ({
  id: generateId(),
  type,
  position: [position.x, position.y, position.z],
  growthStage: 0,
  lastWatered: Date.now(),
});

const canPlantAt = (position: Vector3, plants: Plants) => {
  // Check if position is within valid bounds
  if (position.y < 0 || position.y > 10) return false;

  // Check if there's already a plant within 1 unit
  return !Object.values(plants).some((plant) => {
    const dx = plant.position[0] - position.x;
    const dy = plant.position[1] - position.y;
    const dz = plant.position[2] - position.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz) < 1;
  });
};

type GameState = {
  plants: Plants;
  inventory: Inventory;
  selectedPlantType: PlantType | null;
  setSelectedPlantType: (type: PlantType | null) => void;
  addPlant: (position: Vector3, type: PlantType) => void;
  waterPlant: (plantId: string) => void;
  handlePlanting: (position: Vector3) => void;
  harvestPlant: (plantId: string) => void;
};

const GameStateContext = createContext<GameState | null>(null);

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [plants, setPlants] = useState<Plants>({});
  const [inventory, setInventory] = useState<Inventory>({
    LuminaBloom: 5,
    EthereumEssence: 3,
    OPStackOrchid: 2,
    DeFiDandelion: 1,
  });
  const [selectedPlantType, setSelectedPlantType] = useState<PlantType | null>(
    null
  );

  // Start ambient music when the game loads
  useEffect(() => {
    soundSystem.startAmbientMusic();
    return () => soundSystem.stopMusic();
  }, []);

  const addPlant = (position: Vector3, type: PlantType) => {
    const plant = generateNewPlant(position, type);
    setPlants((prev) => ({ ...prev, [plant.id]: plant }));
    soundSystem.play("effects", "plant-seed");
  };

  const waterPlant = (id: string) => {
    const currentPlant = plants[id];
    if (!currentPlant) return;

    const currentGrowthStage = currentPlant.growthStage || 0;
    const newGrowthStage = Math.min(1, currentGrowthStage + 0.2);

    setPlants((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        lastWatered: Date.now(),
        growthStage: newGrowthStage,
      },
    }));

    // Play water drop sound
    soundSystem.play("effects", "water-drop");

    // If the plant just reached full growth, play the fully grown sound
    if (newGrowthStage >= 1 && currentGrowthStage < 1) {
      soundSystem.play("effects", "fully-grown");
    }
  };

  const harvestPlant = (id: string) => {
    console.log("Attempting to harvest plant:", id);
    const plant = plants[id];
    console.log("Plant data:", plant);
    if (plant && plant.growthStage >= 1) {
      console.log("Plant is ready for harvest");
      // Add seeds to inventory (2-3 seeds per harvest)
      const seedCount = Math.floor(Math.random() * 2) + 2;
      console.log("Adding", seedCount, "seeds to inventory");
      setInventory((prev) => ({
        ...prev,
        [plant.type]: prev[plant.type] + seedCount,
      }));

      // Remove the plant
      setPlants((prev) => {
        const newPlants = { ...prev };
        delete newPlants[id];
        return newPlants;
      });

      // Play harvest sound
      soundSystem.play("effects", "harvest");
      console.log("Plant harvested successfully");
    } else {
      console.log("Plant not ready for harvest:", {
        plant,
        growthStage: plant?.growthStage,
      });
    }
  };

  const handlePlanting = (position: Vector3) => {
    if (selectedPlantType && canPlantAt(position, plants)) {
      if (inventory[selectedPlantType] > 0) {
        addPlant(position, selectedPlantType);
        setInventory((prev) => ({
          ...prev,
          [selectedPlantType]: prev[selectedPlantType] - 1,
        }));
        setSelectedPlantType(null);
        soundSystem.play("ui", "success");
      }
    }
  };

  return (
    <GameStateContext.Provider
      value={{
        plants,
        inventory,
        selectedPlantType,
        setSelectedPlantType,
        addPlant,
        waterPlant,
        handlePlanting,
        harvestPlant,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error("useGameState must be used within a GameStateProvider");
  }
  return context;
}
