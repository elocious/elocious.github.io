import type {
  User, Category, Brand, Product, Review, Store, Order, Coupon,
  Notification, Promotion, SupportTicket, Address,
} from '@/types'

const img = (seed: string, w = 600, h = 600) => `https://picsum.photos/seed/${seed}/${w}/${h}`
const banner = (seed: string) => `https://picsum.photos/seed/${seed}/1200/400`

export const currentUser: User = {
  id: 'u1',
  name: 'Alex Morgan',
  username: 'alexmorgan',
  email: 'alex@nexacart.com',
  phone: '+1 (555) 123-4567',
  avatar: img('avatar-alex', 200, 200),
  role: 'customer',
  points: 2450,
  loyaltyTier: 'Gold',
  referralCode: 'ALEX-2024',
  joinedAt: '2024-01-15',
}

export const users: User[] = [
  currentUser,
  { id: 'u2', name: 'Sara Chen', username: 'sarachen', email: 'sara@store.com', avatar: img('avatar-sara', 200, 200), role: 'seller', points: 0, loyaltyTier: 'Gold', referralCode: 'SARA-2024', joinedAt: '2023-06-01' },
  { id: 'u3', name: 'Marcus Lee', username: 'marcuslee', email: 'marcus@store.com', avatar: img('avatar-marcus', 200, 200), role: 'seller', points: 0, loyaltyTier: 'Silver', referralCode: 'MARC-2024', joinedAt: '2023-03-15' },
  { id: 'u4', name: 'Admin User', username: 'admin', email: 'admin@nexacart.com', avatar: img('avatar-admin', 200, 200), role: 'admin', points: 0, loyaltyTier: 'Platinum', referralCode: 'ADMIN-2024', joinedAt: '2023-01-01' },
]

export const categories: Category[] = [
  { id: 'c1', name: 'Electronics', slug: 'electronics', icon: 'Smartphone', image: img('cat-electronics'), parentId: null, description: 'Phones, laptops, gaming & accessories', productCount: 12 },
  { id: 'c2', name: 'Phones', slug: 'phones', icon: 'Smartphone', image: img('cat-phones'), parentId: 'c1', productCount: 5 },
  { id: 'c3', name: 'Laptops', slug: 'laptops', icon: 'Laptop', image: img('cat-laptops'), parentId: 'c1', productCount: 4 },
  { id: 'c4', name: 'Audio', slug: 'audio', icon: 'Headphones', image: img('cat-audio'), parentId: 'c1', productCount: 3 },
  { id: 'c5', name: 'Fashion', slug: 'fashion', icon: 'Shirt', image: img('cat-fashion'), parentId: null, description: 'Men\'s, women\'s, shoes & accessories', productCount: 8 },
  { id: 'c6', name: 'Men\'s', slug: 'mens', icon: 'Shirt', image: img('cat-mens'), parentId: 'c5', productCount: 4 },
  { id: 'c7', name: 'Women\'s', slug: 'womens', icon: 'Shirt', image: img('cat-womens'), parentId: 'c5', productCount: 4 },
  { id: 'c8', name: 'Home & Living', slug: 'home-living', icon: 'Sofa', image: img('cat-home'), parentId: null, description: 'Furniture, decor & kitchen essentials', productCount: 5 },
  { id: 'c9', name: 'Sports & Outdoors', slug: 'sports', icon: 'Dumbbell', image: img('cat-sports'), parentId: null, description: 'Fitness, outdoor gear & equipment', productCount: 4 },
  { id: 'c10', name: 'Beauty & Health', slug: 'beauty', icon: 'Sparkles', image: img('cat-beauty'), parentId: null, description: 'Skincare, makeup & wellness', productCount: 3 },
  { id: 'c11', name: 'Gaming', slug: 'gaming', icon: 'Gamepad2', image: img('cat-gaming'), parentId: 'c1', productCount: 3 },
  { id: 'c12', name: 'Toys & Kids', slug: 'toys-kids', icon: 'Baby', image: img('cat-toys'), parentId: null, description: 'Toys, games & kids essentials', productCount: 3 },
]

export const brands: Brand[] = [
  { id: 'b1', name: 'AuraTech', logo: img('brand-aura', 200, 200), productCount: 6 },
  { id: 'b2', name: 'Lumina', logo: img('brand-lumina', 200, 200), productCount: 4 },
  { id: 'b3', name: 'Vertex', logo: img('brand-vertex', 200, 200), productCount: 5 },
  { id: 'b4', name: 'PulseFit', logo: img('brand-pulse', 200, 200), productCount: 3 },
  { id: 'b5', name: 'ZenHome', logo: img('brand-zen', 200, 200), productCount: 4 },
  { id: 'b6', name: 'GlowLab', logo: img('brand-glow', 200, 200), productCount: 3 },
  { id: 'b7', name: 'NovaPlay', logo: img('brand-nova', 200, 200), productCount: 3 },
  { id: 'b8', name: 'EcoThread', logo: img('brand-eco', 200, 200), productCount: 4 },
]

