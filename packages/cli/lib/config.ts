import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { homedir } from "os";
import { join, dirname } from "path";

export const CONFIG_PATH: string = join(homedir(), ".claude.json");
export const BACKUP_PATH: string = join(homedir(), ".claude", "buddy-backup.json");

interface ClaudeConfig {
  oauthAccount?: { accountUuid?: string; [key: string]: unknown };
  userID?: string;
  companion?: unknown;
  [key: string]: unknown;
}

interface BackupData {
  originalAccountUuid: string | null;
  originalUserID: string | null;
  backedUpAt: string;
}

export function readJson(path: string): ClaudeConfig | null {
  try {
    return JSON.parse(readFileSync(path, "utf-8")) as ClaudeConfig;
  } catch {
    return null;
  }
}

export function isValidUuid(str: string): boolean {
  return /^[0-9a-f]{32}$/i.test(str.replace(/-/g, ""));
}

export function getRealUserId(): string {
  const backup = readJson(BACKUP_PATH) as unknown as BackupData | null;
  if (backup?.originalAccountUuid) return backup.originalAccountUuid;
  if (backup?.originalUserID) return backup.originalUserID;
  const config = readJson(CONFIG_PATH);
  return config?.oauthAccount?.accountUuid ?? config?.userID ?? "anon";
}

export function getEffectiveUserId(): string {
  const config = readJson(CONFIG_PATH);
  return config?.oauthAccount?.accountUuid ?? config?.userID ?? "anon";
}

export function backup(config: ClaudeConfig): void {
  if (existsSync(BACKUP_PATH)) return;
  const dir = dirname(BACKUP_PATH);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(
    BACKUP_PATH,
    JSON.stringify(
      {
        originalAccountUuid: config.oauthAccount?.accountUuid || null,
        originalUserID: config.userID || null,
        backedUpAt: new Date().toISOString(),
      } satisfies BackupData,
      null,
      2,
    ) + "\n",
  );
}

export function writeConfig(config: ClaudeConfig): void {
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2) + "\n");
}
