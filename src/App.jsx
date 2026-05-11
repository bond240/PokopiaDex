import React, { useState, useMemo, useEffect } from 'react';

/* ---------- design tokens ---------- */

const REGIONS = {
  'Withered Wasteland': { bg: '#2d1f0e', accent: '#c4a35a', icon: '🏜️' },
  'Rocky Ridges':       { bg: '#1a1a2e', accent: '#8b7355', icon: '🏔️' },
  'Bleak Beach':        { bg: '#0d1b2a', accent: '#5e9ecf', icon: '🏖️' },
  'Sparkling Skylands': { bg: '#1a0a2e', accent: '#c79bf5', icon: '✨' },
  'Palette Town':       { bg: '#0e2a1a', accent: '#6bcf7f', icon: '🎨' },
};

const TYPE_COLORS = {
  Normal: '#A8A878', Fire: '#F08030', Water: '#6890F0', Grass: '#78C850',
  Electric: '#F8D030', Ice: '#98D8D8', Fighting: '#C03028', Poison: '#A040A0',
  Ground: '#E0C068', Flying: '#A890F0', Psychic: '#F85888', Bug: '#A8B820',
  Rock: '#B8A038', Ghost: '#705898', Dragon: '#7038F8', Dark: '#705848',
  Steel: '#B8B8D0', Fairy: '#EE99AC',
};

const ALL_TYPES = Object.keys(TYPE_COLORS);

/* ---------- national-dex numbers (for fetching sprite art) ---------- */

const DEX = {
  // Withered Wasteland
  Cacnea: 331, Sandshrew: 27, Trapinch: 328, Cubone: 104, Numel: 322,
  Hippopotas: 449, Sandile: 551, Diglett: 50, Drilbur: 529, Helioptile: 694,
  Maractus: 556, Darumaka: 554, Vulpix: 37, Growlithe: 58,
  Charmander: 4, Charmeleon: 5, Phanpy: 231, Rolycoly: 837, Slugma: 218,
  Litwick: 607, Scraggy: 559, Cutiefly: 742, Cyndaquil: 155, Torchic: 255,
  Chimchar: 390, Tepig: 498,
  // Rocky Ridges
  Geodude: 74, Onix: 95, Aron: 304, Larvitar: 246, Roggenrola: 524,
  Machop: 66, Mankey: 56, Zubat: 41, Nosepass: 299, Rockruff: 744,
  Riolu: 447, Mienfoo: 619, Timburr: 532, Bonsly: 438,
  Pawniard: 624, Lycanroc: 745, Tyrunt: 696, Carbink: 703, Cubchoo: 613,
  Croagunk: 453, Klink: 599, Cufant: 878, Gible: 443, Salandit: 757,
  Mawile: 303, Boldore: 525, Lillipup: 506, Stufful: 759, Spinda: 327,
  // Bleak Beach
  Magikarp: 129, Krabby: 98, Staryu: 120, Wingull: 278, Tentacool: 72,
  Horsea: 116, Wailmer: 320, Corsola: 222, Mudkip: 258, Psyduck: 54,
  Slowpoke: 79, Buizel: 418, Lapras: 131, Squirtle: 7,
  Spheal: 363, Shellos: 422, Frillish: 592, Clamperl: 366, Tirtouga: 564,
  Piplup: 393, Totodile: 158, Goldeen: 118, Remoraid: 223, Mantyke: 458,
  Carvanha: 318, Oshawott: 501, Popplio: 728, Froakie: 656, Quaxly: 912,
  Sobble: 816,
  // Sparkling Skylands
  Pidgey: 16, Togepi: 175, Cleffa: 173, Mareep: 179, Pichu: 172,
  Drifloon: 425, Swablu: 333, Starly: 396, Rookidee: 821, Hoppip: 187,
  Beldum: 374, Porygon: 137, Abra: 63, Ralts: 280,
  Cottonee: 546, Petilil: 548, Igglybuff: 174, Jigglypuff: 39,
  Magnemite: 81, Voltorb: 100, Elgyem: 605, Cosmog: 789, Sigilyph: 561,
  Comfey: 764, Minccino: 572, Spritzee: 682,
  // Palette Town
  Bulbasaur: 1, Oddish: 43, Bellsprout: 69, Sunkern: 191, Caterpie: 10,
  Weedle: 13, Pikachu: 25, Eevee: 133, Chansey: 113, Snom: 872,
  Wooloo: 831, Skwovet: 819, Bidoof: 399, Munchlax: 446,
  Chikorita: 152, Treecko: 252, Turtwig: 387, Snivy: 495, Chespin: 650,
  Rowlet: 722, Grookey: 810, Sprigatito: 906, Hoothoot: 163, Sentret: 161,
  Plusle: 311, Minun: 312, Yamper: 835, Lechonk: 915, Skitty: 300,
  Buneary: 427, Audino: 531, Hatenna: 856, Morpeko: 877, Snorlax: 143,
  // Evolved / additional — Withered Wasteland
  Charizard: 6, Camerupt: 323, Vibrava: 329, Flygon: 330, Sandslash: 28,
  Marowak: 105, Krokorok: 552, Krookodile: 553, Cacturne: 332, Excadrill: 530,
  Heliolisk: 695, Ninetales: 38, Arcanine: 59, Darmanitan: 555, Magcargo: 219,
  // Evolved / additional — Rocky Ridges
  Graveler: 75, Golem: 76, Steelix: 208, Lairon: 305, Aggron: 306,
  Pupitar: 247, Tyranitar: 248, Gigalith: 526, Machoke: 67, Machamp: 68,
  Primeape: 57, Golbat: 42, Crobat: 169, Lucario: 448, Gurdurr: 533,
  Conkeldurr: 534, Sudowoodo: 185,
  // Evolved / additional — Bleak Beach
  Blastoise: 9, Swampert: 260, Empoleon: 395, Feraligatr: 160, Samurott: 503,
  Greninja: 658, Primarina: 730, Inteleon: 818, Quaquaval: 914, Sharpedo: 319,
  // Evolved / additional — Sparkling Skylands
  Togekiss: 468, Clefable: 36, Ampharos: 181, Drifblim: 426, Altaria: 334,
  Staraptor: 398, Corviknight: 823, Jumpluff: 189, Metagross: 376,
  'Porygon-Z': 474, Alakazam: 65, Gardevoir: 282, Gallade: 475,
  Whimsicott: 547, Wigglytuff: 40,
  // Evolved / additional — Palette Town
  Venusaur: 3, Vileplume: 45, Victreebel: 71, Sunflora: 192, Butterfree: 12,
  Beedrill: 15, Vaporeon: 134, Jolteon: 135, Flareon: 136, Espeon: 196,
  Umbreon: 197, Leafeon: 470, Glaceon: 471, Sylveon: 700, Blissey: 242,
  Frosmoth: 873, Dubwool: 832, Greedent: 820, Bibarel: 400, Meganium: 154,
  Sceptile: 254, Torterra: 389, Serperior: 497, Chesnaught: 652,
  Decidueye: 724, Rillaboom: 812, Meowscarada: 908, Hatterene: 858,
  // Tree-Shaded Tall Grass crew (Withered Wasteland, confirmed)
  Scyther: 123, Scizor: 212, Pinsir: 127, Heracross: 214, Yanma: 193,
  Yanmega: 469,
};

/* Pokémon HOME 3D renders — closest free match to Pokopia's 3D-model style. */
const SPRITE_BASE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home';

const spriteUrl = (name) => {
  const id = DEX[name];
  return id ? `${SPRITE_BASE}/${id}.png` : null;
};

/* ---------- pokémon data (236 entries across 5 regions, multi-region) ----------
 * Each entry: { id, name, type[], region, habitats[], specialty,
 *               time, weather, desc }.
 * A Pokémon can list multiple habitats — the card shows the first
 * with a "+N" badge, and the detail panel renders every habitat as
 * its own banner.
 */

