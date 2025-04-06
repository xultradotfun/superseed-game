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
  | "DeFiDandelion"
  | "SuperSeed";

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

// Update shop configuration
const SEED_SHOP_CONFIG = {
  EthereumEssence: {
    cost: { type: "LuminaBloom" as PlantType, amount: 25 },
    requiredSeeds: 15, // Number of Lumina seeds needed to unlock
  },
  OPStackOrchid: {
    cost: { type: "EthereumEssence" as PlantType, amount: 20 },
    requiredMastery: "master_ethereum", // Achievement ID required
  },
  DeFiDandelion: {
    cost: { type: "OPStackOrchid" as PlantType, amount: 15 },
    requiredMastery: "master_opstack", // Achievement ID required
  },
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
  unlockedSeeds: PlantType[]; // Track which seeds are available in the shop
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

interface VictoryLink {
  text: string;
  url: string;
  description: string;
}

interface VictoryModalProps {
  title: string;
  message: string;
  links: VictoryLink[];
}

export interface GameState {
  plants: Plants;
  inventory: Inventory;
  selectedPlantType: PlantType | null;
  setSelectedPlantType: (type: PlantType | null) => void;
  addPlant: (position: Vector3, type: PlantType) => void;
  waterPlant: (plantId: string) => void;
  handlePlanting: (position: Vector3) => void;
  harvestPlant: (plantId: string) => void;
  gameProgress: GameProgress;
  canPurchaseSeed: (type: PlantType) => boolean;
  purchaseSeed: (type: PlantType) => boolean;
  canClaimSuperSeed: () => boolean;
  claimSuperSeed: () => boolean;
  showVictoryModal: (props: VictoryModalProps) => void;
}

const GameStateContext = createContext<GameState | null>(null);

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [plants, setPlants] = useState<Plants>({});
  const [inventory, setInventory] = useState<Inventory>({
    LuminaBloom: 5,
    EthereumEssence: 0,
    OPStackOrchid: 0,
    DeFiDandelion: 0,
    SuperSeed: 0,
  });
  const [selectedPlantType, setSelectedPlantType] = useState<PlantType | null>(
    null
  );
  const [gameProgress, setGameProgress] = useState<GameProgress>({
    plantMasteries: {
      LuminaBloom: { ...INITIAL_PLANT_MASTERY },
      EthereumEssence: { ...INITIAL_PLANT_MASTERY },
      OPStackOrchid: { ...INITIAL_PLANT_MASTERY },
      DeFiDandelion: { ...INITIAL_PLANT_MASTERY },
      SuperSeed: { ...INITIAL_PLANT_MASTERY },
    },
    achievements: INITIAL_ACHIEVEMENTS,
    superseedProgress: {
      prophecyPiecesFound: 0,
      totalPieces: 4,
      unlockedCombinations: [],
      completedRituals: [],
    },
    unlockedSeeds: ["LuminaBloom"], // Start with only Lumina Bloom
  });

  useEffect(() => {
    soundSystem.startAmbientMusic();
    return () => soundSystem.stopMusic();
  }, []);

  const addPlant = (position: Vector3, type: PlantType) => {
    const plant = generateNewPlant(position, type);
    setPlants((prev) => ({ ...prev, [plant.id]: plant }));
    soundSystem.play("effects", "plant-seed");
  };

  const checkPlantGrowthAchievements = () => {
    const fullGrownPlants = Object.values(plants).filter(
      (p) => p.growthStage >= 1
    ).length;

    setGameProgress((prev) => {
      const updatedAchievements = prev.achievements.map((achievement) => {
        if (achievement.id === "efficient_gardener") {
          // Track the highest number of simultaneous plants we've had
          const newProgress = Math.max(achievement.progress, fullGrownPlants);
          const isNowCompleted = newProgress >= achievement.maxProgress;

          if (isNowCompleted && !achievement.completed) {
            console.log("Efficient Gardener achievement completed!");
            soundSystem.play("ui", "success");
          }

          return {
            ...achievement,
            progress: newProgress,
            completed: isNowCompleted || achievement.completed, // Once completed, stays completed
          };
        }
        return achievement;
      });

      return {
        ...prev,
        achievements: updatedAchievements,
      };
    });
  };

  const waterPlant = (id: string) => {
    const currentPlant = plants[id];
    if (!currentPlant) return;

    const currentGrowthStage = currentPlant.growthStage || 0;
    const newGrowthStage = Math.min(1, currentGrowthStage + 0.2);

    // Check if plant is newly reaching full growth
    const wasFullyGrown = currentGrowthStage >= 1;
    const isNowFullyGrown = newGrowthStage >= 1;

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

    // If the plant just reached full growth
    if (isNowFullyGrown && !wasFullyGrown) {
      soundSystem.play("effects", "fully-grown");
      // Check achievements when a plant reaches full growth
      checkPlantGrowthAchievements();
    }
  };

  const checkSuperseedProgress = () => {
    const { achievements, superseedProgress } = gameProgress;
    const unlockedPieces = new Set<number>();

    achievements.forEach((achievement) => {
      if (achievement.completed && achievement.prophecyPiece !== undefined) {
        unlockedPieces.add(achievement.prophecyPiece);
      }
    });

    const newPiecesCount = unlockedPieces.size;

    if (newPiecesCount > superseedProgress.prophecyPiecesFound) {
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

        queueMicrotask(() => {
          soundSystem.play("ui", "success");
          if (newPiecesCount === prev.superseedProgress.totalPieces) {
            console.log(
              "All prophecy pieces found! The Superseed can now be discovered!"
            );
          }
        });

        return newState;
      });
    }
  };

  const harvestPlant = async (id: string) => {
    const plant = plants[id];
    if (plant && plant.growthStage >= 1) {
      const seedCount = Math.floor(Math.random() * 2) + 2;
      const isPerfectGrowth = plant.growthStage >= 1;
      const currentMastery = gameProgress.plantMasteries[plant.type];
      const newPerfectGrowths =
        currentMastery.perfectGrowths + (isPerfectGrowth ? 1 : 0);

      const achievementMap = {
        LuminaBloom: "master_lumina",
        EthereumEssence: "master_ethereum",
        OPStackOrchid: "master_opstack",
        DeFiDandelion: "master_defi",
      };

      const masteryAchievementId = achievementMap[plant.type];
      const totalSeeds =
        Object.values(gameProgress.plantMasteries).reduce(
          (total, mastery) => total + mastery.seedsCollected,
          0
        ) + seedCount;

      setGameProgress((prev) => {
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
          } else if (achievement.id === "seed_collector") {
            return {
              ...achievement,
              progress: totalSeeds,
              completed: totalSeeds >= achievement.maxProgress,
            };
          }
          return achievement;
        });

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

        if (hadNewPieces) {
          queueMicrotask(() => {
            soundSystem.play("ui", "success");
            if (newPiecesCount === prev.superseedProgress.totalPieces) {
              console.log(
                "All prophecy pieces found! The Superseed can now be discovered!"
              );
            }
          });
          // Explicitly check superseed progress after finding new pieces
          checkSuperseedProgress();
        }

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

      setInventory((prev) => ({
        ...prev,
        [plant.type]: prev[plant.type] + seedCount,
      }));

      setPlants((prev) => {
        const newPlants = { ...prev };
        delete newPlants[id];
        return newPlants;
      });

      soundSystem.play("effects", "harvest");

      // Check for new seed unlocks after harvesting
      checkSeedUnlocks();
    }
  };

  // Add effect to check seed unlocks when mastery changes
  useEffect(() => {
    checkSeedUnlocks();
  }, [
    gameProgress.plantMasteries.LuminaBloom.plantsGrown,
    gameProgress.achievements,
  ]);

  const handlePlanting = (position: Vector3) => {
    if (selectedPlantType && canPlantAt(position, plants)) {
      if (inventory[selectedPlantType] > 0) {
        addPlant(position, selectedPlantType);
        setInventory((prev) => ({
          ...prev,
          [selectedPlantType]: prev[selectedPlantType] - 1,
        }));
        // Only exit planting mode if we run out of the selected seed
        if (inventory[selectedPlantType] <= 1) {
          setSelectedPlantType(null);
        }
        soundSystem.play("ui", "success");
      }
    }
  };

  // Add shop functions
  const canPurchaseSeed = (type: PlantType): boolean => {
    if (type === "LuminaBloom") return false; // Can't purchase starter seeds

    const config = SEED_SHOP_CONFIG[type as keyof typeof SEED_SHOP_CONFIG];
    if (!config) return false;

    // For Ethereum Essence, just check if we have enough seeds
    if (type === "EthereumEssence") {
      return inventory[config.cost.type] >= config.cost.amount;
    }

    // For other seeds, check if we have the achievement and enough seeds
    if (gameProgress.unlockedSeeds.includes(type)) {
      return inventory[config.cost.type] >= config.cost.amount;
    }

    return false;
  };

  const checkSeedUnlocks = () => {
    const newUnlocks: PlantType[] = ["LuminaBloom"];

    // Check Ethereum Essence unlock - available when you have enough Lumina seeds
    if (
      inventory.LuminaBloom >= SEED_SHOP_CONFIG.EthereumEssence.requiredSeeds
    ) {
      newUnlocks.push("EthereumEssence");
    }

    // Check OP Stack Orchid unlock
    const ethereumMastery = gameProgress.achievements.find(
      (a) => a.id === SEED_SHOP_CONFIG.OPStackOrchid.requiredMastery
    );
    if (ethereumMastery?.completed) {
      newUnlocks.push("OPStackOrchid");
    }

    // Check DeFi Dandelion unlock
    const opStackMastery = gameProgress.achievements.find(
      (a) => a.id === SEED_SHOP_CONFIG.DeFiDandelion.requiredMastery
    );
    if (opStackMastery?.completed) {
      newUnlocks.push("DeFiDandelion");
    }

    if (
      JSON.stringify(newUnlocks) !== JSON.stringify(gameProgress.unlockedSeeds)
    ) {
      setGameProgress((prev) => ({
        ...prev,
        unlockedSeeds: newUnlocks,
      }));
      soundSystem.play("ui", "success");
    }
  };

  // Add effect to check seed unlocks when inventory changes
  useEffect(() => {
    checkSeedUnlocks();
  }, [inventory.LuminaBloom]);

  const purchaseSeed = (type: PlantType) => {
    if (!canPurchaseSeed(type)) return false;

    const config = SEED_SHOP_CONFIG[type as keyof typeof SEED_SHOP_CONFIG];
    if (!config) return false;

    setInventory((prev) => ({
      ...prev,
      [config.cost.type]: prev[config.cost.type] - config.cost.amount,
      [type]: prev[type] + 1,
    }));

    soundSystem.play("ui", "success");
    return true;
  };

  // Add function to check if SuperSeed can be claimed
  const canClaimSuperSeed = (): boolean => {
    return (
      gameProgress.superseedProgress.prophecyPiecesFound ===
        gameProgress.superseedProgress.totalPieces &&
      !gameProgress.superseedProgress.completedRituals.includes(
        "claimed_superseed"
      )
    );
  };

  // Add function to claim SuperSeed
  const claimSuperSeed = () => {
    if (!canClaimSuperSeed()) return false;

    setInventory((prev) => ({
      ...prev,
      SuperSeed: prev.SuperSeed + 1,
    }));

    setGameProgress((prev) => ({
      ...prev,
      superseedProgress: {
        ...prev.superseedProgress,
        completedRituals: [
          ...prev.superseedProgress.completedRituals,
          "claimed_superseed",
        ],
      },
    }));

    soundSystem.play("ui", "success");
    return true;
  };

  const showVictoryModal = (props: VictoryModalProps) => {
    // We'll implement the actual modal in the UI layer
    window.dispatchEvent(
      new CustomEvent("showVictoryModal", { detail: props })
    );
  };

  const value = {
    plants,
    inventory,
    selectedPlantType,
    setSelectedPlantType,
    addPlant,
    waterPlant,
    handlePlanting,
    harvestPlant,
    gameProgress,
    canPurchaseSeed,
    purchaseSeed,
    canClaimSuperSeed,
    claimSuperSeed,
    showVictoryModal,
  };

  return (
    <GameStateContext.Provider value={value}>
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
