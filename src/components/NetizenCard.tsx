import type { Role } from "@/lib/arc-data";

export function NetizenCard({
  role,
  number,
  username,
}: {
  role: Role;
  number: string;
  username: string;
}) {
  return (
    <div className="relative w-full max-w-[380px] border border-border bg-paper">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="technical-label">ARC Netizen</span>
        <span className="technical-label" style={{ color: role.color }}>
          Netizen #{number}
        </span>
      </div>

      <div className="bg-background p-4">
        <div className="relative aspect-[2/3] overflow-hidden border border-foreground/15 bg-paper">
          <img
            src={role.image}
            alt={`ARC Netizen portrait for The ${role.name}`}
            width={1024}
            height={1536}
            className="h-full w-full object-contain mix-blend-multiply"
          />
        </div>
      </div>

      <div className="border-t border-border px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-2xl font-medium uppercase leading-none">{role.name}</h3>
            <p className="mt-2 text-xs uppercase leading-5 text-muted-foreground">{role.desc}</p>
          </div>
          <span className="technical-label shrink-0 text-muted-foreground">{role.id}</span>
        </div>
      </div>

      <div className="technical-label flex items-center justify-between border-t border-border px-4 py-3 text-muted-foreground">
        <span>@{username}</span>
        <span>ARC Network</span>
      </div>
    </div>
  );
}
