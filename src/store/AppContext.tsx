import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Recipe } from '../services/ai';

type FridgeItem = { id: number; name: string; date: string };
type ShopItem = { name: string; qty: string; done: boolean };
type FamilyMember = { name: string; pref: string };

interface AppState {
  ingredients: string[];
  setIngredients: React.Dispatch<React.SetStateAction<string[]>>;
  selectedDevices: string[];
  setSelectedDevices: React.Dispatch<React.SetStateAction<string[]>>;
  selectedEmotions: string[];
  setSelectedEmotions: React.Dispatch<React.SetStateAction<string[]>>;
  allergies: string[];
  setAllergies: React.Dispatch<React.SetStateAction<string[]>>;
  preferences: string[];
  setPreferences: React.Dispatch<React.SetStateAction<string[]>>;
  goals: string[];
  setGoals: React.Dispatch<React.SetStateAction<string[]>>;
  fridgeItems: FridgeItem[];
  setFridgeItems: React.Dispatch<React.SetStateAction<FridgeItem[]>>;
  shoppingList: ShopItem[];
  setShoppingList: React.Dispatch<React.SetStateAction<ShopItem[]>>;
  familyMembers: FamilyMember[];
  setFamilyMembers: React.Dispatch<React.SetStateAction<FamilyMember[]>>;
  homeRecipes: Recipe[];
  setHomeRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  suggestRecipes: Recipe[];
  setSuggestRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [fridgeItems, setFridgeItems] = useState<FridgeItem[]>([]);
  const [shoppingList, setShoppingList] = useState<ShopItem[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  
  const [homeRecipes, setHomeRecipes] = useState<Recipe[]>([]);
  const [suggestRecipes, setSuggestRecipes] = useState<Recipe[]>([]);

  return (
    <AppContext.Provider value={{
      ingredients, setIngredients,
      selectedDevices, setSelectedDevices,
      selectedEmotions, setSelectedEmotions,
      allergies, setAllergies,
      preferences, setPreferences,
      goals, setGoals,
      fridgeItems, setFridgeItems,
      shoppingList, setShoppingList,
      familyMembers, setFamilyMembers,
      homeRecipes, setHomeRecipes,
      suggestRecipes, setSuggestRecipes
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
