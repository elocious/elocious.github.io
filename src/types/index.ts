export type Verdict = 'BUY' | 'RENT' | 'CAUTION' | 'AVOID';

export type ArchitecturalArchetype =
  | 'contemporary-organic'
  | 'postmodern-glass'
  | 'mid-century-craftsman'
  | 'biophilic-waterfront'
  | 'urban-monolithic';

export type PropertyType = 'house' | 'condo' | 'townhouse' | 'apartment';

export type FloodRisk = 'low' | 'moderate' | 'high';

export type ViewMode = 'vault' | 'evaluate' | 'compare' | 'profile';

export type VisualMode = 'showcase' | 'compact';

export interface PropertyInput {
  // Core Financials
  price: number;
  monthlyRent: number;
  propertyTaxes: number; // annual
  hoaDues: number; // monthly
  insurance: number; // annual

  // Structural Attributes
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  yearBuilt: number;
  garage: boolean;
  lotSize: number;
  heating: boolean;
  cooling: boolean;
  solar: boolean;
  yard: boolean;

  // Neighborhood Metrics
  safetyScore: number; // 1-10
  schoolRating: number; // 1-10
  walkability: number; // 0-100
  transitScore: number; // 0-100
  parkAccess: boolean;
  floodRisk: FloodRisk;
  noiseLevel: number; // 1-10
  appreciationPotential: number; // 1-10

  // User Sentiment & Priorities
  affordabilityComfort: number; // 1-10
  appearanceRating: number; // 1-10
  neighborhoodVibe: number; // 1-10
  pros: string[];
  cons: string[];

  // Mortgage Parameters
  interestRate: number; // %
  downPayment: number; // %

  // Meta
  title: string;
  address: string;
  city: string;
  zipCode: string;
  propertyType: PropertyType;
  archetype: ArchitecturalArchetype;
  imageUrl?: string;
}

export interface ScoreBreakdownItem {
  category: string;
  score: number; // 0-100
  weight: number; // 0-1
}

export interface EvaluationResult {
  aiScore: number; // 0-100
  verdict: Verdict;
  monthlyCarryingCost: number;
  monthlyRentEquivalent: number;
  principalAndInterest: number;
  monthlyTaxes: number;
  monthlyHoa: number;
  monthlyInsurance: number;
  maintenanceReserve: number;
  fiveYearEquity: number;
  fiveYearRentCost: number;
  fiveYearOwnCost: number;
  fiveYearNetPosition: number;
  costPerSqft: number;
  dueDiligence: string[];
  scoreBreakdown: ScoreBreakdownItem[];
}

export interface EvaluatedProperty extends PropertyInput {
  id: string;
  evaluation: EvaluationResult;
  createdAt: number;
}

export interface BuyerPersona {
  investmentHorizon: 'short-term' | 'forever';
  riskTolerance: 'conservative' | 'balanced' | 'aggressive';
  priorities: {
    schools: number; // 1-10
    commute: number; // 1-10
    appreciation: number; // 1-10
    lotSize: number; // 1-10
  };
}

export interface ArchetypeInfo {
  id: ArchitecturalArchetype;
  name: string;
  shortName: string;
  description: string;
  materials: string[];
  lighting: string;
  structuralFeatures: string[];
  era: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
