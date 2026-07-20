export function filterByTier(items, tier) {
  if (tier === "all") {
    return items;
  }

  return items.filter((item) => item.tier === tier);
}

export function getTieredHomeSlice(items, tier, limit) {
  return items.filter((item) => item.tier === tier).slice(0, limit);
}
