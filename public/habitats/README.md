# Habitat screenshots

Drop screenshots in this folder and they appear automatically. **No
code change needed per file** — the renderer derives the expected
filename from the habitat name via this slug rule:

> lowercase → strip accents (`é` → `e`) → replace anything that isn't
> a letter or digit with a single `-` → trim leading/trailing dashes
> → append `.jpg`

## Examples

| Habitat name                  | Filename to save              |
| ----------------------------- | ----------------------------- |
| Tall Grass                    | `tall-grass.jpg`              |
| Tree-Shaded Tall Grass        | `tree-shaded-tall-grass.jpg`  |
| Boulder-Shaded Tall Grass     | `boulder-shaded-tall-grass.jpg` |
| Elevated Tall Grass           | `elevated-tall-grass.jpg`     |
| Smooth Tall Grass             | `smooth-tall-grass.jpg`       |
| Marshy Tall Grass             | `marshy-tall-grass.jpg`       |
| Wildflower Patch              | `wildflower-patch.jpg`        |
| Flower Garden                 | `flower-garden.jpg`           |
| Field of Flowers              | `field-of-flowers.jpg`        |
| Campsite                      | `campsite.jpg`                |
| Pokémon Center                | `pokemon-center.jpg`          |
| Sky Garden                    | `sky-garden.jpg`              |

## Workflow for the Polygon (or any guide) screenshots

1. Open the article in your browser.
2. For each habitat image: **right-click → Save Image As…**
3. Save into this folder using the slug rule above (e.g. `marshy-tall-grass.jpg`).
4. `git add public/habitats/*.jpg && git commit -m "Add habitat
   screenshots" && git push` — the Pages workflow redeploys.

## Notes

- **Extension**: `.jpg` is the default. If you save as `.png` or
  `.webp` instead, you can override per-habitat in `src/App.jsx`
  `HABITAT_INFO` with an explicit `image: '/habitats/foo.png'` field.
- **Aspect ratio**: any size works (the renderer crops 16:9 cover),
  but ~1280×720 keeps the bundle reasonable.
- **Partial coverage is fine**: missing files fall back to a clean
  gradient placeholder + the habitat description text.
- **Copyright**: these are © Nintendo / The Pokémon Company. Self-
  hosting keeps them off third-party CDNs that block hot-linking,
  but is still fan-use only.
- **Adding new habitats to the data**: if you want to use habitat
  names not in `HABITAT_INFO`, the image still resolves
  automatically — but you'll get the banner without a description
  paragraph. Add a `'<Habitat Name>': { desc: '...' }` entry to
  include one.
