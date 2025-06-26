"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import UserSidebar from "./UserSidebar";
import UserTopbar from "./UserTopbar";

export default function UserPage() {
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    // Buscar dados do usuário
    fetch("http://localhost:3001/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error();
        const data = await res.json();
        setId(data.id); // Salva o id
        setName(data.name);
        setEmail(data.email);
      })
      .catch(() => router.replace("/login"));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    const token = Cookies.get("token");
    if (!id) {
      setError("ID de usuário não encontrado.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:3001/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, password: password || undefined }),
      });
      if (!res.ok) throw new Error();
      setMessage("Dados atualizados com sucesso!");
      setPassword("");
    } catch {
      setError("Erro ao atualizar dados");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 relative">
      <UserSidebar active="dados" />
      <UserTopbar />
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">Seus dados</h1>
          {message && <div className="text-green-600 mb-2">{message}</div>}
          {error && <div className="text-red-600 mb-2">{error}</div>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="password"
              placeholder="Nova senha (opcional)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded px-3 py-2"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
            >
              Atualizar dados
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
