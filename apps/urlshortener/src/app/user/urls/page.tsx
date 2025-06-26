"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import UserSidebar from "../UserSidebar";
import UserTopbar from "../UserTopbar";

export default function UserUrlsPage() {
    const [urls, setUrls] = useState<any[]>([]);
    const [editMode, setEditMode] = useState<Record<number, boolean>>({});
    const [editUrls, setEditUrls] = useState<Record<number, string>>({});
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [userId, setUserId] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            router.replace("/login");
            return;
        }
        // Busca o userId do usuário logado
        fetch("http://localhost:3001/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(async (res) => {
                if (!res.ok) throw new Error();
                const data = await res.json();
                setUserId(data.id);
            })
            .catch(() => router.replace("/login"));
    }, [router]);

    const fetchUrls = () => {
        const token = Cookies.get("token");
        if (!token || userId === null) return;
        fetch("http://localhost:3002/api/urls", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(async (res) => {
                if (!res.ok) throw new Error();
                const data = await res.json();
                setUrls(data.filter((url: any) => url.userId === userId));
            })
            .catch(() => setError("Erro ao carregar URLs"));
    };

    useEffect(() => {
        fetchUrls();
        // eslint-disable-next-line
    }, [router, userId]);

    const handleEditClick = (id: number, originalUrl: string) => {
        setEditMode((prev) => ({ ...prev, [id]: true }));
        setEditUrls((prev) => ({ ...prev, [id]: originalUrl }));
    };

    const handleEditCancel = (id: number) => {
        setEditMode((prev) => ({ ...prev, [id]: false }));
        setEditUrls((prev) => ({ ...prev, [id]: "" }));
    };

    const handleEditChange = (id: number, value: string) => {
        setEditUrls((prev) => ({ ...prev, [id]: value }));
    };

    const handleEditSave = async (id: number) => {
        setError("");
        setSuccess("");
        const token = Cookies.get("token");
        const newUrl = editUrls[id];
        if (!newUrl) return;
        try {
            const res = await fetch(`http://localhost:3002/api/urls/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ originalUrl: newUrl }),
            });
            if (!res.ok) throw new Error();
            setSuccess("URL atualizada com sucesso!");
            setEditMode((prev) => ({ ...prev, [id]: false }));
            setEditUrls((prev) => ({ ...prev, [id]: "" }));
            fetchUrls();
        } catch {
            setError("Erro ao atualizar URL");
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50 relative">
            <UserSidebar active="urls" />
            <UserTopbar />
            <main className="flex-1 flex flex-col items-center justify-center">
                <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
                    <h1 className="text-2xl font-bold mb-4 text-center">Seus URLs</h1>
                    {success && <div className="text-green-600 mb-2">{success}</div>}
                    {error && <div className="text-red-600 mb-2">{error}</div>}
                    <ul className="divide-y">
                        {urls.length === 0 && (
                            <li className="py-4 text-center">Nenhum URL encontrado.</li>
                        )}
                        {urls.map((url) => (
                            <li
                                key={url.id}
                                className="py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                            >
                                <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2">
                                    {editMode[url.id] ? (
                                        <>

                                            <button
                                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                                                onClick={() => handleEditSave(url.id)}
                                            >
                                                Salvar
                                            </button>
                                            <button
                                                className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition"
                                                onClick={() => handleEditCancel(url.id)}
                                            >
                                                Cancelar
                                            </button>
                                            <input
                                                type="text"
                                                className="border rounded px-2 py-1 flex-1"
                                                value={editUrls[url.id]}
                                                onChange={(e) => handleEditChange(url.id, e.target.value)}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                                                onClick={() => handleEditClick(url.id, url.originalUrl)}
                                            >
                                                Editar
                                            </button>
                                            <span className="break-all">{url.originalUrl}</span>
                                        </>
                                    )}
                                </div>
                                <span className="text-blue-600 break-all">
                                    {typeof window !== "undefined" ? window.location.origin : ""}/
                                    {url.shortUrl}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
}
