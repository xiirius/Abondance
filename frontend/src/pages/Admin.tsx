import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/landing/Logo";
import { Loader2, Users, ShoppingBag, Download, Save } from "lucide-react";

interface Lead {
  id: string;
  prenom: string;
  email: string;
  created_at: string;
}

interface Payment {
  session_id: string;
  prenom: string;
  email: string;
  amount: number;
  currency: string;
  status: string;
  payment_status: string;
  created_at: string;
}

const KEY = "abondance_admin";

async function adminFetch<T>(path: string, key: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", "X-Admin-Key": key, ...(options?.headers || {}) },
  });
  if (!res.ok) throw new Error(String(res.status));
  return (await res.json()) as T;
}

export default function Admin() {
  const [key, setKey] = useState<string>(() => sessionStorage.getItem(KEY) || "");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [price, setPrice] = useState("8.90");
  const [contactEmail, setContactEmail] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = async (k: string) => {
    setLoading(true);
    try {
      const [l, p, c] = await Promise.all([
        adminFetch<Lead[]>("/admin/leads", k),
        adminFetch<Payment[]>("/admin/payments", k),
        fetch("/api/config").then((r) => r.json()),
      ]);
      setLeads(l);
      setPayments(p);
      setPrice(String(c.price_euros));
      setContactEmail(c.contact_email);
    } catch {
      setKey("");
      sessionStorage.removeItem(KEY);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (key) load(key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      await adminFetch<{ ok: boolean }>("/admin/login", "x", {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      sessionStorage.setItem(KEY, password);
      setKey(password);
    } catch {
      setLoginError("Mot de passe incorrect.");
    }
  };

  const saveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    try {
      await adminFetch("/admin/config", key, {
        method: "PUT",
        body: JSON.stringify({ price_euros: parseFloat(price.replace(",", ".")), contact_email: contactEmail }),
      });
      setSaved(true);
    } catch {
      setLoginError("");
    }
  };

  const exportCsv = async () => {
    const res = await fetch("/api/admin/leads.csv", { headers: { "X-Admin-Key": key } });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inscrits-abondance.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!key) {
    return (
      <div className="grain flex min-h-screen items-center justify-center bg-cream px-5" data-testid="admin-login-page">
        <form onSubmit={login} className="w-full max-w-sm rounded-3xl border border-line bg-white p-8 shadow-xl">
          <Logo />
          <h1 className="mt-6 font-heading text-2xl tracking-tight text-ink">Espace d'administration</h1>
          <p className="mt-2 text-sm text-muted-warm">Réservé à l'éditeur du guide.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            className="mt-6 w-full rounded-xl border border-line bg-cream/60 px-4 py-3 text-base outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
            data-testid="admin-password-input"
          />
          {loginError && <p className="mt-3 text-sm text-[#A63D40]" data-testid="admin-login-error">{loginError}</p>}
          <button
            type="submit"
            className="mt-5 w-full rounded-full bg-forest py-3.5 font-sans font-medium text-white transition-all hover:bg-[#2D4B39]"
            data-testid="admin-login-button"
          >
            Se connecter
          </button>
          <Link to="/" className="mt-4 block text-center font-sans text-xs text-muted-warm hover:text-ink" data-testid="admin-back-home">
            ← Revenir au site
          </Link>
        </form>
      </div>
    );
  }

  const paidCount = payments.filter((p) => p.payment_status === "paid").length;

  return (
    <div className="grain min-h-screen bg-cream" data-testid="admin-dashboard">
      <header className="border-b border-line bg-cream/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <Link to="/" data-testid="admin-logo-link"><Logo /></Link>
          <button
            onClick={() => { sessionStorage.removeItem(KEY); setKey(""); }}
            className="font-sans text-sm text-muted-warm hover:text-ink"
            data-testid="admin-logout-button"
          >
            Se déconnecter
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-10 px-5 py-12">
        {loading && <Loader2 className="h-6 w-6 animate-spin text-gold" />}

        <div className="grid gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-line bg-white p-6" data-testid="admin-stat-leads">
            <Users className="h-5 w-5 text-sage-deep" />
            <p className="mt-3 font-heading text-4xl text-ink">{leads.length}</p>
            <p className="mt-1 font-sans text-sm text-muted-warm">Inscrits à la lecture gratuite</p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-6" data-testid="admin-stat-sales">
            <ShoppingBag className="h-5 w-5 text-gold" />
            <p className="mt-3 font-heading text-4xl text-ink">{paidCount}</p>
            <p className="mt-1 font-sans text-sm text-muted-warm">Guides vendus</p>
          </div>
          <div className="rounded-2xl border border-gold/30 bg-sand p-6" data-testid="admin-stat-pdf">
            <Download className="h-5 w-5 text-[#7D6B4E]" />
            <p className="mt-3 font-heading text-lg text-ink">Fichier du guide</p>
            <p className="mt-1 font-sans text-xs leading-relaxed text-muted-warm">
              Pour remplacer le PDF, déposez votre fichier dans <code className="rounded bg-white/70 px-1">backend/downloads/guide.pdf</code>
            </p>
          </div>
        </div>

        <section className="rounded-2xl border border-line bg-white p-7" data-testid="admin-settings-section">
          <h2 className="font-heading text-2xl tracking-tight text-ink">Paramètres</h2>
          <form onSubmit={saveConfig} className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="admin-price" className="mb-1.5 block font-sans text-xs font-medium uppercase tracking-[0.14em] text-muted-warm">
                Prix du guide (€)
              </label>
              <input
                id="admin-price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                inputMode="decimal"
                className="w-full rounded-xl border border-line bg-cream/60 px-4 py-3 outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                data-testid="admin-price-input"
              />
            </div>
            <div>
              <label htmlFor="admin-contact-email" className="mb-1.5 block font-sans text-xs font-medium uppercase tracking-[0.14em] text-muted-warm">
                E-mail de contact
              </label>
              <input
                id="admin-contact-email"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full rounded-xl border border-line bg-cream/60 px-4 py-3 outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                data-testid="admin-contact-email-input"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-forest px-7 py-3 font-sans font-medium text-white transition-all hover:bg-[#2D4B39]"
                data-testid="admin-save-config-button"
              >
                <Save className="h-4 w-4" />
                Enregistrer
              </button>
              {saved && <span className="ml-4 font-sans text-sm text-sage-deep" data-testid="admin-save-success">Paramètres enregistrés.</span>}
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-line bg-white p-7" data-testid="admin-leads-section">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-heading text-2xl tracking-tight text-ink">Inscrits ({leads.length})</h2>
            <button
              onClick={exportCsv}
              className="rounded-full border border-line px-5 py-2 font-sans text-sm text-ink transition-colors hover:border-gold hover:text-gold"
              data-testid="admin-export-csv-button"
            >
              Exporter en CSV
            </button>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-sm" data-testid="admin-leads-table">
              <thead>
                <tr className="border-b border-line font-sans text-xs uppercase tracking-[0.12em] text-muted-warm">
                  <th className="py-3 pr-4">Prénom</th>
                  <th className="py-3 pr-4">E-mail</th>
                  <th className="py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="border-b border-line/60">
                    <td className="py-3 pr-4 text-ink">{l.prenom}</td>
                    <td className="py-3 pr-4 text-muted-warm">{l.email}</td>
                    <td className="py-3 text-muted-warm">{new Date(l.created_at).toLocaleDateString("fr-FR")}</td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr><td colSpan={3} className="py-6 text-center text-muted-warm">Aucun inscrit pour le moment.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-7" data-testid="admin-payments-section">
          <h2 className="font-heading text-2xl tracking-tight text-ink">Ventes ({payments.length})</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-sm" data-testid="admin-payments-table">
              <thead>
                <tr className="border-b border-line font-sans text-xs uppercase tracking-[0.12em] text-muted-warm">
                  <th className="py-3 pr-4">E-mail</th>
                  <th className="py-3 pr-4">Montant</th>
                  <th className="py-3 pr-4">Statut</th>
                  <th className="py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.session_id} className="border-b border-line/60">
                    <td className="py-3 pr-4 text-muted-warm">{p.email || "—"}</td>
                    <td className="py-3 pr-4 text-ink">{p.amount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</td>
                    <td className="py-3 pr-4">
                      <span className={`rounded-full px-3 py-1 font-sans text-xs ${p.payment_status === "paid" ? "bg-sage text-sage-deep" : "bg-sand text-[#7D6B4E]"}`}>
                        {p.payment_status === "paid" ? "Payé" : p.payment_status}
                      </span>
                    </td>
                    <td className="py-3 text-muted-warm">{new Date(p.created_at).toLocaleDateString("fr-FR")}</td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr><td colSpan={4} className="py-6 text-center text-muted-warm">Aucune vente pour le moment.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
