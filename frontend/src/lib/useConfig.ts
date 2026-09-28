import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

export interface SiteConfig {
  product_name: string;
  price_euros: number;
  contact_email: string;
}

export const DEFAULT_CONFIG: SiteConfig = {
  product_name: "Le Guide de l'Abondance Intérieure",
  price_euros: 8.9,
  contact_email: "contact@abondance-interieure.fr",
};

export function useConfig(): SiteConfig {
  const { data, isError } = useQuery({
    queryKey: ["config"],
    queryFn: () => apiGet<SiteConfig>("/config"),
    staleTime: 60_000,
    retry: 1,
  });
  if (isError || !data) return DEFAULT_CONFIG;
  return data;
}

export function formatPrice(value: number): string {
  return value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}
