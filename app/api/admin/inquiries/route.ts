import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";

export async function GET() {
    try {
        const snapshot = await adminDb.collection("inquiries").orderBy("createdAt", "desc").get();
        const inquiries = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
            id: doc.id,
            ...doc.data(),
        }));
        return NextResponse.json({ inquiries });
    } catch (error) {
        console.error("Error fetching inquiries:", error);
        return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ error: "ID and status are required." }, { status: 400 });
        }

        await adminDb.collection("inquiries").doc(id).update({ status });
        return NextResponse.json({ success: true, message: "Inquiry status updated" });
    } catch (error) {
        console.error("Error updating inquiry status:", error);
        return NextResponse.json({ error: "Failed to update inquiry status" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Inquiry ID is required." }, { status: 400 });
        }

        await adminDb.collection("inquiries").doc(id).delete();
        return NextResponse.json({ success: true, message: "Inquiry deleted" });
    } catch (error) {
        console.error("Error deleting inquiry:", error);
        return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 });
    }
}