export const stores: Store[] = [
  { id: 's1', name: 'AuraTech Official', slug: 'auratech', logo: img('store-aura', 200, 200), banner: banner('store-aura'), description: 'Premium electronics & cutting-edge gadgets from the future of tech.', sellerId: 'u2', sellerName: 'Sara Chen', rating: 4.8, reviewCount: 1240, productCount: 8, joinedAt: '2023-06-01', verified: true, location: 'San Francisco, CA', followers: 15400 },
  { id: 's2', name: 'Vertex Lifestyle', slug: 'vertex', logo: img('store-vertex', 200, 200), banner: banner('store-vertex'), description: 'Fashion-forward apparel and accessories for the modern individual.', sellerId: 'u3', sellerName: 'Marcus Lee', rating: 4.6, reviewCount: 890, productCount: 6, joinedAt: '2023-03-15', verified: true, location: 'New York, NY', followers: 9200 },
  { id: 's3', name: 'ZenHome Living', slug: 'zenhome', logo: img('store-zen', 200, 200), banner: banner('store-zen'), description: 'Transform your space with curated home & living essentials.', sellerId: 'u2', sellerName: 'Sara Chen', rating: 4.7, reviewCount: 670, productCount: 5, joinedAt: '2023-08-20', verified: true, location: 'Austin, TX', followers: 7800 },
  { id: 's4', name: 'PulseFit Gear', slug: 'pulsefit', logo: img('store-pulse', 200, 200), banner: banner('store-pulse'), description: 'Performance sports gear and outdoor equipment for athletes.', sellerId: 'u3', sellerName: 'Marcus Lee', rating: 4.5, reviewCount: 540, productCount: 4, joinedAt: '2023-09-10', verified: false, location: 'Denver, CO', followers: 5600 },
  { id: 's5', name: 'GlowLab Beauty', slug: 'glowlab', logo: img('store-glow', 200, 200), banner: banner('store-glow'), description: 'Clean beauty, skincare & wellness products that actually work.', sellerId: 'u2', sellerName: 'Sara Chen', rating: 4.9, reviewCount: 2100, productCount: 3, joinedAt: '2023-05-05', verified: true, location: 'Los Angeles, CA', followers: 22000 },
]

let pid = 0
function P(p: Partial<Product> & { title: string; price: number; categoryId: string; storeId: string }): Product {
  pid++
  const id = `p${pid}`
  const discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0
  return {
    id,
    title: p.title,
    slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    description: p.description || `Experience the ${p.title} — crafted with premium materials and designed for those who demand excellence. This product combines cutting-edge technology with elegant design to deliver an unmatched experience.`,
    brand: p.brand || 'AuraTech',
    brandId: p.brandId || 'b1',
    categoryId: p.categoryId,
    storeId: p.storeId,
    storeName: stores.find(s => s.id === p.storeId)?.name || '',
    sellerId: stores.find(s => s.id === p.storeId)?.sellerId || 'u2',
    price: p.price,
    originalPrice: p.originalPrice,
    discount,
    rating: p.rating || (4 + Math.random()).toFixed(1) as unknown as number,
    reviewCount: p.reviewCount || Math.floor(20 + Math.random() * 500),
    stock: p.stock ?? Math.floor(5 + Math.random() * 95),
    sku: `NC-${id.toUpperCase()}-${1000 + pid}`,
    images: p.images || [img(`prod-${id}-1`), img(`prod-${id}-2`, 600, 600), img(`prod-${id}-3`, 600, 600), img(`prod-${id}-4`, 600, 600)],
    variants: p.variants || [],
    specifications: p.specifications || [
      { label: 'Brand', value: p.brand || 'AuraTech' },
      { label: 'Warranty', value: '1 Year' },
      { label: 'Model', value: `NC-${pid}X` },
    ],
    whatsIncluded: p.whatsIncluded || ['1x Product', '1x User Manual', '1x Warranty Card'],
    shippingInfo: 'Ships within 1-2 business days. Free shipping on orders over $50.',
    returnPolicy: '30-day return policy. Item must be in original condition.',
    condition: p.condition || 'New',
    tags: p.tags || [],
    createdAt: p.createdAt || `2024-0${(pid % 9) + 1}-1${pid % 9}`,
    sold: p.sold || Math.floor(50 + Math.random() * 2000),
    trending: p.trending,
    bestSeller: p.bestSeller,
    newArrival: p.newArrival,
    flashSale: p.flashSale,
    dealPrice: p.dealPrice,
    dealEndsAt: p.dealEndsAt,
  }
}

