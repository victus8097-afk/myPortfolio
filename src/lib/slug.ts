export function generateSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[^\w\s\u0600-\u06FF-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
