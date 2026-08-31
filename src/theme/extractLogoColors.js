// Samples an uploaded logo image and derives a small brand palette (primary,
// primary-dark, secondary) from its dominant colors. Neutral/background and
// semantic status colors are left at safe defaults — only the brand accents
// are swapped, so readability and success/warning/danger meaning stay intact.

function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('')}`
}

function darken(r, g, b, amount = 0.72) {
  return rgbToHex(Math.round(r * amount), Math.round(g * amount), Math.round(b * amount))
}

function hueDistance(a, b) {
  const [h1] = rgbToHsl(a)
  const [h2] = rgbToHsl(b)
  const d = Math.abs(h1 - h2)
  return Math.min(d, 360 - d)
}

function rgbToHsl([r, g, b]) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  const l = (max + min) / 2
  const d = max - min
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
  if (d !== 0) {
    switch (max) {
      case r:
        h = ((g - b) / d) % 6
        break
      case g:
        h = (b - r) / d + 2
        break
      default:
        h = (r - g) / d + 4
    }
    h *= 60
    if (h < 0) h += 360
  }
  return [h, s, l]
}

export function extractColorsFromImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      try {
        const size = 48
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        ctx.drawImage(img, 0, 0, size, size)
        const { data } = ctx.getImageData(0, 0, size, size)

        const buckets = new Map()
        for (let i = 0; i < data.length; i += 4) {
          const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]]
          if (a < 120) continue
          // Skip near-white and near-black pixels (background/outline noise)
          const brightness = (r + g + b) / 3
          if (brightness > 240 || brightness < 15) continue

          const qr = Math.round(r / 24) * 24
          const qg = Math.round(g / 24) * 24
          const qb = Math.round(b / 24) * 24
          const key = `${qr},${qg},${qb}`
          buckets.set(key, (buckets.get(key) || 0) + 1)
        }

        if (buckets.size === 0) {
          reject(new Error('No usable colors found in this logo.'))
          return
        }

        const sorted = [...buckets.entries()]
          .map(([key, count]) => ({ rgb: key.split(',').map(Number), count }))
          .sort((a, b) => b.count - a.count)

        const primaryRgb = sorted[0].rgb
        const secondaryEntry = sorted.find((c) => hueDistance(c.rgb, primaryRgb) > 25) || sorted[Math.min(1, sorted.length - 1)]
        const secondaryRgb = secondaryEntry.rgb

        resolve({
          'color-primary': rgbToHex(...primaryRgb),
          'color-primary-dark': darken(...primaryRgb),
          'color-secondary': rgbToHex(...secondaryRgb),
        })
      } catch (err) {
        reject(err)
      }
    }
    img.onerror = () => reject(new Error('Could not read the uploaded logo image.'))
    img.src = dataUrl
  })
}