export const products: Product[] = [
  P({ title: 'AuraPhone Pro Max 5G', price: 1099, originalPrice: 1299, categoryId: 'c2', storeId: 's1', brand: 'AuraTech', brandId: 'b1', rating: 4.8, reviewCount: 842, trending: true, bestSeller: true, stock: 45, variants: [{ name: 'Color', options: ['Midnight Black', 'Gold', 'Silver'] }, { name: 'Storage', options: ['128GB', '256GB', '512GB'] }], specifications: [{ label: 'Display', value: '6.7" OLED 120Hz' }, { label: 'Camera', value: '108MP Triple' }, { label: 'Battery', value: '5000mAh' }, { label: 'Chip', value: 'A18 Bionic' }], tags: ['5G', 'flagship', 'premium'] }),
  P({ title: 'Lumina UltraBook 16', price: 1899, originalPrice: 2199, categoryId: 'c3', storeId: 's1', brand: 'Lumina', brandId: 'b2', rating: 4.7, reviewCount: 456, trending: true, stock: 23, variants: [{ name: 'RAM', options: ['16GB', '32GB'] }, { name: 'SSD', options: ['512GB', '1TB'] }], specifications: [{ label: 'Display', value: '16" Retina 3K' }, { label: 'CPU', value: 'M3 Pro' }, { label: 'Weight', value: '1.8kg' }], tags: ['laptop', 'ultrabook'] }),
  P({ title: 'AuraBuds Pro ANC', price: 249, originalPrice: 329, categoryId: 'c4', storeId: 's1', brand: 'AuraTech', brandId: 'b1', rating: 4.6, reviewCount: 1240, bestSeller: true, flashSale: true, dealPrice: 199, dealEndsAt: new Date(Date.now() + 86400000 * 2).toISOString(), stock: 120, variants: [{ name: 'Color', options: ['White', 'Black'] }], tags: ['audio', 'wireless', 'ANC'] }),
  P({ title: 'Vertex Heritage Jacket', price: 179, originalPrice: 249, categoryId: 'c6', storeId: 's2', brand: 'Vertex', brandId: 'b3', rating: 4.5, reviewCount: 320, newArrival: true, stock: 67, variants: [{ name: 'Size', options: ['S', 'M', 'L', 'XL', 'XXL'] }, { name: 'Color', options: ['Charcoal', 'Navy', 'Olive'] }], tags: ['fashion', 'jacket'] }),
  P({ title: 'ZenHome Smart Lamp', price: 89, originalPrice: 129, categoryId: 'c8', storeId: 's3', brand: 'ZenHome', brandId: 'b5', rating: 4.7, reviewCount: 210, trending: true, stock: 89, tags: ['smart-home', 'lighting'] }),
  P({ title: 'PulseFit Pro Watch X', price: 349, originalPrice: 449, categoryId: 'c9', storeId: 's4', brand: 'PulseFit', brandId: 'b4', rating: 4.4, reviewCount: 560, bestSeller: true, flashSale: true, dealPrice: 299, dealEndsAt: new Date(Date.now() + 86400000).toISOString(), stock: 54, variants: [{ name: 'Size', options: ['40mm', '44mm'] }, { name: 'Band', options: ['Sport', 'Leather', 'Metal'] }], tags: ['fitness', 'wearable', 'smartwatch'] }),
  P({ title: 'GlowLab Vitamin C Serum', price: 39, originalPrice: 59, categoryId: 'c10', storeId: 's5', brand: 'GlowLab', brandId: 'b6', rating: 4.9, reviewCount: 3200, bestSeller: true, stock: 200, tags: ['beauty', 'skincare'] }),
  P({ title: 'NovaPlay Console Z', price: 499, originalPrice: 599, categoryId: 'c11', storeId: 's1', brand: 'NovaPlay', brandId: 'b7', rating: 4.8, reviewCount: 890, trending: true, stock: 15, tags: ['gaming', 'console'] }),
  P({ title: 'AuraTab Air 11', price: 649, originalPrice: 799, categoryId: 'c2', storeId: 's1', brand: 'AuraTech', brandId: 'b1', rating: 4.6, reviewCount: 340, newArrival: true, stock: 38, variants: [{ name: 'Color', options: ['Space Gray', 'Silver'] }, { name: 'Storage', options: ['64GB', '256GB'] }], tags: ['tablet'] }),
  P({ title: 'Vertex Slim Fit Jeans', price: 79, originalPrice: 119, categoryId: 'c6', storeId: 's2', brand: 'Vertex', brandId: 'b3', rating: 4.3, reviewCount: 280, stock: 95, variants: [{ name: 'Size', options: ['28', '30', '32', '34', '36'] }, { name: 'Color', options: ['Dark Blue', 'Black', 'Gray'] }], tags: ['fashion', 'jeans'] }),
  P({ title: 'Lumina Studio Headphones', price: 399, originalPrice: 499, categoryId: 'c4', storeId: 's1', brand: 'Lumina', brandId: 'b2', rating: 4.8, reviewCount: 670, bestSeller: true, stock: 42, variants: [{ name: 'Color', options: ['Black', 'Sand', 'Blue'] }], tags: ['audio', 'over-ear', 'studio'] }),
  P({ title: 'ZenHome Ergonomic Chair', price: 449, originalPrice: 599, categoryId: 'c8', storeId: 's3', brand: 'ZenHome', brandId: 'b5', rating: 4.6, reviewCount: 430, trending: true, stock: 28, variants: [{ name: 'Color', options: ['Black', 'Gray'] }], tags: ['furniture', 'office'] }),
  P({ title: 'PulseFit Resistance Band Set', price: 34, originalPrice: 49, categoryId: 'c9', storeId: 's4', brand: 'PulseFit', brandId: 'b4', rating: 4.5, reviewCount: 180, newArrival: true, stock: 150, tags: ['fitness', 'home-gym'] }),
  P({ title: 'GlowLab Hydrating Moisturizer', price: 29, originalPrice: 45, categoryId: 'c10', storeId: 's5', brand: 'GlowLab', brandId: 'b6', rating: 4.7, reviewCount: 1100, stock: 180, tags: ['beauty', 'skincare'] }),
  P({ title: 'NovaPlay Wireless Controller', price: 69, originalPrice: 89, categoryId: 'c11', storeId: 's1', brand: 'NovaPlay', brandId: 'b7', rating: 4.5, reviewCount: 420, stock: 76, variants: [{ name: 'Color', options: ['Black', 'White', 'Red'] }], tags: ['gaming', 'controller'] }),
  P({ title: 'AuraPhone Lite 5G', price: 599, originalPrice: 749, categoryId: 'c2', storeId: 's1', brand: 'AuraTech', brandId: 'b1', rating: 4.4, reviewCount: 520, stock: 60, variants: [{ name: 'Color', options: ['Blue', 'Black', 'Purple'] }, { name: 'Storage', options: ['128GB', '256GB'] }], tags: ['5G', 'mid-range'] }),
  P({ title: 'EcoThread Organic Cotton Tee', price: 39, originalPrice: 59, categoryId: 'c6', storeId: 's2', brand: 'EcoThread', brandId: 'b8', rating: 4.4, reviewCount: 240, newArrival: true, stock: 110, variants: [{ name: 'Size', options: ['XS', 'S', 'M', 'L', 'XL'] }, { name: 'Color', options: ['White', 'Black', 'Sage', 'Sand'] }], tags: ['fashion', 'sustainable'] }),
  P({ title: 'Vertex Wool Overcoat', price: 299, originalPrice: 399, categoryId: 'c6', storeId: 's2', brand: 'Vertex', brandId: 'b3', rating: 4.6, reviewCount: 190, stock: 34, variants: [{ name: 'Size', options: ['S', 'M', 'L', 'XL'] }, { name: 'Color', options: ['Camel', 'Charcoal', 'Black'] }], tags: ['fashion', 'winter'] }),
  P({ title: 'Lumina Desktop Pro', price: 2499, originalPrice: 2899, categoryId: 'c3', storeId: 's1', brand: 'Lumina', brandId: 'b2', rating: 4.7, reviewCount: 210, stock: 12, variants: [{ name: 'Config', options: ['Standard', 'Pro', 'Max'] }], tags: ['desktop', 'workstation'] }),
  P({ title: 'ZenHome Coffee Maker Deluxe', price: 159, originalPrice: 219, categoryId: 'c8', storeId: 's3', brand: 'ZenHome', brandId: 'b5', rating: 4.5, reviewCount: 380, bestSeller: true, stock: 52, tags: ['kitchen', 'coffee'] }),
  P({ title: 'AuraBuds Lite', price: 99, originalPrice: 149, categoryId: 'c4', storeId: 's1', brand: 'AuraTech', brandId: 'b1', rating: 4.2, reviewCount: 680, flashSale: true, dealPrice: 79, dealEndsAt: new Date(Date.now() + 86400000 * 3).toISOString(), stock: 200, tags: ['audio', 'budget'] }),
  P({ title: 'PulseFit Running Shoes', price: 129, originalPrice: 179, categoryId: 'c9', storeId: 's4', brand: 'PulseFit', brandId: 'b4', rating: 4.4, reviewCount: 450, trending: true, stock: 88, variants: [{ name: 'Size', options: ['7', '8', '9', '10', '11', '12'] }, { name: 'Color', options: ['Black', 'Blue', 'Red'] }], tags: ['sports', 'footwear'] }),
  P({ title: 'EcoThread Linen Shirt', price: 69, originalPrice: 99, categoryId: 'c7', storeId: 's2', brand: 'EcoThread', brandId: 'b8', rating: 4.5, reviewCount: 160, newArrival: true, stock: 72, variants: [{ name: 'Size', options: ['S', 'M', 'L', 'XL'] }, { name: 'Color', options: ['White', 'Sky', 'Sand'] }], tags: ['fashion', 'summer'] }),
  P({ title: 'GlowLab Retinol Night Cream', price: 49, originalPrice: 69, categoryId: 'c10', storeId: 's5', brand: 'GlowLab', brandId: 'b6', rating: 4.6, reviewCount: 890, stock: 140, tags: ['beauty', 'anti-aging'] }),
  P({ title: 'NovaPlay Gaming Headset Pro', price: 149, originalPrice: 199, categoryId: 'c11', storeId: 's1', brand: 'NovaPlay', brandId: 'b7', rating: 4.5, reviewCount: 560, bestSeller: true, stock: 64, variants: [{ name: 'Color', options: ['Black', 'Green'] }], tags: ['gaming', 'headset'] }),
  P({ title: 'ZenHome Throw Blanket', price: 59, originalPrice: 89, categoryId: 'c8', storeId: 's3', brand: 'ZenHome', brandId: 'b5', rating: 4.7, reviewCount: 290, stock: 96, variants: [{ name: 'Color', options: ['Cream', 'Gray', 'Terracotta'] }], tags: ['home', 'decor'] }),
  P({ title: 'Vertex Leather Belt', price: 45, originalPrice: 69, categoryId: 'c6', storeId: 's2', brand: 'Vertex', brandId: 'b3', rating: 4.3, reviewCount: 140, stock: 120, variants: [{ name: 'Size', options: ['30', '32', '34', '36', '38'] }], tags: ['fashion', 'accessories'] }),
  P({ title: 'AuraPhone Mini', price: 449, originalPrice: 599, categoryId: 'c2', storeId: 's1', brand: 'AuraTech', brandId: 'b1', rating: 4.3, reviewCount: 380, stock: 50, variants: [{ name: 'Color', options: ['Pink', 'Blue', 'Green'] }], tags: ['phone', 'compact'] }),
  P({ title: 'Lumina Portable Monitor 15', price: 299, originalPrice: 399, categoryId: 'c3', storeId: 's1', brand: 'Lumina', brandId: 'b2', rating: 4.4, reviewCount: 230, newArrival: true, stock: 33, tags: ['monitor', 'portable'] }),
  P({ title: 'EcoThread Recycled Backpack', price: 89, originalPrice: 129, categoryId: 'c6', storeId: 's2', brand: 'EcoThread', brandId: 'b8', rating: 4.6, reviewCount: 340, trending: true, stock: 78, variants: [{ name: 'Color', options: ['Forest', 'Ocean', 'Black'] }], tags: ['fashion', 'accessories', 'sustainable'] }),
  P({ title: 'PulseFit Yoga Mat Premium', price: 49, originalPrice: 79, categoryId: 'c9', storeId: 's4', brand: 'PulseFit', brandId: 'b4', rating: 4.5, reviewCount: 260, stock: 130, variants: [{ name: 'Color', options: ['Purple', 'Teal', 'Gray'] }], tags: ['fitness', 'yoga'] }),
  P({ title: 'GlowLab Sunscreen SPF 50', price: 24, originalPrice: 34, categoryId: 'c10', storeId: 's5', brand: 'GlowLab', brandId: 'b6', rating: 4.7, reviewCount: 670, newArrival: true, stock: 160, tags: ['beauty', 'suncare'] }),
  P({ title: 'NovaPlay Game Bundle', price: 119, originalPrice: 179, categoryId: 'c11', storeId: 's1', brand: 'NovaPlay', brandId: 'b7', rating: 4.6, reviewCount: 180, stock: 44, tags: ['gaming', 'bundle'] }),
  P({ title: 'ZenHome Ceramic Vase Set', price: 65, originalPrice: 95, categoryId: 'c8', storeId: 's3', brand: 'ZenHome', brandId: 'b5', rating: 4.6, reviewCount: 120, newArrival: true, stock: 68, tags: ['home', 'decor'] }),
  P({ title: 'Vertex Women\'s Summer Dress', price: 89, originalPrice: 139, categoryId: 'c7', storeId: 's2', brand: 'Vertex', brandId: 'b3', rating: 4.5, reviewCount: 310, trending: true, stock: 84, variants: [{ name: 'Size', options: ['XS', 'S', 'M', 'L', 'XL'] }, { name: 'Color', options: ['Floral', 'Black', 'Coral'] }], tags: ['fashion', 'dress'] }),
]

