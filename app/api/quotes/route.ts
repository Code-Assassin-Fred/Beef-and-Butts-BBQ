import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { eventType, guestCount, eventDate, name, email, phone, details } = body;

        if (!name || !email || !phone) {
            return NextResponse.json(
                { error: "Name, email, and phone are required." },
                { status: 400 }
            );
        }

        const quoteDoc = {
            eventType: eventType || "General",
            guestCount: guestCount || "",
            eventDate: eventDate || "",
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            details: details ? details.trim() : "",
            status: "pending",
            createdAt: new Date().toISOString(),
        };

        const docRef = await adminDb.collection("quotes").add(quoteDoc);

        return NextResponse.json({
            success: true,
            id: docRef.id,
            message: "Quote request submitted successfully.",
        });
    } catch (error) {
        console.error("Error creating quote:", error);
        return NextResponse.json(
            { error: "Internal server error while saving quote request." },
            { status: 500 }
        );
    }
}
