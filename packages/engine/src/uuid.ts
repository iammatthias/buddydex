export function generateUuid(): string {
  const hex = (): string => Math.floor(Math.random() * 16).toString(16);
  const h = (n: number): string => Array.from({ length: n }, hex).join("");
  return `${h(8)}-${h(4)}-${h(4)}-${h(4)}-${h(12)}`;
}
