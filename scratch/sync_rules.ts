import { initializeApp, cert } from 'firebase-admin/app';
import { getSecurityRules } from 'firebase-admin/security-rules';
import { readFileSync } from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = JSON.parse(
  readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf8')
);

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

initializeApp({
  credential: cert(serviceAccount),
  projectId: firebaseConfig.projectId
});

async function syncRules() {
  try {
    const rules = readFileSync(path.join(process.cwd(), 'firestore.rules'), 'utf8');
    const databaseId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)' 
      ? firebaseConfig.firestoreDatabaseId 
      : undefined;

    console.log(`[Sync] Updating rules for project: ${firebaseConfig.projectId}`);
    console.log(`[Sync] Database: ${databaseId || "(default)"}`);

    const rulesClient = getSecurityRules() as any;
    const ruleset = await rulesClient.createRuleset({
      files: [{ name: 'firestore.rules', content: rules }]
    });
    
    const target = `cloud.firestore${databaseId ? `/${databaseId}` : ''}`;
    await rulesClient.releaseRuleset(target, ruleset.name);
    
    console.log(`[Success] Firestore rules updated successfully for ${target}`);
    process.exit(0);
  } catch (error) {
    console.error(`[Error] Failed to sync rules:`, error);
    process.exit(1);
  }
}

syncRules();
