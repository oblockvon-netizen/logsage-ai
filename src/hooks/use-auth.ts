"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getAccessToken } from "@/lib/token-storage";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: api.me,
    enabled: typeof window !== "undefined" && Boolean(getAccessToken())
  });
}