const POKEMON = [
  // —— Withered Wasteland ——
  { id: 1,  name: 'Cacnea',     type: ['Grass'],            regions: ['Withered Wasteland', 'Palette Town'], habitats: ['Wildflower Patch'],     specialty: 'Grow',     time: 'Day',     weather: 'Sunny',  desc: 'A spiny cactus dweller that flourishes in dry soil. It helps coax wildflowers back to bloom across the wasteland.' },
  { id: 2,  name: 'Sandshrew',  type: ['Ground'],           regions: ['Withered Wasteland', 'Palette Town', 'Rocky Ridges'], habitats: ['Tall Grass'],           specialty: 'Bulldoze', time: 'Day',     weather: 'Sunny',  desc: 'Curls up in dry tall grass during the heat. It loosens packed earth so seeds can finally take root.' },
  { id: 3,  name: 'Trapinch',   type: ['Ground'],           regions: ['Withered Wasteland', 'Rocky Ridges'], habitats: ['Boulder Tall Grass'],   specialty: 'Crush',    time: 'Day',     weather: 'Sunny',  desc: 'Digs conical pits between sun-bleached boulders. It pulverizes rubble into workable sand.' },
  { id: 4,  name: 'Cubone',     type: ['Ground'],           regions: ['Withered Wasteland', 'Palette Town'], habitats: ['Wildflower Patch'],     specialty: 'Gather',   time: 'Night',   weather: 'Any',    desc: 'A lonely wanderer of moonlit dunes. It collects bones and stones to mark new growing sites.' },
  { id: 5,  name: 'Numel',      type: ['Fire', 'Ground'],   regions: ['Withered Wasteland', 'Palette Town'], habitats: ['Campfire Ring'],        specialty: 'Burn',     time: 'Any',     weather: 'Sunny',  desc: 'Lounges by campfires with magma simmering inside its hump. It keeps cookfires lit through long desert nights.' },
  { id: 6,  name: 'Hippopotas', type: ['Ground'],           regions: ['Withered Wasteland', 'Palette Town', 'Rocky Ridges'], habitats: ['Tall Grass'],           specialty: 'Bulldoze', time: 'Day',     weather: 'Sunny',  desc: 'Trundles through dust bowls kicking up plumes of sand. It clears wide paths for caravans of helpers.' },
  { id: 7,  name: 'Sandile',    type: ['Ground', 'Dark'],   regions: ['Withered Wasteland', 'Palette Town', 'Rocky Ridges'], habitats: ['Tall Grass'],           specialty: 'Search',   time: 'Day',     weather: 'Sunny',  desc: 'Glides just beneath the sand with only its eyes visible. It tracks down lost tools buried by storms.' },
  { id: 8,  name: 'Diglett',    type: ['Ground'],           regions: ['Withered Wasteland', 'Palette Town'], habitats: ['Veggie Plot'],          specialty: 'Bulldoze', time: 'Any',     weather: 'Any',    desc: 'Pops up wherever the soil is loose enough to till. It aerates new veggie plots overnight.' },
  { id: 9,  name: 'Drilbur',    type: ['Ground'],           regions: ['Withered Wasteland', 'Palette Town', 'Rocky Ridges'], habitats: ['Construction Site'],    specialty: 'Build',    time: 'Day',     weather: 'Any',    desc: 'Spins through hardpan like a living drill. It opens foundations for new desert outposts.' },
  { id: 10, name: 'Helioptile', type: ['Electric', 'Normal'], regions: ['Withered Wasteland', 'Palette Town'], habitats: ['Wildflower Patch'],   specialty: 'Generate', time: 'Day',     weather: 'Sunny',  desc: 'Unfurls solar frills to drink in the harsh sun. It powers tiny irrigation pumps for fragile blooms.' },
  { id: 11, name: 'Maractus',   type: ['Grass'],            regions: ['Withered Wasteland', 'Palette Town'], habitats: ['Wildflower Patch'],     specialty: 'Grow',     time: 'Day',     weather: 'Sunny',  desc: 'Rattles its spines in a rhythm that wakes seeds. It dances dawn-to-dusk to encourage flowers.' },
  { id: 12, name: 'Darumaka',   type: ['Fire'],             regions: ['Withered Wasteland', 'Palette Town'], habitats: ['Campfire Ring'],        specialty: 'Burn',     time: 'Day',     weather: 'Sunny',  desc: 'Bounces around the embers warming chilly mornings. It ignites kindling with a single hiccup of flame.' },
  { id: 13, name: 'Vulpix',     type: ['Fire'],             regions: ['Withered Wasteland', 'Palette Town', 'Rocky Ridges'], habitats: ['Tall Grass'],           specialty: 'Burn',     time: 'Evening', weather: 'Sunny',  desc: 'Slips through brittle grass with tails flickering. It carefully scorches deadwood to make space for fresh growth.' },
  { id: 14, name: 'Growlithe',  type: ['Fire'],             regions: ['Withered Wasteland', 'Palette Town'], habitats: ['Campfire Ring'],        specialty: 'Burn',     time: 'Any',     weather: 'Any',    desc: 'Stands watch beside the fire pit, ears pricked. It guards travelers and helps relight stoves on demand.' },

  // —— Rocky Ridges ——
  { id: 15, name: 'Geodude',    type: ['Rock', 'Ground'],   regions: ['Rocky Ridges', 'Withered Wasteland'],       habitats: ['Mountain Cave', 'Boulder Tall Grass'], specialty: 'Crush',    time: 'Any',     weather: 'Any',    desc: 'Sleeps wedged into cave walls until the morning bell. It crushes ore and rubble for tomorrow’s builders.' },
  { id: 16, name: 'Onix',       type: ['Rock', 'Ground'],   regions: ['Rocky Ridges', 'Withered Wasteland'],       habitats: ['Mountain Cave'],        specialty: 'Bulldoze', time: 'Any',     weather: 'Any',    desc: 'Tunnels long, twisting passages through the ridge. Its corridors become highways for hauling materials.' },
  { id: 17, name: 'Aron',       type: ['Steel', 'Rock'],    regions: ['Rocky Ridges', 'Withered Wasteland'],       habitats: ['Mountain Cave'],        specialty: 'Recycle',  time: 'Day',     weather: 'Cloudy', desc: 'Munches abandoned scrap iron deep in the cave. It refines it into nuggets for the smiths upstairs.' },
  { id: 18, name: 'Larvitar',   type: ['Rock', 'Ground'],   regions: ['Rocky Ridges', 'Withered Wasteland'],       habitats: ['Boulder Tall Grass'],   specialty: 'Crush',    time: 'Day',     weather: 'Sunny',  desc: 'Burrows between boulders nibbling stone for nutrients. Its leavings make excellent gravel.' },
  { id: 19, name: 'Roggenrola', type: ['Rock'],             regions: ['Rocky Ridges', 'Withered Wasteland'],       habitats: ['Mountain Cave'],        specialty: 'Crush',    time: 'Any',     weather: 'Any',    desc: 'A walking core of compressed energy in the dark. It powers crystal lamps and clears stone debris.' },
  { id: 20, name: 'Machop',     type: ['Fighting'],         regions: ['Rocky Ridges', 'Sparkling Skylands'],       habitats: ['Mountain Peak'],        specialty: 'Build',    time: 'Day',     weather: 'Sunny',  desc: 'Hauls slabs up the ridge for sheer training. It anchors framework beams nobody else can lift.' },
  { id: 21, name: 'Mankey',     type: ['Fighting'],         regions: ['Rocky Ridges', 'Palette Town', 'Withered Wasteland'],       habitats: ['Tree-Shaded Tall Grass'], specialty: 'Chop',   time: 'Day',     weather: 'Cloudy', desc: 'Swings from shaded branches in noisy troops. It clears overgrown switchbacks with rapid kicks.' },
  { id: 22, name: 'Zubat',      type: ['Poison', 'Flying'], regions: ['Rocky Ridges', 'Sparkling Skylands', 'Withered Wasteland'],       habitats: ['Mountain Cave', 'Hidden Laboratory'], specialty: 'Search',   time: 'Night',   weather: 'Any',    desc: 'Flits through pitch-dark passages by echo. It maps unexplored caverns for the survey team.' },
  { id: 23, name: 'Nosepass',   type: ['Rock'],             regions: ['Rocky Ridges', 'Sparkling Skylands'],       habitats: ['Mountain Peak'],        specialty: 'Search',   time: 'Day',     weather: 'Any',    desc: 'Points its magnetic nose unerringly north. It orients pathfinders lost in cloud-wreathed peaks.' },
  { id: 24, name: 'Rockruff',   type: ['Rock'],             regions: ['Rocky Ridges', 'Withered Wasteland'],       habitats: ['Boulder Tall Grass'],   specialty: 'Chop',    time: 'Day',     weather: 'Sunny',  desc: 'Bounds between boulders barking at passing helpers. It gnaws fallen branches into kindling.' },
  { id: 25, name: 'Riolu',      type: ['Fighting'],         regions: ['Rocky Ridges', 'Sparkling Skylands'],       habitats: ['Mountain Peak'],        specialty: 'Hype',     time: 'Day',     weather: 'Sunny',  desc: 'Reads moods through its aura. It cheers builders into their second wind on the steep peaks.' },
  { id: 26, name: 'Mienfoo',    type: ['Fighting'],         regions: ['Rocky Ridges', 'Palette Town', 'Withered Wasteland'],       habitats: ['Tree-Shaded Tall Grass'], specialty: 'Chop',   time: 'Day',     weather: 'Any',    desc: 'Trains beneath cool, shaded leaves. Each chop of its paw splits a log clean in two.' },
  { id: 27, name: 'Timburr',    type: ['Fighting'],         regions: ['Rocky Ridges', 'Palette Town', 'Withered Wasteland'],       habitats: ['Construction Site'],    specialty: 'Build',    time: 'Day',     weather: 'Any',    desc: 'Hauls a square beam everywhere it goes. It frames every new bridge along the ridge road.' },
  { id: 28, name: 'Bonsly',     type: ['Rock'],             regions: ['Rocky Ridges', 'Withered Wasteland'],       habitats: ['Boulder Tall Grass'],   specialty: 'Gather',   time: 'Day',     weather: 'Sunny',  desc: 'Sheds salty droplets that nourish dry moss. It quietly gathers pebbles to mark safe footing.' },

  // —— Bleak Beach ——
  { id: 29, name: 'Magikarp',   type: ['Water'],            regions: ['Bleak Beach', 'Palette Town'],        habitats: ['Waterside Tall Grass', 'Ocean Tall Grass'], specialty: 'Water',    time: 'Any',     weather: 'Any',    desc: 'Splashes in shallow reeds with hopeful resolve. Its splashes water nearby seedlings just enough.' },
  { id: 30, name: 'Krabby',     type: ['Water'],            regions: ['Bleak Beach'],        habitats: ['Waterside Dinghy'],     specialty: 'Search',   time: 'Day',     weather: 'Sunny',  desc: 'Scuttles among the moored dinghies snipping kelp. It uncovers shells and lost trinkets along the planks.' },
  { id: 31, name: 'Staryu',     type: ['Water'],            regions: ['Bleak Beach'],        habitats: ['Ocean Tall Grass'],     specialty: 'Generate', time: 'Night',   weather: 'Any',    desc: 'Pulses softly between swaying ocean grasses. It powers buoy lamps that guide night fishers home.' },
  { id: 32, name: 'Wingull',    type: ['Water', 'Flying'],  regions: ['Bleak Beach'],        habitats: ['Waterside Dinghy'],     specialty: 'Fly',      time: 'Day',     weather: 'Any',    desc: 'Wheels above the dock chasing breezes. It ferries lightweight parcels from boat to boat.' },
  { id: 33, name: 'Tentacool',  type: ['Water', 'Poison'],  regions: ['Bleak Beach'],        habitats: ['Ocean Tall Grass'],     specialty: 'Litter',   time: 'Any',     weather: 'Cloudy', desc: 'Drifts with the current, tentacles trailing. It collects floating plastic and surrenders it to recyclers.' },
  { id: 34, name: 'Horsea',     type: ['Water'],            regions: ['Bleak Beach'],        habitats: ['Waterside Dinghy'],     specialty: 'Water',    time: 'Day',     weather: 'Any',    desc: 'Anchors itself to mossy rope under a dinghy. It mists nearby reeds to keep them sea-green.' },
  { id: 35, name: 'Wailmer',    type: ['Water'],            regions: ['Bleak Beach'],        habitats: ['Ocean Tall Grass'],     specialty: 'Water',    time: 'Day',     weather: 'Any',    desc: 'Spouts plumes high above the kelp beds. It rains a fine mist that revives parched tidepools.' },
  { id: 36, name: 'Corsola',    type: ['Water', 'Rock'],    regions: ['Bleak Beach', 'Palette Town'],        habitats: ['Waterside Tall Grass'], specialty: 'Grow',     time: 'Day',     weather: 'Sunny',  desc: 'Grows pink branches from its sturdy shell. It seeds new reefs where the tide pools are healing.' },
  { id: 37, name: 'Mudkip',     type: ['Water'],            regions: ['Bleak Beach', 'Palette Town'],        habitats: ['Waterside Tall Grass'], specialty: 'Water',    time: 'Any',     weather: 'Rain',   desc: 'Wades in tidewater grass sensing the slightest current. It waters whole flowerbeds before breakfast.' },
  { id: 38, name: 'Psyduck',    type: ['Water'],            regions: ['Bleak Beach', 'Palette Town'],        habitats: ['Waterside Tall Grass'], specialty: 'Teleport', time: 'Day',     weather: 'Cloudy', desc: 'Stares dazedly at the waves until a headache strikes. When it does, helpful objects appear out of nowhere.' },
  { id: 39, name: 'Slowpoke',   type: ['Water', 'Psychic'], regions: ['Bleak Beach', 'Palette Town'],        habitats: ['Waterside Tall Grass'], specialty: 'Search',   time: 'Any',     weather: 'Any',    desc: 'Dangles its tail in the shallows for hours. It eventually fishes up exactly the item you needed.' },
  { id: 40, name: 'Buizel',     type: ['Water'],            regions: ['Bleak Beach'],        habitats: ['Waterside Dinghy'],     specialty: 'Water',    time: 'Day',     weather: 'Sunny',  desc: 'Inflates its flotation collar to tow the dinghies. It also turns waterwheels for the seaside mill.' },
  { id: 41, name: 'Lapras',     type: ['Water', 'Ice'],     regions: ['Bleak Beach'],        habitats: ['Ocean Tall Grass'],     specialty: 'Fly',      time: 'Day',     weather: 'Any',    desc: 'A gentle ferry across the cold ocean grass. It carries crews to the offshore construction site.' },
  { id: 42, name: 'Squirtle',   type: ['Water'],            regions: ['Bleak Beach', 'Palette Town'],        habitats: ['Waterside Dinghy', 'Waterside Tall Grass'], specialty: 'Water',    time: 'Any',     weather: 'Sunny',  desc: 'Climbs onto a sun-warmed dinghy to nap. It blasts water on command to scrub salt from the deck.' },

  // —— Sparkling Skylands ——
  { id: 43, name: 'Pidgey',     type: ['Normal', 'Flying'], regions: ['Sparkling Skylands', 'Palette Town', 'Withered Wasteland'], habitats: ['Sky Garden', 'Tree-Shaded Tall Grass'], specialty: 'Fly',      time: 'Day',     weather: 'Sunny',  desc: 'Coasts the updrafts circling the floating gardens. It scouts new island patches for planters.' },
  { id: 44, name: 'Togepi',     type: ['Fairy'],            regions: ['Sparkling Skylands', 'Palette Town'], habitats: ['Secret Garden'],        specialty: 'Hype',     time: 'Day',     weather: 'Sunny',  desc: 'A pocketful of luck waddles among the petals. Its presence lifts spirits across the whole island.' },
  { id: 45, name: 'Cleffa',     type: ['Fairy'],            regions: ['Sparkling Skylands'], habitats: ['Sky Garden'],           specialty: 'Hype',     time: 'Night',   weather: 'Any',    desc: 'Bounces in starlit circles between drifting clouds. It choreographs late-night dances for the helpers.' },
  { id: 46, name: 'Mareep',     type: ['Electric'],         regions: ['Sparkling Skylands'], habitats: ['Sky Garden'],           specialty: 'Generate', time: 'Day',     weather: 'Sunny',  desc: 'Grazes the cloud-meadows storing static in its fleece. A pat from a helper charges a whole lantern.' },
  { id: 47, name: 'Pichu',      type: ['Electric'],         regions: ['Sparkling Skylands'], habitats: ['Sky Garden'],           specialty: 'Generate', time: 'Day',     weather: 'Sunny',  desc: 'Sparks adorably whenever it tries to talk. It runs tiny lights along the garden trellises.' },
  { id: 48, name: 'Drifloon',   type: ['Ghost', 'Flying'],  regions: ['Sparkling Skylands'], habitats: ['Sky Garden'],           specialty: 'Fly',      time: 'Evening', weather: 'Cloudy', desc: 'Tethers itself to railings until needed. It floats fragile pots between island terraces.' },
  { id: 49, name: 'Swablu',     type: ['Normal', 'Flying'], regions: ['Sparkling Skylands'], habitats: ['Sky Garden'],           specialty: 'Fly',      time: 'Day',     weather: 'Sunny',  desc: 'Trails cottony wings as it loops the sky. It dusts pollen across distant flowerbeds.' },
  { id: 50, name: 'Starly',     type: ['Normal', 'Flying'], regions: ['Sparkling Skylands'], habitats: ['Sky Garden'],           specialty: 'Fly',      time: 'Day',     weather: 'Any',    desc: 'Lives in chattering flocks above the meadows. It signals weather changes to the gardeners below.' },
  { id: 51, name: 'Rookidee',   type: ['Flying'],           regions: ['Sparkling Skylands'], habitats: ['Sky Garden'],           specialty: 'Fly',      time: 'Day',     weather: 'Sunny',  desc: 'A brave little courier hopping cloud to cloud. It will challenge anything that ruffles its garden.' },
  { id: 52, name: 'Hoppip',     type: ['Grass', 'Flying'],  regions: ['Sparkling Skylands'], habitats: ['Sky Garden'],           specialty: 'Grow',     time: 'Day',     weather: 'Sunny',  desc: 'Drifts wherever the breeze takes it. It spreads seeds across every floating planter on the way.' },
  { id: 53, name: 'Beldum',     type: ['Steel', 'Psychic'], regions: ['Sparkling Skylands'], habitats: ['Hidden Laboratory'],    specialty: 'Build',    time: 'Any',     weather: 'Any',    desc: 'Hovers patiently among gleaming benches. It assembles delicate frameworks with magnetic precision.' },
  { id: 54, name: 'Porygon',    type: ['Normal'],           regions: ['Sparkling Skylands'], habitats: ['Hidden Laboratory'],    specialty: 'Generate', time: 'Any',     weather: 'Any',    desc: 'A polygonal helper that lives in the lab’s mainframe. It compiles blueprints for the rest of the team.' },
  { id: 55, name: 'Abra',       type: ['Psychic'],          regions: ['Sparkling Skylands'], habitats: ['Hidden Laboratory'],    specialty: 'Teleport', time: 'Any',     weather: 'Any',    desc: 'Sleeps almost all day inside the lab. When awake, it teleports tools wherever they’re needed instantly.' },
  { id: 56, name: 'Ralts',      type: ['Psychic', 'Fairy'], regions: ['Sparkling Skylands', 'Palette Town'], habitats: ['Secret Garden'],        specialty: 'Hype',     time: 'Day',     weather: 'Sunny',  desc: 'Senses the emotions of every island visitor. It guides anxious newcomers gently into the secret garden.' },

  // —— Palette Town ——
  { id: 57, name: 'Bulbasaur',  type: ['Grass', 'Poison'],  regions: ['Palette Town', 'Withered Wasteland'],       habitats: ['Garden Habitat', 'Tree-Shaded Tall Grass'], specialty: 'Grow',     time: 'Day',     weather: 'Sunny',  desc: 'Bathes its bulb in the morning sun. It seeds whole flowerbeds in a single afternoon.' },
  { id: 58, name: 'Oddish',     type: ['Grass', 'Poison'],  regions: ['Palette Town'],       habitats: ['Garden Habitat'],       specialty: 'Grow',     time: 'Night',   weather: 'Rain',   desc: 'Buries itself by day and dances by night. Wherever it dances, new sprouts appear by dawn.' },
  { id: 59, name: 'Bellsprout', type: ['Grass', 'Poison'],  regions: ['Palette Town', 'Withered Wasteland'],       habitats: ['Veggie Plot'],          specialty: 'Grow',     time: 'Day',     weather: 'Sunny',  desc: 'Sways like a stalk in the breeze among the rows. It speeds along the ripening of every veggie.' },
  { id: 60, name: 'Sunkern',    type: ['Grass'],            regions: ['Palette Town', 'Withered Wasteland'],       habitats: ['Wildflower Patch'],     specialty: 'Grow',     time: 'Day',     weather: 'Sunny',  desc: 'A tiny seed that hardly moves all day. Beneath it, the soil quietly grows richer.' },
  { id: 61, name: 'Caterpie',   type: ['Bug'],              regions: ['Palette Town', 'Withered Wasteland'],       habitats: ['Tree-Shaded Tall Grass'], specialty: 'Gather',  time: 'Day',     weather: 'Any',    desc: 'Inches along leafy stems collecting tender shoots. It bundles them neatly for the gardeners.' },
  { id: 62, name: 'Weedle',     type: ['Bug', 'Poison'],    regions: ['Palette Town', 'Withered Wasteland'],       habitats: ['Tree-Shaded Tall Grass'], specialty: 'Gather',  time: 'Day',     weather: 'Any',    desc: 'A careful forager with a stinger to match. It clips ripe berries without bruising a one.' },
  { id: 63, name: 'Pikachu',    type: ['Electric'],         regions: ['Palette Town', 'Withered Wasteland'],       habitats: ['Tree-Shaded Pink Tall Grass', 'Wildflower Patch'], specialty: 'Generate', time: 'Day', weather: 'Sunny',  desc: 'Loves the pink-tinged grass best of all. A tail-wag from this one lights the whole town square.' },
  { id: 64, name: 'Eevee',      type: ['Normal'],           regions: ['Palette Town'],       habitats: ['Pokémon Center', 'Garden Habitat'], specialty: 'Hype',     time: 'Any',     weather: 'Any',    desc: 'Greets every visitor at the Pokémon Center door. Its tail-wag is rumored to cure homesickness.' },
  { id: 65, name: 'Chansey',    type: ['Normal'],           regions: ['Palette Town'],       habitats: ['Pokémon Center'],       specialty: 'Hype',     time: 'Any',     weather: 'Any',    desc: 'Doles out lucky eggs to weary helpers. Its smile alone seems to mend a rough day.' },
  { id: 66, name: 'Snom',       type: ['Ice', 'Bug'],       regions: ['Palette Town', 'Sparkling Skylands'],       habitats: ['Hydrated Pink Tall Grass', 'Secret Garden'], specialty: 'Water', time: 'Night',   weather: 'Rain',   desc: 'Curls in cool dew between blades of pink grass. It drips meltwater that nurtures rare blooms.' },
  { id: 67, name: 'Wooloo',     type: ['Normal'],           regions: ['Palette Town'],       habitats: ['Garden Habitat'],       specialty: 'Gather',   time: 'Day',     weather: 'Sunny',  desc: 'Rolls through the garden trimming overgrown grass. Its wool drops become soft mulch for new beds.' },
  { id: 68, name: 'Skwovet',    type: ['Normal'],           regions: ['Palette Town', 'Withered Wasteland'],       habitats: ['Tree-Shaded Tall Grass'], specialty: 'Gather',  time: 'Day',     weather: 'Any',    desc: 'Cheeks bulging with stashed berries year-round. It tops up the town larder without being asked.' },
  { id: 69, name: 'Bidoof',     type: ['Normal'],           regions: ['Palette Town', 'Withered Wasteland'],       habitats: ['Veggie Plot'],          specialty: 'Chop',     time: 'Day',     weather: 'Any',    desc: 'A cheerful little builder with strong teeth. It gnaws timber to size for every fence post in town.' },
  { id: 70, name: 'Munchlax',   type: ['Normal'],           regions: ['Palette Town'],       habitats: ['Tree-Shaded Pink Tall Grass'], specialty: 'Recycle', time: 'Any', weather: 'Any',   desc: 'Will eat almost any leftover offered. It composts the rest into rich soil for the pink-grass meadows.' },

  // —— Withered Wasteland (added) ——
  { id: 71, name: 'Charmander', type: ['Fire'],             regions: ['Withered Wasteland', 'Palette Town'], habitats: ['Campfire Ring', 'Wildflower Patch'], specialty: 'Burn',     time: 'Day',     weather: 'Sunny',  desc: 'Curls beside the fire warming its tail-flame. It lights signal lanterns along the dune trails after dusk.' },
  { id: 72, name: 'Charmeleon', type: ['Fire'],             regions: ['Withered Wasteland', 'Palette Town', 'Rocky Ridges'], habitats: ['Campfire Ring', 'Tall Grass'], specialty: 'Burn',     time: 'Day',     weather: 'Sunny',  desc: 'Patrols hotter, drier stretches than its younger kin. It scorches deadwood so new shoots can push through.' },
  { id: 73, name: 'Phanpy',     type: ['Ground'],           regions: ['Withered Wasteland', 'Palette Town'], habitats: ['Wildflower Patch'],     specialty: 'Bulldoze', time: 'Day',     weather: 'Sunny',  desc: 'Trots happily through flower patches with its trunk swinging. It uproots stubborn weeds for the gardeners.' },
  { id: 74, name: 'Rolycoly',   type: ['Rock'],             regions: ['Withered Wasteland', 'Rocky Ridges'], habitats: ['Mountain Cave'],        specialty: 'Crush',    time: 'Any',     weather: 'Any',    desc: 'Rolls everywhere on a wheel of coal. It cracks dry rubble down into useful gravel as it goes.' },
  { id: 75, name: 'Slugma',     type: ['Fire'],             regions: ['Withered Wasteland', 'Palette Town'], habitats: ['Campfire Ring'],        specialty: 'Burn',     time: 'Day',     weather: 'Sunny',  desc: 'Oozes slowly between sun-baked stones. Its trail of warm magma reheats the campfire ring overnight.' },
  { id: 76, name: 'Litwick',    type: ['Ghost', 'Fire'],    regions: ['Withered Wasteland', 'Rocky Ridges'], habitats: ['Mountain Cave'],        specialty: 'Search',   time: 'Night',   weather: 'Any',    desc: 'A small candle that floats through dark caves. Its quiet flame leads weary travelers back to the surface.' },
  { id: 77, name: 'Scraggy',    type: ['Dark', 'Fighting'], regions: ['Withered Wasteland', 'Palette Town', 'Rocky Ridges'], habitats: ['Tall Grass'],           specialty: 'Chop',     time: 'Day',     weather: 'Sunny',  desc: 'Headbutts dead branches loose all afternoon. The kindling pile beside the campfire is its handiwork.' },
  { id: 78, name: 'Cutiefly',   type: ['Bug', 'Fairy'],     regions: ['Withered Wasteland', 'Palette Town'], habitats: ['Wildflower Patch'],     specialty: 'Gather',   time: 'Day',     weather: 'Sunny',  desc: 'Drifts between blooms gathering bright nectar. It scatters pollen wherever it lands, helping new flowers spread.' },
  { id: 79, name: 'Cyndaquil',  type: ['Fire'],             regions: ['Withered Wasteland', 'Palette Town'], habitats: ['Campfire Ring'],        specialty: 'Burn',     time: 'Day',     weather: 'Sunny',  desc: 'Flares the flames on its back when surprised. It tends the campfire when no one else is around to stoke it.' },
  { id: 80, name: 'Torchic',    type: ['Fire'],             regions: ['Withered Wasteland', 'Palette Town'], habitats: ['Campfire Ring'],        specialty: 'Burn',     time: 'Day',     weather: 'Sunny',  desc: 'A downy chick that toddles after warm sand and warmer hands. Its little flame keeps tea kettles humming.' },
  { id: 81, name: 'Chimchar',   type: ['Fire'],             regions: ['Withered Wasteland', 'Palette Town', 'Rocky Ridges', 'Sparkling Skylands'], habitats: ['Campfire Ring', 'Mountain Peak'], specialty: 'Burn',     time: 'Day',     weather: 'Sunny',  desc: 'Swings from rope to rope and from rock to rock, tail-flame blazing. It loves to dance around the fire at night.' },
  { id: 82, name: 'Tepig',      type: ['Fire'],             regions: ['Withered Wasteland', 'Palette Town'], habitats: ['Veggie Plot', 'Campfire Ring'], specialty: 'Burn',     time: 'Day',     weather: 'Sunny',  desc: 'Roots through dry soil sniffing out forgotten roots. It roasts them on the campfire to share with everyone.' },

  // —— Rocky Ridges (added) ——
  { id: 83, name: 'Pawniard',   type: ['Dark', 'Steel'],    regions: ['Rocky Ridges', 'Withered Wasteland'],       habitats: ['Mountain Cave'],        specialty: 'Chop',     time: 'Day',     weather: 'Any',    desc: 'A blade-armored scout that haunts the deeper cave levels. Its precise slashes prune awkward branches in seconds.' },
  { id: 84, name: 'Lycanroc',   type: ['Rock'],             regions: ['Rocky Ridges', 'Sparkling Skylands', 'Withered Wasteland'],       habitats: ['Mountain Peak', 'Boulder Tall Grass'], specialty: 'Chop',     time: 'Day',     weather: 'Sunny',  desc: 'Patrols the upper ridges in long, loping strides. It clears unstable boulders before they can fall on travelers.' },
  { id: 85, name: 'Tyrunt',     type: ['Rock', 'Dragon'],   regions: ['Rocky Ridges', 'Withered Wasteland'],       habitats: ['Mountain Cave'],        specialty: 'Crush',    time: 'Day',     weather: 'Sunny',  desc: 'A pint-sized prehistoric brawler that loves a tussle. Its bite cracks ore loose from the cave walls.' },
  { id: 86, name: 'Carbink',    type: ['Rock', 'Fairy'],    regions: ['Rocky Ridges', 'Sparkling Skylands', 'Withered Wasteland'],       habitats: ['Mountain Cave', 'Hidden Laboratory'], specialty: 'Generate', time: 'Any',     weather: 'Any',    desc: 'A glittering gem-creature that hums softly in dark places. Its glow keeps cave lanterns lit without oil.' },
  { id: 87, name: 'Cubchoo',    type: ['Ice'],              regions: ['Rocky Ridges', 'Sparkling Skylands'],       habitats: ['Mountain Peak'],        specialty: 'Water',    time: 'Day',     weather: 'Cloudy', desc: 'Sniffles its way across the snowy summits. Its dripping nose waters thirsty alpine flowers.' },
  { id: 88, name: 'Croagunk',   type: ['Poison', 'Fighting'], regions: ['Rocky Ridges', 'Withered Wasteland'],     habitats: ['Mountain Cave'],        specialty: 'Crush',    time: 'Night',   weather: 'Cloudy', desc: 'A quiet swamp-fighter that prefers the cave’s damp corners. It deflates puffed-up rivals with a single jab.' },
  { id: 89, name: 'Klink',      type: ['Steel'],            regions: ['Rocky Ridges', 'Palette Town', 'Sparkling Skylands', 'Withered Wasteland'],       habitats: ['Construction Site', 'Hidden Laboratory'], specialty: 'Build',    time: 'Any',     weather: 'Any',    desc: 'A pair of gears that mesh with a satisfying click. It powers small lifts and conveyor belts on busy work sites.' },
  { id: 90, name: 'Cufant',     type: ['Steel'],            regions: ['Rocky Ridges', 'Palette Town', 'Withered Wasteland'],       habitats: ['Construction Site'],    specialty: 'Bulldoze', time: 'Day',     weather: 'Any',    desc: 'A small copper elephant with a knack for heavy hauling. Its trunk doubles as a perfect winch.' },
  { id: 91, name: 'Gible',      type: ['Dragon', 'Ground'], regions: ['Rocky Ridges', 'Withered Wasteland'],       habitats: ['Mountain Cave'],        specialty: 'Crush',    time: 'Day',     weather: 'Sunny',  desc: 'Lurks just inside cave mouths and snaps at anything passing. It chews through stubborn rock dams with no fuss.' },
  { id: 92, name: 'Salandit',   type: ['Poison', 'Fire'],   regions: ['Rocky Ridges', 'Withered Wasteland'],       habitats: ['Mountain Cave'],        specialty: 'Burn',     time: 'Night',   weather: 'Any',    desc: 'Slips between cracks in the rock leaving wisps of toxic smoke. It startles cave bats into open passages.' },
  { id: 93, name: 'Mawile',     type: ['Steel', 'Fairy'],   regions: ['Rocky Ridges', 'Withered Wasteland'],       habitats: ['Mountain Cave'],        specialty: 'Recycle',  time: 'Day',     weather: 'Any',    desc: 'Hides its huge steel jaws under a sweet smile. It bites old nails and scraps into perfectly reusable forms.' },
  { id: 94, name: 'Boldore',    type: ['Rock'],             regions: ['Rocky Ridges', 'Withered Wasteland'],       habitats: ['Mountain Cave', 'Boulder Tall Grass'], specialty: 'Crush',    time: 'Any',     weather: 'Any',    desc: 'A crystalline boulder studded with bright orange shards. It cracks tunnels open with a single rolling charge.' },
  { id: 95, name: 'Lillipup',   type: ['Normal'],           regions: ['Rocky Ridges', 'Palette Town', 'Sparkling Skylands'],       habitats: ['Mountain Peak', 'Garden Habitat'], specialty: 'Search',   time: 'Day',     weather: 'Sunny',  desc: 'A scruffy little pup with a brave, alert face. It scouts switchbacks for the slow-moving Hippopotas caravans.' },
  { id: 96, name: 'Stufful',    type: ['Normal', 'Fighting'], regions: ['Rocky Ridges', 'Palette Town', 'Withered Wasteland'],     habitats: ['Tree-Shaded Tall Grass'], specialty: 'Build',    time: 'Day',     weather: 'Sunny',  desc: 'Looks cuddly and acts surly, but lifts twice its weight in lumber. It anchors heavy crossbeams without complaint.' },
  { id: 97, name: 'Spinda',     type: ['Normal'],           regions: ['Rocky Ridges', 'Sparkling Skylands'],       habitats: ['Mountain Peak'],        specialty: 'Hype',     time: 'Day',     weather: 'Cloudy', desc: 'Wobbles in dizzy circles wherever it goes. Its goofy dance gets weary builders laughing again.' },

  // —— Bleak Beach (added) ——
  { id: 98,  name: 'Spheal',    type: ['Ice', 'Water'],     regions: ['Bleak Beach'],        habitats: ['Ocean Tall Grass'],     specialty: 'Water',    time: 'Day',     weather: 'Any',    desc: 'Rolls through cold tidewater grass like a furry ball. It cools the beach air on hotter afternoons.' },
  { id: 99,  name: 'Shellos',   type: ['Water'],            regions: ['Bleak Beach', 'Palette Town'],        habitats: ['Waterside Tall Grass'], specialty: 'Water',    time: 'Day',     weather: 'Rain',   desc: 'A soft sea slug that prefers brackish puddles. It seeps fresh water steadily into tired roots.' },
  { id: 100, name: 'Frillish',  type: ['Water', 'Ghost'],   regions: ['Bleak Beach'],        habitats: ['Ocean Tall Grass'],     specialty: 'Water',    time: 'Night',   weather: 'Any',    desc: 'Drifts beneath dark waves trailing pale frills. Its faint glow guides night-fishers home to shore.' },
  { id: 101, name: 'Clamperl',  type: ['Water'],            regions: ['Bleak Beach'],        habitats: ['Waterside Dinghy'],     specialty: 'Gather',   time: 'Day',     weather: 'Any',    desc: 'Hides a single shining pearl in a hinged blue shell. It gifts the pearl to helpers who treat the reef kindly.' },
  { id: 102, name: 'Tirtouga',  type: ['Water', 'Rock'],    regions: ['Bleak Beach'],        habitats: ['Waterside Dinghy'],     specialty: 'Search',   time: 'Day',     weather: 'Sunny',  desc: 'An ancient little turtle uncovered in shoreline rubble. It still knows where the old reefs sleep.' },
  { id: 103, name: 'Piplup',    type: ['Water'],            regions: ['Bleak Beach', 'Palette Town'],        habitats: ['Waterside Tall Grass'], specialty: 'Water',    time: 'Day',     weather: 'Any',    desc: 'A proud little penguin chick that won’t admit it’s lost. It waters seedlings whenever no one’s watching.' },
  { id: 104, name: 'Totodile',  type: ['Water'],            regions: ['Bleak Beach', 'Palette Town'],        habitats: ['Waterside Tall Grass'], specialty: 'Water',    time: 'Day',     weather: 'Sunny',  desc: 'Snaps cheerfully at anything that drifts within reach. Its tail-splashes water entire rows of reeds.' },
  { id: 105, name: 'Goldeen',   type: ['Water'],            regions: ['Bleak Beach', 'Palette Town'],        habitats: ['Waterside Tall Grass'], specialty: 'Water',    time: 'Day',     weather: 'Any',    desc: 'A graceful red-and-white swimmer threading through reeds. It rinses fresh silt over tired riverbanks.' },
  { id: 106, name: 'Remoraid',  type: ['Water'],            regions: ['Bleak Beach'],        habitats: ['Ocean Tall Grass'],     specialty: 'Water',    time: 'Day',     weather: 'Any',    desc: 'Fires precise jets of water at distant targets. Helpers use it like a portable garden hose.' },
  { id: 107, name: 'Mantyke',   type: ['Water', 'Flying'],  regions: ['Bleak Beach'],        habitats: ['Ocean Tall Grass'],     specialty: 'Fly',      time: 'Day',     weather: 'Sunny',  desc: 'Glides above the waves trailing a smaller Remoraid. The pair ferries lightweight messages to and from the offshore dock.' },
  { id: 108, name: 'Carvanha',  type: ['Water', 'Dark'],    regions: ['Bleak Beach'],        habitats: ['Ocean Tall Grass'],     specialty: 'Chop',     time: 'Night',   weather: 'Cloudy', desc: 'A toothy predator best admired from the dock. Its bite cracks driftwood into instant kindling.' },
  { id: 109, name: 'Oshawott',  type: ['Water'],            regions: ['Bleak Beach', 'Palette Town'],        habitats: ['Waterside Tall Grass', 'Waterside Dinghy'], specialty: 'Chop',     time: 'Day',     weather: 'Any',    desc: 'Wields a sea-shell scalchop like a small blade. It trims overgrown reeds for the boat crews.' },
  { id: 110, name: 'Popplio',   type: ['Water'],            regions: ['Bleak Beach'],        habitats: ['Waterside Dinghy'],     specialty: 'Hype',     time: 'Day',     weather: 'Sunny',  desc: 'Conjures bubble sculptures from its nose for fun. Its show is the highlight of every dockside picnic.' },
  { id: 111, name: 'Froakie',   type: ['Water'],            regions: ['Bleak Beach', 'Palette Town'],        habitats: ['Waterside Tall Grass'], specialty: 'Water',    time: 'Day',     weather: 'Rain',   desc: 'A nimble blue frog cloaked in bubbly foam. It mists the reeds with every confident hop.' },
  { id: 112, name: 'Quaxly',    type: ['Water'],            regions: ['Bleak Beach'],        habitats: ['Waterside Dinghy'],     specialty: 'Hype',     time: 'Day',     weather: 'Sunny',  desc: 'A dapper duckling that grooms its head feathers obsessively. It supervises every dinghy launch like a tiny captain.' },
  { id: 113, name: 'Sobble',    type: ['Water'],            regions: ['Bleak Beach', 'Palette Town'],        habitats: ['Waterside Tall Grass'], specialty: 'Water',    time: 'Evening', weather: 'Rain',   desc: 'A shy chameleon-lizard that vanishes into wet reeds. Its tears nurture the rarest waterside blooms.' },

  // —— Sparkling Skylands (added) ——
  { id: 114, name: 'Cottonee',  type: ['Grass', 'Fairy'],   regions: ['Sparkling Skylands'], habitats: ['Sky Garden'],           specialty: 'Grow',     time: 'Day',     weather: 'Sunny',  desc: 'Drifts on the breeze like a sentient dandelion. It scatters seed-fluff across every floating planter.' },
  { id: 115, name: 'Petilil',   type: ['Grass'],            regions: ['Sparkling Skylands', 'Palette Town'], habitats: ['Secret Garden'],        specialty: 'Grow',     time: 'Day',     weather: 'Sunny',  desc: 'A tiny bulb with two cheerful leaves on its head. It hums softly to wilting flowers until they perk up.' },
  { id: 116, name: 'Igglybuff', type: ['Normal', 'Fairy'],  regions: ['Sparkling Skylands'], habitats: ['Sky Garden'],           specialty: 'Hype',     time: 'Day',     weather: 'Sunny',  desc: 'Bounces around the cloud-meadows in fluffy pink puffs. Its giggle is rumored to make stubborn seeds sprout.' },
  { id: 117, name: 'Jigglypuff',type: ['Normal', 'Fairy'],  regions: ['Sparkling Skylands'], habitats: ['Sky Garden'],           specialty: 'Hype',     time: 'Any',     weather: 'Any',    desc: 'Sings tired helpers into deep, fluffy naps. Then it pouts adorably when they doze off.' },
  { id: 118, name: 'Magnemite', type: ['Electric', 'Steel'],regions: ['Sparkling Skylands'], habitats: ['Hidden Laboratory'],    specialty: 'Generate', time: 'Any',     weather: 'Any',    desc: 'Hovers patiently above the lab benches humming. It powers the smallest gadgets straight from its coils.' },
  { id: 119, name: 'Voltorb',   type: ['Electric'],         regions: ['Sparkling Skylands'], habitats: ['Hidden Laboratory'],    specialty: 'Generate', time: 'Any',     weather: 'Any',    desc: 'Disguises itself among the lab’s spare batteries. Touch the wrong one and the lights flicker for a week.' },
  { id: 120, name: 'Elgyem',    type: ['Psychic'],          regions: ['Sparkling Skylands'], habitats: ['Hidden Laboratory'],    specialty: 'Teleport', time: 'Night',   weather: 'Any',    desc: 'Appears at the lab during meteor showers. It teleports lost tools back from wherever they’ve drifted to.' },
  { id: 121, name: 'Cosmog',    type: ['Psychic'],          regions: ['Sparkling Skylands', 'Palette Town'], habitats: ['Sky Garden', 'Secret Garden'], specialty: 'Teleport', time: 'Night',   weather: 'Any',    desc: 'A tiny ball of starlight that giggles when held. It only appears for helpers who’ve tended the gardens kindly.' },
  { id: 122, name: 'Sigilyph',  type: ['Psychic', 'Flying'],regions: ['Sparkling Skylands'], habitats: ['Sky Garden'],           specialty: 'Fly',      time: 'Day',     weather: 'Sunny',  desc: 'A patterned guardian that circles the island in slow loops. It watches over fragile pots on windy days.' },
  { id: 123, name: 'Comfey',    type: ['Fairy'],            regions: ['Sparkling Skylands', 'Palette Town'], habitats: ['Secret Garden'],        specialty: 'Hype',     time: 'Day',     weather: 'Sunny',  desc: 'Weaves itself into wreaths of fresh flowers. Anyone wearing one feels their tired feet lighten up.' },
  { id: 124, name: 'Minccino',  type: ['Normal'],           regions: ['Sparkling Skylands', 'Palette Town'], habitats: ['Secret Garden', 'Pokémon Center'], specialty: 'Gather',   time: 'Day',     weather: 'Sunny',  desc: 'A tidy little chinchilla that grooms everything in sight. The Pokémon Center has never been dust-free until now.' },
  { id: 125, name: 'Spritzee',  type: ['Fairy'],            regions: ['Sparkling Skylands', 'Palette Town'], habitats: ['Secret Garden'],        specialty: 'Hype',     time: 'Day',     weather: 'Sunny',  desc: 'Carries a permanent cloud of sweet perfume. Helpers visit it before any garden-party celebration.' },

  // —— Palette Town (added) ——
  { id: 126, name: 'Chikorita', type: ['Grass'],            regions: ['Palette Town'],       habitats: ['Garden Habitat'],       specialty: 'Grow',     time: 'Day',     weather: 'Sunny',  desc: 'A leaf-headed sweetie that releases calming aroma. It waves its leaf to guide gardeners between rows.' },
  { id: 127, name: 'Treecko',   type: ['Grass'],            regions: ['Palette Town', 'Withered Wasteland'],       habitats: ['Tree-Shaded Tall Grass'], specialty: 'Grow',    time: 'Day',     weather: 'Sunny',  desc: 'Clings to tree trunks with grippy toe-pads. It measures sapling growth with quiet pride each morning.' },
  { id: 128, name: 'Turtwig',   type: ['Grass'],            regions: ['Palette Town', 'Withered Wasteland'],       habitats: ['Garden Habitat', 'Veggie Plot'], specialty: 'Grow',     time: 'Day',     weather: 'Sunny',  desc: 'Wears a tiny tree as a shell. The leaf overhead tells gardeners exactly when it’s time to water.' },
  { id: 129, name: 'Snivy',     type: ['Grass'],            regions: ['Palette Town', 'Withered Wasteland'],       habitats: ['Tree-Shaded Tall Grass'], specialty: 'Grow',    time: 'Day',     weather: 'Sunny',  desc: 'A graceful, smug little snake that prefers dappled shade. It coils around stalks to keep them upright.' },
  { id: 130, name: 'Chespin',   type: ['Grass'],            regions: ['Palette Town', 'Withered Wasteland'],       habitats: ['Tree-Shaded Tall Grass'], specialty: 'Chop',    time: 'Day',     weather: 'Sunny',  desc: 'A spiky-headed forager that gnaws nuts with gusto. It splits firewood for the Pokémon Center stove.' },
  { id: 131, name: 'Rowlet',    type: ['Grass', 'Flying'],  regions: ['Palette Town', 'Withered Wasteland'],       habitats: ['Tree-Shaded Tall Grass'], specialty: 'Fly',     time: 'Evening', weather: 'Cloudy', desc: 'A round little owl that drops silently from low branches. It carries small letters between cottages at dusk.' },
  { id: 132, name: 'Grookey',   type: ['Grass'],            regions: ['Palette Town', 'Withered Wasteland'],       habitats: ['Tree-Shaded Tall Grass'], specialty: 'Hype',    time: 'Day',     weather: 'Sunny',  desc: 'Drums on hollow logs in steady upbeat rhythms. The garden seems to grow faster wherever it plays.' },
  { id: 133, name: 'Sprigatito',type: ['Grass'],            regions: ['Palette Town'],       habitats: ['Garden Habitat'],       specialty: 'Grow',     time: 'Day',     weather: 'Sunny',  desc: 'A leafy little kitten that nuzzles every visitor. Its fur smells faintly of fresh-cut herbs.' },
  { id: 134, name: 'Hoothoot',  type: ['Normal', 'Flying'], regions: ['Palette Town', 'Withered Wasteland'],       habitats: ['Tree-Shaded Tall Grass'], specialty: 'Search',  time: 'Night',   weather: 'Any',    desc: 'Stands watch on a single foot from a high branch. It hoots the hour for late-night gardeners.' },
  { id: 135, name: 'Sentret',   type: ['Normal'],           regions: ['Palette Town'],       habitats: ['Garden Habitat'],       specialty: 'Search',   time: 'Day',     weather: 'Sunny',  desc: 'Stands tall on its tail to peek over hedges. It signals helpers the moment a stray Skwovet sneaks in.' },
  { id: 136, name: 'Plusle',    type: ['Electric'],         regions: ['Palette Town', 'Withered Wasteland'],       habitats: ['Wildflower Patch'],     specialty: 'Hype',     time: 'Day',     weather: 'Sunny',  desc: 'Cheers helpers on with sparkling pom-poms of static. Always seen beside its partner Minun.' },
  { id: 137, name: 'Minun',     type: ['Electric'],         regions: ['Palette Town', 'Withered Wasteland'],       habitats: ['Wildflower Patch'],     specialty: 'Hype',     time: 'Day',     weather: 'Sunny',  desc: 'Trades cheers with Plusle in perfect counter-rhythm. Their twin sparks could light a small parade.' },
  { id: 138, name: 'Yamper',    type: ['Electric'],         regions: ['Palette Town'],       habitats: ['Garden Habitat'],       specialty: 'Generate', time: 'Day',     weather: 'Sunny',  desc: 'A corgi puppy that generates static from its own running. It powers small fairy lights along the path.' },
  { id: 139, name: 'Lechonk',   type: ['Normal'],           regions: ['Palette Town', 'Withered Wasteland'],       habitats: ['Veggie Plot'],          specialty: 'Gather',   time: 'Day',     weather: 'Any',    desc: 'A round little pig with an unstoppable appetite. It snuffles out overripe veggies before they spoil.' },
  { id: 140, name: 'Skitty',    type: ['Normal'],           regions: ['Palette Town'],       habitats: ['Garden Habitat'],       specialty: 'Hype',     time: 'Day',     weather: 'Sunny',  desc: 'Chases its own tail in dizzy little loops. Its purr is rumored to coax shy flowers into bloom.' },
  { id: 141, name: 'Buneary',   type: ['Normal'],           regions: ['Palette Town'],       habitats: ['Garden Habitat'],       specialty: 'Hype',     time: 'Day',     weather: 'Sunny',  desc: 'Hops higher than any helper expects. Its springy ears double as a soft bell rope at the gate.' },
  { id: 142, name: 'Audino',    type: ['Normal'],           regions: ['Palette Town'],       habitats: ['Pokémon Center'],       specialty: 'Hype',     time: 'Any',     weather: 'Any',    desc: 'Listens to a guest’s heartbeat with floppy pink ears. It always knows exactly which berry to offer.' },
  { id: 143, name: 'Hatenna',   type: ['Psychic'],          regions: ['Palette Town', 'Sparkling Skylands'],       habitats: ['Garden Habitat', 'Secret Garden'], specialty: 'Hype',     time: 'Day',     weather: 'Any',    desc: 'A timid little reader of moods. It only approaches helpers who are calm and quiet inside.' },
  { id: 144, name: 'Morpeko',   type: ['Electric', 'Dark'], regions: ['Palette Town'],       habitats: ['Pokémon Center'],       specialty: 'Generate', time: 'Night',   weather: 'Any',    desc: 'Cycles between cheerful and grumpy on an empty stomach. Snack first, then ask it to power the night lamps.' },
  { id: 145, name: 'Snorlax',   type: ['Normal'],           regions: ['Palette Town'],       habitats: ['Tree-Shaded Pink Tall Grass'], specialty: 'Recycle', time: 'Any',     weather: 'Any',    desc: 'Naps in the pink grass for hours at a time. Its quiet mountain of a body shelters smaller Pokémon underneath.' },

  // —— Withered Wasteland (evolutions & additions) ——
  { id: 146, name: 'Charizard',  type: ['Fire', 'Flying'],   regions: ['Withered Wasteland', 'Palette Town', 'Rocky Ridges', 'Sparkling Skylands'], habitats: ['Mountain Peak', 'Campfire Ring'], specialty: 'Fly',      time: 'Day',     weather: 'Sunny',  desc: 'Soars on broad wings over the cracked plateau. Its updrafts ferry small helpers between distant dunes.' },
  { id: 147, name: 'Camerupt',   type: ['Fire', 'Ground'],   regions: ['Withered Wasteland', 'Palette Town', 'Rocky Ridges'], habitats: ['Mountain Cave', 'Campfire Ring'], specialty: 'Burn',     time: 'Any',     weather: 'Sunny',  desc: 'Carries two small volcanoes on its back. They keep entire campsites warm through cold desert nights.' },
  { id: 148, name: 'Vibrava',    type: ['Ground', 'Dragon'], regions: ['Withered Wasteland', 'Rocky Ridges'], habitats: ['Boulder Tall Grass'],   specialty: 'Bulldoze', time: 'Day',     weather: 'Sunny',  desc: 'Buzzes through the heat haze on filmy wings. Its hum knocks loose dust from cracked stone.' },
  { id: 149, name: 'Flygon',     type: ['Ground', 'Dragon'], regions: ['Withered Wasteland', 'Rocky Ridges', 'Sparkling Skylands'], habitats: ['Boulder Tall Grass', 'Mountain Peak'], specialty: 'Fly',      time: 'Day',     weather: 'Sunny',  desc: 'A graceful desert dragon whose wings sing in flight. It guides caravans through sandstorms.' },
  { id: 150, name: 'Sandslash',  type: ['Ground'],           regions: ['Withered Wasteland', 'Palette Town', 'Rocky Ridges'], habitats: ['Tall Grass'],           specialty: 'Bulldoze', time: 'Day',     weather: 'Sunny',  desc: 'Curls into a spiny ball to roll downhill. Its quills aerate hard-packed soil wherever it lands.' },
  { id: 151, name: 'Marowak',    type: ['Ground'],           regions: ['Withered Wasteland', 'Palette Town'], habitats: ['Wildflower Patch'],     specialty: 'Build',    time: 'Night',   weather: 'Any',    desc: 'Carries a sturdy bone like a builder’s tool. It taps fence posts deep into desert soil at dusk.' },
  { id: 152, name: 'Krokorok',   type: ['Ground', 'Dark'],   regions: ['Withered Wasteland', 'Palette Town', 'Rocky Ridges'], habitats: ['Tall Grass'],           specialty: 'Search',   time: 'Day',     weather: 'Sunny',  desc: 'Watches passing travelers from behind dark eye-stripes. It noses out buried tools without breaking stride.' },
  { id: 153, name: 'Krookodile', type: ['Ground', 'Dark'],   regions: ['Withered Wasteland', 'Rocky Ridges'], habitats: ['Boulder Tall Grass'],   specialty: 'Bulldoze', time: 'Day',     weather: 'Sunny',  desc: 'A fearsome bouncer of the dune trails. Its tail-sweep flattens an entire stretch of wasteland in seconds.' },
  { id: 154, name: 'Cacturne',   type: ['Grass', 'Dark'],    regions: ['Withered Wasteland', 'Palette Town'], habitats: ['Wildflower Patch'],     specialty: 'Grow',     time: 'Night',   weather: 'Any',    desc: 'A spiny scarecrow that wanders by moonlight. It plants seeds in spots no helper would ever think to try.' },
  { id: 155, name: 'Excadrill',  type: ['Ground', 'Steel'],  regions: ['Withered Wasteland', 'Palette Town', 'Rocky Ridges'], habitats: ['Construction Site', 'Mountain Cave'], specialty: 'Build',    time: 'Day',     weather: 'Any',    desc: 'Drills through hardpan like wet sand. Its tunnels become foundation trenches for the next outpost.' },
  { id: 156, name: 'Heliolisk',  type: ['Electric', 'Normal'], regions: ['Withered Wasteland', 'Palette Town'], habitats: ['Wildflower Patch'],   specialty: 'Generate', time: 'Day',     weather: 'Sunny',  desc: 'Fans a frill of solar collectors wide. A single afternoon of sun powers an irrigation pump for a week.' },
  { id: 157, name: 'Ninetales',  type: ['Fire'],             regions: ['Withered Wasteland', 'Palette Town', 'Rocky Ridges'], habitats: ['Tall Grass', 'Campfire Ring'], specialty: 'Burn',     time: 'Evening', weather: 'Sunny',  desc: 'Threads through dry grass with nine flickering tails. It scorches deadwood without ever lighting the surroundings.' },
  { id: 158, name: 'Arcanine',   type: ['Fire'],             regions: ['Withered Wasteland', 'Palette Town', 'Rocky Ridges'], habitats: ['Campfire Ring', 'Tall Grass'], specialty: 'Burn',     time: 'Any',     weather: 'Any',    desc: 'A noble bonfire-guardian who runs night patrols. Its very presence keeps the embers from going out.' },
  { id: 159, name: 'Darmanitan', type: ['Fire'],             regions: ['Withered Wasteland', 'Palette Town'], habitats: ['Campfire Ring'],        specialty: 'Burn',     time: 'Day',     weather: 'Sunny',  desc: 'Sits like a stone statue until something interesting happens. Then it lights up the whole campfire with a single roar.' },
  { id: 160, name: 'Magcargo',   type: ['Fire', 'Rock'],     regions: ['Withered Wasteland', 'Rocky Ridges'], habitats: ['Mountain Cave'],        specialty: 'Burn',     time: 'Any',     weather: 'Any',    desc: 'A slow-rolling lava snail trailing fresh stone behind it. Its path becomes a perfect natural walkway once cooled.' },

  // —— Rocky Ridges (evolutions & additions) ——
  { id: 161, name: 'Graveler',   type: ['Rock', 'Ground'],   regions: ['Rocky Ridges', 'Withered Wasteland'],       habitats: ['Mountain Cave', 'Boulder Tall Grass'], specialty: 'Crush',    time: 'Any',     weather: 'Any',    desc: 'Rolls down the ridges in a perfect tucked ball. It pulverizes loose rubble for the road crew.' },
  { id: 162, name: 'Golem',      type: ['Rock', 'Ground'],   regions: ['Rocky Ridges', 'Withered Wasteland'],       habitats: ['Mountain Cave'],        specialty: 'Crush',    time: 'Any',     weather: 'Any',    desc: 'Drops a heavy shell on stubborn boulders. They break into perfectly stackable blocks.' },
  { id: 163, name: 'Steelix',    type: ['Steel', 'Ground'],  regions: ['Rocky Ridges', 'Withered Wasteland'],       habitats: ['Mountain Cave'],        specialty: 'Bulldoze', time: 'Any',     weather: 'Any',    desc: 'A train-long iron serpent that bores wide, sturdy tunnels. Its passages last for generations.' },
  { id: 164, name: 'Lairon',     type: ['Steel', 'Rock'],    regions: ['Rocky Ridges', 'Withered Wasteland'],       habitats: ['Mountain Cave'],        specialty: 'Recycle',  time: 'Day',     weather: 'Cloudy', desc: 'Lives off iron ore from the deep cave walls. Its scrap leavings refine into the cleanest nuggets.' },
  { id: 165, name: 'Aggron',     type: ['Steel', 'Rock'],    regions: ['Rocky Ridges', 'Sparkling Skylands'],       habitats: ['Mountain Peak'],        specialty: 'Build',    time: 'Day',     weather: 'Sunny',  desc: 'A territorial steel titan that grooms its mountain. It restores fallen rocks to their proper places.' },
  { id: 166, name: 'Pupitar',    type: ['Rock', 'Ground'],   regions: ['Rocky Ridges', 'Withered Wasteland'],       habitats: ['Boulder Tall Grass'],   specialty: 'Crush',    time: 'Day',     weather: 'Sunny',  desc: 'A rocketing rocky cocoon that can’t sit still. It scours away the toughest debris in a single charge.' },
  { id: 167, name: 'Tyranitar',  type: ['Rock', 'Dark'],     regions: ['Rocky Ridges', 'Sparkling Skylands', 'Withered Wasteland'],       habitats: ['Mountain Peak', 'Mountain Cave'], specialty: 'Bulldoze', time: 'Any',     weather: 'Cloudy', desc: 'A storm-summoning ridge-king. Its rumble reshapes the mountainside if it has a mind to.' },
  { id: 168, name: 'Gigalith',   type: ['Rock'],             regions: ['Rocky Ridges', 'Withered Wasteland'],       habitats: ['Mountain Cave'],        specialty: 'Generate', time: 'Day',     weather: 'Sunny',  desc: 'A walking crystal generator. Helpers tap its bright facets for a steady current of energy.' },
  { id: 169, name: 'Machoke',    type: ['Fighting'],         regions: ['Rocky Ridges', 'Palette Town', 'Withered Wasteland'],       habitats: ['Construction Site'],    specialty: 'Build',    time: 'Day',     weather: 'Any',    desc: 'A patient mover of impossible loads. Its belt is the secret to lifting twice its weight.' },
  { id: 170, name: 'Machamp',    type: ['Fighting'],         regions: ['Rocky Ridges', 'Palette Town', 'Sparkling Skylands', 'Withered Wasteland'],       habitats: ['Construction Site', 'Mountain Peak'], specialty: 'Build',    time: 'Day',     weather: 'Sunny',  desc: 'Four arms working in perfect rhythm raise a wall in minutes. It also makes a fearsome champion of arm-wrestling.' },
  { id: 171, name: 'Primeape',   type: ['Fighting'],         regions: ['Rocky Ridges', 'Palette Town', 'Withered Wasteland'],       habitats: ['Tree-Shaded Tall Grass'], specialty: 'Chop',     time: 'Day',     weather: 'Cloudy', desc: 'A hot-tempered scrapper who calms only when chopping firewood. The wood pile is always tallest near its tree.' },
  { id: 172, name: 'Golbat',     type: ['Poison', 'Flying'], regions: ['Rocky Ridges', 'Withered Wasteland'],       habitats: ['Mountain Cave'],        specialty: 'Search',   time: 'Night',   weather: 'Any',    desc: 'Wheels through cave corridors in chattering swarms. Its sonar maps every wall worth knowing.' },
  { id: 173, name: 'Crobat',     type: ['Poison', 'Flying'], regions: ['Rocky Ridges', 'Sparkling Skylands', 'Withered Wasteland'],       habitats: ['Mountain Cave', 'Hidden Laboratory'], specialty: 'Fly',      time: 'Night',   weather: 'Any',    desc: 'Four silent wings carry it through any passage. The fastest courier between cave and lab.' },
  { id: 174, name: 'Lucario',    type: ['Fighting', 'Steel'],regions: ['Rocky Ridges', 'Sparkling Skylands'],       habitats: ['Mountain Peak', 'Hidden Laboratory'], specialty: 'Hype',     time: 'Day',     weather: 'Sunny',  desc: 'Reads the aura of every helper on the ridge. A nod from this one is worth a hundred cheers.' },
  { id: 175, name: 'Gurdurr',    type: ['Fighting'],         regions: ['Rocky Ridges', 'Palette Town', 'Withered Wasteland'],       habitats: ['Construction Site'],    specialty: 'Build',    time: 'Day',     weather: 'Any',    desc: 'A muscle-bound bricklayer who carries a steel I-beam everywhere. Its scaffolds never wobble.' },
  { id: 176, name: 'Conkeldurr', type: ['Fighting'],         regions: ['Rocky Ridges', 'Palette Town', 'Withered Wasteland'],       habitats: ['Construction Site'],    specialty: 'Build',    time: 'Day',     weather: 'Sunny',  desc: 'Twin concrete pillars in hand, it leads the master-builder crew. Every bridge it sets endures storms.' },
  { id: 177, name: 'Sudowoodo',  type: ['Rock'],             regions: ['Rocky Ridges', 'Palette Town', 'Withered Wasteland'],       habitats: ['Tree-Shaded Tall Grass'], specialty: 'Gather',  time: 'Day',     weather: 'Sunny',  desc: 'A stone Pokémon disguised as a small tree. Helpers use it as a sturdy landmark in the shaded grass.' },

  // —— Bleak Beach (evolutions & additions) ——
  { id: 178, name: 'Blastoise',  type: ['Water'],            regions: ['Bleak Beach'],        habitats: ['Waterside Dinghy', 'Ocean Tall Grass'], specialty: 'Water',    time: 'Day',     weather: 'Sunny',  desc: 'Twin shell-cannons mist whole rows of reeds in one sweep. The dock crew uses it to scrub barnacles too.' },
  { id: 179, name: 'Swampert',   type: ['Water', 'Ground'],  regions: ['Bleak Beach', 'Palette Town'],        habitats: ['Waterside Tall Grass'], specialty: 'Bulldoze', time: 'Day',     weather: 'Rain',   desc: 'A mighty mudfish that reshapes whole shorelines. It dredges silty channels so seedlings drink first.' },
  { id: 180, name: 'Empoleon',   type: ['Water', 'Steel'],   regions: ['Bleak Beach'],        habitats: ['Waterside Dinghy', 'Ocean Tall Grass'], specialty: 'Fly',      time: 'Day',     weather: 'Cloudy', desc: 'A regal penguin admiral that leads dinghy flotillas. Its bladed flippers cut wakes through choppy water.' },
  { id: 181, name: 'Feraligatr', type: ['Water'],            regions: ['Bleak Beach', 'Palette Town'],        habitats: ['Waterside Tall Grass'], specialty: 'Chop',     time: 'Day',     weather: 'Sunny',  desc: 'A massive river-king with a snapping grin. Its jaws split driftwood logs into perfect kindling.' },
  { id: 182, name: 'Samurott',   type: ['Water'],            regions: ['Bleak Beach'],        habitats: ['Waterside Dinghy'],     specialty: 'Chop',     time: 'Day',     weather: 'Any',    desc: 'Wields twin seamitars from its hip-plates. It trims reed clearings in two clean strokes.' },
  { id: 183, name: 'Greninja',   type: ['Water', 'Dark'],    regions: ['Bleak Beach', 'Palette Town', 'Sparkling Skylands'],        habitats: ['Waterside Tall Grass', 'Hidden Laboratory'], specialty: 'Search',   time: 'Night',   weather: 'Rain',   desc: 'A silent ninja-frog that flits between reeds. It scouts unmapped tidepools for the survey team.' },
  { id: 184, name: 'Primarina',  type: ['Water', 'Fairy'],   regions: ['Bleak Beach'],        habitats: ['Ocean Tall Grass'],     specialty: 'Hype',     time: 'Night',   weather: 'Any',    desc: 'Conducts choirs of bubbles by song. Helpers gather at the shore just to listen on still nights.' },
  { id: 185, name: 'Inteleon',   type: ['Water'],            regions: ['Bleak Beach'],        habitats: ['Waterside Dinghy'],     specialty: 'Search',   time: 'Day',     weather: 'Sunny',  desc: 'A sharp-eyed lizard agent perched atop a high mast. It spots distant trouble before anyone else does.' },
  { id: 186, name: 'Quaquaval',  type: ['Water', 'Fighting'],regions: ['Bleak Beach'],        habitats: ['Waterside Dinghy'],     specialty: 'Hype',     time: 'Day',     weather: 'Sunny',  desc: 'A dazzling carnival-dancer that high-kicks across the dock. Its routines whip every onlooker into cheers.' },
  { id: 187, name: 'Sharpedo',   type: ['Water', 'Dark'],    regions: ['Bleak Beach'],        habitats: ['Ocean Tall Grass'],     specialty: 'Bulldoze', time: 'Night',   weather: 'Cloudy', desc: 'A torpedo-fast predator best watched from shore. Its wake bulldozes overgrown seaweed off the reef.' },

  // —— Sparkling Skylands (evolutions & additions) ——
  { id: 188, name: 'Togekiss',   type: ['Fairy', 'Flying'],  regions: ['Sparkling Skylands', 'Palette Town'], habitats: ['Sky Garden', 'Secret Garden'], specialty: 'Hype',     time: 'Day',     weather: 'Sunny',  desc: 'A jubilation Pokémon that arrives where helpers are happiest. Its visit blesses any new garden.' },
  { id: 189, name: 'Clefable',   type: ['Fairy'],            regions: ['Sparkling Skylands', 'Palette Town'], habitats: ['Secret Garden'],        specialty: 'Hype',     time: 'Night',   weather: 'Any',    desc: 'A timid moonlit dancer that prefers hidden meadows. Helpers say its giggle makes wishes come true.' },
  { id: 190, name: 'Ampharos',   type: ['Electric'],         regions: ['Sparkling Skylands'], habitats: ['Hidden Laboratory', 'Sky Garden'], specialty: 'Generate', time: 'Night',   weather: 'Any',    desc: 'A lighthouse on legs whose tail-beam guides night flyers. It runs the lab’s entire array on a quiet hum.' },
  { id: 191, name: 'Drifblim',   type: ['Ghost', 'Flying'],  regions: ['Sparkling Skylands'], habitats: ['Sky Garden'],           specialty: 'Fly',      time: 'Evening', weather: 'Cloudy', desc: 'A great balloon-ghost that ferries heavier cargo. Helpers tether it to railings when the wind is up.' },
  { id: 192, name: 'Altaria',    type: ['Dragon', 'Flying'], regions: ['Sparkling Skylands'], habitats: ['Sky Garden'],           specialty: 'Fly',      time: 'Day',     weather: 'Sunny',  desc: 'Floats on cloud-fluffy wings, humming a soft tune. It tours every island patch checking on the flowers.' },
  { id: 193, name: 'Staraptor',  type: ['Normal', 'Flying'], regions: ['Sparkling Skylands'], habitats: ['Sky Garden'],           specialty: 'Fly',      time: 'Day',     weather: 'Any',    desc: 'A daring flock-leader with a swept crest. It chases off mischievous Drifloons drifting where they shouldn’t.' },
  { id: 194, name: 'Corviknight',type: ['Flying', 'Steel'],  regions: ['Sparkling Skylands', 'Palette Town', 'Rocky Ridges', 'Withered Wasteland'], habitats: ['Sky Garden', 'Construction Site'], specialty: 'Fly',      time: 'Day',     weather: 'Any',    desc: 'A steel-feathered raven the size of a carriage. It carries beams between island work sites in its talons.' },
  { id: 195, name: 'Jumpluff',   type: ['Grass', 'Flying'],  regions: ['Sparkling Skylands'], habitats: ['Sky Garden'],           specialty: 'Grow',     time: 'Day',     weather: 'Sunny',  desc: 'Three fluffballs spinning on every breeze. It pollinates the entire chain of floating planters in a single afternoon.' },
  { id: 196, name: 'Metagross',  type: ['Steel', 'Psychic'], regions: ['Sparkling Skylands'], habitats: ['Hidden Laboratory'],    specialty: 'Build',    time: 'Any',     weather: 'Any',    desc: 'Four legs, four minds, one perfectly engineered builder. Its calculations make the trickiest sky-bridge level.' },
  { id: 197, name: 'Porygon-Z',  type: ['Normal'],           regions: ['Sparkling Skylands'], habitats: ['Hidden Laboratory'],    specialty: 'Generate', time: 'Any',     weather: 'Any',    desc: 'A jittery upgrade of Porygon running experimental code. It compiles new blueprints in a blink.' },
  { id: 198, name: 'Alakazam',   type: ['Psychic'],          regions: ['Sparkling Skylands'], habitats: ['Hidden Laboratory'],    specialty: 'Teleport', time: 'Any',     weather: 'Any',    desc: 'Holds two silver spoons and a thousand-yard stare. It teleports rare components between island labs.' },
  { id: 199, name: 'Gardevoir',  type: ['Psychic', 'Fairy'], regions: ['Sparkling Skylands', 'Palette Town'], habitats: ['Secret Garden'],        specialty: 'Hype',     time: 'Day',     weather: 'Sunny',  desc: 'A serene guardian who shields its chosen helpers from harm. Its presence steadies even the shyest visitors.' },
  { id: 200, name: 'Gallade',    type: ['Psychic', 'Fighting'], regions: ['Sparkling Skylands', 'Palette Town', 'Rocky Ridges'], habitats: ['Secret Garden', 'Mountain Peak'], specialty: 'Chop',     time: 'Day',     weather: 'Sunny',  desc: 'A blade-armed knight of the secret garden. It clears thickets with elegant, exact strokes.' },
  { id: 201, name: 'Whimsicott', type: ['Grass', 'Fairy'],   regions: ['Sparkling Skylands'], habitats: ['Sky Garden'],           specialty: 'Grow',     time: 'Day',     weather: 'Sunny',  desc: 'A mischievous tumbleweed that opens windows on the breeze. It scatters cotton seeds across the meadow.' },
  { id: 202, name: 'Wigglytuff', type: ['Normal', 'Fairy'],  regions: ['Sparkling Skylands'], habitats: ['Sky Garden'],           specialty: 'Hype',     time: 'Any',     weather: 'Any',    desc: 'A bouncy big sister to every Jigglypuff. It runs the island sing-along better than anyone.' },

  // —— Palette Town (evolutions, Eeveelutions & additions) ——
  { id: 203, name: 'Venusaur',   type: ['Grass', 'Poison'],  regions: ['Palette Town', 'Withered Wasteland'],       habitats: ['Garden Habitat', 'Tree-Shaded Tall Grass'], specialty: 'Grow',     time: 'Day',     weather: 'Sunny',  desc: 'A walking flowerbed in full bloom. Its petals release pollen that doubles the size of every nearby planter.' },
  { id: 204, name: 'Vileplume',  type: ['Grass', 'Poison'],  regions: ['Palette Town', 'Withered Wasteland'],       habitats: ['Wildflower Patch'],     specialty: 'Grow',     time: 'Day',     weather: 'Sunny',  desc: 'Wears a giant red blossom like a hat. Its dance puffs spores that wake every dormant seed nearby.' },
  { id: 205, name: 'Victreebel', type: ['Grass', 'Poison'],  regions: ['Palette Town', 'Withered Wasteland'],       habitats: ['Veggie Plot'],          specialty: 'Gather',   time: 'Day',     weather: 'Sunny',  desc: 'A grinning pitcher-plant that snags overripe veggies. It returns them to the compost without a fuss.' },
  { id: 206, name: 'Sunflora',   type: ['Grass'],            regions: ['Palette Town', 'Withered Wasteland'],       habitats: ['Wildflower Patch'],     specialty: 'Generate', time: 'Day',     weather: 'Sunny',  desc: 'Turns to follow the sun all morning. By noon its petals have soaked up enough to power a whole shed.' },
  { id: 207, name: 'Butterfree', type: ['Bug', 'Flying'],    regions: ['Palette Town', 'Withered Wasteland'],       habitats: ['Wildflower Patch', 'Tree-Shaded Tall Grass'], specialty: 'Fly',     time: 'Day',     weather: 'Sunny',  desc: 'Dusts pollen onto every flower it passes. By season’s end the meadow is twice as colorful.' },
  { id: 208, name: 'Beedrill',   type: ['Bug', 'Poison'],    regions: ['Palette Town', 'Withered Wasteland'],       habitats: ['Tree-Shaded Tall Grass'], specialty: 'Gather',  time: 'Day',     weather: 'Sunny',  desc: 'A buzzing yellow squadron that defends its honey-trees. Helpers leave it well alone — and get sweet rewards anyway.' },
  { id: 209, name: 'Vaporeon',   type: ['Water'],            regions: ['Palette Town', 'Bleak Beach'],       habitats: ['Waterside Tall Grass', 'Garden Habitat'], specialty: 'Water',    time: 'Day',     weather: 'Rain',   desc: 'A graceful blue Eeveelution that almost melts into water. It waters fragile flowerbeds with one cool breath.' },
  { id: 210, name: 'Jolteon',    type: ['Electric'],         regions: ['Palette Town', 'Withered Wasteland'],       habitats: ['Wildflower Patch'],     specialty: 'Generate', time: 'Day',     weather: 'Sunny',  desc: 'Bristles with static and runs in lightning loops. A single sprint charges every lantern in the square.' },
  { id: 211, name: 'Flareon',    type: ['Fire'],             regions: ['Palette Town', 'Withered Wasteland'],       habitats: ['Pokémon Center', 'Campfire Ring'], specialty: 'Burn',     time: 'Any',     weather: 'Any',    desc: 'A fluffy ember-tail that curls by the hearth. It keeps the Pokémon Center waiting room toasty year-round.' },
  { id: 212, name: 'Espeon',     type: ['Psychic'],          regions: ['Palette Town'],       habitats: ['Garden Habitat'],       specialty: 'Hype',     time: 'Day',     weather: 'Sunny',  desc: 'A sun-warm psychic Eeveelution that reads moods at a glance. Its forehead jewel glints when the weather turns.' },
  { id: 213, name: 'Umbreon',    type: ['Dark'],             regions: ['Palette Town'],       habitats: ['Garden Habitat'],       specialty: 'Search',   time: 'Night',   weather: 'Any',    desc: 'A moonlit Eeveelution with shining ring-marks. It patrols the garden after dark, eyes glowing softly.' },
  { id: 214, name: 'Leafeon',    type: ['Grass'],            regions: ['Palette Town', 'Withered Wasteland'],       habitats: ['Tree-Shaded Tall Grass'], specialty: 'Grow',     time: 'Day',     weather: 'Sunny',  desc: 'A leaf-fringed Eeveelution that smells of fresh greenery. Its tail-leaves perform photosynthesis as it naps.' },
  { id: 215, name: 'Glaceon',    type: ['Ice'],              regions: ['Palette Town'],       habitats: ['Hydrated Pink Tall Grass'], specialty: 'Water',   time: 'Night',   weather: 'Cloudy', desc: 'A crisp, frost-blue Eeveelution that prefers the chillier corners. Its breath etches lacy patterns on dewy blades.' },
  { id: 216, name: 'Sylveon',    type: ['Fairy'],            regions: ['Palette Town'],       habitats: ['Pokémon Center'],       specialty: 'Hype',     time: 'Any',     weather: 'Any',    desc: 'Wraps its ribbon-feelers around helpers it likes. The Pokémon Center waiting room is never lonely with one nearby.' },
  { id: 217, name: 'Blissey',    type: ['Normal'],           regions: ['Palette Town'],       habitats: ['Pokémon Center'],       specialty: 'Hype',     time: 'Any',     weather: 'Any',    desc: 'Hands out lucky eggs to weary helpers all day long. Its smile alone is half the cure.' },
  { id: 218, name: 'Frosmoth',   type: ['Ice', 'Bug'],       regions: ['Palette Town'],       habitats: ['Hydrated Pink Tall Grass'], specialty: 'Water',   time: 'Night',   weather: 'Cloudy', desc: 'A gentle moth that scatters cool dew with every wing-beat. Pink blossoms it visits last twice as long.' },
  { id: 219, name: 'Dubwool',    type: ['Normal'],           regions: ['Palette Town'],       habitats: ['Garden Habitat'],       specialty: 'Gather',   time: 'Day',     weather: 'Sunny',  desc: 'A great fluffy sheep whose wool helpers harvest by the basket. The town’s softest mulch comes from this one.' },
  { id: 220, name: 'Greedent',   type: ['Normal'],           regions: ['Palette Town', 'Withered Wasteland'],       habitats: ['Tree-Shaded Tall Grass'], specialty: 'Gather',  time: 'Day',     weather: 'Any',    desc: 'Cheeks stuffed past capacity with berries. The town larder’s overflow is entirely its doing.' },
  { id: 221, name: 'Bibarel',    type: ['Normal', 'Water'],  regions: ['Palette Town', 'Bleak Beach', 'Withered Wasteland'],       habitats: ['Veggie Plot', 'Waterside Tall Grass'], specialty: 'Build',    time: 'Day',     weather: 'Any',    desc: 'A diligent beaver-builder whose dams keep the irrigation steady. It chews timber into perfect planks.' },
  { id: 222, name: 'Meganium',   type: ['Grass'],            regions: ['Palette Town'],       habitats: ['Garden Habitat'],       specialty: 'Hype',     time: 'Day',     weather: 'Sunny',  desc: 'Releases a sweet aroma from the petals around its neck. Even the grouchiest helpers turn calm nearby.' },
  { id: 223, name: 'Sceptile',   type: ['Grass'],            regions: ['Palette Town', 'Withered Wasteland'],       habitats: ['Tree-Shaded Tall Grass'], specialty: 'Chop',     time: 'Day',     weather: 'Sunny',  desc: 'A swift forest blade-runner. Its arm-leaves slice fallen logs into perfect lengths.' },
  { id: 224, name: 'Torterra',   type: ['Grass', 'Ground'],  regions: ['Palette Town'],       habitats: ['Garden Habitat'],       specialty: 'Grow',     time: 'Day',     weather: 'Sunny',  desc: 'Carries a whole tree-and-meadow on its back. Smaller Pokémon hitch a ride and tend to mini-gardens of their own.' },
  { id: 225, name: 'Serperior',  type: ['Grass'],            regions: ['Palette Town', 'Withered Wasteland'],       habitats: ['Tree-Shaded Tall Grass'], specialty: 'Grow',     time: 'Day',     weather: 'Sunny',  desc: 'A regal vine-serpent that surveys its garden in silence. Its gaze keeps every weed politely in check.' },
  { id: 226, name: 'Chesnaught', type: ['Grass', 'Fighting'],regions: ['Palette Town', 'Withered Wasteland'],       habitats: ['Tree-Shaded Tall Grass'], specialty: 'Build',   time: 'Day',     weather: 'Any',    desc: 'A spiky-armored knight that shoulders the heaviest beams. Its shell shrugs off falling timber.' },
  { id: 227, name: 'Decidueye',  type: ['Grass', 'Ghost'],   regions: ['Palette Town', 'Withered Wasteland'],       habitats: ['Tree-Shaded Tall Grass'], specialty: 'Search',  time: 'Night',   weather: 'Any',    desc: 'Looses leaf-arrows from a perfect silent stance. It marks distant trail signs for the next morning’s walkers.' },
  { id: 228, name: 'Rillaboom',  type: ['Grass'],            regions: ['Palette Town', 'Withered Wasteland'],       habitats: ['Tree-Shaded Tall Grass'], specialty: 'Hype',    time: 'Day',     weather: 'Sunny',  desc: 'Drums a great log like a stage piece. Every garden plant rocks gently to its beat.' },
  { id: 229, name: 'Meowscarada',type: ['Grass', 'Dark'],    regions: ['Palette Town'],       habitats: ['Garden Habitat'],       specialty: 'Search',   time: 'Night',   weather: 'Cloudy', desc: 'A masked magician-cat that performs nightly slight-of-paw. Lost objects always seem to find their way back.' },
  { id: 230, name: 'Hatterene',  type: ['Psychic', 'Fairy'], regions: ['Palette Town', 'Sparkling Skylands'],       habitats: ['Secret Garden'],        specialty: 'Hype',     time: 'Day',     weather: 'Any',    desc: 'A silent witch of the secret garden. It tolerates noise just long enough to bless a quiet visit.' },

  // —— Tree-Shaded Tall Grass crew (Withered Wasteland — confirmed by Habitat Dex search) ——
  { id: 231, name: 'Scyther',    type: ['Bug', 'Flying'],    regions: ['Withered Wasteland', 'Palette Town'], habitats: ['Tree-Shaded Tall Grass'], specialty: 'Chop',     time: 'Day',     weather: 'Sunny',  desc: 'Slices fallen branches with twin scythes. The tree-shaded grass keeps its blades cool between strokes.' },
  { id: 232, name: 'Scizor',     type: ['Bug', 'Steel'],     regions: ['Withered Wasteland', 'Palette Town'], habitats: ['Tree-Shaded Tall Grass'], specialty: 'Chop',     time: 'Day',     weather: 'Sunny',  desc: 'A crimson armored mantis that snips logs to size. Its pincers spark briefly with every clean cut.' },
  { id: 233, name: 'Pinsir',     type: ['Bug'],              regions: ['Withered Wasteland', 'Palette Town'], habitats: ['Tree-Shaded Tall Grass'], specialty: 'Crush',    time: 'Day',     weather: 'Sunny',  desc: 'Grips fallen logs in massive horns and crushes them flat. The mulch pile beside the tree is its work.' },
  { id: 234, name: 'Heracross',  type: ['Bug', 'Fighting'],  regions: ['Withered Wasteland', 'Palette Town'], habitats: ['Tree-Shaded Tall Grass'], specialty: 'Chop',     time: 'Day',     weather: 'Sunny',  desc: 'Bulldozes tangled brush aside with a single mighty horn. It clears whole paths through the shaded grass.' },
  { id: 235, name: 'Yanma',      type: ['Bug', 'Flying'],    regions: ['Withered Wasteland', 'Bleak Beach', 'Palette Town'], habitats: ['Tree-Shaded Tall Grass', 'Waterside Tall Grass'], specialty: 'Fly',      time: 'Day',     weather: 'Sunny',  desc: 'A red-eyed dragonfly that darts between shaded blades. Its wing-beats cool nearby helpers like a tiny fan.' },
  { id: 236, name: 'Yanmega',    type: ['Bug', 'Flying'],    regions: ['Withered Wasteland', 'Palette Town', 'Sparkling Skylands'], habitats: ['Tree-Shaded Tall Grass', 'Sky Garden'], specialty: 'Fly',      time: 'Day',     weather: 'Sunny',  desc: 'A larger, faster dragonfly that patrols both grass and sky. It carries lightweight tools between distant sites.' },
];

