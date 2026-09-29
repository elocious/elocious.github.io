import type { ArchetypeInfo, ArchitecturalArchetype, PropertyInput } from '../types';

export const ARCHETYPES: ArchetypeInfo[] = [
  {
    id: 'contemporary-organic',
    name: 'Contemporary Organic Modernism',
    shortName: 'Contemporary Organic',
    description:
      'Clean horizontal lines with warm wood accents and expansive glass, blending modern minimalism with natural materials for a grounded yet luminous aesthetic.',
    materials: ['Cedar battens', 'Architectural concrete', 'Low-E glass', 'Stone veneer'],
    lighting: 'Warm indirect LED soffit lighting; floor-to-ceiling glazing for natural daylight',
    structuralFeatures: ['Flat roof with concealed gutters', 'Cantilevered entry canopy', 'Floor-to-ceiling glazing', 'Integrated landscaping'],
    era: '2015–Present',
  },
  {
    id: 'postmodern-glass',
    name: 'Postmodern Glass Curtainwall',
    shortName: 'Glass Curtainwall',
    description:
      'Multi-story glass tower with expressed steel mullions and reflective curtainwall, creating a bold urban statement with maximum transparency.',
    materials: ['Low-iron curtainwall glass', 'Exposed steel mullions', 'Aluminum composite panels', 'Polished concrete'],
    lighting: 'Recessed linear LEDs; glass floors maximize ambient daylight penetration',
    structuralFeatures: ['Curtainwall facade system', 'Expressed structural steel', 'Cantilevered balconies', 'Double-height lobby'],
    era: '2005–Present',
  },
  {
    id: 'mid-century-craftsman',
    name: 'Mid-Century Organic Craftsman',
    shortName: 'Mid-Century Craftsman',
    description:
      'Steeply gabled roof with natural stone and wood shingle siding, evoking warmth and craftsmanship through tapered porch columns and exposed rafter tails.',
    materials: ['Cedar shingle siding', 'Natural stone foundation', 'Douglas fir beams', 'Leaded glass windows'],
    lighting: 'Warm tungsten-style pendants; stained glass accents diffuse natural light',
    structuralFeatures: ['Steep gabled roof', 'Tapered stone porch columns', 'Exposed rafter tails', 'Built-in cabinetry'],
    era: '1920–1965',
  },
  {
    id: 'biophilic-waterfront',
    name: 'Biophilic Waterfront Cantilever',
    shortName: 'Biophilic Cantilever',
    description:
      'Cantilevered upper volume hovering over water with floor-to-ceiling glass and organic materials, dissolving the boundary between interior and landscape.',
    materials: ['IPE wood decking', 'Structural glass walls', 'Corten steel accents', 'Living green roof'],
    lighting: 'Underwater LED uplighting; biophilic circadian lighting synced to sunset/sunrise',
    structuralFeatures: ['Cantilevered upper level', 'Structural glass curtainwall', 'Green roof system', 'Riparian retaining wall'],
    era: '2018–Present',
  },
  {
    id: 'urban-monolithic',
    name: 'Urban Monolithic Townhouse',
    shortName: 'Urban Monolithic',
    description:
      'Narrow vertical massing with brick facade and bay windows, presenting a stoic urban presence rooted in traditional rowhouse proportions.',
    materials: ['Reclaimed brick veneer', 'Limestone lintels', 'Steel bay windows', 'Slate roof'],
    lighting: 'Industrial pendant fixtures; bay windows flood interiors with lateral daylight',
    structuralFeatures: ['Narrow footprint multi-story', 'Bay window projections', 'Stoop entrance', 'Party wall construction'],
    era: '1880–1930 / Revival 2020+',
  },
];

export function getArchetype(id: ArchitecturalArchetype): ArchetypeInfo {
  return ARCHETYPES.find(a => a.id === id) ?? ARCHETYPES[0];
}

export function generateArchitecturalPrompt(input: PropertyInput): string {
  const arch = getArchetype(input.archetype);
  return (
    `Photorealistic architectural rendering of a ${input.propertyType} in the style of ${arch.name}. ` +
    `${input.bedrooms} bedroom, ${input.bathrooms} bathroom, ${input.sqft} sqft, built circa ${input.yearBuilt}. ` +
    `Located in ${input.city}. ${arch.description} ` +
    `Primary facade materials: ${arch.materials.join(', ')}. ` +
    `Lighting: ${arch.lighting}. ` +
    `Structural features: ${arch.structuralFeatures.join(', ')}. ` +
    `Golden hour lighting, professional architectural photography, 8K, highly detailed.`
  );
}
