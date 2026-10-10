"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { compressImageToBase64 } from "@/lib/imageUtils";
import { Anton, Great_Vibes, Montserrat } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";

const scriptFont = Great_Vibes({ subsets: ["latin"], weight: "400" });
const displayFont = Anton({ subsets: ["latin"], weight: "400" });
const bodyFont = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

type TabType = "overview" | "menu" | "categories" | "gallery" | "inquiries" | "quotes" | "orders";

type ConfirmState = {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
};

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>("overview");

    // Data States
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [galleryPhotos, setGalleryPhotos] = useState<any[]>([]);
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [quotes, setQuotes] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(false);

    // Form States
    const [showMenuModal, setShowMenuModal] = useState(false);
    const [menuForm, setMenuForm] = useState({ id: "", name: "", price: "", category: "Smoked Meats & Platters", description: "" });

    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [categoryForm, setCategoryForm] = useState({ id: "", oldTitle: "", title: "" });

    const [showGalleryModal, setShowGalleryModal] = useState(false);
    const [galleryCaption, setGalleryCaption] = useState("");
    const [imageBase64, setImageBase64] = useState("");
    const [compressing, setCompressing] = useState(false);
    const [uploadError, setUploadError] = useState("");

    const [confirmModal, setConfirmModal] = useState<ConfirmState | null>(null);

    // Auth listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                router.push("/admin-bnb/login");
            } else {
                setUser(currentUser);
            }
            setLoadingAuth(false);
        });
        return () => unsubscribe();
    }, [router]);

    const fetchAllAdminData = async () => {
        setLoadingData(true);
        try {
            const fetchOpts = { cache: 'no-store' as RequestCache };
            const [menuRes, catRes, galleryRes, inqRes, quoteRes, orderRes] = await Promise.all([
                fetch("/api/admin/menu", fetchOpts),
                fetch("/api/admin/categories", fetchOpts),
                fetch("/api/admin/gallery", fetchOpts),
                fetch("/api/admin/inquiries", fetchOpts),
                fetch("/api/admin/quotes", fetchOpts),
                fetch("/api/admin/orders", fetchOpts),
            ]);

            if (menuRes.ok) {
                const data = await menuRes.json();
                setMenuItems(data.items || []);
            }
            if (catRes.ok) {
                const data = await catRes.json();
                setCategories(data.categories || []);
                if (data.categories && data.categories.length > 0 && !menuForm.category) {
                    setMenuForm((prev) => ({ ...prev, category: data.categories[0].title }));
                }
            }
            if (galleryRes.ok) {
                const data = await galleryRes.json();
                setGalleryPhotos(data.photos || []);
            }
            if (inqRes.ok) {
                const data = await inqRes.json();
                setInquiries(data.inquiries || []);
            }
            if (quoteRes.ok) {
                const data = await quoteRes.json();
                setQuotes(data.quotes || []);
            }
            if (orderRes.ok) {
                const data = await orderRes.json();
                setOrders(data.orders || []);
            }
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchAllAdminData();
        }
    }, [user]);

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/admin-bnb/login");
    };

    // Helper confirmation caller
    const askConfirmation = (title: string, message: string, onConfirm: () => void) => {
        setConfirmModal({
            isOpen: true,
            title,
            message,
            onConfirm: () => {
                onConfirm();
                setConfirmModal(null);
            },
        });
    };

    // Category CRUD
    const handleSaveCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryForm.title.trim()) return;

        const method = categoryForm.id ? "PUT" : "POST";
        const res = await fetch("/api/admin/categories", {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(categoryForm),
        });

        if (res.ok) {
            setShowCategoryModal(false);
            setCategoryForm({ id: "", oldTitle: "", title: "" });
            fetchAllAdminData();
        }
    };

    const handleDeleteCategory = (id: string, title: string) => {
        askConfirmation(
            "Delete Category",
            `Are you sure you want to delete the category "${title}"?`,
            async () => {
                const res = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
                if (res.ok) fetchAllAdminData();
            }
        );
    };

    // Menu CRUD
    const handleSaveMenu = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!menuForm.name || !menuForm.price || !menuForm.category) return;

        const method = menuForm.id ? "PUT" : "POST";
        const res = await fetch("/api/admin/menu", {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(menuForm),
        });

        if (res.ok) {
            setShowMenuModal(false);
            setMenuForm({ id: "", name: "", price: "", category: categories[0]?.title || "Smoked Meats & Platters", description: "" });
            fetchAllAdminData();
        }
    };

    const handleDeleteMenu = (id: string, name: string) => {
        askConfirmation("Delete Menu Item", `Are you sure you want to delete "${name}"?`, async () => {
            const res = await fetch(`/api/admin/menu?id=${id}`, { method: "DELETE" });
            if (res.ok) fetchAllAdminData();
        });
    };

    // Gallery Photo Upload & Delete
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCompressing(true);
        setUploadError("");
        try {
            const base64 = await compressImageToBase64(file, 800, 0.7);
            setImageBase64(base64);
        } catch (err: any) {
            setUploadError("Failed to process image.");
        } finally {
            setCompressing(false);
        }
    };

    const handleUploadGallery = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageBase64) return;

        const res = await fetch("/api/admin/gallery", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageBase64, caption: galleryCaption }),
        });

        if (res.ok) {
            setShowGalleryModal(false);
            setImageBase64("");
            setGalleryCaption("");
            fetchAllAdminData();
        } else {
            setUploadError("Upload failed.");
        }
    };

    const handleDeleteGallery = (id: string) => {
        askConfirmation("Delete Photo", "Are you sure you want to delete this photo from the gallery?", async () => {
            const res = await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
            if (res.ok) fetchAllAdminData();
        });
    };

    // Status Updates
    const handleUpdateOrderStatus = async (id: string, status: string) => {
        await fetch("/api/admin/orders", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status }),
        });
        fetchAllAdminData();
    };

    const handleDeleteOrder = (id: string) => {
        askConfirmation("Delete Order", "Are you sure you want to delete this order record?", async () => {
            const res = await fetch(`/api/admin/orders?id=${id}`, { method: "DELETE" });
            if (res.ok) fetchAllAdminData();
        });
    };

    const handleToggleInquiryRead = async (id: string, isRead: boolean) => {
        await fetch("/api/admin/inquiries", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, isRead: !isRead }),
        });
        fetchAllAdminData();
    };

    const handleDeleteInquiry = (id: string) => {
        askConfirmation("Delete Message", "Delete this inquiry message?", async () => {
            const res = await fetch(`/api/admin/inquiries?id=${id}`, { method: "DELETE" });
            if (res.ok) fetchAllAdminData();
        });
    };

    const handleUpdateQuoteStatus = async (id: string, status: string) => {
        await fetch("/api/admin/quotes", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status }),
        });
        fetchAllAdminData();
    };

    const handleDeleteQuote = (id: string) => {
        askConfirmation("Delete Quote Request", "Delete this catering quote request?", async () => {
            const res = await fetch(`/api/admin/quotes?id=${id}`, { method: "DELETE" });
            if (res.ok) fetchAllAdminData();
        });
    };

    if (loadingAuth) {
        return (
            <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#e4202b]"></div>
            </div>
        );
    }

    if (!user) return null;

    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || o.total || 0), 0);
    const pendingOrders = orders.filter((o) => o.status === "pending" || !o.status).length;
    const unreadInquiries = inquiries.filter((i) => !i.isRead).length;

    return (
        <div className={`${bodyFont.className} min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col`}>
            {/* Top Navigation */}
            <header className="bg-[#111827] border-b border-slate-800 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className={`${scriptFont.className} text-[#e4202b] text-3xl`}>Beef N' Butts</span>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-400 hidden sm:inline">{user.email}</span>
                    <button
                        onClick={handleLogout}
                        className="text-xs bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold px-4 py-1.5 rounded-lg transition-colors cursor-pointer shadow-sm border-none"
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Navigation */}
                <aside className="w-64 bg-[#111827] border-r border-slate-800 p-4 hidden md:flex flex-col gap-2">
                    {[
                        { id: "overview", label: "Dashboard Overview" },
                        { id: "orders", label: `Orders (${orders.length})` },
                        { id: "menu", label: `Menu Items (${menuItems.length})` },
                        { id: "categories", label: `Categories (${categories.length})` },
                        { id: "gallery", label: `Gallery Photos (${galleryPhotos.length})` },
                        { id: "inquiries", label: `Contact Inquiries (${inquiries.length})` },
                        { id: "quotes", label: `Catering Quotes (${quotes.length})` },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
                            className={`w-full text-left px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                                activeTab === tab.id
                                    ? "bg-[#e4202b] text-white font-bold"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
                    {/* Top Mobile Bar Tabs */}
                    <div className="md:hidden flex overflow-x-auto gap-2 pb-3 mb-4 border-b border-slate-800 no-scrollbar">
                        {["overview", "orders", "menu", "categories", "gallery", "inquiries", "quotes"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as TabType)}
                                className={`px-3.5 py-2 rounded-lg text-xs uppercase font-bold whitespace-nowrap transition-colors ${
                                    activeTab === tab ? "bg-[#e4202b] text-white" : "bg-slate-800 text-slate-300"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.25 }}
                        >
                            {/* OVERVIEW TAB */}
                            {activeTab === "overview" && (
                                <div className="space-y-6">
                                    <h2 className={`${displayFont.className} text-2xl uppercase text-white tracking-wide`}>Overview</h2>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="bg-[#161e2e] p-5 rounded-xl border border-slate-800">
                                            <p className="text-xs uppercase text-slate-400 font-bold">Total Revenue</p>
                                            <p className="text-2xl font-bold text-[#e4202b] mt-2">${totalRevenue.toFixed(2)}</p>
                                        </div>
                                        <div className="bg-[#161e2e] p-5 rounded-xl border border-slate-800">
                                            <p className="text-xs uppercase text-slate-400 font-bold">Pending Orders</p>
                                            <p className="text-2xl font-bold text-yellow-400 mt-2">{pendingOrders}</p>
                                        </div>
                                        <div className="bg-[#161e2e] p-5 rounded-xl border border-slate-800">
                                            <p className="text-xs uppercase text-slate-400 font-bold">Unread Inquiries</p>
                                            <p className="text-2xl font-bold text-blue-400 mt-2">{unreadInquiries}</p>
                                        </div>
                                <div className="bg-[#161e2e] p-5 rounded-xl border border-slate-800">
                                    <p className="text-xs uppercase text-slate-400 font-bold">Catering Quotes</p>
                                    <p className="text-2xl font-bold text-purple-400 mt-2">{quotes.length}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ORDERS TAB */}
                    {activeTab === "orders" && (
                        <div className="space-y-4">
                            <h2 className={`${displayFont.className} text-2xl uppercase text-white`}>Customer Orders</h2>
                            {orders.length === 0 ? (
                                <p className="text-slate-400 text-sm">No orders recorded yet.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {orders.map((o) => (
                                        <div key={o.id} className="bg-[#161e2e] p-5 rounded-xl border border-slate-800 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-white text-base">{o.customerName || "Guest"}</h3>
                                                    <p className="text-xs text-slate-300 font-medium">{o.customerPhone} | <span className="uppercase text-[#e4202b] font-bold">{o.orderType}</span></p>
                                                    {o.location && <p className="text-xs text-slate-400 mt-0.5"><span className="font-semibold text-slate-300">Address:</span> {o.location}</p>}
                                                    {(o.date || o.time) && <p className="text-xs text-slate-400 mt-0.5"><span className="font-semibold text-slate-300">Scheduled:</span> {o.date} {o.time}</p>}
                                                </div>
                                                <span className="text-base font-bold text-[#e4202b]">${(o.totalPrice || o.total || 0).toFixed(2)}</span>
                                            </div>
                                            <div className="text-xs text-slate-300 space-y-1 bg-slate-900/50 p-2.5 rounded border border-slate-800/80">
                                                {o.items?.map((it: any, idx: number) => (
                                                    <div key={idx} className="flex justify-between">
                                                        <span>{it.qty}x {it.name}</span>
                                                        <span>{it.price}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                                                <select
                                                    value={o.status || "pending"}
                                                    onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                                                    className="bg-slate-900 border border-slate-700 text-xs rounded px-2 py-1 text-white"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                                <button
                                                    onClick={() => handleDeleteOrder(o.id)}
                                                    className="text-xs text-red-400 hover:text-red-300"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* MENU TAB */}
                    {activeTab === "menu" && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className={`${displayFont.className} text-2xl uppercase text-white`}>Menu Items</h2>
                                <button
                                    onClick={() => {
                                        setMenuForm({ id: "", name: "", price: "", category: categories[0]?.title || "Smoked Meats & Platters", description: "" });
                                        setShowMenuModal(true);
                                    }}
                                    className="bg-[#e4202b] text-white font-bold px-4 py-2 rounded-lg text-xs uppercase"
                                >
                                    + Add Menu Item
                                </button>
                            </div>

                            <div className="bg-[#161e2e] rounded-xl border border-slate-800 overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-900 text-slate-400 uppercase border-b border-slate-800">
                                        <tr>
                                            <th className="p-3">Name</th>
                                            <th className="p-3">Category</th>
                                            <th className="p-3">Price</th>
                                            <th className="p-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {menuItems.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-800/50">
                                                <td className="p-3 font-semibold text-white">{item.name}</td>
                                                <td className="p-3 text-slate-400">{item.category}</td>
                                                <td className="p-3 text-[#e4202b] font-bold">{item.price}</td>
                                                <td className="p-3 text-right space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            setMenuForm({
                                                                id: item.id,
                                                                name: item.name,
                                                                price: item.price,
                                                                category: item.category,
                                                                description: item.description || "",
                                                            });
                                                            setShowMenuModal(true);
                                                        }}
                                                        className="text-blue-400 hover:text-blue-300"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteMenu(item.id, item.name)}
                                                        className="text-red-400 hover:text-red-300"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* CATEGORIES TAB */}
                    {activeTab === "categories" && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className={`${displayFont.className} text-2xl uppercase text-white`}>Categories</h2>
                                <button
                                    onClick={() => {
                                        setCategoryForm({ id: "", oldTitle: "", title: "" });
                                        setShowCategoryModal(true);
                                    }}
                                    className="bg-[#e4202b] text-white font-bold px-4 py-2 rounded-lg text-xs uppercase"
                                >
                                    + Add Category
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {categories.map((cat) => (
                                    <div key={cat.id} className="bg-[#161e2e] p-5 rounded-xl border border-slate-800 flex justify-between items-center">
                                        <span className="font-bold text-white text-sm">{cat.title}</span>
                                        <div className="space-x-2 text-xs">
                                            <button
                                                onClick={() => {
                                                    setCategoryForm({ id: cat.id, oldTitle: cat.title, title: cat.title });
                                                    setShowCategoryModal(true);
                                                }}
                                                className="text-blue-400 hover:text-blue-300"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCategory(cat.id, cat.title)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* GALLERY TAB */}
                    {activeTab === "gallery" && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className={`${displayFont.className} text-2xl uppercase text-white`}>Gallery Photos</h2>
                                <button
                                    onClick={() => {
                                        setImageBase64("");
                                        setGalleryCaption("");
                                        setShowGalleryModal(true);
                                    }}
                                    className="bg-[#e4202b] text-white font-bold px-4 py-2 rounded-lg text-xs uppercase"
                                >
                                    + Upload Photo
                                </button>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {galleryPhotos.map((photo) => (
                                    <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-md">
                                        <Image
                                            src={photo.src || photo.imageBase64}
                                            alt={photo.caption || "Gallery"}
                                            fill
                                            className="object-cover"
                                        />
                                        {/* Subtle top & bottom shadow gradient for legibility */}
                                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/70 via-transparent to-black/75" />

                                        {/* Caption Label - Always Visible */}
                                        {photo.caption && (
                                            <div className="absolute top-2 left-2 right-2 pointer-events-none">
                                                <span className="inline-block bg-black/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow border border-white/10 max-w-full truncate">
                                                    {photo.caption}
                                                </span>
                                            </div>
                                        )}

                                        {/* Delete Button - Always Visible */}
                                        <div className="absolute bottom-2 right-2">
                                            <button
                                                onClick={() => handleDeleteGallery(photo.id)}
                                                className="bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold py-1.5 px-3 rounded-md shadow transition-colors cursor-pointer"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* INQUIRIES TAB */}
                    {activeTab === "inquiries" && (
                        <div className="space-y-4">
                            <h2 className={`${displayFont.className} text-2xl uppercase text-white`}>Contact Inquiries</h2>
                            <div className="space-y-3">
                                {inquiries.map((inq) => (
                                    <div key={inq.id} className="bg-[#161e2e] p-4 rounded-xl border border-slate-800 space-y-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="font-bold text-white text-sm">{inq.name}</span>
                                                <span className="text-xs text-slate-400 ml-2">({inq.email})</span>
                                            </div>
                                            <button
                                                onClick={() => handleToggleInquiryRead(inq.id, inq.isRead)}
                                                className={`text-xs px-2 py-0.5 rounded ${inq.isRead ? "bg-slate-800 text-slate-400" : "bg-blue-600 text-white font-bold"}`}
                                            >
                                                {inq.isRead ? "Read" : "Unread"}
                                            </button>
                                        </div>
                                        <p className="text-xs text-slate-300">{inq.message}</p>
                                        <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2">
                                            <span>{inq.createdAt}</span>
                                            <button onClick={() => handleDeleteInquiry(inq.id)} className="text-red-400 hover:text-red-300 text-xs">Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* QUOTES TAB */}
                    {activeTab === "quotes" && (
                        <div className="space-y-4">
                            <h2 className={`${displayFont.className} text-2xl uppercase text-white`}>Catering Quote Requests</h2>
                            <div className="space-y-3">
                                {quotes.map((q) => (
                                    <div key={q.id} className="bg-[#161e2e] p-4 rounded-xl border border-slate-800 space-y-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="font-bold text-[#e4202b] text-sm">{q.eventType}</span>
                                                <span className="text-xs text-slate-400 ml-2">by {q.name} ({q.email} | {q.phone})</span>
                                            </div>
                                            <select
                                                value={q.status || "pending"}
                                                onChange={(e) => handleUpdateQuoteStatus(q.id, e.target.value)}
                                                className="bg-slate-900 border border-slate-700 text-xs rounded px-2 py-1 text-white"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="reviewed">Reviewed</option>
                                                <option value="booked">Booked</option>
                                            </select>
                                        </div>
                                        <p className="text-xs text-slate-300">Guests: {q.guestCount} | Date: {q.eventDate || "TBD"}</p>
                                        {q.details && <p className="text-xs text-slate-400 bg-slate-900 p-2 rounded">{q.details}</p>}
                                        <div className="flex justify-end pt-2">
                                            <button onClick={() => handleDeleteQuote(q.id)} className="text-red-400 hover:text-red-300 text-xs">Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            {/* Menu Modal */}
            {showMenuModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <form onSubmit={handleSaveMenu} className="bg-[#161e2e] p-6 rounded-xl border border-slate-800 max-w-md w-full space-y-4">
                        <h3 className="text-lg font-bold text-white">{menuForm.id ? "Edit Menu Item" : "Add Menu Item"}</h3>
                        <input
                            type="text"
                            placeholder="Item Name *"
                            value={menuForm.name}
                            onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white"
                        />
                        <input
                            type="text"
                            placeholder="Price (e.g. $18) *"
                            value={menuForm.price}
                            onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })}
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white"
                        />
                        <select
                            value={menuForm.category}
                            onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })}
                            className="w-full bg-[#111827] border border-slate-700 rounded px-3 py-2 text-xs text-white"
                        >
                            {categories.map((c) => (
                                <option key={c.id} value={c.title}>{c.title}</option>
                            ))}
                        </select>
                        <textarea
                            placeholder="Description"
                            value={menuForm.description}
                            onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white"
                        />
                        <div className="flex justify-end gap-2 pt-2">
                            <button type="button" onClick={() => setShowMenuModal(false)} className="px-4 py-2 text-xs text-slate-400">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-[#e4202b] text-white font-bold rounded text-xs">Save</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Category Modal */}
            {showCategoryModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <form onSubmit={handleSaveCategory} className="bg-[#161e2e] p-6 rounded-xl border border-slate-800 max-w-md w-full space-y-4">
                        <h3 className="text-lg font-bold text-white">{categoryForm.id ? "Edit Category" : "Add Category"}</h3>
                        <input
                            type="text"
                            placeholder="Category Title *"
                            value={categoryForm.title}
                            onChange={(e) => setCategoryForm({ ...categoryForm, title: e.target.value })}
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white"
                        />
                        <div className="flex justify-end gap-2 pt-2">
                            <button type="button" onClick={() => setShowCategoryModal(false)} className="px-4 py-2 text-xs text-slate-400">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-[#e4202b] text-white font-bold rounded text-xs">Save</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Gallery Modal */}
            {showGalleryModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <form onSubmit={handleUploadGallery} className="bg-[#161e2e] p-6 rounded-xl border border-slate-800 max-w-md w-full space-y-4">
                        <h3 className="text-lg font-bold text-white">Upload Gallery Photo</h3>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                            className="w-full text-xs text-slate-400"
                        />
                        {compressing && <p className="text-xs text-yellow-400">Compressing photo...</p>}
                        {imageBase64 && <p className="text-xs text-green-400">Photo ready for upload.</p>}
                        <input
                            type="text"
                            placeholder="Caption (e.g. Sliced Brisket)"
                            value={galleryCaption}
                            onChange={(e) => setGalleryCaption(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white"
                        />
                        {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
                        <div className="flex justify-end gap-2 pt-2">
                            <button type="button" onClick={() => setShowGalleryModal(false)} className="px-4 py-2 text-xs text-slate-400">Cancel</button>
                            <button type="submit" disabled={!imageBase64} className="px-4 py-2 bg-[#e4202b] text-white font-bold rounded text-xs disabled:opacity-50">Upload</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Confirm Modal */}
            {confirmModal && confirmModal.isOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#161e2e] p-6 rounded-xl border border-slate-800 max-w-sm w-full space-y-4 text-center">
                        <h3 className="text-base font-bold text-white">{confirmModal.title}</h3>
                        <p className="text-xs text-slate-300">{confirmModal.message}</p>
                        <div className="flex justify-center gap-3 pt-2">
                            <button onClick={() => setConfirmModal(null)} className="px-4 py-2 text-xs text-slate-400">Cancel</button>
                            <button onClick={confirmModal.onConfirm} className="px-4 py-2 bg-red-600 text-white font-bold rounded text-xs">Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