const ALL_REGIONS = Object.keys(REGIONS);

/* ---------- font loader (runs once) ---------- */

function FontLink() {
  return (
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap"
    />
  );
}

/* ---------- habitat info ----------
 * Habitat images are auto-resolved from the habitat name:
 *   habitat name → slugify → /public/habitats/<slug>.jpg
 *
 * To add an image for ANY habitat (even ones not listed below),
 * just save the screenshot as <slug>.jpg in public/habitats/ and
 * it appears automatically. No code change needed.
 *
 * Slug rules: lowercase, accents stripped (Pokémon → pokemon),
 * non-alphanumerics collapsed to single dashes.
 *
 * Optional `image` field lets you override the auto-derived path
 * (e.g. to use .png or .webp instead).
 *
 * Pokopia art is © Nintendo / The Pokémon Company — keep
 * screenshots self-hosted under /public/habitats/.
 */
const BASE = import.meta.env.BASE_URL || '/';

const slugifyHabitat = (s) => s
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const defaultHabitatImage = (habitat) => `${BASE}habitats/${slugifyHabitat(habitat)}.jpg`;

const HABITAT_INFO = {
  'Tall Grass': {
    desc: 'A patch of four grass tiles laid side by side. Pokémon rustle the blades — wade through to coax them into the open.',
  },
  'Tree-Shaded Tall Grass': {
    desc: 'Four patches of tall grass nestled at the base of a large tree. The cool shade draws forest-loving Pokémon like Scyther.',
  },
  'Boulder Tall Grass': {
    desc: 'Four patches of tall grass arranged around a single large boulder. Rock-loving Pokémon scramble across the stone.',
  },
  'Waterside Tall Grass': {
    desc: 'Tall grass planted along the water’s edge. The constant moisture keeps it vivid green and pulls in water-adjacent Pokémon.',
  },
  'Ocean Tall Grass': {
    desc: 'Tall grass sprouting where the land meets the sea. Salt-tolerant Pokémon and tide-watchers gather along the shoreline.',
  },
  'Wildflower Patch': {
    desc: 'A patch of four wildflower blooms gathered together. The bright petals draw pollinators and curious Pokémon alike.',
  },
  'Campfire Ring': {
    desc: 'Three campfires arranged in a cozy ring. Fire types and wanderers gather around the warm glow after sundown.',
  },
  'Mountain Cave': {
    desc: 'A dim cavern carved into the mountainside. Rock and Zubat-kin roost in the quiet, echoing depths.',
  },
  'Mountain Peak': {
    desc: 'A windswept summit far above the treeline. Hardy Pokémon train against the thin, cold air.',
  },
  'Veggie Plot': {
    desc: 'Tilled rows of soil studded with fresh sprouts. Pokémon graze and help tend the rows in turn.',
  },
  'Garden Habitat': {
    desc: 'A tidy garden of trimmed hedges and beds of flowers. Friendly Pokémon love the calm, well-kept space.',
  },
  'Sky Garden': {
    desc: 'A floating garden built atop a Cloud Island. Rare Pokémon found nowhere else drift between its planters.',
  },
  'Construction Site': {
    desc: 'A bustling work site cluttered with scaffolding and beams. Strong, helpful Pokémon pitch in with the heavy lifting.',
  },
  'Waterside Dinghy': {
    desc: 'A small wooden boat moored at the shoreline. Aquatic Pokémon dart around the hull and through the ropes.',
  },
  'Tree-Shaded Pink Tall Grass': {
    desc: 'A leafy tree shading patches of pink tall grass. The soft pink blades draw cheerful, sweet-natured Pokémon.',
  },
  'Hydrated Pink Tall Grass': {
    desc: 'Pink tall grass kept lush by a steady source of water nearby. Pokémon cool off in the dewy blades.',
  },
  'Hidden Laboratory': {
    desc: 'A discreet research lab tucked away from view. Psychic, Steel, and tech-minded Pokémon gather around its humming equipment.',
  },
  'Secret Garden': {
    desc: 'A hidden garden behind a flowered arch. The rarest, most timid Pokémon find sanctuary among the petals.',
  },
  'Pokémon Center': {
    desc: 'A red-roofed building with a healing counter glowing at all hours. Helpers and friendly Pokémon mingle inside.',
  },
};

