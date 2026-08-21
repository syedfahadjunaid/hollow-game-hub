"use server";

import { apiRequest, ApiError } from "@/lib/api-client";

export interface IShopItem {
  id?: string;
  _id?: string;
  name: string;
  slug: string;
  description: string;
  category: "theme" | "frame" | "title" | "badge" | "soundpack";
  rarity: "common" | "rare" | "epic" | "legendary";
  priceCoins: number;
  priceGems: number;
  assetKey: string;
  metadata?: Record<string, unknown>;
  isActive?: boolean;
}

export interface IWalletBalance {
  coins: number;
  gems: number;
}

export interface IInventoryItem {
  itemId: string;
  itemSlug: string;
  acquiredAt: string;
  itemDetails: IShopItem | null;
}

export interface IUserInventory {
  userId: string;
  items: IInventoryItem[];
  equipped: {
    theme?: string | null;
    frame?: string | null;
    title?: string | null;
    soundpack?: string | null;
  };
}

function errorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Failed to complete shop action.";
}

/**
 * Fetch all available cosmetic items in the catalog
 */
export async function getCatalogAction(): Promise<{
  success: boolean;
  catalog?: IShopItem[];
  error?: string;
}> {
  try {
    const data = await apiRequest("/api/shop/catalog", { method: "GET" });
    return { success: true, catalog: data?.catalog || [] };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

/**
 * Fetch current user's coin and gem wallet balance
 */
export async function getMyBalanceAction(): Promise<{
  success: boolean;
  balance?: IWalletBalance;
  error?: string;
}> {
  try {
    const data = await apiRequest("/api/shop/balance", { method: "GET" });
    return { success: true, balance: data?.balance || { coins: 0, gems: 0 } };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

/**
 * Fetch current user's owned inventory and equipped cosmetics
 */
export async function getMyInventoryAction(): Promise<{
  success: boolean;
  inventory?: IUserInventory;
  error?: string;
}> {
  try {
    const data = await apiRequest("/api/shop/inventory", { method: "GET" });
    return { success: true, inventory: data?.inventory };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

/**
 * Purchase a cosmetic item from the shop
 */
export async function purchaseItemAction(itemSlug: string): Promise<{
  success: boolean;
  balance?: IWalletBalance;
  inventory?: IUserInventory;
  error?: string;
}> {
  try {
    const data = await apiRequest("/api/shop/purchase", {
      method: "POST",
      body: JSON.stringify({ itemSlug }),
    });
    return {
      success: true,
      balance: data?.balance,
      inventory: data?.inventory,
    };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

/**
 * Equip or unequip a cosmetic item slot
 */
export async function equipItemAction(
  slot: "theme" | "frame" | "title" | "soundpack",
  itemSlug: string | null
): Promise<{
  success: boolean;
  equipped?: IUserInventory["equipped"];
  error?: string;
}> {
  try {
    const data = await apiRequest("/api/shop/equip", {
      method: "POST",
      body: JSON.stringify({ slot, itemSlug }),
    });
    return { success: true, equipped: data?.equipped };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}
