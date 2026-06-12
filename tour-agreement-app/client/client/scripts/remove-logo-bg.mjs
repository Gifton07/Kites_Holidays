/**
 * Removes JPEG white background via flood-fill from image edges (keeps white inside the mark).
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")
// Prefer repo-root kites/logo.jpeg; fallback to copied JPEG in public/
const inputFromRepo = path.join(root, "..", "..", "..", "logo.jpeg")
const inputFromPublic = path.join(root, "public", "logo.jpeg")
const inputPath = fs.existsSync(inputFromRepo) ? inputFromRepo : inputFromPublic
const outLogo = path.join(root, "public", "logo.png")
const outFavicon = path.join(root, "public", "favicon-32.png")

function isWhiteish(r, g, b) {
  return r > 232 && g > 232 && b > 232 && (r + g + b) / 3 > 235
}

const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const w = info.width
const h = info.height
const rgba = new Uint8ClampedArray(data)
const bg = new Uint8Array(w * h)

const idx = (x, y) => (y * w + x) * 4
const pidx = (x, y) => y * w + x

const q = []
const pushEdge = (x, y) => {
  const i = idx(x, y)
  if (!isWhiteish(rgba[i], rgba[i + 1], rgba[i + 2])) return
  const pi = pidx(x, y)
  if (bg[pi]) return
  bg[pi] = 1
  q.push([x, y])
}

for (let x = 0; x < w; x++) {
  pushEdge(x, 0)
  pushEdge(x, h - 1)
}
for (let y = 0; y < h; y++) {
  pushEdge(0, y)
  pushEdge(w - 1, y)
}

for (let head = 0; head < q.length; head++) {
  const [x, y] = q[head]
  for (const [dx, dy] of [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ]) {
    const nx = x + dx
    const ny = y + dy
    if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue
    const pi = pidx(nx, ny)
    if (bg[pi]) continue
    const i = idx(nx, ny)
    if (isWhiteish(rgba[i], rgba[i + 1], rgba[i + 2])) {
      bg[pi] = 1
      q.push([nx, ny])
    }
  }
}

for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    if (bg[pidx(x, y)]) {
      const i = idx(x, y)
      rgba[i + 3] = 0
    }
  }
}

const raw = Buffer.from(rgba)
await sharp(raw, { raw: { width: w, height: h, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile(outLogo)

await sharp(outLogo)
  .resize(32, 32, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(outFavicon)

console.log("Wrote:", outLogo, outFavicon)
