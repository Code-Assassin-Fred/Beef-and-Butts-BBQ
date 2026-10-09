import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { normalizeImageBase64 } from "@/lib/imageUtils";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";

export async function GET() {
    try {
        const snapshot = await adminDb.collection("gallery").orderBy("createdAt", "desc").get();
        const photos = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
            id: doc.id,
            ...doc.data(),
        }));
        return NextResponse.json({ photos });
    } catch (error) {
        console.error("Error fetching gallery items:", error);
        return NextResponse.json({ error: "Failed to fetch gallery items" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { imageBase64, src, caption } = body;

        const rawImage = imageBase64 || src;
        if (!rawImage) {
            return NextResponse.json(
                { error: "Image data (Base64) is required." },
                { status: 400 }
            );
        }

        let finalImageSrc = rawImage;
        if (rawImage.startsWith("data:image/") || rawImage.length > 500) {
            const normalized = normalizeImageBase64(rawImage, 700);
            if (!normalized) {
                return NextResponse.json(
                    { error: "Invalid or oversized Base64 image. Maximum size allowed is 700 KB." },
                    { status: 400 }
                );
            }
            finalImageSrc = normalized;
        }

        const newPhoto = {
            src: finalImageSrc,
            caption: caption ? caption.trim() : "Beef N' Butts BBQ",
            rotate: ["rotate-1", "-rotate-1", "rotate-2", "-rotate-2", "rotate-3", "-rotate-3"][
                Math.floor(Math.random() * 6)
            ],
            createdAt: new Date().toISOString(),
        };

        const docRef = await adminDb.collection("gallery").add(newPhoto);
        return NextResponse.json({
            success: true,
            id: docRef.id,
            photo: { id: docRef.id, ...newPhoto },
        });
    } catch (error) {
        console.error("Error creating gallery photo:", error);
        return NextResponse.json({ error: "Failed to upload gallery photo" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Photo ID is required." }, { status: 400 });
        }

        await adminDb.collection("gallery").doc(id).delete();
        return NextResponse.json({ success: true, message: "Gallery photo deleted" });
    } catch (error) {
        console.error("Error deleting gallery photo:", error);
        return NextResponse.json({ error: "Failed to delete gallery photo" }, { status: 500 });
    }
}
