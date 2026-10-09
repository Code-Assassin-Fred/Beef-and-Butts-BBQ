import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";

export async function GET() {
    try {
        const snapshot = await adminDb.collection("menu").orderBy("createdAt", "asc").get();
        const items = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
            id: doc.id,
            ...doc.data(),
        }));
        return NextResponse.json({ items });
    } catch (error) {
        console.error("Error fetching admin menu items:", error);
        return NextResponse.json({ error: "Failed to fetch menu items" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, price, category, categoryNote } = body;

        if (!name || !price || !category) {
            return NextResponse.json(
                { error: "Name, price, and category are required." },
                { status: 400 }
            );
        }

        const newItem = {
            name: name.trim(),
            price: price.trim().startsWith("$") ? price.trim() : `$${price.trim()}`,
            category: category.trim(),
            categoryNote: categoryNote ? categoryNote.trim() : "",
            createdAt: new Date().toISOString(),
        };

        const docRef = await adminDb.collection("menu").add(newItem);
        return NextResponse.json({ success: true, id: docRef.id, item: { id: docRef.id, ...newItem } });
    } catch (error) {
        console.error("Error creating menu item:", error);
        return NextResponse.json({ error: "Failed to create menu item" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, name, price, category, categoryNote } = body;

        if (!id) {
            return NextResponse.json({ error: "Item ID is required." }, { status: 400 });
        }

        const updateData: Record<string, any> = {};
        if (name) updateData.name = name.trim();
        if (price) updateData.price = price.trim().startsWith("$") ? price.trim() : `$${price.trim()}`;
        if (category) updateData.category = category.trim();
        if (categoryNote !== undefined) updateData.categoryNote = categoryNote.trim();

        await adminDb.collection("menu").doc(id).update(updateData);
        return NextResponse.json({ success: true, message: "Menu item updated" });
    } catch (error) {
        console.error("Error updating menu item:", error);
        return NextResponse.json({ error: "Failed to update menu item" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Item ID is required." }, { status: 400 });
        }

        await adminDb.collection("menu").doc(id).delete();
        return NextResponse.json({ success: true, message: "Menu item deleted" });
    } catch (error) {
        console.error("Error deleting menu item:", error);
        return NextResponse.json({ error: "Failed to delete menu item" }, { status: 500 });
    }
}