export const reviews: Review[] = [
  { id: 'r1', productId: 'p1', userId: 'u1', userName: 'Alex Morgan', userAvatar: img('avatar-alex', 200, 200), rating: 5, title: 'Best phone I\'ve ever owned!', body: 'The camera quality is absolutely stunning. Battery lasts all day even with heavy use. The build quality feels premium and the display is gorgeous.', createdAt: '2024-08-15', verified: true, helpful: 42 },
  { id: 'r2', productId: 'p1', userId: 'u2', userName: 'Sara Chen', userAvatar: img('avatar-sara', 200, 200), rating: 4, title: 'Great but expensive', body: 'Amazing phone but the price is steep. Still, you get what you pay for. The 5G speeds are incredible.', createdAt: '2024-07-20', verified: true, helpful: 18 },
  { id: 'r3', productId: 'p1', userId: 'u3', userName: 'Marcus Lee', userAvatar: img('avatar-marcus', 200, 200), rating: 5, title: 'Worth every penny', body: 'Switched from a competitor and never looking back. The ecosystem integration is seamless.', createdAt: '2024-09-01', verified: true, helpful: 35 },
  { id: 'r4', productId: 'p3', userId: 'u1', userName: 'Alex Morgan', userAvatar: img('avatar-alex', 200, 200), rating: 5, title: 'ANC is mind-blowing', body: 'I can\'t hear anything when these are on. Perfect for flights and noisy offices. Sound quality is top-notch.', createdAt: '2024-08-10', verified: true, helpful: 56 },
  { id: 'r5', productId: 'p3', userId: 'u3', userName: 'Marcus Lee', userAvatar: img('avatar-marcus', 200, 200), rating: 4, title: 'Good but fit could be better', body: 'Sound is amazing but they fall out during workouts. Great for commuting though.', createdAt: '2024-07-05', verified: true, helpful: 12 },
  { id: 'r6', productId: 'p2', userId: 'u2', userName: 'Sara Chen', userAvatar: img('avatar-sara', 200, 200), rating: 5, title: 'Perfect for work', body: 'Handles everything I throw at it — video editing, coding, multiple monitors. Battery life is surprisingly good.', createdAt: '2024-08-25', verified: true, helpful: 28 },
  { id: 'r7', productId: 'p6', userId: 'u1', userName: 'Alex Morgan', userAvatar: img('avatar-alex', 200, 200), rating: 4, title: 'Great fitness tracker', body: 'Accurate heart rate monitoring and the GPS is spot on. Battery lasts about a week.', createdAt: '2024-09-10', verified: true, helpful: 22 },
  { id: 'r8', productId: 'p7', userId: 'u2', userName: 'Sara Chen', userAvatar: img('avatar-sara', 200, 200), rating: 5, title: 'My skin glows!', body: 'After 3 weeks of use, my skin has never looked better. The vitamin C really works. Will repurchase.', createdAt: '2024-08-30', verified: true, helpful: 89 },
]

