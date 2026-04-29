import { useAuthStore } from "@/store/useAuthStore";

export function useRole() {
  const user = useAuthStore((s) => s.user);

  return {
    isAdmin: user?.role === "admin",
    isUser: user?.role === "user",
  };
}