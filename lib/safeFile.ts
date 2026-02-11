import fs from "fs/promises";
import path from "path";

/**
 * Atomic write to prevent file corruption:
 * write to temp file, then rename over target.
 */
export async function writeJsonAtomic(filePath: string, data: any) {
  const dir = path.dirname(filePath);
  const base = path.basename(filePath);
  const tmp = path.join(dir, `${base}.tmp`);

  const payload = JSON.stringify(data, null, 2);

  await fs.writeFile(tmp, payload, "utf8");
  await fs.rename(tmp, filePath);
}
