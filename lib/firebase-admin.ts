import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore, FieldValue } from "firebase-admin/firestore";

function initApp(): App {
    if (getApps().length > 0) {
        return getApps()[0];
    }

    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

    let rawKey = process.env.FIREBASE_PRIVATE_KEY_BASE64
        ? Buffer.from(process.env.FIREBASE_PRIVATE_KEY_BASE64.trim(), "base64").toString("utf-8").trim()
        : process.env.FIREBASE_PRIVATE_KEY?.trim();

    if (rawKey?.startsWith('"') && rawKey?.endsWith('"')) {
        rawKey = rawKey.slice(1, -1);
    }
    if (rawKey?.startsWith("'") && rawKey?.endsWith("'")) {
        rawKey = rawKey.slice(1, -1);
    }

    const privateKey = rawKey?.replace(/\\\\n/g, "\n").replace(/\\n/g, "\n");

    const storageBucket =
        process.env.FIREBASE_STORAGE_BUCKET ||
        process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
        `${projectId}.appspot.com`;

    if (projectId && clientEmail && privateKey) {
        try {
            return initializeApp({
                credential: cert({
                    projectId,
                    clientEmail,
                    privateKey,
                }),
                storageBucket,
            });
        } catch (error) {
            console.error("Failed to initialize Firebase Admin with credentials:", error);
        }
    }

    return initializeApp({
        projectId: projectId || "beef-and-butts-bbq",
        storageBucket,
    });
}

export const app = initApp();

export const adminDb: Firestore = getFirestore(app);
export { FieldValue };

export function getAdminAuth() {
    // Lazy load auth module only if invoked
    const { getAuth } = require("firebase-admin/auth");
    return getAuth(app);
}

export function getAdminStorage() {
    // Lazy load storage module only if invoked
    const { getStorage } = require("firebase-admin/storage");
    return getStorage(app);
}

try {
    const dbWithSettings = adminDb as unknown as {
        settings?: (settings: { ignoreUndefinedProperties: boolean }) => void;
    };
    dbWithSettings.settings?.({ ignoreUndefinedProperties: true });
} catch {
    // No-op
}
