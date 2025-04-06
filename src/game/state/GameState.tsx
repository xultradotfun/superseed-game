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

// Achievement tracking
export type Achievement = {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  progress: number;
  maxProgress: number;
  prophecyPiece?: number; // Which prophecy piece this achievement unlocks (0-3)
};

// Plant mastery tracking
export type PlantMastery = {
  plantsGrown: number;
  perfectGrowths: number;
  seedsCollected: number;
  timesCaredFor: number;
};

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

// Track overall game progression
type GameProgress = {
  plantMasteries: Record<PlantType, PlantMastery>;
  achievements: Achievement[];
  superseedProgress: {
    prophecyPiecesFound: number;
    totalPieces: number;
    unlockedCombinations: string[];
    completedRituals: string[];
  };
};

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "master_lumina",
    name: "Lumina Master",
    description: "Master the Lumina Bloom by growing 10 perfect specimens",
    completed: false,
    progress: 0,
    maxProgress: 10,
    prophecyPiece: 0,
  },
  {
    id: "master_ethereum",
    name: "Ethereum Essence Expert",
    description: "Master the Ethereum Essence by growing 10 perfect specimens",
    completed: false,
    progress: 0,
    maxProgress: 10,
    prophecyPiece: 1,
  },
  {
    id: "master_opstack",
    name: "OP Stack Oracle",
    description: "Master the OP Stack Orchid by growing 10 perfect specimens",
    completed: false,
    progress: 0,
    maxProgress: 10,
    prophecyPiece: 2,
  },
  {
    id: "master_defi",
    name: "DeFi Sage",
    description: "Master the DeFi Dandelion by growing 10 perfect specimens",
    completed: false,
    progress: 0,
    maxProgress: 10,
    prophecyPiece: 3,
  },
  {
    id: "grow_first_plant",
    name: "First Steps",
    description: "Grow your first plant to completion",
    completed: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: "efficient_gardener",
    name: "Efficient Gardener",
    description: "Maintain 3 plants simultaneously at full growth",
    completed: false,
    progress: 0,
    maxProgress: 3,
  },
  {
    id: "seed_collector",
    name: "Seed Collector",
    description: "Collect 50 seeds in total",
    completed: false,
    progress: 0,
    maxProgress: 50,
  },
];

