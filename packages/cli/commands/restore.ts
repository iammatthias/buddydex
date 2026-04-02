import { existsSync } from "fs";
import { rollBones } from "@buddy/engine";
import {
  CONFIG_PATH,
  BACKUP_PATH,
  readJson,
  getEffectiveUserId,
  writeConfig,
} from "../lib/config.ts";
import { printHeader, printBuddy } from "../lib/format.ts";

interface BackupData {
  originalAccountUuid?: string;
  originalUserID?: string;
}

export default function cmdRestore(): void {
  if (!existsSync(BACKUP_PATH)) {
    console.error(`\n  No backup found at ${BACKUP_PATH}\n`);
    process.exit(1);
  }

  const bk = readJson(BACKUP_PATH) as unknown as BackupData | null;
  const config = readJson(CONFIG_PATH);
  if (!config) {
    console.error(`\n  Cannot read ${CONFIG_PATH}\n`);
    process.exit(1);
  }

  printHeader();

  if (bk?.originalAccountUuid && config.oauthAccount) {
    config.oauthAccount.accountUuid = bk.originalAccountUuid;
    console.log(`\n  Restored oauthAccount.accountUuid`);
  }
  if (bk?.originalUserID) {
    config.userID = bk.originalUserID;
    console.log(`  Restored userID`);
  }

  delete config.companion;
  writeConfig(config);

  const restoredId = getEffectiveUserId();
  const bones = rollBones(restoredId);
  printBuddy("Restored buddy:", bones, restoredId);
  console.log(`\n  Restart Claude Code to get your original buddy back.\n`);
}
