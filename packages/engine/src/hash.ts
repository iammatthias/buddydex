/**
 * Hash — uses Bun.hash() when available (native Wyhash),
 * falls back to @zig-wasm/hash (identical Zig Wyhash via WASM).
 * Both produce identical results.
 */

let _wyhashSync: ((buf: Uint8Array, seed: bigint) => bigint) | null = null;
let _initPromise: Promise<void> | null = null;

async function ensureWyhash(): Promise<void> {
  if (_wyhashSync) return;
  if (!_initPromise) {
    _initPromise = import("@zig-wasm/hash").then(async (mod: any) => {
      await mod.init();
      _wyhashSync = mod.wyhashSync;
    });
  }
  await _initPromise;
}

const _encoder = new TextEncoder();

function wyhashFallback(str: string): number {
  const buf = _encoder.encode(str);
  const raw = _wyhashSync!(buf, 0n);
  return Number(BigInt.asUintN(64, raw) & 0xffffffffn);
}

/**
 * Initialize the WASM hash module. Must be called once before hashString()
 * when running outside Bun (browser, Node). No-op under Bun.
 */
export async function initHash(): Promise<void> {
  if (typeof globalThis.Bun !== "undefined") return;
  await ensureWyhash();
}

/**
 * Hash a string with Wyhash, truncated to u32.
 */
export function hashString(str: string): number {
  if (typeof globalThis.Bun !== "undefined") {
    return Number(BigInt(Bun.hash(str)) & 0xffffffffn);
  }

  if (!_wyhashSync) {
    throw new Error("Hash not initialized. Call initHash() first.");
  }

  return wyhashFallback(str);
}
