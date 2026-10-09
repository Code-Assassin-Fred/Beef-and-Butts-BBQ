import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";

export async function GET() {
    try {
        const snapshot = await adminDb.collection("quotes").orderBy("createdAt", "desc").get();
        const quotes = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
            id: doc.id,
            ...doc.data(),
        }));
        return NextResponse.json({ quotes });
    } catch (error) {
        console.error("Error fetching quotes:", error);
        return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ error: "ID and status are required." }, { status: 400 });
        }

        await adminDb.collection("quotes").doc(id).update({ status });
        return NextResponse.json({ success: true, message: "Quote status updated" });
    } catch (error) {
        console.error("Error updating quote status:", error);
        return NextResponse.json({ error: "Failed to update quote status" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Quote ID is required." }, { status: 400 });
        }

        await adminDb.collection("quotes").doc(id).delete();
        return NextResponse.json({ success: true, message: "Quote deleted" });
    } catch (error) {
        console.error("Error deleting quote:", error);
        return NextResponse.json({ error: "Failed to delete quote" }, { status: 500 });
    }
}
