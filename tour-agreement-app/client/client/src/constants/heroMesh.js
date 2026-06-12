/** Same layered mesh — Home hero (single layer), footer; keep in sync with nav overlay. */
export const HERO_MESH_LAYERS = `
  radial-gradient(ellipse 90% 70% at 50% -25%, rgba(56, 189, 248, 0.45), transparent 55%),
  radial-gradient(ellipse 55% 45% at 95% 45%, rgba(167, 139, 250, 0.35), transparent 50%),
  radial-gradient(ellipse 50% 45% at 5% 75%, rgba(45, 212, 191, 0.25), transparent 50%),
  radial-gradient(ellipse 45% 35% at 70% 90%, rgba(251, 146, 60, 0.2), transparent 45%),
  radial-gradient(ellipse 40% 30% at 20% 30%, rgba(244, 114, 182, 0.12), transparent 40%)
`

/** Same layout as HERO_MESH_LAYERS, softened for light pages (booking form, etc.). */
export const FORM_MESH_LAYERS = `
  radial-gradient(ellipse 90% 70% at 50% -20%, rgba(56, 189, 248, 0.22), transparent 55%),
  radial-gradient(ellipse 55% 45% at 95% 40%, rgba(167, 139, 250, 0.16), transparent 50%),
  radial-gradient(ellipse 50% 45% at 5% 72%, rgba(45, 212, 191, 0.14), transparent 50%),
  radial-gradient(ellipse 45% 35% at 70% 88%, rgba(251, 146, 60, 0.12), transparent 45%),
  radial-gradient(ellipse 40% 30% at 22% 28%, rgba(244, 114, 182, 0.08), transparent 40%)
`

export const HERO_NOISE_DATA_URL = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`
