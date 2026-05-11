const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no ambiguous chars (0/O, 1/I)

export function generateReferenceNumber(): string {
  const year = new Date().getFullYear()
  let random = ''
  for (let i = 0; i < 6; i++) {
    random += CHARS[Math.floor(Math.random() * CHARS.length)]
  }
  return `NF${year}${random}`
}
