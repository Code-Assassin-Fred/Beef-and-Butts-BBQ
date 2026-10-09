/**
 * Client-Side Image Compression and Base64 Conversion Utility
 */

export interface CompressImageOptions {
    maxWidth?: number;
    quality?: number;
}

/**
 * Downscales and compresses an image File to a Base64 JPEG data URL.
 * Preserves aspect ratio, fills background with white (#ffffff), and revokes object URL.
 */
export async function compressImageToBase64(
    file: File,
    maxWidth: number = 1200,
    quality: number = 0.72
): Promise<string> {
    if (!file || !file.type.startsWith("image/")) {
        throw new Error("File must be a valid image");
    }

    let objectUrl: string | null = null;

    try {
        objectUrl = URL.createObjectURL(file);
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = (err) => reject(new Error("Failed to load image for compression"));
            image.src = objectUrl!;
        });

        let { width, height } = img;

        if (width > maxWidth || height > maxWidth) {
            if (width > height) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            } else {
                width = Math.round((width * maxWidth) / height);
                height = maxWidth;
            }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
            throw new Error("Could not get 2d canvas context");
        }

        // Fill background with white to handle transparent PNGs nicely
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG Data URL
        const base64DataUrl = canvas.toDataURL("image/jpeg", quality);
        return base64DataUrl;
    } finally {
        if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
        }
    }
}

/**
 * Base64 Normalization and Validation Utility
 * Checks raw binary byte size and returns valid Base64 string or empty string if invalid/oversized.
 */
export function normalizeImageBase64(
    base64String: string,
    maxSizeKB: number = 700
): string {
    if (!base64String || typeof base64String !== "string") {
        return "";
    }

    // Strip header if present
    const matches = base64String.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    const mimeType = matches ? matches[1] : "image/jpeg";
    const rawBase64 = matches ? matches[2] : base64String.replace(/^data:image\/[a-zA-Z+]+;base64,/, "");

    try {
        let byteSize = 0;
        if (typeof window !== "undefined" && typeof window.atob === "function") {
            const binaryString = window.atob(rawBase64);
            byteSize = binaryString.length;
        } else if (typeof Buffer !== "undefined") {
            byteSize = Buffer.from(rawBase64, "base64").length;
        } else {
            // Rough fallback calculation: 4 base64 chars = 3 bytes
            byteSize = Math.floor((rawBase64.length * 3) / 4);
        }

        const maxSizeBytes = maxSizeKB * 1024;
        if (byteSize > maxSizeBytes) {
            console.warn(`Base64 image exceeds maximum size of ${maxSizeKB} KB (Actual: ${Math.round(byteSize / 1024)} KB)`);
            return "";
        }

        return `data:${mimeType};base64,${rawBase64}`;
    } catch (error) {
        console.error("Invalid base64 string:", error);
        return "";
    }
}
