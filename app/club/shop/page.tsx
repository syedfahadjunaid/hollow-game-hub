"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import {
  IconCoins,
  IconDiamond,
  IconPalette,
  IconFrame,
  IconAward,
  IconVolume,
  IconShoppingBag,
  IconPackage,
  IconCheck,
  IconSparkles,
} from "@tabler/icons-react";
import { toast } from "sonner";

import {
  getCatalogAction,
  getMyBalanceAction,
  getMyInventoryAction,
  purchaseItemAction,
  equipItemAction,
  IShopItem,
  IWalletBalance,
  IUserInventory,
} from "@/app/actions/shop-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/8bit/card";
import { Button } from "@/components/ui/8bit/button";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/ui/8bit/back-button";
import { cn } from "@/lib/utils";

type CategoryFilter = "all" | "theme" | "frame" | "title" | "badge" | "soundpack";

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState<"catalog" | "inventory">("catalog");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [catalog, setCatalog] = useState<IShopItem[]>([]);
  const [balance, setBalance] = useState<IWalletBalance>({ coins: 0, gems: 0 });
  const [inventory, setInventory] = useState<IUserInventory | null>(null);
  const [selectedItem, setSelectedItem] = useState<IShopItem | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadData = async () => {
    const [catRes, balRes, invRes] = await Promise.all([
      getCatalogAction(),
      getMyBalanceAction(),
      getMyInventoryAction(),
    ]);

    if (catRes.success && catRes.catalog) {
      setCatalog(catRes.catalog);
    }
    if (balRes.success && balRes.balance) {
      setBalance(balRes.balance);
    }
    if (invRes.success && invRes.inventory) {
      setInventory(invRes.inventory);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePurchase = (item: IShopItem) => {
    startTransition(async () => {
      const res = await purchaseItemAction(item.slug);
      if (res.success) {
        toast.success(`Unlocked ${item.name}!`, {
          description: "Item has been added to your inventory locker.",
        });
        setSelectedItem(null);
        loadData();
      } else {
        toast.error("Purchase Failed", {
          description: res.error || "Could not complete transaction.",
        });
      }
    });
  };

  const handleEquip = (slot: "theme" | "frame" | "title" | "soundpack", itemSlug: string | null) => {
    startTransition(async () => {
      const res = await equipItemAction(slot, itemSlug);
      if (res.success) {
        toast.success(itemSlug ? `Equipped ${slot}!` : `Unequipped ${slot}`);
        if (inventory && res.equipped) {
          setInventory({ ...inventory, equipped: res.equipped });
        }
      } else {
        toast.error("Equip Failed", {
          description: res.error || "Could not update cosmetic.",
        });
      }
    });
  };

  const isOwned = (slug: string) => {
    return inventory?.items?.some((i) => i.itemSlug === slug) ?? false;
  };

  const filteredCatalog = catalog.filter((item) => {
    if (categoryFilter === "all") return true;
    return item.category === categoryFilter;
  });

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50">LEGENDARY</Badge>;
      case "epic":
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">EPIC</Badge>;
      case "rare":
        return <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">RARE</Badge>;
      default:
        return <Badge className="bg-zinc-500/20 text-zinc-400 border-zinc-500/50">COMMON</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "theme":
        return <IconPalette className="size-4" />;
      case "frame":
        return <IconFrame className="size-4" />;
      case "title":
        return <IconAward className="size-4" />;
      case "soundpack":
        return <IconVolume className="size-4" />;
      default:
        return <IconSparkles className="size-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Wallet Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card p-4 sm:p-6 border-2 border-foreground dark:border-ring shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BackButton href="/club/main-menu" />
            <Image
              src="/images/pixel-coin.gif"
              alt="Coin"
              width={24}
              height={24}
              className="size-6 object-contain pixelated"
              unoptimized
            />
            <h1 className="text-xl sm:text-2xl font-black tracking-wide font-mono uppercase">
              Arcade Shop & Locker
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Customise your retro aesthetic with themes, avatar frames, custom titles, and SFX.
          </p>
        </div>

        {/* Currency Display */}
        <div className="flex items-center gap-3 bg-muted/40 p-2 sm:p-3 border border-border">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-sm font-bold">
            <IconCoins className="size-4 shrink-0" />
            <span>{balance.coins.toLocaleString()}</span>
            <span className="text-[10px] text-amber-500/70 hidden sm:inline">COINS</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-sm font-bold">
            <IconDiamond className="size-4 shrink-0" />
            <span>{balance.gems.toLocaleString()}</span>
            <span className="text-[10px] text-cyan-500/70 hidden sm:inline">GEMS</span>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <Button
          variant={activeTab === "catalog" ? "default" : "ghost"}
          onClick={() => setActiveTab("catalog")}
          className="flex items-center gap-2 font-mono text-xs sm:text-sm"
        >
          <IconShoppingBag className="size-4" />
          <span>Cosmetics Shop ({catalog.length})</span>
        </Button>
        <Button
          variant={activeTab === "inventory" ? "default" : "ghost"}
          onClick={() => setActiveTab("inventory")}
          className="flex items-center gap-2 font-mono text-xs sm:text-sm"
        >
          <IconPackage className="size-4" />
          <span>My Inventory ({inventory?.items?.length || 0})</span>
        </Button>
      </div>

      {/* SHOP CATALOG TAB */}
      {activeTab === "catalog" && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All Items" },
              { id: "theme", label: "Themes", icon: IconPalette },
              { id: "frame", label: "Avatar Frames", icon: IconFrame },
              { id: "title", label: "Titles", icon: IconAward },
              { id: "badge", label: "Badges", icon: IconSparkles },
              { id: "soundpack", label: "Soundpacks", icon: IconVolume },
            ].map((cat) => (
              <Button
                key={cat.id}
                size="sm"
                variant={categoryFilter === cat.id ? "default" : "secondary"}
                onClick={() => setCategoryFilter(cat.id as CategoryFilter)}
                className="text-xs font-mono h-8"
              >
                {cat.label}
              </Button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCatalog.map((item) => {
              const owned = isOwned(item.slug);
              return (
                <Card
                  key={item.slug}
                  className={cn(
                    "flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5",
                    item.rarity === "legendary" && "border-amber-500/60 bg-amber-500/5",
                    item.rarity === "epic" && "border-purple-500/60 bg-purple-500/5",
                    item.rarity === "rare" && "border-cyan-500/60 bg-cyan-500/5"
                  )}
                >
                  <CardHeader className="space-y-2 pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase font-mono">
                        {getCategoryIcon(item.category)}
                        <span>{item.category}</span>
                      </div>
                      {getRarityBadge(item.rarity)}
                    </div>
                    <CardTitle className="text-base font-bold font-mono tracking-wide">
                      {item.name}
                    </CardTitle>
                    <CardDescription className="text-xs line-clamp-2">
                      {item.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-2 space-y-4">
                    {/* Price & Action */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/60">
                      <div className="flex items-center gap-2">
                        {item.priceCoins > 0 && (
                          <div className="flex items-center gap-1 text-amber-400 font-mono text-xs font-bold">
                            <IconCoins className="size-3.5" />
                            <span>{item.priceCoins}</span>
                          </div>
                        )}
                        {item.priceGems > 0 && (
                          <div className="flex items-center gap-1 text-cyan-400 font-mono text-xs font-bold">
                            <IconDiamond className="size-3.5" />
                            <span>{item.priceGems}</span>
                          </div>
                        )}
                      </div>

                      {owned ? (
                        <div className="flex items-center gap-1 text-xs text-emerald-400 font-mono font-bold">
                          <IconCheck className="size-4" />
                          <span>OWNED</span>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          disabled={isPending || balance.coins < item.priceCoins || balance.gems < item.priceGems}
                          onClick={() => setSelectedItem(item)}
                          className="text-xs font-mono h-7"
                        >
                          BUY
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* MY INVENTORY TAB */}
      {activeTab === "inventory" && (
        <div className="space-y-6">
          {/* Active Equipped Showcase */}
          <div className="p-4 bg-card border-2 border-foreground dark:border-ring space-y-3">
            <h3 className="text-sm font-bold font-mono tracking-wider text-amber-400 uppercase">
              Equipped Cosmetics
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(["theme", "frame", "title", "soundpack"] as const).map((slot) => {
                const currentEquipped = inventory?.equipped?.[slot];
                return (
                  <div
                    key={slot}
                    className="p-3 bg-muted/40 border border-border flex flex-col justify-between gap-2"
                  >
                    <span className="text-[11px] uppercase font-mono text-muted-foreground">
                      {slot}
                    </span>
                    <span className="text-xs font-bold font-mono truncate">
                      {currentEquipped || "Default"}
                    </span>
                    {currentEquipped && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleEquip(slot, null)}
                        disabled={isPending}
                        className="text-[10px] h-6 px-1"
                      >
                        Unequip
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Owned Items Roster */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold font-mono uppercase">
              Owned Items ({inventory?.items?.length || 0})
            </h3>
            {inventory?.items?.length === 0 ? (
              <div className="p-8 text-center bg-card border border-border text-muted-foreground font-mono text-sm">
                No items owned yet. Visit the shop above to customize your loadout!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {inventory?.items?.map((owned) => {
                  const details = owned.itemDetails;
                  if (!details) return null;
                  const isEquipped =
                    inventory.equipped?.[details.category as keyof typeof inventory.equipped] === details.slug;

                  return (
                    <Card key={owned.itemSlug} className="flex flex-col justify-between">
                      <CardHeader className="space-y-1 pb-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground uppercase font-mono">
                            {details.category}
                          </span>
                          {getRarityBadge(details.rarity)}
                        </div>
                        <CardTitle className="text-sm font-bold font-mono">
                          {details.name}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {details.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-2">
                        {details.category !== "badge" ? (
                          <Button
                            size="sm"
                            variant={isEquipped ? "destructive" : "default"}
                            disabled={isPending}
                            onClick={() =>
                              handleEquip(
                                details.category as "theme" | "frame" | "title" | "soundpack",
                                isEquipped ? null : details.slug
                              )
                            }
                            className="w-full text-xs font-mono h-7"
                          >
                            {isEquipped ? "UNEQUIP" : "EQUIP"}
                          </Button>
                        ) : (
                          <div className="text-center text-xs text-muted-foreground font-mono py-1">
                            Badge auto-active in chat
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Purchase Confirmation Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-card border-2 border-foreground dark:border-ring">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono text-muted-foreground">
                  Confirm Purchase
                </span>
                {getRarityBadge(selectedItem.rarity)}
              </div>
              <CardTitle className="text-lg font-bold font-mono">
                {selectedItem.name}
              </CardTitle>
              <CardDescription className="text-xs">
                {selectedItem.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-muted/40 border border-border flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">Price:</span>
                <div className="flex items-center gap-2">
                  {selectedItem.priceCoins > 0 && (
                    <span className="text-amber-400 font-mono font-bold text-sm">
                      🪙 {selectedItem.priceCoins} Coins
                    </span>
                  )}
                  {selectedItem.priceGems > 0 && (
                    <span className="text-cyan-400 font-mono font-bold text-sm">
                      💎 {selectedItem.priceGems} Gems
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="flex-1 text-xs font-mono"
                  onClick={() => setSelectedItem(null)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  className="flex-1 text-xs font-mono"
                  onClick={() => handlePurchase(selectedItem)}
                  disabled={isPending}
                >
                  {isPending ? "Purchasing..." : "Confirm Buy"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