export const addresses: Address[] = [
  { id: 'a1', label: 'Home', name: 'Alex Morgan', street: '123 Market Street, Apt 4B', city: 'San Francisco', state: 'CA', zip: '94103', country: 'USA', phone: '+1 (555) 123-4567', isDefault: true },
  { id: 'a2', label: 'Office', name: 'Alex Morgan', street: '500 Howard Street, Floor 12', city: 'San Francisco', state: 'CA', zip: '94105', country: 'USA', phone: '+1 (555) 123-4567' },
]

export const orders: Order[] = [
  {
    id: 'NC-ORD-2024-001',
    userId: 'u1',
    items: [
      { productId: 'p1', title: 'AuraPhone Pro Max 5G', image: img('prod-p1-1'), price: 1099, quantity: 1, storeId: 's1', storeName: 'AuraTech Official' },
      { productId: 'p3', title: 'AuraBuds Pro ANC', image: img('prod-p3-1'), price: 199, quantity: 1, storeId: 's1', storeName: 'AuraTech Official' },
    ],
    subtotal: 1298, shipping: 0, tax: 103.84, discount: 100, total: 1301.84,
    status: 'delivered',
    address: addresses[0],
    paymentMethod: 'Visa •••• 4242',
    createdAt: '2024-09-15',
    trackingNumber: 'NC1Z987654321',
    estimatedDelivery: '2024-09-20',
    timeline: [
      { status: 'confirmed', label: 'Order Confirmed', date: '2024-09-15', done: true },
      { status: 'processing', label: 'Processing', date: '2024-09-16', done: true },
      { status: 'shipped', label: 'Shipped', date: '2024-09-17', done: true },
      { status: 'out_for_delivery', label: 'Out for Delivery', date: '2024-09-19', done: true },
      { status: 'delivered', label: 'Delivered', date: '2024-09-20', done: true },
    ],
  },
  {
    id: 'NC-ORD-2024-002',
    userId: 'u1',
    items: [
      { productId: 'p6', title: 'PulseFit Pro Watch X', image: img('prod-p6-1'), price: 299, quantity: 1, storeId: 's4', storeName: 'PulseFit Gear' },
    ],
    subtotal: 299, shipping: 15, tax: 25.12, discount: 0, total: 339.12,
    status: 'shipped',
    address: addresses[0],
    paymentMethod: 'Mastercard •••• 5555',
    createdAt: '2024-09-25',
    trackingNumber: 'NC1Z456789123',
    estimatedDelivery: '2024-09-30',
    timeline: [
      { status: 'confirmed', label: 'Order Confirmed', date: '2024-09-25', done: true },
      { status: 'processing', label: 'Processing', date: '2024-09-26', done: true },
      { status: 'shipped', label: 'Shipped', date: '2024-09-27', done: true },
      { status: 'out_for_delivery', label: 'Out for Delivery', date: '2024-09-30', done: false },
      { status: 'delivered', label: 'Delivered', date: '—', done: false },
    ],
  },
  {
    id: 'NC-ORD-2024-003',
    userId: 'u1',
    items: [
      { productId: 'p7', title: 'GlowLab Vitamin C Serum', image: img('prod-p7-1'), price: 39, quantity: 2, storeId: 's5', storeName: 'GlowLab Beauty' },
    ],
    subtotal: 78, shipping: 5, tax: 6.63, discount: 0, total: 89.63,
    status: 'processing',
    address: addresses[0],
    paymentMethod: 'Visa •••• 4242',
    createdAt: '2024-09-27',
    trackingNumber: 'NC1Z123456789',
    estimatedDelivery: '2024-10-02',
    timeline: [
      { status: 'confirmed', label: 'Order Confirmed', date: '2024-09-27', done: true },
      { status: 'processing', label: 'Processing', date: '2024-09-28', done: true },
      { status: 'shipped', label: 'Shipped', date: '—', done: false },
      { status: 'out_for_delivery', label: 'Out for Delivery', date: '—', done: false },
      { status: 'delivered', label: 'Delivered', date: '—', done: false },
    ],
  },
]