const INITIAL_PLANT_MASTERY: PlantMastery = {
  plantsGrown: 0,
  perfectGrowths: 0,
  seedsCollected: 0,
  timesCaredFor: 0,
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
  gameProgress: GameProgress;
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

  // Add new state for progression tracking
  const [gameProgress, setGameProgress] = useState<GameProgress>({
    plantMasteries: {
      LuminaBloom: { ...INITIAL_PLANT_MASTERY },
      EthereumEssence: { ...INITIAL_PLANT_MASTERY },
      OPStackOrchid: { ...INITIAL_PLANT_MASTERY },
      DeFiDandelion: { ...INITIAL_PLANT_MASTERY },
    },
    achievements: INITIAL_ACHIEVEMENTS,
    superseedProgress: {
      prophecyPiecesFound: 0,
      totalPieces: 4,
      unlockedCombinations: [],
      completedRituals: [],
    },
  });

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

  // Function to update achievement progress
  const updateAchievement = (achievementId: string, progress: number) => {
    return new Promise<void>((resolve) => {
      setGameProgress((prev) => {
        const updatedAchievements = prev.achievements.map((achievement) => {
          if (achievement.id === achievementId) {
            const newProgress = Math.min(achievement.maxProgress, progress);
            const wasCompleted = achievement.completed;
            const isNowCompleted = newProgress >= achievement.maxProgress;

            // Log achievement update
            console.log(`Updating achievement ${achievement.name}:`, {
              oldProgress: achievement.progress,
              newProgress,
              wasCompleted,
              isNowCompleted,
            });

            // Only trigger completion events if this is the first time completing
            if (!wasCompleted && isNowCompleted) {
              console.log(`Achievement ${achievement.name} just completed!`);
              soundSystem.play("ui", "success");
            }

            return {
              ...achievement,
              progress: newProgress,
              completed: isNowCompleted,
            };
          }
          return achievement;
        });

        const newState = {
          ...prev,
          achievements: updatedAchievements,
        };

        // Resolve after state update
        queueMicrotask(() => {
          resolve();
          checkSuperseedProgress();
        });

        return newState;
      });
    });
  };

  // Function to update plant mastery
  const updatePlantMastery = (
    type: PlantType,
    update: Partial<PlantMastery>
  ) => {
    setGameProgress((prev) => ({
      ...prev,
      plantMasteries: {
        ...prev.plantMasteries,
        [type]: {
          ...prev.plantMasteries[type],
          ...update,
        },
      },
    }));
  };

  // Check if player has unlocked the Superseed
  const checkSuperseedProgress = () => {
    const { achievements, superseedProgress } = gameProgress;
    const unlockedPieces = new Set<number>();

    // Debug logging for achievements
    console.log("Checking achievements for prophecy pieces:");
    achievements.forEach((achievement) => {
      console.log(
        `${achievement.name}: completed=${achievement.completed}, progress=${achievement.progress}/${achievement.maxProgress}, piece=${achievement.prophecyPiece}`
      );
      if (achievement.completed && achievement.prophecyPiece !== undefined) {
        unlockedPieces.add(achievement.prophecyPiece);
        console.log(
          `Added prophecy piece ${achievement.prophecyPiece} from ${achievement.name}`
        );
      }
    });

    const newPiecesCount = unlockedPieces.size;
    console.log(`Total unlocked pieces: ${newPiecesCount}`);

    // Only update if we found new pieces
    if (newPiecesCount > superseedProgress.prophecyPiecesFound) {
      console.log(
        `Updating prophecy pieces from ${superseedProgress.prophecyPiecesFound} to ${newPiecesCount}`
      );

      // Force an immediate state update
      const newCombination = `Prophecy Piece ${newPiecesCount} Unlocked!`;
      setGameProgress((prev) => {
        const newState = {
          ...prev,
          superseedProgress: {
            ...prev.superseedProgress,
            prophecyPiecesFound: newPiecesCount,
            unlockedCombinations: [
              ...prev.superseedProgress.unlockedCombinations,
              newCombination,
            ],
          },
        };

        // Play special sound for finding a prophecy piece
        queueMicrotask(() => {
          soundSystem.play("ui", "success");

          // If all pieces are found, trigger the final revelation
          if (newPiecesCount === prev.superseedProgress.totalPieces) {
            console.log(
              "All prophecy pieces found! The Superseed can now be discovered!"
            );
            // TODO: Implement final revelation ceremony
          }
        });

        return newState;
      });
    }
  };

  const harvestPlant = async (id: string) => {
    const plant = plants[id];
    if (plant && plant.growthStage >= 1) {
      // Calculate all the new values first
      const seedCount = Math.floor(Math.random() * 2) + 2;
      const isPerfectGrowth = plant.growthStage >= 1;
      const currentMastery = gameProgress.plantMasteries[plant.type];
      const newPerfectGrowths =
        currentMastery.perfectGrowths + (isPerfectGrowth ? 1 : 0);

      // Calculate achievement updates
      const achievementMap = {
        LuminaBloom: "master_lumina",
        EthereumEssence: "master_ethereum",
        OPStackOrchid: "master_opstack",
        DeFiDandelion: "master_defi",
      };

      const masteryAchievementId = achievementMap[plant.type];
      const fullGrownPlants = Object.values(plants).filter(
        (p) => p.growthStage >= 1
      ).length;
      const totalSeeds =
        Object.values(gameProgress.plantMasteries).reduce(
          (total, mastery) => total + mastery.seedsCollected,
          0
        ) + seedCount;

      // Single atomic state update
      setGameProgress((prev) => {
        // Update achievements first
        const updatedAchievements = prev.achievements.map((achievement) => {
          if (achievement.id === masteryAchievementId) {
            const isNowCompleted = newPerfectGrowths >= achievement.maxProgress;
            return {
              ...achievement,
              progress: newPerfectGrowths,
              completed: isNowCompleted,
            };
          } else if (achievement.id === "grow_first_plant") {
            return { ...achievement, progress: 1, completed: true };
          } else if (achievement.id === "efficient_gardener") {
            return {
              ...achievement,
              progress: fullGrownPlants,
              completed: fullGrownPlants >= achievement.maxProgress,
            };
          } else if (achievement.id === "seed_collector") {
            return {
              ...achievement,
              progress: totalSeeds,
              completed: totalSeeds >= achievement.maxProgress,
            };
          }
          return achievement;
        });

        // Check for newly completed achievements with prophecy pieces
        const unlockedPieces = new Set<number>();
        updatedAchievements.forEach((achievement) => {
          if (
            achievement.completed &&
            achievement.prophecyPiece !== undefined
          ) {
            unlockedPieces.add(achievement.prophecyPiece);
          }
        });

        const newPiecesCount = unlockedPieces.size;
        const hadNewPieces =
          newPiecesCount > prev.superseedProgress.prophecyPiecesFound;

        // If we have new pieces, play the success sound
        if (hadNewPieces) {
          queueMicrotask(() => {
            soundSystem.play("ui", "success");
            if (newPiecesCount === prev.superseedProgress.totalPieces) {
              console.log(
                "All prophecy pieces found! The Superseed can now be discovered!"
              );
            }
          });
        }

        // Return the complete new state
        return {
          ...prev,
          plantMasteries: {
            ...prev.plantMasteries,
            [plant.type]: {
              plantsGrown: currentMastery.plantsGrown + 1,
              perfectGrowths: newPerfectGrowths,
              seedsCollected: currentMastery.seedsCollected + seedCount,
              timesCaredFor: currentMastery.timesCaredFor,
            },
          },
          achievements: updatedAchievements,
          superseedProgress: hadNewPieces
            ? {
                ...prev.superseedProgress,
                prophecyPiecesFound: newPiecesCount,
                unlockedCombinations: [
                  ...prev.superseedProgress.unlockedCombinations,
                  `Prophecy Piece ${newPiecesCount} Unlocked!`,
                ],
              }
            : prev.superseedProgress,
        };
      });

      // Update inventory
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
        gameProgress,
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
