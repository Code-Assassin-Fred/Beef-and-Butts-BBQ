import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";

const defaultPhotos = [
    { id: "1", src: "/Assets/glazed-bbq-chicken.jpg", caption: "Glazed BBQ Chicken", rotate: "-rotate-3" },
    { id: "2", src: "/Assets/bbq-ribs-with-bhajia.jpg", caption: "BBQ Ribs Platter", rotate: "rotate-2" },
    { id: "3", src: "/Assets/sliced-brisket-with-greens.jpg", caption: "Sliced Brisket with Greens", rotate: "-rotate-2" },
    { id: "4", src: "/Assets/seasoned-rib-racks-raw.jpg", caption: "Seasoned Rib Racks", rotate: "rotate-3" },
    { id: "5", src: "/Assets/curry-with-tortilla-chips.jpg", caption: "Curry with Tortilla Chips", rotate: "-rotate-1" },
    { id: "6", src: "/Assets/bhajia-with-chilli-sauce.jpg", caption: "Bhajia with Chilli Sauce", rotate: "rotate-2" },
    { id: "7", src: "/Assets/tortilla-chips-prep.jpg", caption: "Tortilla Chips Prep", rotate: "-rotate-3" },
    { id: "8", src: "/Assets/munched.jpg", caption: "Munched", rotate: "rotate-1" },
];

export async function GET() {
    try {
        const snapshot = await adminDb.collection("gallery").orderBy("createdAt", "desc").get();
        if (snapshot.empty) {
            return NextResponse.json({ photos: defaultPhotos, isDefault: true });
        }

        const photos = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
            id: doc.id,
            src: doc.data().src || doc.data().imageBase64,
            caption: doc.data().caption,
            rotate: doc.data().rotate || "rotate-1",
            createdAt: doc.data().createdAt,
        }));

        return NextResponse.json({ photos, isDefault: false });
    } catch (error) {
        console.error("Error fetching gallery photos:", error);
        return NextResponse.json({ photos: defaultPhotos, isDefault: true });
    }
}