export const coupons: Coupon[] = [
  { id: 'cp1', code: 'WELCOME10', type: 'percentage', value: 10, minPurchase: 0, expiresAt: '2025-12-31', usageLimit: 10000, used: 3400, description: '10% off your entire order — for new customers' },
  { id: 'cp2', code: 'SAVE25', type: 'fixed', value: 25, minPurchase: 150, expiresAt: '2025-12-31', usageLimit: 5000, used: 1200, description: '$25 off orders over $150' },
  { id: 'cp3', code: 'FREESHIP', type: 'free_shipping', value: 0, minPurchase: 50, expiresAt: '2025-12-31', usageLimit: 99999, used: 8900, description: 'Free shipping on orders over $50' },
  { id: 'cp4', code: 'FLASH20', type: 'percentage', value: 20, minPurchase: 100, expiresAt: '2025-10-31', usageLimit: 2000, used: 800, description: '20% off flash sale items, min $100' },
  { id: 'cp5', code: 'FIRSTORDER', type: 'percentage', value: 15, minPurchase: 0, expiresAt: '2025-12-31', usageLimit: 50000, used: 12000, description: '15% off your first order ever', firstOrderOnly: true },
]

export const notifications: Notification[] = [
  { id: 'n1', type: 'order', title: 'Order Confirmed', body: 'Your order NC-ORD-2024-003 has been confirmed and is being processed.', read: false, createdAt: '2024-09-27T10:30:00', link: '/orders/NC-ORD-2024-003' },
  { id: 'n2', type: 'shipping', title: 'Order Shipped', body: 'Your order NC-ORD-2024-002 has shipped! Track: NC1Z456789123', read: false, createdAt: '2024-09-27T08:00:00', link: '/orders/NC-ORD-2024-002' },
  { id: 'n3', type: 'promotion', title: 'Flash Sale Live!', body: 'Up to 40% off audio products. Ends in 48 hours!', read: true, createdAt: '2024-09-26T14:00:00', link: '/products?filter=flash' },
  { id: 'n4', type: 'price_drop', title: 'Price Drop Alert', body: 'AuraBuds Pro ANC dropped from $329 to $199!', read: true, createdAt: '2024-09-25T09:00:00', link: '/product/p3' },
  { id: 'n5', type: 'reward', title: 'Points Earned', body: 'You earned 130 points from your recent order!', read: true, createdAt: '2024-09-20T16:00:00', link: '/rewards' },
  { id: 'n6', type: 'security', title: 'New Login', body: 'Login detected from San Francisco, CA. Was this you?', read: true, createdAt: '2024-09-15T12:00:00', link: '/settings' },
]

