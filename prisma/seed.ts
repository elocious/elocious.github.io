import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const img = (id: string, w = 1200) => `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

const properties = [
  {
    title: 'Modern Downtown Apartment',
    description: 'Stunning contemporary apartment in the heart of downtown with floor-to-ceiling windows, sleek finishes, and panoramic city views. Open-concept living with chef\'s kitchen, quartz countertops, and stainless steel appliances. Building amenities include rooftop pool, fitness center, and 24-hour concierge.',
    price: 485000, rent: 2800, listingType: 'buy', propertyType: 'apartment',
    address: '201 Congress Ave, Unit 1408', city: 'Austin', state: 'TX', zipCode: '78701', neighborhood: 'Downtown',
    latitude: 30.2649, longitude: -97.7466,
    bedrooms: 2, bathrooms: 2, squareFeet: 1280, lotSize: null, yearBuilt: 2019, parking: 1,
    furnished: false, pool: true, garden: false, solar: false, smartHome: true, hoa: 380,
    schoolRating: 6.5, safetyScore: 72, walkabilityScore: 94, transitScore: 88, noiseLevel: 'high', floodRisk: 'low',
    propertyTax: 9700, insuranceEstimate: 1800, maintenanceEstimate: 200,
    images: JSON.stringify([img('photo-1545324418-cc1a3fa10f00'), img('photo-1502672260-937e5eeb90f0'), img('photo-1560448204-e02ea11c3127'), img('photo-1493809816272-2aec01e543a3')]),
  },
  {
    title: 'Family Townhouse in Cedar Park',
    description: 'Beautiful 3-story townhouse in family-friendly Cedar Park. Spacious living areas, gourmet kitchen with island, master suite with walk-in closet, and private backyard patio. Community features walking trails, playground, and is zoned for top-rated schools. Low-maintenance living with HOA handling exterior upkeep.',
    price: 425000, rent: 2400, listingType: 'buy', propertyType: 'townhouse',
    address: '4521 Cypress Creek Dr', city: 'Cedar Park', state: 'TX', zipCode: '78613', neighborhood: 'Cedar Park',
    latitude: 30.5053, longitude: -97.8203,
    bedrooms: 3, bathrooms: 2.5, squareFeet: 1850, lotSize: 2200, yearBuilt: 2017, parking: 2,
    furnished: false, pool: false, garden: true, solar: false, smartHome: false, hoa: 145,
    schoolRating: 8.5, safetyScore: 85, walkabilityScore: 52, transitScore: 45, noiseLevel: 'low', floodRisk: 'low',
    propertyTax: 8500, insuranceEstimate: 1600, maintenanceEstimate: 150,
    images: JSON.stringify([img('photo-1568605114967-8130f3a46994'), img('photo-1570129477492-45c003edd2be'), img('photo-1600585154340-be6161a8a0a0'), img('photo-1600596542815-52ddde2922f5')]),
  },
  {
    title: 'Luxury Waterfront Villa',
    description: 'Extraordinary waterfront villa with private dock, infinity pool, and breathtaking lake views. This architectural masterpiece features 20-foot ceilings, walls of glass, wine cellar, home theater, and smart home automation throughout. Gourmet kitchen with commercial-grade appliances. Outdoor kitchen and fire pit overlooking the water.',
    price: 1850000, rent: 8500, listingType: 'buy', propertyType: 'villa',
    address: '7801 Lakeshore Dr', city: 'Austin', state: 'TX', zipCode: '78732', neighborhood: 'Lakeway',
    latitude: 30.3650, longitude: -97.9800,
    bedrooms: 5, bathrooms: 4.5, squareFeet: 4200, lotSize: 0.5, yearBuilt: 2021, parking: 3,
    furnished: false, pool: true, garden: true, solar: true, smartHome: true, hoa: 0,
    schoolRating: 9.0, safetyScore: 90, walkabilityScore: 28, transitScore: 30, noiseLevel: 'low', floodRisk: 'moderate',
    propertyTax: 37000, insuranceEstimate: 6500, maintenanceEstimate: 800,
    images: JSON.stringify([img('photo-1613493492783-2fd5f6f7f7e0'), img('photo-1600585154526-9906d7a9f5c0'), img('photo-1600607687939-ce8e3e563f59'), img('photo-1600566753086-00f1f0a87e52')]),
  },
  {
    title: 'Charming Fixer-Upper Bungalow',
    description: 'Classic 1950s bungalow with tons of potential! Original hardwood floors, large lot with mature trees, and great bones. Needs updating throughout — kitchen, bathrooms, and cosmetic work. Perfect opportunity to build equity in an established, desirable neighborhood close to shops and restaurants.',
    price: 325000, rent: 1900, listingType: 'buy', propertyType: 'fixer-upper',
    address: '1208 W 6th St', city: 'Austin', state: 'TX', zipCode: '78703', neighborhood: 'Old West Austin',
    latitude: 30.2747, longitude: -97.7579,
    bedrooms: 3, bathrooms: 1, squareFeet: 1450, lotSize: 7000, yearBuilt: 1952, parking: 1,
    furnished: false, pool: false, garden: true, solar: false, smartHome: false, hoa: 0,
    schoolRating: 7.5, safetyScore: 78, walkabilityScore: 82, transitScore: 70, noiseLevel: 'medium', floodRisk: 'low',
    propertyTax: 6500, insuranceEstimate: 1400, maintenanceEstimate: 400,
    images: JSON.stringify([img('photo-1568605114967-8130f3a46994'), img('photo-1484154218962-a197022b5858'), img('photo-1502005229762-cf1b2da7c5d6'), img('photo-1494526585095-c41746248156')]),
  },
  {
    title: 'Sleek City Condo with Amenities',
    description: 'Modern high-rise condo with resort-style amenities. Floor-to-ceiling windows with downtown and hill country views. Designer finishes, European cabinetry, and spa-like bathroom. Building features pool, hot tub, fitness center, dog park, co-working space, and rooftop lounge. Walk to restaurants and entertainment.',
    price: 365000, rent: 2100, listingType: 'buy', propertyType: 'condo',
    address: '96 Rainey St, Unit 2205', city: 'Austin', state: 'TX', zipCode: '78701', neighborhood: 'Rainey District',
    latitude: 30.2580, longitude: -97.7395,
    bedrooms: 1, bathrooms: 1, squareFeet: 780, lotSize: null, yearBuilt: 2020, parking: 1,
    furnished: true, pool: true, garden: false, solar: false, smartHome: true, hoa: 420,
    schoolRating: 5.5, safetyScore: 70, walkabilityScore: 96, transitScore: 85, noiseLevel: 'high', floodRisk: 'low',
    propertyTax: 7300, insuranceEstimate: 1200, maintenanceEstimate: 100,
    images: JSON.stringify([img('photo-1502672260-937e5eeb90f0'), img('photo-1545324418-cc1a3fa10f00'), img('photo-1493809816272-2aec01e543a3'), img('photo-1560448204-e02ea11c3127')]),
  },
  {
    title: 'Spacious Detached Family Home',
    description: 'Well-maintained 2-story home in quiet, established neighborhood. Large backyard with covered patio, perfect for entertaining. Updated kitchen with granite counters, hardwood floors throughout main level. Master bedroom with en-suite and dual vanities. Close to parks, schools, and shopping.',
    price: 575000, rent: 3200, listingType: 'buy', propertyType: 'house',
    address: '3407 Mesa Dr', city: 'Austin', state: 'TX', zipCode: '78731', neighborhood: 'Allandale',
    latitude: 30.3180, longitude: -97.7440,
    bedrooms: 4, bathrooms: 3, squareFeet: 2600, lotSize: 9000, yearBuilt: 1998, parking: 2,
    furnished: false, pool: false, garden: true, solar: true, smartHome: false, hoa: 0,
    schoolRating: 8.0, safetyScore: 82, walkabilityScore: 65, transitScore: 55, noiseLevel: 'low', floodRisk: 'low',
    propertyTax: 11500, insuranceEstimate: 2200, maintenanceEstimate: 300,
    images: JSON.stringify([img('photo-1564013799919-ab6000b0b8e7'), img('photo-1600585154340-be6161a8a0a0'), img('photo-1600566753086-00f1f0a87e52'), img('photo-1600210492486-7b9385f7f7e0')]),
  },
  {
    title: 'Waterfront Property with Dock',
    description: 'Rare waterfront property on Lake Austin with private boat dock and stunning water views. Open floor plan with wall of windows overlooking the lake. Large deck perfect for entertaining. Kayak storage and lakeside fire pit. Mature landscaping with native plants. A true Texas Hill Country waterfront retreat.',
    price: 1250000, rent: 6000, listingType: 'buy', propertyType: 'waterfront',
    address: '4505 Lake Austin Blvd', city: 'Austin', state: 'TX', zipCode: '78703', neighborhood: 'Tarrytown',
    latitude: 30.2810, longitude: -97.7820,
    bedrooms: 4, bathrooms: 3, squareFeet: 3100, lotSize: 0.3, yearBuilt: 2005, parking: 2,
    furnished: false, pool: true, garden: true, solar: false, smartHome: true, hoa: 0,
    schoolRating: 8.5, safetyScore: 88, walkabilityScore: 40, transitScore: 35, noiseLevel: 'low', floodRisk: 'moderate',
    propertyTax: 25000, insuranceEstimate: 4500, maintenanceEstimate: 600,
    images: JSON.stringify([img('photo-1600210492493-1bf5f7394e7e'), img('photo-1613493492783-2fd5f6f7f7e0'), img('photo-1600585154526-9906d7a9f5c0'), img('photo-1600596542815-52ddde2922f5')]),
  },
  {
    title: 'Investment Duplex — Cash Flow Opportunity',
    description: 'Turnkey duplex with both units rented. Each unit has 2 bedrooms, 1 bathroom, and private yard. Recent updates include roof (2022), HVAC (2021), and exterior paint. Strong rental history with long-term tenants. Great cash flow potential in a growing area near major employers.',
    price: 410000, rent: 3600, listingType: 'buy', propertyType: 'duplex',
    address: '1502 E 12th St', city: 'Austin', state: 'TX', zipCode: '78702', neighborhood: 'East Austin',
    latitude: 30.2685, longitude: -97.7230,
    bedrooms: 4, bathrooms: 2, squareFeet: 2000, lotSize: 6000, yearBuilt: 1985, parking: 4,
    furnished: false, pool: false, garden: true, solar: false, smartHome: false, hoa: 0,
    schoolRating: 6.0, safetyScore: 68, walkabilityScore: 78, transitScore: 65, noiseLevel: 'medium', floodRisk: 'low',
    propertyTax: 8200, insuranceEstimate: 1800, maintenanceEstimate: 350,
    images: JSON.stringify([img('photo-1484154218962-a197022b5858'), img('photo-1502005229762-cf1b2da7c5d6'), img('photo-1564013799919-ab6000b0b8e7'), img('photo-1494526585095-c41746248156')]),
  },
  {
    title: 'Cozy Bungalow Near Zilker Park',
    description: 'Adorable bungalow walking distance to Zilker Park and Barton Springs. Original character with modern updates — refinished hardwoods, updated kitchen, and spa bathroom. Large private yard with deck and garden. Bike to downtown. One of Austin\'s most sought-after neighborhoods.',
    price: 695000, rent: 3500, listingType: 'buy', propertyType: 'bungalow',
    address: '805 Barton Springs Rd', city: 'Austin', state: 'TX', zipCode: '78704', neighborhood: 'Zilker',
    latitude: 30.2620, longitude: -97.7680,
    bedrooms: 2, bathrooms: 1.5, squareFeet: 1100, lotSize: 5000, yearBuilt: 1948, parking: 1,
    furnished: false, pool: false, garden: true, solar: false, smartHome: false, hoa: 0,
    schoolRating: 7.0, safetyScore: 80, walkabilityScore: 85, transitScore: 72, noiseLevel: 'medium', floodRisk: 'low',
    propertyTax: 13900, insuranceEstimate: 2000, maintenanceEstimate: 250,
    images: JSON.stringify([img('photo-1494526585095-c41746248156'), img('photo-1484154218962-a197022b5858f7'), img('photo-1568605114967-8130f3a46994'), img('photo-1502005229762-cf1b2da7c5d6')]),
  },
  {
    title: 'Contemporary Hill Country Home',
    description: 'Stunning contemporary home with panoramic Hill Country views. Clean lines, energy-efficient design with solar panels, and native landscaping. Open living area with floor-to-ceiling windows. Chef\'s kitchen with waterfall island. Master suite with spa bathroom and private balcony. Rainwater collection system.',
    price: 825000, rent: 4200, listingType: 'buy', propertyType: 'house',
    address: '2201 Scenic Brook Dr', city: 'Austin', state: 'TX', zipCode: '78737', neighborhood: 'Oak Hill',
    latitude: 30.2200, longitude: -97.8650,
    bedrooms: 4, bathrooms: 3.5, squareFeet: 3200, lotSize: 1.2, yearBuilt: 2020, parking: 2,
    furnished: false, pool: true, garden: true, solar: true, smartHome: true, hoa: 0,
    schoolRating: 8.0, safetyScore: 86, walkabilityScore: 30, transitScore: 25, noiseLevel: 'low', floodRisk: 'low',
    propertyTax: 16500, insuranceEstimate: 2800, maintenanceEstimate: 350,
    images: JSON.stringify([img('photo-1600585154340-be6161a8a0a0'), img('photo-1600566753086-00f1f0a87e52'), img('photo-1600596542815-52ddde2922f5'), img('photo-1600607687939-ce8e3e563f59')]),
  },
];

async function main() {
  console.log('Seeding BetterHome database...');

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@betterhome.app' },
    update: {},
    create: {
      email: 'demo@betterhome.app',
      name: 'Alex Morgan',
      buyerType: 'buy',
      budgetMin: 400000,
      budgetMax: 850000,
      preferredLocations: JSON.stringify(['Austin, TX', 'Cedar Park, TX', 'Lakeway, TX']),
      timeline: '3-6m',
      weightAffordability: 8,
      weightSafety: 7,
      weightSchools: 6,
      weightCommute: 7,
      weightSpace: 8,
      weightNeighborhood: 6,
      weightInvestment: 5,
      weightLifestyle: 7,
      weightMaintenance: 4,
      weightPrivacy: 6,
      weightOutdoor: 7,
    },
  });

  // Create neighborhoods
  const neighborhoods = [
    { name: 'Downtown', city: 'Austin', state: 'TX', schoolRating: 6.5, safetyScore: 72, walkabilityScore: 94, transitScore: 88, noiseLevel: 'high', floodRisk: 'low', averagePrice: 500000, priceTrend: 'up', amenities: JSON.stringify(['Restaurants', 'Bars', 'Shopping', 'Transit', 'Entertainment']) },
    { name: 'Cedar Park', city: 'Cedar Park', state: 'TX', schoolRating: 8.5, safetyScore: 85, walkabilityScore: 52, transitScore: 45, noiseLevel: 'low', floodRisk: 'low', averagePrice: 425000, priceTrend: 'up', amenities: JSON.stringify(['Parks', 'Schools', 'Shopping', 'Trails']) },
    { name: 'Lakeway', city: 'Austin', state: 'TX', schoolRating: 9.0, safetyScore: 90, walkabilityScore: 28, transitScore: 30, noiseLevel: 'low', floodRisk: 'moderate', averagePrice: 1200000, priceTrend: 'stable', amenities: JSON.stringify(['Lake Access', 'Golf', 'Marina', 'Parks']) },
    { name: 'Old West Austin', city: 'Austin', state: 'TX', schoolRating: 7.5, safetyScore: 78, walkabilityScore: 82, transitScore: 70, noiseLevel: 'medium', floodRisk: 'low', averagePrice: 650000, priceTrend: 'up', amenities: JSON.stringify(['Historic District', 'Restaurants', 'Parks', 'Schools']) },
    { name: 'Rainey District', city: 'Austin', state: 'TX', schoolRating: 5.5, safetyScore: 70, walkabilityScore: 96, transitScore: 85, noiseLevel: 'high', floodRisk: 'low', averagePrice: 380000, priceTrend: 'up', amenities: JSON.stringify(['Restaurants', 'Bars', 'River Access', 'Transit']) },
    { name: 'Allandale', city: 'Austin', state: 'TX', schoolRating: 8.0, safetyScore: 82, walkabilityScore: 65, transitScore: 55, noiseLevel: 'low', floodRisk: 'low', averagePrice: 575000, priceTrend: 'up', amenities: JSON.stringify(['Parks', 'Schools', 'Shopping', 'Quiet Streets']) },
    { name: 'Tarrytown', city: 'Austin', state: 'TX', schoolRating: 8.5, safetyScore: 88, walkabilityScore: 40, transitScore: 35, noiseLevel: 'low', floodRisk: 'moderate', averagePrice: 1100000, priceTrend: 'stable', amenities: JSON.stringify(['Lake Access', 'Parks', 'Historic Homes', 'Schools']) },
    { name: 'East Austin', city: 'Austin', state: 'TX', schoolRating: 6.0, safetyScore: 68, walkabilityScore: 78, transitScore: 65, noiseLevel: 'medium', floodRisk: 'low', averagePrice: 420000, priceTrend: 'up', amenities: JSON.stringify(['Restaurants', 'Bars', 'Art Scene', 'Transit']) },
    { name: 'Zilker', city: 'Austin', state: 'TX', schoolRating: 7.0, safetyScore: 80, walkabilityScore: 85, transitScore: 72, noiseLevel: 'medium', floodRisk: 'low', averagePrice: 700000, priceTrend: 'up', amenities: JSON.stringify(['Zilker Park', 'Barton Springs', 'Restaurants', 'Trails']) },
    { name: 'Oak Hill', city: 'Austin', state: 'TX', schoolRating: 8.0, safetyScore: 86, walkabilityScore: 30, transitScore: 25, noiseLevel: 'low', floodRisk: 'low', averagePrice: 750000, priceTrend: 'up', amenities: JSON.stringify(['Hill Country Views', 'Parks', 'Schools', 'Solar-Friendly']) },
  ];

  for (const n of neighborhoods) {
    await prisma.neighborhood.upsert({
      where: { id: n.name + '-' + n.city },
      update: {},
      create: { id: n.name + '-' + n.city, ...n },
    });
  }

  // Create properties
  for (const p of properties) {
    const existing = await prisma.property.findFirst({ where: { address: p.address } });
    if (existing) continue;
    const prop = await prisma.property.create({ data: p as any });
    await prisma.propertyEvent.create({
      data: { propertyId: prop.id, eventType: 'added', description: 'Property added to BetterHome' },
    });
  }

  // Save a few properties for the demo user
  const allProps = await prisma.property.findMany();
  if (allProps.length >= 4) {
    const savedAddresses = ['4521 Cypress Creek Dr', '3407 Mesa Dr', '805 Barton Springs Rd'];
    for (const addr of savedAddresses) {
      const prop = allProps.find(p => p.address === addr);
      if (prop) {
        const existing = await prisma.savedProperty.findFirst({ where: { userId: user.id, propertyId: prop.id } });
        if (!existing) {
          await prisma.savedProperty.create({
            data: { userId: user.id, propertyId: prop.id, vaultStatus: addr === '3407 Mesa Dr' ? 'viewing' : 'researching' },
          });
          await prisma.propertyEvent.create({
            data: { propertyId: prop.id, eventType: 'saved', description: 'Saved to vault' },
          });
        }
      }
    }
  }

  // Create some tasks
  const firstProp = allProps[1];
  if (firstProp) {
    const tasks = [
      { title: 'Order professional home inspection', category: 'structural', status: 'not_started' },
      { title: 'Review HOA documents and financials', category: 'hoa', status: 'in_progress' },
      { title: 'Verify property tax assessment', category: 'taxes', status: 'not_started' },
      { title: 'Get mortgage pre-approval letter', category: 'financial', status: 'complete' },
      { title: 'Check flood zone designation on FEMA map', category: 'flooding', status: 'not_started' },
      { title: 'Research school district boundaries', category: 'neighborhood', status: 'in_progress' },
    ];
    for (const t of tasks) {
      const existing = await prisma.task.findFirst({ where: { userId: user.id, propertyId: firstProp.id, title: t.title } });
      if (!existing) {
        await prisma.task.create({ data: { ...t, userId: user.id, propertyId: firstProp.id } as any });
      }
    }
  }

  // Create notifications
  const notifs = [
    { type: 'new_match', title: 'New property match', message: 'A new 3-bedroom home in Cedar Park matches your saved search.' },
    { type: 'price_change', title: 'Price reduced', message: 'Modern Downtown Apartment dropped by $15,000.' },
    { type: 'task', title: 'Task due soon', message: 'Your HOA document review is still in progress.' },
  ];
  for (const n of notifs) {
    const existing = await prisma.notification.findFirst({ where: { userId: user.id, title: n.title } });
    if (!existing) {
      await prisma.notification.create({ data: { ...n, userId: user.id } as any });
    }
  }

  console.log('Seed complete. Properties:', allProps.length, 'Neighborhoods:', neighborhoods.length);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
