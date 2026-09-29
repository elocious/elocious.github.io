import { prisma } from './db';

// Simple session: in dev we use a single demo user.
// This avoids external auth provider dependencies while keeping the data model ready.
const DEMO_EMAIL = 'demo@betterhome.app';

export async function getCurrentUser() {
  let user = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: DEMO_EMAIL,
        name: 'Alex Morgan',
        buyerType: 'buy',
        budgetMin: 400000,
        budgetMax: 850000,
        preferredLocations: JSON.stringify(['Austin, TX', 'Seattle, WA', 'Denver, CO']),
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
  }
  return user;
}

export async function getCurrentUserId() {
  const user = await getCurrentUser();
  return user.id;
}
