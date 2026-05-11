#!/usr/bin/env node
/* Expands each Pokémon's `regions: ['X']` to include every region where
 * any of its habitats can be built. Preserves the originally-listed
 * region as the first (primary) entry so card styling stays stable.
 *
 * The HABITAT_REGIONS map below is best-effort inference for Pokopia.
 * Edit it freely as you confirm official data — re-run the script
 * to propagate the corrections across every Pokémon.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.resolve(__dirname, '..', 'src', 'App.jsx');

// Which regions each habitat can be built in.
const HABITAT_REGIONS = {
  'Tall Grass':                    ['Withered Wasteland', 'Palette Town', 'Rocky Ridges'],
  'Tree-Shaded Tall Grass':        ['Withered Wasteland', 'Palette Town'],
  'Boulder Tall Grass':            ['Rocky Ridges', 'Withered Wasteland'],
  'Waterside Tall Grass':          ['Bleak Beach', 'Palette Town'],
  'Ocean Tall Grass':              ['Bleak Beach'],
  'Wildflower Patch':              ['Withered Wasteland', 'Palette Town'],
  'Campfire Ring':                 ['Withered Wasteland', 'Palette Town'],
  'Mountain Cave':                 ['Rocky Ridges', 'Withered Wasteland'],
  'Mountain Peak':                 ['Rocky Ridges', 'Sparkling Skylands'],
  'Veggie Plot':                   ['Palette Town', 'Withered Wasteland'],
  'Garden Habitat':                ['Palette Town'],
  'Sky Garden':                    ['Sparkling Skylands'],
  'Construction Site':             ['Rocky Ridges', 'Withered Wasteland', 'Palette Town'],
  'Waterside Dinghy':              ['Bleak Beach'],
  'Tree-Shaded Pink Tall Grass':   ['Palette Town'],
  'Hydrated Pink Tall Grass':      ['Palette Town'],
  'Hidden Laboratory':             ['Sparkling Skylands'],
  'Secret Garden':                 ['Sparkling Skylands', 'Palette Town'],
  'Pokémon Center':                ['Palette Town'],
};

const src = fs.readFileSync(FILE, 'utf8');

// Match every Pokémon entry's regions + habitats block in one capture so we can rewrite.
// Entries look like:  regions: ['Palette Town'],  ...  habitats: ['Garden Habitat', 'Tree-Shaded Tall Grass'],
const entryRe = /regions: \[([^\]]+)\],([\s\S]*?)habitats: \[([^\]]+)\]/g;

let changed = 0;
let touched = 0;

const out = src.replace(entryRe, (full, regionsRaw, gap, habitatsRaw) => {
  const currentRegions = [...regionsRaw.matchAll(/'([^']+)'/g)].map(m => m[1]);
  const habitats       = [...habitatsRaw.matchAll(/'([^']+)'/g)].map(m => m[1]);
  if (!currentRegions.length || !habitats.length) return full;

  const primary = currentRegions[0];

  const derived = new Set();
  derived.add(primary);
  for (const h of habitats) {
    const rs = HABITAT_REGIONS[h];
    if (!rs) continue;
    for (const r of rs) derived.add(r);
  }

  // Preserve primary as index 0, then sort the rest alphabetically for stability.
  const others = [...derived].filter(r => r !== primary).sort();
  const next = [primary, ...others];

  touched += 1;
  if (next.length !== currentRegions.length || next.some((r, i) => r !== currentRegions[i])) {
    changed += 1;
  }

  const regionsStr = next.map(r => `'${r}'`).join(', ');
  return `regions: [${regionsStr}],${gap}habitats: [${habitatsRaw}]`;
});

fs.writeFileSync(FILE, out);
console.log(`Inspected ${touched} entries · updated ${changed}`);
