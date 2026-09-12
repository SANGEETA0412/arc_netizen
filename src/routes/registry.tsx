import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { roles } from "@/lib/arc-data";

export const Route = createFileRoute("/registry")({
  head: () => ({
    meta: [
      { title: "The Netizen Registry — ARC Netizens" },
      {
        name: "description",
        content:
          "Every verified ARC Netizen: number, role, X account and wallet, recorded in the public registry.",
      },
      { property: "og:title", content: "The Netizen Registry — ARC Netizens" },
      {
        property: "og:description",
        content: "Different roles. Same humanity. Browse every verified ARC Netizen.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RegistryPage,
  errorComponent: () => (
    <Shell>
      <p className="text-sm text-muted-foreground">
        The registry could not be loaded. Please try again.
      </p>
    </Shell>
  ),
  notFoundComponent: () => (
    <Shell>
      <p className="text-sm text-muted-foreground">Not found.</p>
    </Shell>
  ),
});

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background px-5 py-16 lg:px-10">
      <div className="mx-auto max-w-[1200px]">
        <Link to="/" className="technical-label text-muted-foreground hover:text-foreground">
          ← ARC Netizens
        </Link>
        <h1 className="display-title mt-8 text-4xl lg:text-6xl">The Netizen Registry</h1>
        <div className="mt-10">{children}</div>
      </div>
    </main>
  );
}

function shortWallet(address: string | null | undefined) {
  if (!address || address.length < 12) return address ?? "—";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

type NetizenRow = {
  id: string;
  netizen_number: number;
  x_username: string;
  wallet_address: string;
  role_slug: string;
  created_at: string;
};

function RegistryPage() {
  const [filter, setFilter] = useState("ALL");

  const netizensQuery = useQuery({
    queryKey: ["arc-netizens"],
    queryFn: async (): Promise<NetizenRow[]> => {
      const { data, error } = await supabase
        .from("netizens")
        .select("*")
        .order("netizen_number", { ascending: true });
      if (error) throw error;
      return (data ?? []) as NetizenRow[];
    },
  });

  const roleSlugs = ["ALL", ...roles.map((r) => r.name.toUpperCase())];
  const rows = (netizensQuery.data ?? []).filter((c) =>
    filter === "ALL" ? true : c.role_slug.toUpperCase() === filter,
  );

  return (
    <Shell>
      <div className="flex flex-wrap gap-2">
        {roleSlugs.map((slug) => (
          <button
            key={slug}
            type="button"
            onClick={() => setFilter(slug)}
            className={`technical-label border px-3 py-2 transition-colors ${filter === slug ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground"}`}
          >
            {slug}
          </button>
        ))}
      </div>

      <div className="mt-8 border border-border">
        <div className="technical-label grid grid-cols-[80px_1fr_1fr] gap-4 border-b border-border px-4 py-3 text-muted-foreground sm:grid-cols-[80px_1fr_1fr_1fr_120px]">
          <span>No.</span>
          <span>Netizen</span>
          <span>Role</span>
          <span className="hidden sm:block">Wallet</span>
          <span className="hidden sm:block">Joined</span>
        </div>

        {netizensQuery.isLoading && (
          <p className="px-4 py-8 text-sm text-muted-foreground">Loading the registry…</p>
        )}

        {!netizensQuery.isLoading && rows.length === 0 && (
          <p className="px-4 py-10 text-sm text-muted-foreground">
            No netizens recorded yet. The registry fills as people complete the tasks.
          </p>
        )}

        {rows.map((c) => (
          <div
            key={c.id}
            className="grid grid-cols-[80px_1fr_1fr] gap-4 border-b border-border px-4 py-4 text-sm last:border-b-0 sm:grid-cols-[80px_1fr_1fr_1fr_120px]"
          >
            <span className="font-mono">#{String(c.netizen_number).padStart(4, "0")}</span>
            <span>@{c.x_username}</span>
            <span className="uppercase">{c.role_slug}</span>
            <span className="hidden font-mono text-muted-foreground sm:block">
              {shortWallet(c.wallet_address)}
            </span>
            <span className="hidden text-muted-foreground sm:block">
              {new Date(c.created_at).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </Shell>
  );
}
