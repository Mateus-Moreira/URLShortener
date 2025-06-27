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
        fetch(process.env.NEXT_PUBLIC_API_USERS_URL + "/auth/me", {
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
        fetch(process.env.NEXT_PUBLIC_API_URLS_URL + '/urls', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(async (res) => {
                if (!res.ok) throw new Error();
                const data = await res.json();
                setUrls(
                    data
                        .filter((url: any) => url.userId === userId)
                        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                );
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
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URLS_URL}/urls/${id}`, {
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

    const handleDelete = async (id: number) => {
        if (!confirm("Tem certeza que deseja deletar esta URL?")) return;
        setError("");
        setSuccess("");
        const token = Cookies.get("token");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URLS_URL}/urls/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error();
            setSuccess("URL deletada com sucesso!");
            fetchUrls();
        } catch {
            setError("Erro ao deletar URL");
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
                            <div key={url.id}>
                                <li
                                    className="py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                                >
                                    <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2">
                                        {editMode[url.id] ? (
                                            <>
                                                <div className="flex flex-col gap-1">
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

                                                </div>
                                                <input
                                                    type="text"
                                                    className="border rounded px-2 py-1 flex-1"
                                                    value={editUrls[url.id]}
                                                    onChange={(e) => handleEditChange(url.id, e.target.value)}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex flex-col gap-1">
                                                    <button
                                                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                                                        onClick={() => handleEditClick(url.id, url.originalUrl)}
                                                    >
                                                        Editar
                                                    </button>
                                                    {!editMode[url.id] && (
                                                        <button
                                                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition mt-1"
                                                            onClick={() => handleDelete(url.id)}
                                                        >
                                                            Deletar
                                                        </button>
                                                    )}
                                                </div>
                                                <span className="break-all">{url.originalUrl}</span>
                                            </>
                                        )}
                                    </div>
                                    <span className="text-blue-600 break-all">
                                        {typeof window !== "undefined" ? window.location.origin : ""}/
                                        {url.shortUrl}
                                    </span>
                                    <span className="text-gray-700 text-sm min-w-[80px] text-center">
                                        Acessos: {url.accessCount ?? 0}
                                    </span>
                                </li>
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 w-full">
                                    <div className="text-gray-500 text-xs min-w-[120px] text-right md:text-right ml-auto">
                                        Atualizada: 
                                        {url.updated_at
                                            ? new Date(new Date(url.updated_at).getTime() - 3 * 60 * 60 * 1000).toLocaleString('pt-BR')
                                            : '-'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
}
