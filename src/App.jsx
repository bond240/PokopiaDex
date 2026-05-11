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
  // Rocky Ridges
  Geodude: 74, Onix: 95, Aron: 304, Larvitar: 246, Roggenrola: 524,
  Machop: 66, Mankey: 56, Zubat: 41, Nosepass: 299, Rockruff: 744,
  Riolu: 447, Mienfoo: 619, Timburr: 532, Bonsly: 438,
  // Bleak Beach
  Magikarp: 129, Krabby: 98, Staryu: 120, Wingull: 278, Tentacool: 72,
  Horsea: 116, Wailmer: 320, Corsola: 222, Mudkip: 258, Psyduck: 54,
  Slowpoke: 79, Buizel: 418, Lapras: 131, Squirtle: 7,
  // Sparkling Skylands
  Pidgey: 16, Togepi: 175, Cleffa: 173, Mareep: 179, Pichu: 172,
  Drifloon: 425, Swablu: 333, Starly: 396, Rookidee: 821, Hoppip: 187,
  Beldum: 374, Porygon: 137, Abra: 63, Ralts: 280,
  // Palette Town
  Bulbasaur: 1, Oddish: 43, Bellsprout: 69, Sunkern: 191, Caterpie: 10,
  Weedle: 13, Pikachu: 25, Eevee: 133, Chansey: 113, Snom: 872,
  Wooloo: 831, Skwovet: 819, Bidoof: 399, Munchlax: 446,
};

/* Pokémon HOME 3D renders — closest free match to Pokopia's 3D-model style. */
const SPRITE_BASE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home';

const spriteUrl = (name) => {
  const id = DEX[name];
  return id ? `${SPRITE_BASE}/${id}.png` : null;
};

/* ---------- pokémon data (70 entries across 5 regions) ---------- */

