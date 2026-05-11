# Habitat screenshots

Drop one screenshot per habitat in this folder. Filenames must match
exactly (case-sensitive on the deployed server):

| Filename                            | Habitat                       |
| ----------------------------------- | ----------------------------- |
| tall-grass.jpg                      | Tall Grass                    |
| tree-shaded-tall-grass.jpg          | Tree-Shaded Tall Grass        |
| boulder-tall-grass.jpg              | Boulder Tall Grass            |
| waterside-tall-grass.jpg            | Waterside Tall Grass          |
| ocean-tall-grass.jpg                | Ocean Tall Grass              |
| wildflower-patch.jpg                | Wildflower Patch              |
| campfire-ring.jpg                   | Campfire Ring                 |
| mountain-cave.jpg                   | Mountain Cave                 |
| mountain-peak.jpg                   | Mountain Peak                 |
| veggie-plot.jpg                     | Veggie Plot                   |
| garden-habitat.jpg                  | Garden Habitat                |
| sky-garden.jpg                      | Sky Garden                    |
| construction-site.jpg               | Construction Site             |
| waterside-dinghy.jpg                | Waterside Dinghy              |
| tree-shaded-pink-tall-grass.jpg     | Tree-Shaded Pink Tall Grass   |
| hydrated-pink-tall-grass.jpg        | Hydrated Pink Tall Grass      |
| hidden-laboratory.jpg               | Hidden Laboratory             |
| secret-garden.jpg                   | Secret Garden                 |
| pokemon-center.jpg                  | Pokémon Center                |

Notes:

- Recommended size: 16:9, ~1280×720 (will be displayed as cover at
  any size). The renderer crops to fill, so center the subject.
- `.jpg`, `.png`, `.webp` all work — just match the extension you
  use here with the one referenced in `src/App.jsx` (`HABITAT_INFO`).
- Missing files fall back to a clean gradient placeholder + the
  habitat description, so partial coverage is fine.
- These are © Nintendo / The Pokémon Company. Self-hosting here
  keeps them off third-party CDNs that block hot-linking, but is
  still fan-use only.
