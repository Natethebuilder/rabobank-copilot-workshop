// The planted WGB-101 bug, reproduced for the "Why FR14 failed" slide.
// buggy: r = 0; for each 15-digit chunk c: r = Number(String(r) + c) % 97
// fixed: BigInt(digits) % 97n
export const MAX_SAFE = BigInt(Number.MAX_SAFE_INTEGER)

export const groupIban = (s) => s.replace(/(.{4})/g, '$1 ').trim()

export function analyseIban(input) {
  const iban = String(input || '').replace(/\s+/g, '').toUpperCase()
  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]{4,30}$/.test(iban)) {
    return { error: 'Type an IBAN: two letters, two check digits, then letters and digits.' }
  }
  const rearranged = iban.slice(4) + iban.slice(0, 4)
  const digits = rearranged.replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55))
  const rows = []
  let r = 0
  for (let i = 0; i < digits.length; i += 15) {
    const chunk = digits.slice(i, i + 15)
    const joined = String(r) + chunk
    const exact = BigInt(joined)
    const n = Number(joined)
    const rounded = BigInt(n)
    const next = n % 97
    rows.push({
      prev: r,
      chunk,
      joined,
      exact: exact.toString(),
      number: rounded.toString(),
      length: exact.toString().length,
      unsafe: exact > MAX_SAFE,
      rounded: rounded !== exact,
      next,
      exactNext: Number(exact % 97n),
    })
    r = next
  }
  const fixed = Number(BigInt(digits) % 97n)
  return { iban, rearranged, digits, rows, buggy: r, buggyOk: r === 1, fixed, fixedOk: fixed === 1 }
}