const POKEMON = [
  // —— Withered Wasteland ——
  { id: 1,  name: 'Cacnea',     type: ['Grass'],            region: 'Withered Wasteland', habitat: 'Wildflower Patch',     specialty: 'Grow',     time: 'Day',     weather: 'Sunny',  desc: 'A spiny cactus dweller that flourishes in dry soil. It helps coax wildflowers back to bloom across the wasteland.' },
  { id: 2,  name: 'Sandshrew',  type: ['Ground'],           region: 'Withered Wasteland', habitat: 'Tall Grass',           specialty: 'Bulldoze', time: 'Day',     weather: 'Sunny',  desc: 'Curls up in dry tall grass during the heat. It loosens packed earth so seeds can finally take root.' },
  { id: 3,  name: 'Trapinch',   type: ['Ground'],           region: 'Withered Wasteland', habitat: 'Boulder Tall Grass',   specialty: 'Crush',    time: 'Day',     weather: 'Sunny',  desc: 'Digs conical pits between sun-bleached boulders. It pulverizes rubble into workable sand.' },
  { id: 4,  name: 'Cubone',     type: ['Ground'],           region: 'Withered Wasteland', habitat: 'Wildflower Patch',     specialty: 'Gather',   time: 'Night',   weather: 'Any',    desc: 'A lonely wanderer of moonlit dunes. It collects bones and stones to mark new growing sites.' },
  { id: 5,  name: 'Numel',      type: ['Fire', 'Ground'],   region: 'Withered Wasteland', habitat: 'Campfire Ring',        specialty: 'Burn',     time: 'Any',     weather: 'Sunny',  desc: 'Lounges by campfires with magma simmering inside its hump. It keeps cookfires lit through long desert nights.' },
  { id: 6,  name: 'Hippopotas', type: ['Ground'],           region: 'Withered Wasteland', habitat: 'Tall Grass',           specialty: 'Bulldoze', time: 'Day',     weather: 'Sunny',  desc: 'Trundles through dust bowls kicking up plumes of sand. It clears wide paths for caravans of helpers.' },
  { id: 7,  name: 'Sandile',    type: ['Ground', 'Dark'],   region: 'Withered Wasteland', habitat: 'Tall Grass',           specialty: 'Search',   time: 'Day',     weather: 'Sunny',  desc: 'Glides just beneath the sand with only its eyes visible. It tracks down lost tools buried by storms.' },
  { id: 8,  name: 'Diglett',    type: ['Ground'],           region: 'Withered Wasteland', habitat: 'Veggie Plot',          specialty: 'Bulldoze', time: 'Any',     weather: 'Any',    desc: 'Pops up wherever the soil is loose enough to till. It aerates new veggie plots overnight.' },
  { id: 9,  name: 'Drilbur',    type: ['Ground'],           region: 'Withered Wasteland', habitat: 'Construction Site',    specialty: 'Build',    time: 'Day',     weather: 'Any',    desc: 'Spins through hardpan like a living drill. It opens foundations for new desert outposts.' },
  { id: 10, name: 'Helioptile', type: ['Electric', 'Normal'], region: 'Withered Wasteland', habitat: 'Wildflower Patch',   specialty: 'Generate', time: 'Day',     weather: 'Sunny',  desc: 'Unfurls solar frills to drink in the harsh sun. It powers tiny irrigation pumps for fragile blooms.' },
  { id: 11, name: 'Maractus',   type: ['Grass'],            region: 'Withered Wasteland', habitat: 'Wildflower Patch',     specialty: 'Grow',     time: 'Day',     weather: 'Sunny',  desc: 'Rattles its spines in a rhythm that wakes seeds. It dances dawn-to-dusk to encourage flowers.' },
  { id: 12, name: 'Darumaka',   type: ['Fire'],             region: 'Withered Wasteland', habitat: 'Campfire Ring',        specialty: 'Burn',     time: 'Day',     weather: 'Sunny',  desc: 'Bounces around the embers warming chilly mornings. It ignites kindling with a single hiccup of flame.' },
  { id: 13, name: 'Vulpix',     type: ['Fire'],             region: 'Withered Wasteland', habitat: 'Tall Grass',           specialty: 'Burn',     time: 'Evening', weather: 'Sunny',  desc: 'Slips through brittle grass with tails flickering. It carefully scorches deadwood to make space for fresh growth.' },
  { id: 14, name: 'Growlithe',  type: ['Fire'],             region: 'Withered Wasteland', habitat: 'Campfire Ring',        specialty: 'Burn',     time: 'Any',     weather: 'Any',    desc: 'Stands watch beside the fire pit, ears pricked. It guards travelers and helps relight stoves on demand.' },

  // —— Rocky Ridges ——
  { id: 15, name: 'Geodude',    type: ['Rock', 'Ground'],   region: 'Rocky Ridges',       habitat: 'Mountain Cave',        specialty: 'Crush',    time: 'Any',     weather: 'Any',    desc: 'Sleeps wedged into cave walls until the morning bell. It crushes ore and rubble for tomorrow’s builders.' },
  { id: 16, name: 'Onix',       type: ['Rock', 'Ground'],   region: 'Rocky Ridges',       habitat: 'Mountain Cave',        specialty: 'Bulldoze', time: 'Any',     weather: 'Any',    desc: 'Tunnels long, twisting passages through the ridge. Its corridors become highways for hauling materials.' },
  { id: 17, name: 'Aron',       type: ['Steel', 'Rock'],    region: 'Rocky Ridges',       habitat: 'Mountain Cave',        specialty: 'Recycle',  time: 'Day',     weather: 'Cloudy', desc: 'Munches abandoned scrap iron deep in the cave. It refines it into nuggets for the smiths upstairs.' },
  { id: 18, name: 'Larvitar',   type: ['Rock', 'Ground'],   region: 'Rocky Ridges',       habitat: 'Boulder Tall Grass',   specialty: 'Crush',    time: 'Day',     weather: 'Sunny',  desc: 'Burrows between boulders nibbling stone for nutrients. Its leavings make excellent gravel.' },
  { id: 19, name: 'Roggenrola', type: ['Rock'],             region: 'Rocky Ridges',       habitat: 'Mountain Cave',        specialty: 'Crush',    time: 'Any',     weather: 'Any',    desc: 'A walking core of compressed energy in the dark. It powers crystal lamps and clears stone debris.' },
  { id: 20, name: 'Machop',     type: ['Fighting'],         region: 'Rocky Ridges',       habitat: 'Mountain Peak',        specialty: 'Build',    time: 'Day',     weather: 'Sunny',  desc: 'Hauls slabs up the ridge for sheer training. It anchors framework beams nobody else can lift.' },
  { id: 21, name: 'Mankey',     type: ['Fighting'],         region: 'Rocky Ridges',       habitat: 'Tree-Shaded Tall Grass', specialty: 'Chop',   time: 'Day',     weather: 'Cloudy', desc: 'Swings from shaded branches in noisy troops. It clears overgrown switchbacks with rapid kicks.' },
  { id: 22, name: 'Zubat',      type: ['Poison', 'Flying'], region: 'Rocky Ridges',       habitat: 'Mountain Cave',        specialty: 'Search',   time: 'Night',   weather: 'Any',    desc: 'Flits through pitch-dark passages by echo. It maps unexplored caverns for the survey team.' },
  { id: 23, name: 'Nosepass',   type: ['Rock'],             region: 'Rocky Ridges',       habitat: 'Mountain Peak',        specialty: 'Search',   time: 'Day',     weather: 'Any',    desc: 'Points its magnetic nose unerringly north. It orients pathfinders lost in cloud-wreathed peaks.' },
  { id: 24, name: 'Rockruff',   type: ['Rock'],             region: 'Rocky Ridges',       habitat: 'Boulder Tall Grass',   specialty: 'Chop',    time: 'Day',     weather: 'Sunny',  desc: 'Bounds between boulders barking at passing helpers. It gnaws fallen branches into kindling.' },
  { id: 25, name: 'Riolu',      type: ['Fighting'],         region: 'Rocky Ridges',       habitat: 'Mountain Peak',        specialty: 'Hype',     time: 'Day',     weather: 'Sunny',  desc: 'Reads moods through its aura. It cheers builders into their second wind on the steep peaks.' },
  { id: 26, name: 'Mienfoo',    type: ['Fighting'],         region: 'Rocky Ridges',       habitat: 'Tree-Shaded Tall Grass', specialty: 'Chop',   time: 'Day',     weather: 'Any',    desc: 'Trains beneath cool, shaded leaves. Each chop of its paw splits a log clean in two.' },
  { id: 27, name: 'Timburr',    type: ['Fighting'],         region: 'Rocky Ridges',       habitat: 'Construction Site',    specialty: 'Build',    time: 'Day',     weather: 'Any',    desc: 'Hauls a square beam everywhere it goes. It frames every new bridge along the ridge road.' },
  { id: 28, name: 'Bonsly',     type: ['Rock'],             region: 'Rocky Ridges',       habitat: 'Boulder Tall Grass',   specialty: 'Gather',   time: 'Day',     weather: 'Sunny',  desc: 'Sheds salty droplets that nourish dry moss. It quietly gathers pebbles to mark safe footing.' },

  // —— Bleak Beach ——
  { id: 29, name: 'Magikarp',   type: ['Water'],            region: 'Bleak Beach',        habitat: 'Waterside Tall Grass', specialty: 'Water',    time: 'Any',     weather: 'Any',    desc: 'Splashes in shallow reeds with hopeful resolve. Its splashes water nearby seedlings just enough.' },
  { id: 30, name: 'Krabby',     type: ['Water'],            region: 'Bleak Beach',        habitat: 'Waterside Dinghy',     specialty: 'Search',   time: 'Day',     weather: 'Sunny',  desc: 'Scuttles among the moored dinghies snipping kelp. It uncovers shells and lost trinkets along the planks.' },
  { id: 31, name: 'Staryu',     type: ['Water'],            region: 'Bleak Beach',        habitat: 'Ocean Tall Grass',     specialty: 'Generate', time: 'Night',   weather: 'Any',    desc: 'Pulses softly between swaying ocean grasses. It powers buoy lamps that guide night fishers home.' },
  { id: 32, name: 'Wingull',    type: ['Water', 'Flying'],  region: 'Bleak Beach',        habitat: 'Waterside Dinghy',     specialty: 'Fly',      time: 'Day',     weather: 'Any',    desc: 'Wheels above the dock chasing breezes. It ferries lightweight parcels from boat to boat.' },
  { id: 33, name: 'Tentacool',  type: ['Water', 'Poison'],  region: 'Bleak Beach',        habitat: 'Ocean Tall Grass',     specialty: 'Litter',   time: 'Any',     weather: 'Cloudy', desc: 'Drifts with the current, tentacles trailing. It collects floating plastic and surrenders it to recyclers.' },
  { id: 34, name: 'Horsea',     type: ['Water'],            region: 'Bleak Beach',        habitat: 'Waterside Dinghy',     specialty: 'Water',    time: 'Day',     weather: 'Any',    desc: 'Anchors itself to mossy rope under a dinghy. It mists nearby reeds to keep them sea-green.' },
  { id: 35, name: 'Wailmer',    type: ['Water'],            region: 'Bleak Beach',        habitat: 'Ocean Tall Grass',     specialty: 'Water',    time: 'Day',     weather: 'Any',    desc: 'Spouts plumes high above the kelp beds. It rains a fine mist that revives parched tidepools.' },
  { id: 36, name: 'Corsola',    type: ['Water', 'Rock'],    region: 'Bleak Beach',        habitat: 'Waterside Tall Grass', specialty: 'Grow',     time: 'Day',     weather: 'Sunny',  desc: 'Grows pink branches from its sturdy shell. It seeds new reefs where the tide pools are healing.' },
  { id: 37, name: 'Mudkip',     type: ['Water'],            region: 'Bleak Beach',        habitat: 'Waterside Tall Grass', specialty: 'Water',    time: 'Any',     weather: 'Rain',   desc: 'Wades in tidewater grass sensing the slightest current. It waters whole flowerbeds before breakfast.' },
  { id: 38, name: 'Psyduck',    type: ['Water'],            region: 'Bleak Beach',        habitat: 'Waterside Tall Grass', specialty: 'Teleport', time: 'Day',     weather: 'Cloudy', desc: 'Stares dazedly at the waves until a headache strikes. When it does, helpful objects appear out of nowhere.' },
  { id: 39, name: 'Slowpoke',   type: ['Water', 'Psychic'], region: 'Bleak Beach',        habitat: 'Waterside Tall Grass', specialty: 'Search',   time: 'Any',     weather: 'Any',    desc: 'Dangles its tail in the shallows for hours. It eventually fishes up exactly the item you needed.' },
  { id: 40, name: 'Buizel',     type: ['Water'],            region: 'Bleak Beach',        habitat: 'Waterside Dinghy',     specialty: 'Water',    time: 'Day',     weather: 'Sunny',  desc: 'Inflates its flotation collar to tow the dinghies. It also turns waterwheels for the seaside mill.' },
  { id: 41, name: 'Lapras',     type: ['Water', 'Ice'],     region: 'Bleak Beach',        habitat: 'Ocean Tall Grass',     specialty: 'Fly',      time: 'Day',     weather: 'Any',    desc: 'A gentle ferry across the cold ocean grass. It carries crews to the offshore construction site.' },
  { id: 42, name: 'Squirtle',   type: ['Water'],            region: 'Bleak Beach',        habitat: 'Waterside Dinghy',     specialty: 'Water',    time: 'Any',     weather: 'Sunny',  desc: 'Climbs onto a sun-warmed dinghy to nap. It blasts water on command to scrub salt from the deck.' },

  // —— Sparkling Skylands ——
  { id: 43, name: 'Pidgey',     type: ['Normal', 'Flying'], region: 'Sparkling Skylands', habitat: 'Sky Garden',           specialty: 'Fly',      time: 'Day',     weather: 'Sunny',  desc: 'Coasts the updrafts circling the floating gardens. It scouts new island patches for planters.' },
  { id: 44, name: 'Togepi',     type: ['Fairy'],            region: 'Sparkling Skylands', habitat: 'Secret Garden',        specialty: 'Hype',     time: 'Day',     weather: 'Sunny',  desc: 'A pocketful of luck waddles among the petals. Its presence lifts spirits across the whole island.' },
  { id: 45, name: 'Cleffa',     type: ['Fairy'],            region: 'Sparkling Skylands', habitat: 'Sky Garden',           specialty: 'Hype',     time: 'Night',   weather: 'Any',    desc: 'Bounces in starlit circles between drifting clouds. It choreographs late-night dances for the helpers.' },
  { id: 46, name: 'Mareep',     type: ['Electric'],         region: 'Sparkling Skylands', habitat: 'Sky Garden',           specialty: 'Generate', time: 'Day',     weather: 'Sunny',  desc: 'Grazes the cloud-meadows storing static in its fleece. A pat from a helper charges a whole lantern.' },
  { id: 47, name: 'Pichu',      type: ['Electric'],         region: 'Sparkling Skylands', habitat: 'Sky Garden',           specialty: 'Generate', time: 'Day',     weather: 'Sunny',  desc: 'Sparks adorably whenever it tries to talk. It runs tiny lights along the garden trellises.' },
  { id: 48, name: 'Drifloon',   type: ['Ghost', 'Flying'],  region: 'Sparkling Skylands', habitat: 'Sky Garden',           specialty: 'Fly',      time: 'Evening', weather: 'Cloudy', desc: 'Tethers itself to railings until needed. It floats fragile pots between island terraces.' },
  { id: 49, name: 'Swablu',     type: ['Normal', 'Flying'], region: 'Sparkling Skylands', habitat: 'Sky Garden',           specialty: 'Fly',      time: 'Day',     weather: 'Sunny',  desc: 'Trails cottony wings as it loops the sky. It dusts pollen across distant flowerbeds.' },
  { id: 50, name: 'Starly',     type: ['Normal', 'Flying'], region: 'Sparkling Skylands', habitat: 'Sky Garden',           specialty: 'Fly',      time: 'Day',     weather: 'Any',    desc: 'Lives in chattering flocks above the meadows. It signals weather changes to the gardeners below.' },
  { id: 51, name: 'Rookidee',   type: ['Flying'],           region: 'Sparkling Skylands', habitat: 'Sky Garden',           specialty: 'Fly',      time: 'Day',     weather: 'Sunny',  desc: 'A brave little courier hopping cloud to cloud. It will challenge anything that ruffles its garden.' },
  { id: 52, name: 'Hoppip',     type: ['Grass', 'Flying'],  region: 'Sparkling Skylands', habitat: 'Sky Garden',           specialty: 'Grow',     time: 'Day',     weather: 'Sunny',  desc: 'Drifts wherever the breeze takes it. It spreads seeds across every floating planter on the way.' },
  { id: 53, name: 'Beldum',     type: ['Steel', 'Psychic'], region: 'Sparkling Skylands', habitat: 'Hidden Laboratory',    specialty: 'Build',    time: 'Any',     weather: 'Any',    desc: 'Hovers patiently among gleaming benches. It assembles delicate frameworks with magnetic precision.' },
  { id: 54, name: 'Porygon',    type: ['Normal'],           region: 'Sparkling Skylands', habitat: 'Hidden Laboratory',    specialty: 'Generate', time: 'Any',     weather: 'Any',    desc: 'A polygonal helper that lives in the lab’s mainframe. It compiles blueprints for the rest of the team.' },
  { id: 55, name: 'Abra',       type: ['Psychic'],          region: 'Sparkling Skylands', habitat: 'Hidden Laboratory',    specialty: 'Teleport', time: 'Any',     weather: 'Any',    desc: 'Sleeps almost all day inside the lab. When awake, it teleports tools wherever they’re needed instantly.' },
  { id: 56, name: 'Ralts',      type: ['Psychic', 'Fairy'], region: 'Sparkling Skylands', habitat: 'Secret Garden',        specialty: 'Hype',     time: 'Day',     weather: 'Sunny',  desc: 'Senses the emotions of every island visitor. It guides anxious newcomers gently into the secret garden.' },

  // —— Palette Town ——
  { id: 57, name: 'Bulbasaur',  type: ['Grass', 'Poison'],  region: 'Palette Town',       habitat: 'Garden Habitat',       specialty: 'Grow',     time: 'Day',     weather: 'Sunny',  desc: 'Bathes its bulb in the morning sun. It seeds whole flowerbeds in a single afternoon.' },
  { id: 58, name: 'Oddish',     type: ['Grass', 'Poison'],  region: 'Palette Town',       habitat: 'Garden Habitat',       specialty: 'Grow',     time: 'Night',   weather: 'Rain',   desc: 'Buries itself by day and dances by night. Wherever it dances, new sprouts appear by dawn.' },
  { id: 59, name: 'Bellsprout', type: ['Grass', 'Poison'],  region: 'Palette Town',       habitat: 'Veggie Plot',          specialty: 'Grow',     time: 'Day',     weather: 'Sunny',  desc: 'Sways like a stalk in the breeze among the rows. It speeds along the ripening of every veggie.' },
  { id: 60, name: 'Sunkern',    type: ['Grass'],            region: 'Palette Town',       habitat: 'Wildflower Patch',     specialty: 'Grow',     time: 'Day',     weather: 'Sunny',  desc: 'A tiny seed that hardly moves all day. Beneath it, the soil quietly grows richer.' },
  { id: 61, name: 'Caterpie',   type: ['Bug'],              region: 'Palette Town',       habitat: 'Tree-Shaded Tall Grass', specialty: 'Gather',  time: 'Day',     weather: 'Any',    desc: 'Inches along leafy stems collecting tender shoots. It bundles them neatly for the gardeners.' },
  { id: 62, name: 'Weedle',     type: ['Bug', 'Poison'],    region: 'Palette Town',       habitat: 'Tree-Shaded Tall Grass', specialty: 'Gather',  time: 'Day',     weather: 'Any',    desc: 'A careful forager with a stinger to match. It clips ripe berries without bruising a one.' },
  { id: 63, name: 'Pikachu',    type: ['Electric'],         region: 'Palette Town',       habitat: 'Tree-Shaded Pink Tall Grass', specialty: 'Generate', time: 'Day', weather: 'Sunny',  desc: 'Loves the pink-tinged grass best of all. A tail-wag from this one lights the whole town square.' },
  { id: 64, name: 'Eevee',      type: ['Normal'],           region: 'Palette Town',       habitat: 'Pokémon Center',       specialty: 'Hype',     time: 'Any',     weather: 'Any',    desc: 'Greets every visitor at the Pokémon Center door. Its tail-wag is rumored to cure homesickness.' },
  { id: 65, name: 'Chansey',    type: ['Normal'],           region: 'Palette Town',       habitat: 'Pokémon Center',       specialty: 'Hype',     time: 'Any',     weather: 'Any',    desc: 'Doles out lucky eggs to weary helpers. Its smile alone seems to mend a rough day.' },
  { id: 66, name: 'Snom',       type: ['Ice', 'Bug'],       region: 'Palette Town',       habitat: 'Hydrated Pink Tall Grass', specialty: 'Water', time: 'Night',   weather: 'Rain',   desc: 'Curls in cool dew between blades of pink grass. It drips meltwater that nurtures rare blooms.' },
  { id: 67, name: 'Wooloo',     type: ['Normal'],           region: 'Palette Town',       habitat: 'Garden Habitat',       specialty: 'Gather',   time: 'Day',     weather: 'Sunny',  desc: 'Rolls through the garden trimming overgrown grass. Its wool drops become soft mulch for new beds.' },
  { id: 68, name: 'Skwovet',    type: ['Normal'],           region: 'Palette Town',       habitat: 'Tree-Shaded Tall Grass', specialty: 'Gather',  time: 'Day',     weather: 'Any',    desc: 'Cheeks bulging with stashed berries year-round. It tops up the town larder without being asked.' },
  { id: 69, name: 'Bidoof',     type: ['Normal'],           region: 'Palette Town',       habitat: 'Veggie Plot',          specialty: 'Chop',     time: 'Day',     weather: 'Any',    desc: 'A cheerful little builder with strong teeth. It gnaws timber to size for every fence post in town.' },
  { id: 70, name: 'Munchlax',   type: ['Normal'],           region: 'Palette Town',       habitat: 'Tree-Shaded Pink Tall Grass', specialty: 'Recycle', time: 'Any', weather: 'Any',   desc: 'Will eat almost any leftover offered. It composts the rest into rich soil for the pink-grass meadows.' },
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

/* ---------- habitat screenshots ----------
 * Map a habitat name to a screenshot URL from the game.
 * Pokopia art is © Nintendo / The Pokémon Company — hot-linked from
 * publicly hosted sources. Replace or self-host these URLs as needed.
 * When a habitat is missing or its image fails to load, the renderer
 * falls back to a clean gradient placeholder with the habitat name.
 */
const HABITAT_IMAGES = {
  // Example: 'Tall Grass': 'https://example.com/tall-grass.jpg',
};

function HabitatScene({ habitat, accent }) {
  const url = HABITAT_IMAGES[habitat];
  const [failed, setFailed] = useState(false);
  const showImage = url && !failed;

  return (
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
          src={url}
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
          color: 'rgba(255,255,255,0.35)',
          fontSize: 12,
          letterSpacing: 0.5,
        }}>
          No screenshot yet
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
  const region = REGIONS[p.region];
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
        <span style={{ fontSize: 12, lineHeight: 1 }} aria-label={p.region}>{region.icon}</span>
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
      <div style={{ fontSize: compact ? 10.5 : 11, color: region.accent, fontWeight: 500, opacity: 0.85, lineHeight: 1.3 }}>
        {p.habitat}
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
  const region = REGIONS[p.region];

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

            {/* Habitat scene banner */}
            <div style={{ marginBottom: 16 }}>
              <div style={{
                fontSize: 10,
                textTransform: 'uppercase',
                color: region.accent,
                letterSpacing: 1,
                fontWeight: 600,
                marginBottom: 6,
              }}>
                Habitat
              </div>
              <HabitatScene habitat={p.habitat} accent={region.accent} />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
            }}>
              <InfoCell label="Region" value={`${region.icon} ${p.region}`} accent={region.accent} />
              <InfoCell label="Specialty" value={p.specialty} accent={region.accent} />
              <InfoCell label="Time of Day" value={p.time} accent={region.accent} />
              <InfoCell label="Weather" value={p.weather} accent={region.accent} />
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
      if (regionFilter !== 'All' && p.region !== regionFilter) return false;
      if (typeFilter !== 'All' && !p.type.includes(typeFilter)) return false;
      if (q) {
        const hay = (p.name + ' ' + p.habitat).toLowerCase();
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
