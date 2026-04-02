/**
 * Mulberry32 PRNG — exact port from the Claude Code binary.
 */
export class Mulberry32 {
  state: number;

  constructor(seed: number) { this.state = seed >>> 0; }

  nextU32(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let t = (this.state ^ (this.state >>> 15)) >>> 0;
    t = Math.imul(t, 1 | this.state) >>> 0;
    t = (t + (Math.imul((t ^ (t >>> 7)) >>> 0, 61 | t) >>> 0)) ^ t;
    return (t ^ (t >>> 14)) >>> 0;
  }

  nextF64(): number { return this.nextU32() / 4294967296; }
}