export const promotions: Promotion[] = [
  { id: 'pr1', title: 'Flash Sale: Audio Bonanza', description: 'Up to 40% off premium headphones & earbuds', type: 'flash_sale', discount: 40, image: banner('promo-audio'), endsAt: new Date(Date.now() + 86400000 * 2).toISOString(), active: true },
  { id: 'pr2', title: 'Daily Deal: Smart Watches', description: 'Today only — 30% off all fitness wearables', type: 'daily_deal', discount: 30, image: banner('promo-watches'), endsAt: new Date(Date.now() + 86400000).toISOString(), active: true },
  { id: 'pr3', title: 'Buy 1 Get 1: Skincare', description: 'BOGO on all GlowLab products this week', type: 'bogo', discount: 50, image: banner('promo-beauty'), endsAt: new Date(Date.now() + 86400000 * 5).toISOString(), active: true },
]

export const supportTickets: SupportTicket[] = [
  { id: 't1', subject: 'Return request for order NC-ORD-2024-001', category: 'Returns', status: 'resolved', priority: 'medium', createdAt: '2024-09-22', lastUpdate: '2024-09-24', messages: [
    { from: 'user', body: 'I\'d like to return the phone case, it doesn\'t fit.', createdAt: '2024-09-22' },
    { from: 'agent', body: 'Hi Alex! I\'ve processed your return. A refund will be issued within 3-5 business days.', createdAt: '2024-09-24' },
  ]},
  { id: 't2', subject: 'Question about warranty', category: 'Products', status: 'open', priority: 'low', createdAt: '2024-09-26', lastUpdate: '2024-09-26', messages: [
    { from: 'user', body: 'Does the AuraPhone Pro Max come with international warranty?', createdAt: '2024-09-26' },
  ]},
]

