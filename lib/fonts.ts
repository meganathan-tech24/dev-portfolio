import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Archivo for generated images (Open Graph, icons). next/font cannot be used
// there, so the two instances we need are bundled as static TTF files (OFL).
// Read once at module scope; the files do not depend on the request.

export const archivoExpandedExtraBold = await readFile(
  join(process.cwd(), "assets/fonts/Archivo-ExpandedExtraBold.ttf"),
);

export const archivoSemiBold = await readFile(
  join(process.cwd(), "assets/fonts/Archivo-SemiBold.ttf"),
);
