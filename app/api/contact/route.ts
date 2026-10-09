import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Name, email, and message are required." },
                { status: 400 }
            );
        }

        const inquiryDoc = {
            name: name.trim(),
            email: email.trim(),
            message: message.trim(),
            status: "unread",
            createdAt: new Date().toISOString(),
        };

        const docRef = await adminDb.collection("inquiries").add(inquiryDoc);

        return NextResponse.json({
            success: true,
            id: docRef.id,
            message: "Inquiry received successfully.",
        });
    } catch (error) {
        console.error("Error creating inquiry:", error);
        return NextResponse.json(
            { error: "Internal server error while saving inquiry." },
            { status: 500 }
        );
    }
}
