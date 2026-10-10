import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";

const defaultCategories = [
    {
        title: "Smoked Meats & Platters",
        items: [
            { name: "BBQ Beef Brisket", price: "$18" },
            { name: "BBQ Chicken Leg", price: "$13" },
            { name: "1/2 Rack Pork Ribs", price: "$20" },
            { name: "Full Rack Pork Ribs", price: "$35" },
            { name: "Pulled Pork Sandwich", price: "$16" },
            { name: "Smoked Farmers Sausage", price: "$14" },
            { name: "The Master Combo", price: "$55" },
            { name: "The Feast Platter", price: "$90" },
        ],
    },
    {
        title: "Sides & Extras",
        items: [
            { name: "Coleslaw", price: "$5" },
            { name: "Cornbread", price: "$4" },
            { name: "Baked Beans", price: "$5" },
            { name: "Mac & Cheese", price: "$6" },
            { name: "Pickles & Onions", price: "$3" },
            { name: "Corn on the Cob", price: "$5" },
        ],
    },
    {
        title: "Sandwiches",
        items: [
            { name: "Pulled Pork Sandwich", price: "$16" },
            { name: "Brisket Sandwich", price: "$18" },
            { name: "Smoked Chicken Sandwich", price: "$15" },
        ],
    },
    {
        title: "Drinks & Desserts",
        items: [
            { name: "Sweet Tea", price: "$3" },
            { name: "Lemonade", price: "$3" },
            { name: "Root Beer Float", price: "$5" },
            { name: "Smoked Pecan Pie", price: "$7" },
        ],
    },
];

export async function GET() {
    try {
        const snapshot = await adminDb.collection("menu").orderBy("createdAt", "asc").get();
        if (snapshot.empty) {
            return NextResponse.json({ categories: defaultCategories, isDefault: true });
        }

        const itemsDocs = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
            id: doc.id,
            ...doc.data(),
        }));

        const categoriesMap: Record<string, { title: string; note?: string; items: any[] }> = {};

        itemsDocs.forEach((item: any) => {
            const catTitle = item.category || "General";
            if (!categoriesMap[catTitle]) {
                categoriesMap[catTitle] = {
                    title: catTitle,
                    note: item.categoryNote || undefined,
                    items: [],
                };
            }
            categoriesMap[catTitle].items.push({
                id: item.id,
                name: item.name,
                price: item.price,
                description: item.description || "",
            });
        });

        const categories = Object.values(categoriesMap);
        return NextResponse.json({ categories, items: itemsDocs, isDefault: false });
    } catch (error) {
        console.error("Error fetching menu:", error);
        return NextResponse.json({ categories: defaultCategories, isDefault: true });
    }
}
