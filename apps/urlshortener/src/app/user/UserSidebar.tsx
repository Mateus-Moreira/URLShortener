"use client";
import { useRouter } from "next/navigation";

interface UserSidebarProps {
  active?: "dados" | "urls";
}

export default function UserSidebar({ active }: UserSidebarProps) {
  const router = useRouter();

  return (
    <aside className="w-48 bg-white shadow-md flex flex-col p-4 gap-2 min-h-screen">
      <div className="flex flex-col gap-2">
        <button
          className={`text-left px-4 py-2 rounded transition ${active === "dados" ? "bg-blue-100 font-semibold" : "hover:bg-blue-100"}`}
          onClick={() => router.push("/user")}
        >
          Seus dados
        </button>
        <button
          className={`text-left px-4 py-2 rounded transition ${active === "urls" ? "bg-blue-100 font-semibold" : "hover:bg-blue-100"}`}
          onClick={() => router.push("/user/urls")}
        >
          Seus URLs
        </button>
      </div>
    </aside>
  );
}
