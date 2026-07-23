export const sampleProducts = [
  { id: "everyday-tote", name: "Everyday Tote", category: "Bags", price: 68, description: "A structured recycled-canvas carryall with an interior laptop sleeve.", accent: "#E6F4F1", icon: "◒", image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=85" },
  { id: "cloud-mug", name: "Cloud Ceramic Mug", category: "Home", price: 24, description: "A hand-finished 12 oz mug made for slow mornings and long calls.", accent: "#FFF1DB", icon: "◖", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85" },
  { id: "arc-lamp", name: "Arc Desk Lamp", category: "Home", price: 89, description: "Warm, dimmable LED light with a clean aluminum silhouette.", accent: "#E8EEFF", icon: "◐", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85" },
  { id: "daily-bottle", name: "Daily Water Bottle", category: "Wellness", price: 32, description: "Insulated stainless steel bottle that keeps drinks cold for 24 hours.", accent: "#E5F6E8", icon: "◉", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=85" },
  { id: "weekend-throw", name: "Weekend Throw", category: "Home", price: 74, description: "Soft brushed-cotton throw, woven in a versatile natural stripe.", accent: "#F6E9E5", icon: "≈", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=85" },
  { id: "focus-notebook", name: "Focus Notebook", category: "Stationery", price: 18, description: "A dot-grid notebook with lay-flat binding and recycled paper.", accent: "#F2EDFF", icon: "▤", image: "https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?auto=format&fit=crop&w=900&q=85" }
];

export function serializeProduct(product) {
  return { ...product, id: product.id || product._id?.toString() };
}