export const faqs = [
  { q: 'How long does delivery take?', a: 'Standard delivery takes 3-5 business days. Express delivery (1-2 days) is available at checkout for select locations.' },
  { q: 'What is the return policy?', a: 'We offer a 30-day return policy on most items. Products must be in original condition with all packaging. Some categories have extended return windows.' },
  { q: 'How do I track my order?', a: 'Go to My Orders, find your order, and click "Track Order." You\'ll see real-time status updates and a carrier tracking number once shipped.' },
  { q: 'How do I become a seller?', a: 'Click "Sell on NexaCart" and submit a seller application. Our team reviews applications within 3-5 business days. Verified sellers get access to the full seller dashboard.' },
  { q: 'How do rewards points work?', a: 'You earn 1 point per $1 spent. Points can be redeemed for discounts at checkout. You also earn points for reviews and referrals. Higher loyalty tiers earn faster.' },
  { q: 'Is my payment information secure?', a: 'Yes. We use industry-standard encryption and never store your raw card information. Payments are processed through PCI-compliant payment gateways.' },
  { q: 'Can I cancel my order?', a: 'Orders can be cancelled before they ship. Go to My Orders and click "Cancel" on eligible orders. Once shipped, you\'ll need to request a return.' },
  { q: 'How do coupons work?', a: 'Enter your coupon code at checkout. The discount is applied automatically if your order meets the coupon requirements (minimum purchase, category, etc.).' },
]
