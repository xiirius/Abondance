import { useState } from "react";
import { apiPost } from "@/lib/api";

interface CheckoutResponse {
  checkout_url: string;
  session_id: string;
}

export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startCheckout = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiPost<CheckoutResponse>("/payments/checkout", {
        origin_url: window.location.origin,
        prenom: localStorage.getItem("abondance_prenom") || undefined,
        email: localStorage.getItem("abondance_email") || undefined,
      });
      window.location.href = res.checkout_url;
    } catch {
      setError("Le paiement n'a pas pu démarrer. Merci de réessayer dans un instant.");
      setLoading(false);
    }
  };

  return { startCheckout, loading, error };
}
