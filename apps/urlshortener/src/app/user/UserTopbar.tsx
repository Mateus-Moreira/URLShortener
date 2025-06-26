"use client";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function UserTopbar() {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/");
  };

  return (
    <div className="absolute top-4 right-4 flex gap-2 z-10">
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        onClick={() => router.push("/")}
      >
        Início
      </button>
      <button
        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
        onClick={handleLogout}
      >
        Sair
      </button>
    </div>
  );
}
