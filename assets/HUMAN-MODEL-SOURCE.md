# Human avatar source and license

The rendered human parts now use the MakeHuman hm08 base mesh, not the procedural head and fingers. The model is selected for anatomical facial topology, real skin / eye textures, transparent hair cards, and clear redistribution rights. This is a suitability choice for this web demo, not a claim that it is the best human model available anywhere.

## Primary references

- MakeHuman asset license: https://static.makehumancommunity.org/about/license.html
- Official CC0 system asset catalogue: https://static.makehumancommunity.org/assets/assetpacks/makehuman_system_assets.html
- Official base mesh, targets, eyes and rig: https://github.com/makehumancommunity/makehuman/tree/master/makehuman/data
- CC0 asset snapshot mirror: https://github.com/s20220526/makehuman-assets/tree/8cf9645b975a98eea056b140df11a1d278da0d10
- Alternative considered, Blender Studio human base meshes: https://download.blender.org/demo/asset-bundles/human-base-meshes/

Copyright holders: Data Collection AB, Joel Palmius, Jonas Hauquier / MakeHuman contributors. Asset license: CC0 1.0 Universal. License texts and per-file SHA-256 hashes are retained in `human-source/`. No MakeHuman application code is included.

Skin and hair texture bytes initially acquired from the older upstream mirror were verified against the LFS SHA-256 pointers in the explicit CC0 snapshot above. The OBJ/MHCLO/material files were then obtained from that CC0 snapshot, with their CC0 headers intact. Eyes/base/targets/rig are from the official MakeHuman repository.

## Adaptation

`scripts/build-human.py` applies the adult female shape targets, fits the eye and hair proxies using the MakeHuman vertex references, subdivides exposed skin once with Catmull-Clark, preserves UV seams, and packages an indexed GLB with embedded images. These shape / skin names are asset catalogue names for the chosen reference avatar; the app does not infer race, sex or age from uploaded photos.

Only the head / neck, relaxed hands, eyes, and the two selectable hairstyles are shipped in the runtime component model. Covered torso and legs remain the app's adjustable clothing geometry. The entire original base mesh is retained for reproducible asset preparation. This does not add a skinned skeleton, motion capture, exact face reconstruction, or physical cloth simulation.

The app loads the component model from its own origin, clones meshes for each outfit, and reuses textures. The loader has an explicit loading state and falls back to the old illustration if loading fails. The exporter waits for model loading and includes the active hairstyle and textures in the downloaded GLB.

## Rebuild

Requires Python 3, NumPy and Pillow. Run `python scripts/build-human.py`, then `npm run build`. Normal deployment uses the committed GLB and does not require Python. Regenerate `human-source/manifest.json` if source assets or the baked model change.

This adaptation was created on 2026-10-11, after the original contest deadline.
