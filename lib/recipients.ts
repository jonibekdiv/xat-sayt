const EMAIL = /^[^\s@<>,;"]+@[^\s@<>,;"]+\.[^\s@<>,;"]{2,}$/;

export function parseRecipients(input: string): { valid: string[]; invalid: string[] } {
  const seen = new Set<string>();
  const valid: string[] = [];
  const invalid: string[] = [];
  for (const raw of input.split(/[,;\n]+/)) {
    const item = raw.trim();
    if (!item) continue;
    const key = item.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    // \r bo'lsa sarlavha in'ektsiyasi: bunday manzil yaroqsiz
    (EMAIL.test(item) ? valid : invalid).push(item);
  }
  return { valid, invalid };
}