function HabitatScene({ habitat, accent }) {
  const info = HABITAT_INFO[habitat] || {};
  const imageSrc = info.image || defaultHabitatImage(habitat);
  const [failed, setFailed] = useState(false);
  const showImage = imageSrc && !failed;

  return (
    <div>
      <div style={{
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
        aspectRatio: '16 / 9',
        background: showImage
          ? '#0a0a0f'
          : `linear-gradient(135deg, ${accent}22 0%, #0a0a0f 60%, ${accent}11 100%)`,
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
      }}>
        {showImage ? (
          <img
            src={imageSrc}
            alt={`${habitat} habitat screenshot`}
            loading="lazy"
            decoding="async"
            draggable={false}
            onError={() => setFailed(true)}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none',
            }}
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column',
            gap: 4,
            color: 'rgba(255,255,255,0.45)',
            fontSize: 11,
            letterSpacing: 0.5,
            padding: 16,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 28 }}>🖼️</div>
            <div>Screenshot coming soon</div>
          </div>
        )}
        <div style={{
          position: 'absolute',
          left: 10, bottom: 10,
          fontSize: 11,
          fontWeight: 600,
          color: '#fff',
          letterSpacing: 0.5,
          textShadow: '0 1px 4px rgba(0,0,0,0.7)',
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          padding: '4px 10px',
          borderRadius: 999,
        }}>
          {habitat}
        </div>
      </div>
      {info.desc && (
        <div style={{
          marginTop: 10,
          fontSize: 13,
          lineHeight: 1.55,
          color: 'rgba(255,255,255,0.72)',
        }}>
          {info.desc}
        </div>
      )}
    </div>
  );
}

