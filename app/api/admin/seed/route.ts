import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

const initialCategories = [
    { title: "Smoked Meats & Platters" },
    { title: "Classic Sides" },
    { title: "Sandwiches" },
    { title: "Drinks & Desserts" },
];

const initialMenuItems = [
    {
        name: "BBQ Beef Brisket",
        price: "$18",
        category: "Smoked Meats & Platters",
        description: "Slow-smoked over hardwood for 14 hours till melt-in-your-mouth tender.",
    },
    {
        name: "BBQ Chicken Leg",
        price: "$13",
        category: "Smoked Meats & Platters",
        description: "Glazed and wood-fired chicken leg with rich smoky flavor.",
    },
    {
        name: "1/2 Rack Pork Ribs",
        price: "$20",
        category: "Smoked Meats & Platters",
        description: "Half rack of St. Louis cut pork ribs coated in house dry rub.",
    },
    {
        name: "Full Rack Pork Ribs",
        price: "$35",
        category: "Smoked Meats & Platters",
        description: "Full rack of fall-off-the-bone smoked pork ribs.",
    },
    {
        name: "Pulled Pork Sandwich",
        price: "$16",
        category: "Smoked Meats & Platters",
        description: "Hickory-smoked pulled pork on a toasted brioche bun.",
    },
    {
        name: "Smoked Farmers Sausage",
        price: "$14",
        category: "Smoked Meats & Platters",
        description: "Snap-casing sausage link served with tangy mustard.",
    },
    {
        name: "The Master Combo",
        price: "$55",
        category: "Smoked Meats & Platters",
        description: "Feeds 2. Brisket, pork ribs, sausage link, and two small sides.",
    },
    {
        name: "The Feast Platter",
        price: "$90",
        category: "Smoked Meats & Platters",
        description: "Feeds 4. Full rack of ribs, brisket, chicken legs, sausage and large sides.",
    },

    // Classic Sides
    {
        name: "Coleslaw",
        price: "$6",
        category: "Classic Sides",
        description: "Crispy cabbage tossed in our creamy house dressing.",
    },
    {
        name: "Baked BBQ Beans",
        price: "$5",
        category: "Classic Sides",
        description: "Slow-cooked with brisket burnt ends and sweet molasses.",
    },
    {
        name: "Creamy Mac & Cheese",
        price: "$6",
        category: "Classic Sides",
        description: "Elbow macaroni baked in rich four-cheese blend.",
    },
    {
        name: "Cornbread with Honey Butter",
        price: "$5",
        category: "Classic Sides",
        description: "Warm golden cornbread served with whipped honey butter.",
    },
    {
        name: "French Fries",
        price: "$5",
        category: "Classic Sides",
        description: "Golden crispy fries seasoned with house rub.",
    },
    {
        name: "Smoked BBQ Poutine",
        price: "$12",
        category: "Classic Sides",
        description: "Fries topped with fresh cheese curds, savory gravy, and smoked brisket.",
    },

    // Sandwiches
    {
        name: "Pulled Pork Sandwich",
        price: "$16",
        category: "Sandwiches",
        description: "Piled high with hickory-smoked pulled pork and slaw.",
    },
    {
        name: "Brisket Sandwich",
        price: "$18",
        category: "Sandwiches",
        description: "Sliced smoked brisket topped with house BBQ sauce.",
    },
    {
        name: "Smoked Chicken Sandwich",
        price: "$15",
        category: "Sandwiches",
        description: "Pulled smoked chicken with house sauce on brioche.",
    },

    // Drinks & Desserts
    {
        name: "Sprite",
        price: "$1.50",
        category: "Drinks & Desserts",
        description: "Chilled 355ml can.",
    },
    {
        name: "Fanta",
        price: "$1.50",
        category: "Drinks & Desserts",
        description: "Chilled 355ml can.",
    },
    {
        name: "Coke",
        price: "$1.50",
        category: "Drinks & Desserts",
        description: "Chilled 355ml can.",
    },
    {
        name: "Diet Coke",
        price: "$1.50",
        category: "Drinks & Desserts",
        description: "Chilled 355ml can.",
    },
    {
        name: "Canada Dry Ginger Ale",
        price: "$1.50",
        category: "Drinks & Desserts",
        description: "Chilled 355ml can.",
    },
    {
        name: "Root Beer",
        price: "$1.50",
        category: "Drinks & Desserts",
        description: "Chilled 355ml can.",
    },
];

const initialGalleryPhotos = [
    { caption: "Ribs & Bhajia", src: "/Assets/bbq-ribs-with-bhajia.jpg", rotate: "-rotate-3" },
    { caption: "Bhajia & Chilli Sauce", src: "/Assets/bhajia-with-chilli-sauce.jpg", rotate: "rotate-2" },
    { caption: "Curry & Tortilla Chips", src: "/Assets/curry-with-tortilla-chips.jpg", rotate: "-rotate-1" },
    { caption: "Glazed BBQ Chicken", src: "/Assets/glazed-bbq-chicken.jpg", rotate: "-rotate-2" },
    { caption: "Clean Plate", src: "/Assets/munched.jpg", rotate: "rotate-1" },
    { caption: "Seasoned Rib Racks", src: "/Assets/seasoned-rib-racks-raw.jpg", rotate: "rotate-3" },
    { caption: "Sliced Brisket & Greens", src: "/Assets/sliced-brisket-with-greens.jpg", rotate: "-rotate-2" },
    { caption: "Fresh Tortilla Chips", src: "/Assets/tortilla-chips-prep.jpg", rotate: "-rotate-3" },
];

export async function POST(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const force = searchParams.get("force") === "true";

        let seeded = {
            categories: 0,
            menu: 0,
            gallery: 0,
        };

        // 1. Categories
        const catSnap = await adminDb.collection("categories").get();
        if (catSnap.empty || force) {
            if (force && !catSnap.empty) {
                const batch = adminDb.batch();
                catSnap.docs.forEach((doc) => batch.delete(doc.ref));
                await batch.commit();
            }
            for (const cat of initialCategories) {
                await adminDb.collection("categories").add({
                    title: cat.title,
                    createdAt: new Date().toISOString(),
                });
                seeded.categories++;
            }
        }

        // 2. Menu Items
        const menuSnap = await adminDb.collection("menu").get();
        if (menuSnap.empty || force) {
            if (force && !menuSnap.empty) {
                const batch = adminDb.batch();
                menuSnap.docs.forEach((doc) => batch.delete(doc.ref));
                await batch.commit();
            }
            for (const item of initialMenuItems) {
                await adminDb.collection("menu").add({
                    ...item,
                    createdAt: new Date().toISOString(),
                });
                seeded.menu++;
            }
        }

        // 3. Gallery
        const gallerySnap = await adminDb.collection("gallery").get();
        if (gallerySnap.empty || force) {
            if (force && !gallerySnap.empty) {
                const batch = adminDb.batch();
                gallerySnap.docs.forEach((doc) => batch.delete(doc.ref));
                await batch.commit();
            }
            for (const photo of initialGalleryPhotos) {
                await adminDb.collection("gallery").add({
                    ...photo,
                    createdAt: new Date().toISOString(),
                });
                seeded.gallery++;
            }
        }

        return NextResponse.json({
            success: true,
            message: "Database seeded successfully",
            seeded,
        });
    } catch (error: any) {
        console.error("Error seeding database:", error);
        return NextResponse.json(
            { error: error?.message || "Failed to seed database" },
            { status: 500 }
        );
    }
}
