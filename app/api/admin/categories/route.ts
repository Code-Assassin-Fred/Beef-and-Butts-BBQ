import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";

const defaultCategories = [
    { title: "Smoked Meats & Platters" },
    { title: "Sides & Extras" },
    { title: "Sandwiches" },
    { title: "Drinks & Desserts" },
];

export async function GET() {
    try {
        const snapshot = await adminDb.collection("categories").orderBy("createdAt", "asc").get();
        if (snapshot.empty) {
            // Return default categories if empty
            return NextResponse.json({
                categories: defaultCategories.map((c, i) => ({ id: `default-${i}`, title: c.title })),
                isDefault: true,
            });
        }

        const categories = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
            id: doc.id,
            title: doc.data().title,
            createdAt: doc.data().createdAt,
        }));

        return NextResponse.json({ categories, isDefault: false });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json({ categories: defaultCategories, isDefault: true });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title } = body;

        if (!title || typeof title !== "string" || !title.trim()) {
            return NextResponse.json({ error: "Category title is required." }, { status: 400 });
        }

        const newCategory = {
            title: title.trim(),
            createdAt: new Date().toISOString(),
        };

        const docRef = await adminDb.collection("categories").add(newCategory);
        return NextResponse.json({
            success: true,
            id: docRef.id,
            category: { id: docRef.id, ...newCategory },
        });
    } catch (error) {
        console.error("Error creating category:", error);
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, oldTitle, newTitle } = body;

        if (!id || !newTitle || typeof newTitle !== "string" || !newTitle.trim()) {
            return NextResponse.json({ error: "Category ID and new title are required." }, { status: 400 });
        }

        const trimmedTitle = newTitle.trim();
        await adminDb.collection("categories").doc(id).update({ title: trimmedTitle });

        // Update referencing menu items if oldTitle provided
        if (oldTitle && oldTitle !== trimmedTitle) {
            const menuSnap = await adminDb.collection("menu").where("category", "==", oldTitle).get();
            if (!menuSnap.empty) {
                const batch = adminDb.batch();
                menuSnap.docs.forEach((doc) => {
                    batch.update(doc.ref, { category: trimmedTitle });
                });
                await batch.commit();
            }
        }

        return NextResponse.json({ success: true, message: "Category updated" });
    } catch (error) {
        console.error("Error updating category:", error);
        return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Category ID is required." }, { status: 400 });
        }

        await adminDb.collection("categories").doc(id).delete();
        return NextResponse.json({ success: true, message: "Category deleted" });
    } catch (error) {
        console.error("Error deleting category:", error);
        return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
    }
}