/* ---------- small components ---------- */

function TypeBadge({ t }) {
  return (
    <span
      style={{
        background: TYPE_COLORS[t] || '#888',
        color: '#fff',
        padding: '2px 10px',
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.5,
        textShadow: '0 1px 2px rgba(0,0,0,0.4)',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      {t}
    </span>
  );
}

function PokemonCard({ p, selected, onSelect, compact }) {
  const region = REGIONS[p.regions[0]];
  const extraRegions = p.regions.length - 1;
  const [hover, setHover] = useState(false);

  const base = {
    borderRadius: compact ? 14 : 16,
    padding: compact ? 12 : 16,
    border: '2px solid',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    WebkitTapHighlightColor: 'transparent',
    background: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.06)',
    transform: 'translateY(0)',
  };

  let style = { ...base };
  if (selected) {
    style.background = `linear-gradient(135deg, ${region.bg} 0%, ${region.accent}55 100%)`;
    style.borderColor = region.accent;
  } else if (hover) {
    style.background = 'rgba(255,255,255,0.08)';
    style.borderColor = `${region.accent}AA`;
    style.transform = 'translateY(-2px)';
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(p)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(p); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onTouchStart={() => setHover(false)}
      style={style}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
          #{String(p.id).padStart(3, '0')}
        </span>
        <span style={{ fontSize: 12, lineHeight: 1, display: 'inline-flex', alignItems: 'center', gap: 4 }} aria-label={p.regions.join(', ')}>
          <span>{region.icon}</span>
          {extraRegions > 0 && (
            <span style={{
              fontSize: 9,
              fontWeight: 700,
              padding: '1px 5px',
              borderRadius: 999,
              background: `${region.accent}33`,
              color: region.accent,
              letterSpacing: 0.3,
            }}>
              +{extraRegions}
            </span>
          )}
        </span>
      </div>
      <div style={{
        position: 'relative',
        height: compact ? 92 : 110,
        marginBottom: 8,
        borderRadius: 12,
        background: `radial-gradient(ellipse at center, ${region.accent}26 0%, transparent 70%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <img
          src={spriteUrl(p.name)}
          alt={p.name}
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none',
          }}
        />
      </div>
      <div style={{ fontSize: compact ? 15 : 16, fontWeight: 700, color: '#fff', marginBottom: 6, fontFamily: 'Outfit, system-ui, sans-serif', letterSpacing: -0.1 }}>
        {p.name}
      </div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
        {p.type.map((t) => <TypeBadge key={t} t={t} />)}
      </div>
      <div style={{ fontSize: compact ? 10.5 : 11, color: region.accent, fontWeight: 500, opacity: 0.85, lineHeight: 1.3, display: 'flex', alignItems: 'baseline', gap: 4, flexWrap: 'wrap' }}>
        <span>{p.habitats[0]}</span>
        {p.habitats.length > 1 && (
          <span style={{
            fontSize: 10,
            padding: '1px 6px',
            borderRadius: 999,
            background: `${region.accent}33`,
            color: region.accent,
            fontWeight: 700,
            letterSpacing: 0.3,
          }}>
            +{p.habitats.length - 1}
          </span>
        )}
      </div>
    </div>
  );
}

function InfoCell({ label, value, accent }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      borderRadius: 10,
      padding: 12,
    }}>
      <div style={{
        fontSize: 10,
        textTransform: 'uppercase',
        color: accent,
        letterSpacing: 1,
        fontWeight: 600,
        marginBottom: 6,
      }}>
        {label}
      </div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
        {value}
      </div>
    </div>
  );
}

function DetailPanel({ p, onClose, isMobile, safeArea }) {
  const region = REGIONS[p.regions[0]];

  const containerOuter = isMobile
    ? {
        position: 'fixed',
        left: 0, right: 0, bottom: 0,
        top: 'auto',
        maxHeight: '88vh',
        zIndex: 50,
        animation: 'slideUp 0.25s ease',
      }
    : {
        maxWidth: 400,
        width: '100%',
        position: 'sticky',
        top: 16,
        order: -1,
      };

  return (
    <>
      {isMobile && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 49,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
          }}
        />
      )}
      <div style={containerOuter}>
        <div
          style={{
            position: 'relative',
            borderRadius: isMobile ? '20px 20px 0 0' : 20,
            padding: isMobile ? '22px 18px' : 28,
            paddingTop: isMobile ? 26 : 28,
            paddingBottom: isMobile ? 22 + safeArea.bottom : 28,
            border: `1px solid ${region.accent}55`,
            background: `linear-gradient(180deg, ${region.bg} 0%, #0a0a0f 100%)`,
            overflow: 'hidden',
            maxHeight: isMobile ? '90vh' : 'none',
            overflowY: isMobile ? 'auto' : 'visible',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* decorative top-right glow */}
          <div style={{
            position: 'absolute',
            top: 0, right: 0,
            width: 200, height: 200,
            background: `radial-gradient(circle at top right, ${region.accent}26, transparent 70%)`,
            pointerEvents: 'none',
          }} />
          {isMobile && (
            <div style={{
              position: 'absolute',
              top: 8, left: '50%', transform: 'translateX(-50%)',
              width: 40, height: 4, borderRadius: 4,
              background: 'rgba(255,255,255,0.18)',
            }} />
          )}

          {/* close */}
          <button
            onClick={onClose}
            aria-label="Close details"
            style={{
              position: 'absolute',
              top: isMobile ? 14 : 16, right: isMobile ? 14 : 16,
              width: isMobile ? 36 : 32, height: isMobile ? 36 : 32,
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255,255,255,0.12)',
              color: '#fff',
              fontSize: 16,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 2,
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            ✕
          </button>

          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'relative',
              height: isMobile ? 170 : 200,
              marginBottom: 12,
              borderRadius: 16,
              background: `radial-gradient(ellipse at center, ${region.accent}33 0%, transparent 70%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <img
                src={spriteUrl(p.name)}
                alt={p.name}
                decoding="async"
                draggable={false}
                onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
                style={{
                  maxWidth: '90%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.5))',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  WebkitTouchCallout: 'none',
                }}
              />
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 13,
              color: 'rgba(255,255,255,0.3)',
              marginBottom: 4,
            }}>
              #{String(p.id).padStart(3, '0')}
            </div>
            <div style={{
              fontSize: isMobile ? 24 : 28,
              fontWeight: 800,
              color: '#fff',
              marginBottom: 10,
              fontFamily: 'Outfit, system-ui, sans-serif',
              lineHeight: 1.1,
            }}>
              {p.name}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
              {p.type.map((t) => <TypeBadge key={t} t={t} />)}
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 12,
              padding: isMobile ? 14 : 16,
              borderLeft: `3px solid ${region.accent}`,
              marginBottom: 16,
              fontSize: isMobile ? 13.5 : 14,
              lineHeight: 1.65,
              color: 'rgba(255,255,255,0.82)',
            }}>
              {p.desc}
            </div>

            {/* Habitat scene banners — one per habitat */}
            <div style={{ marginBottom: 16 }}>
              <div style={{
                fontSize: 10,
                textTransform: 'uppercase',
                color: region.accent,
                letterSpacing: 1,
                fontWeight: 600,
                marginBottom: 6,
              }}>
                {p.habitats.length > 1 ? `Habitats · ${p.habitats.length}` : 'Habitat'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {p.habitats.map((h) => (
                  <HabitatScene key={h} habitat={h} accent={region.accent} />
                ))}
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
            }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <InfoCell
                  label={p.regions.length > 1 ? `Regions · ${p.regions.length}` : 'Region'}
                  value={p.regions.map((r) => `${REGIONS[r].icon} ${r}`).join('  ·  ')}
                  accent={region.accent}
                />
              </div>
              <InfoCell label="Specialty" value={p.specialty} accent={region.accent} />
              <InfoCell label="Time of Day" value={p.time} accent={region.accent} />
              <div style={{ gridColumn: '1 / -1' }}>
                <InfoCell label="Weather" value={p.weather} accent={region.accent} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- main app ---------- */

export default function App() {
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  // Track viewport for iPhone vs iPad/desktop layout
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [safeArea, setSafeArea] = useState({ top: 0, right: 0, bottom: 0, left: 0 });

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);

    // Read CSS env safe-area values via a probe element
    const probe = document.createElement('div');
    probe.style.cssText = `
      position:fixed;visibility:hidden;pointer-events:none;
      top:env(safe-area-inset-top);
      right:env(safe-area-inset-right);
      bottom:env(safe-area-inset-bottom);
      left:env(safe-area-inset-left);
    `;
    document.body.appendChild(probe);
    const cs = getComputedStyle(probe);
    setSafeArea({
      top: parseFloat(cs.top) || 0,
      right: parseFloat(cs.right) || 0,
      bottom: parseFloat(cs.bottom) || 0,
      left: parseFloat(cs.left) || 0,
    });
    document.body.removeChild(probe);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  const isMobile = vw < 768;   // iPhones, including landscape on small iPhones
  const isTablet = vw >= 768 && vw < 1100; // iPad portrait-ish

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return POKEMON.filter((p) => {
      if (regionFilter !== 'All' && !p.regions.includes(regionFilter)) return false;
      if (typeFilter !== 'All' && !p.type.includes(typeFilter)) return false;
      if (q) {
        const hay = (p.name + ' ' + p.habitats.join(' ')).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [search, regionFilter, typeFilter]);

  /* ---------- styles ---------- */

  const root = {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #0a0a0f 0%, #0f0f1a 50%, #0a0a0f 100%)',
    color: '#fff',
    paddingTop: `calc(${isMobile ? 16 : 24}px + ${safeArea.top}px)`,
    paddingBottom: `calc(${isMobile ? 32 : 40}px + ${safeArea.bottom}px)`,
    paddingLeft: `calc(${isMobile ? 14 : 32}px + ${safeArea.left}px)`,
    paddingRight: `calc(${isMobile ? 14 : 32}px + ${safeArea.right}px)`,
    fontFamily: 'Outfit, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  };

  const maxW = { maxWidth: 1280, margin: '0 auto' };

  const pillBase = {
    borderRadius: 20,
    padding: '8px 16px',
    fontSize: 12,
    fontWeight: 600,
    border: '1px solid',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    minHeight: 36,
    fontFamily: 'inherit',
    transition: 'all 0.15s ease',
  };

  function regionPillStyle(name) {
    const active = regionFilter === name;
    if (name === 'All') {
      return {
        ...pillBase,
        background: active ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.04)',
        borderColor: active ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.06)',
        color: active ? '#fff' : 'rgba(255,255,255,0.5)',
      };
    }
    const r = REGIONS[name];
    return {
      ...pillBase,
      background: active ? `${r.accent}38` : 'rgba(255,255,255,0.04)',
      borderColor: active ? r.accent : 'rgba(255,255,255,0.06)',
      color: active ? r.accent : 'rgba(255,255,255,0.5)',
    };
  }

  const inputBase = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    padding: '12px 14px',
    borderRadius: 10,
    /* >=16px prevents iOS zoom-on-focus */
    fontSize: 16,
    fontFamily: 'inherit',
    outline: 'none',
    minHeight: 44,
  };

  const chevron = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'><path fill='none' stroke='%23ffffffaa' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round' d='M3 4.5l3 3 3-3'/></svg>")`;

  return (
    <div style={root}>
      <FontLink />
      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .pill-row::-webkit-scrollbar { display: none; }
        input::placeholder { color: rgba(255,255,255,0.35); }
        select option { background: #14141f; color: #fff; }
      `}</style>

      <div style={maxW}>
        {/* —— Header —— */}
        <div style={{ position: 'relative', textAlign: 'center', marginBottom: isMobile ? 18 : 28 }}>
          <div style={{
            position: 'absolute',
            left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400, height: 200,
            background: 'radial-gradient(ellipse, rgba(199,155,245,0.08), transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative' }}>
            <div style={{
              fontSize: isMobile ? 10 : 12,
              letterSpacing: isMobile ? 3 : 4,
              color: 'rgba(199,155,245,0.6)',
              fontWeight: 600,
              textTransform: 'uppercase',
              marginBottom: isMobile ? 4 : 8,
            }}>
              POKÉMON POKOPIA
            </div>
            <h1 style={{
              fontSize: isMobile ? 26 : 36,
              fontWeight: 900,
              margin: '0 0 6px 0',
              background: 'linear-gradient(135deg, #fff 0%, #c79bf5 50%, #6bcf7f 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.1,
            }}>
              Habitat Pokédex
            </h1>
            <div style={{ fontSize: isMobile ? 12 : 14, color: 'rgba(255,255,255,0.4)' }}>
              Discover where every Pokémon calls home
            </div>
          </div>
        </div>

        {/* —— Region pills (horizontal scroll) —— */}
        <div
          className="pill-row"
          style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            paddingBottom: 4,
            marginBottom: 12,
            scrollbarWidth: 'none',
            marginLeft: -4, marginRight: -4,
            paddingLeft: 4, paddingRight: 4,
          }}
        >
          <button
            type="button"
            onClick={() => setRegionFilter('All')}
            style={regionPillStyle('All')}
          >
            All
          </button>
          {ALL_REGIONS.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setRegionFilter(name)}
              style={regionPillStyle(name)}
            >
              {REGIONS[name].icon} {name}
            </button>
          ))}
        </div>

        {/* —— Search + Type filter —— */}
        <div style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          marginBottom: 14,
        }}>
          <input
            type="text"
            inputMode="search"
            enterKeyHint="search"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="Search Pokémon or habitat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              ...inputBase,
              flex: 2,
              minWidth: 180,
            }}
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              ...inputBase,
              flex: 1,
              minWidth: 120,
              paddingRight: 36,
              backgroundImage: chevron,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
            }}
          >
            <option value="All">All Types</option>
            {ALL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* —— Count line —— */}
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>
          Showing {filtered.length} of {POKEMON.length} Pokémon
        </div>

        {/* —— Main content row —— */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 24,
          flexWrap: 'wrap',
          alignItems: 'flex-start',
        }}>
          {selected && !isMobile && (
            <DetailPanel
              p={selected}
              onClose={() => setSelected(null)}
              isMobile={false}
              safeArea={safeArea}
            />
          )}

          <div style={{
            flex: 1,
            minWidth: isMobile ? 0 : 280,
            width: '100%',
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? 140 : 200}px, 1fr))`,
            gap: isMobile ? 10 : 12,
          }}>
            {filtered.length === 0 ? (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '60px 16px',
                color: 'rgba(255,255,255,0.4)',
                fontSize: 14,
              }}>
                No Pokémon found matching your filters.
              </div>
            ) : (
              filtered.map((p) => (
                <PokemonCard
                  key={p.id}
                  p={p}
                  compact={isMobile}
                  selected={selected && selected.id === p.id}
                  onSelect={(x) => setSelected((prev) => (prev && prev.id === x.id ? null : x))}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* —— Mobile bottom-sheet detail —— */}
      {selected && isMobile && (
        <DetailPanel
          p={selected}
          onClose={() => setSelected(null)}
          isMobile={true}
          safeArea={safeArea}
        />
      )}
    </div>
  );
}
