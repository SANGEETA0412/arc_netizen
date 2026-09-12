import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { JoinNetizen } from "@/components/JoinNetizen";
import { roles, type Role } from "@/lib/arc-data";
import logoAsset from "@/assets/arc-fingerprint-logo.png.asset.json";
import creatorPortraitAsset from "@/assets/arc-creator-portrait.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ARC Netizen Registry — Become a Netizen" },
      {
        name: "description",
        content:
          "Become a Netizen in ARC: choose a role, make city decisions, and build your record in City Zero.",
      },
      { property: "og:title", content: "ARC Netizen Registry — Become a Netizen" },
      {
        property: "og:description",
        content: "Eight roles. One city. Your decisions shape its future.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function Mark() {
  return (
    <button
      type="button"
      onClick={() => scrollTo("top")}
      className="flex items-center gap-3 text-foreground"
      aria-label="ARC Netizens home"
    >
      <img
        src={logoAsset.url}
        alt=""
        width={40}
        height={40}
        className="size-10 rounded-full object-cover"
      />
      <span className="text-left text-xs font-semibold uppercase leading-tight">
        ARC
        <br />
        Netizens
      </span>
    </button>
  );
}

function Header({ onJoin }: { onJoin: () => void }) {
  const [open, setOpen] = useState(false);
  const links = [
    ["Netizens", "netizens"],
    ["X / @arc_netizen", "x"],
  ] as const;
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-[1440px] items-center justify-between px-5 lg:px-10">
        <Mark />
        <nav className="hidden items-center gap-8 lg:flex">
          {links.map(([name, id]) =>
            id === "x" ? (
              <a
                key={name}
                href="https://x.com/arc_netizen"
                target="_blank"
                rel="noopener noreferrer"
                className="technical-label text-muted-foreground transition-colors hover:text-foreground"
              >
                {name}
              </a>
            ) : (
              <button
                key={name}
                type="button"
                onClick={() => scrollTo(id)}
                className="technical-label text-muted-foreground transition-colors hover:text-foreground"
              >
                {name}
              </button>
            ),
          )}
        </nav>
        <Button variant="registry" className="hidden lg:inline-flex" onClick={onJoin}>
          Become a netizen <ArrowUpRight />
        </Button>
        <button
          className="grid size-10 place-items-center lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-border bg-background px-5 py-6 lg:hidden">
          {links.map(([name, id]) =>
            id === "x" ? (
              <a
                key={name}
                href="https://x.com/arc_netizen"
                target="_blank"
                rel="noopener noreferrer"
                className="technical-label block w-full border-b border-border py-4 text-left"
              >
                {name}
              </a>
            ) : (
              <button
                key={name}
                type="button"
                onClick={() => {
                  setOpen(false);
                  scrollTo(id);
                }}
                className="technical-label block w-full border-b border-border py-4 text-left"
              >
                {name}
              </button>
            ),
          )}
          <Button
            variant="registry"
            className="mt-6 w-full"
            onClick={() => {
              setOpen(false);
              onJoin();
            }}
          >
            Become a netizen <ArrowUpRight />
          </Button>
        </nav>
      )}
    </header>
  );
}

const cityNodes = [
  ["Merchant", 14, 24],
  ["Builder", 50, 15],
  ["Traveler", 85, 28],
  ["Trader", 18, 68],
  ["Architect", 70, 61],
  ["Creator", 49, 48],
  ["Guardian", 90, 74],
  ["Visionary", 62, 90],
] as const;

function Index() {
  const [selected, setSelected] = useState(5);
  const [joinOpen, setJoinOpen] = useState(false);
  const netizen = roles[selected] ?? roles[0];
  if (!netizen) return null;

  return (
    <main id="top" className="paper-grain overflow-hidden">
      <Header onJoin={() => setJoinOpen(true)} />
      <JoinNetizen
        open={joinOpen}
        onOpenChange={setJoinOpen}
        selected={selected}
        onSelect={setSelected}
      />

      <section className="relative border-b border-border pt-18 lg:min-h-[calc(100vh-4.5rem)]">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-12">
          <div className="flex flex-col justify-between px-5 py-14 lg:col-span-7 lg:px-10 lg:py-18">
            <div className="technical-label flex items-center gap-4 text-muted-foreground">
              <span>ARC / Registry protocol 0.22</span>
              <span className="h-px w-16 bg-border" />
              <span className="text-cobalt">Live</span>
            </div>
            <div className="py-18 lg:py-16">
              <p className="technical-label mb-6 text-cobalt">NFT = Netizen identity</p>
              <h1 className="display-title max-w-4xl text-[clamp(4.2rem,10vw,9.5rem)]">
                Become
                <br />a Netizen.
              </h1>
              <p className="mt-9 max-w-xl border-l-2 border-cobalt pl-5 text-xl font-medium uppercase leading-tight md:text-3xl">
                8 roles.
                <br />
                One city.
                <br />
                Your decisions shape its future.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button variant="registry" size="lg" onClick={() => scrollTo("netizens")}>
                  Explore netizens <ArrowDown />
                </Button>
                <Button variant="registryOutline" size="lg" asChild>
                  <a href="https://x.com/arc_netizen" target="_blank" rel="noopener noreferrer">
                    Follow on X <ArrowUpRight />
                  </a>
                </Button>
              </div>
            </div>

            <div className="grid gap-6 border-t border-border pt-6 sm:grid-cols-3">
              <div>
                <span className="technical-label text-muted-foreground">Role</span>
                <p className="mt-2 text-sm font-semibold uppercase">Ability</p>
              </div>
              <div>
                <span className="technical-label text-muted-foreground">Network</span>
                <p className="mt-2 text-sm font-semibold uppercase">City Zero</p>
              </div>
              <div>
                <span className="technical-label text-muted-foreground">Score</span>
                <p className="mt-2 text-sm font-semibold uppercase">Reputation</p>
              </div>
            </div>
          </div>
          <div className="relative min-h-[560px] overflow-hidden border-t border-border bg-paper lg:col-span-5 lg:border-l lg:border-t-0">
            <div className="absolute inset-x-0 top-[18%] z-10 h-px bg-cobalt/50 scan-line" />
            <img
              src={creatorPortraitAsset.url}
              alt="Fingerprint portrait of an ARC Netizen"
              width={768}
              height={1024}
              className="portrait-drift h-full w-full object-cover object-top"
            />
            <div className="absolute inset-5 border border-foreground/20" />
            <div className="absolute left-8 top-8 technical-label text-muted-foreground">
              Biometric / Human
            </div>
            <div className="absolute bottom-8 left-8 right-8 flex justify-between technical-label">
              <span>Identity active</span>
              <span>ARC–0006</span>
            </div>
          </div>
        </div>
      </section>

      <section id="network" className="scroll-mt-18 border-b border-border bg-paper py-24 lg:py-32">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 lg:grid-cols-12 lg:px-10">
          <div className="lg:col-span-4">
            <span className="technical-label text-muted-foreground">01 / The premise</span>
            <h2 className="display-title mt-6 text-5xl md:text-7xl">
              ARC is a city
              <br />
              <span className="text-cobalt">that needs you.</span>
            </h2>
            <div className="mt-9 space-y-5 text-lg leading-7">
              <p>Every Netizen has a role.</p>
              <p>Every role has different strengths.</p>
              <p>Every decision changes the city.</p>
            </div>
          </div>
          <div className="relative min-h-[520px] border border-border lg:col-span-8">
            <div className="absolute left-5 top-5 technical-label text-muted-foreground">
              City Zero / Role topology
            </div>
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 800 520"
              aria-hidden="true"
            >
              <g fill="none" stroke="currentColor" strokeWidth="1" opacity=".25">
                <path d="M112 125L400 260L680 145M70 225L400 260L735 375M225 458L400 260L545 468M70 225L112 125M680 145L735 375" />
              </g>
            </svg>
            <div className="absolute left-1/2 top-1/2 grid size-32 -translate-x-1/2 -translate-y-1/2 place-items-center border border-cobalt bg-background text-center">
              <span className="technical-label text-cobalt">
                One city
                <br />
                <span className="text-foreground">City Zero</span>
              </span>
            </div>
            {cityNodes.map(([name, left, top], index) => (
              <button
                key={name}
                type="button"
                onClick={() => {
                  const next = roles.findIndex((role) => role.name === name);
                  if (next >= 0) {
                    setSelected(next);
                    scrollTo("netizens");
                  }
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 bg-paper px-2 py-1 technical-label transition-colors hover:text-cobalt ${roles[selected]?.name === name ? "text-cobalt" : "text-foreground"}`}
                style={{ left: `${left}%`, top: `${top}%` }}
              >
                <span className="mr-2 inline-block size-1.5 rounded-full bg-cobalt" />
                {String(index + 1).padStart(2, "0")} / {name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="netizens" className="scroll-mt-18 bg-background py-24 lg:py-32">
        <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="technical-label text-muted-foreground">02 / Netizen registry</span>
              <h2 className="display-title mt-6 text-5xl md:text-7xl">
                Choose
                <br />
                your role.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              Your Netizen is your identity. Your role is your ability. Select a card to see how you
              shape the city.
            </p>
          </div>
          <div className="grid grid-cols-2 border-l border-t border-border sm:grid-cols-3 lg:grid-cols-4">
            {roles.map((role, index) => (
              <Button
                key={role.id}
                type="button"
                variant="ghost"
                onClick={() => setSelected(index)}
                className={`group relative h-auto min-h-[300px] items-stretch overflow-hidden rounded-none border-b border-r border-border bg-paper p-0 text-left transition-colors hover:bg-cobalt-soft ${selected === index ? "bg-cobalt-soft" : ""}`}
                aria-label={`Select ${role.name}`}
              >
                <div className="flex w-full flex-col">
                  <div className="relative aspect-[2/3] overflow-hidden bg-paper">
                    <img
                      src={role.image}
                      alt={`${role.name} Netizen card`}
                      loading="lazy"
                      width={1024}
                      height={1536}
                      className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.03]"
                    />
                    <span className="absolute left-3 top-3 technical-label text-foreground">
                      ID / {role.id}
                    </span>
                    <span className="absolute bottom-3 right-3 size-2 rounded-full bg-cobalt" />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <div className="technical-label flex justify-between text-muted-foreground">
                      <span>Netizen</span>
                      <span>8 / 8</span>
                    </div>
                    <h3 className="mt-3 text-sm font-semibold uppercase">{role.name}</h3>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">{role.desc}</p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
          <div className="mt-8 grid border border-border bg-paper lg:grid-cols-[1.15fr_1fr]">
            <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden border-b border-border p-6 lg:border-b-0 lg:border-r">
              <img
                src={netizen.image}
                alt={`Selected Netizen: The ${netizen.name}`}
                width={1024}
                height={1536}
                className="max-h-[560px] w-auto max-w-full object-contain"
              />
              <div className="absolute bottom-6 left-6 technical-label">
                ARC–{netizen.id} / Selected
              </div>
            </div>
            <div className="p-7 md:p-10">
              <div className="technical-label flex justify-between text-muted-foreground">
                <span>Netizen number {netizen.id}</span>
                <span>Role / Ability</span>
              </div>
              <h3 className="mt-10 text-4xl font-medium uppercase">The {netizen.name}</h3>
              <div className="mt-4 h-1 w-16 bg-cobalt" />
              <p className="mt-5 max-w-md text-sm leading-6 text-muted-foreground">
                {netizen.desc}
              </p>
              <div className="mt-8 grid grid-cols-2 border-l border-t border-border">
                <div className="border-b border-r border-border p-4">
                  <span className="technical-label text-muted-foreground">Ability</span>
                  <p className="mt-2 text-sm font-semibold uppercase">{netizen.ability}</p>
                </div>
                <div className="border-b border-r border-border p-4">
                  <span className="technical-label text-muted-foreground">Strength</span>
                  <p className="mt-2 text-sm font-semibold uppercase">
                    {netizen.name === "Builder" || netizen.name === "Architect"
                      ? "Infrastructure"
                      : "Civic influence"}
                  </p>
                </div>
                <div className="border-b border-r border-border p-4">
                  <span className="technical-label text-muted-foreground">City function</span>
                  <p className="mt-2 text-sm font-semibold uppercase">
                    {netizen.name === "Guardian" ? "Protect" : "Advance"}
                  </p>
                </div>
                <div className="border-b border-r border-border p-4">
                  <span className="technical-label text-muted-foreground">Decision weight</span>
                  <p className="mt-2 text-sm font-semibold uppercase text-cobalt">Active</p>
                </div>
              </div>
              <Button variant="registry" className="mt-8" onClick={() => setJoinOpen(true)}>
                Play as this Netizen <ArrowUpRight />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="border-b border-border bg-background py-24 lg:py-32">
        <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
          <span className="technical-label text-muted-foreground">03 / Progression</span>
          <h2 className="display-title mt-6 max-w-3xl text-5xl md:text-7xl">
            Three steps.
            <br />A living record.
          </h2>
          <div className="mt-16 grid border-l border-t border-border md:grid-cols-3">
            {[
              [
                "01",
                "Become a Netizen",
                "Claim an identity and choose the ability you bring to the city.",
              ],
              [
                "02",
                "Make decisions",
                "Use your role to respond when City Zero presents a crisis.",
              ],
              [
                "03",
                "Build your record",
                "Earn reputation, unlock achievements, and leave a trace in civic history.",
              ],
            ].map(([number, title, copy]) => (
              <div
                key={number}
                className="min-h-[280px] border-b border-r border-border p-6 md:p-8"
              >
                <span className="font-mono text-6xl text-cobalt">{number}</span>
                <h3 className="mt-12 text-xl font-semibold uppercase">{title}</h3>
                <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-foreground py-24 text-primary-foreground lg:py-36">
        <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
          <span className="technical-label text-primary-foreground/50">
            06 / Founding principle
          </span>
          <h2 className="display-title mt-10 max-w-6xl text-[clamp(3.2rem,8vw,8rem)]">
            Different roles.
            <br />
            <span className="text-primary-foreground/40">Same humanity.</span>
          </h2>
          <p className="mt-12 max-w-xl text-lg leading-8 text-primary-foreground/65">
            The future is not built by one type of person.
            <br />
            It is built by everyone.
          </p>
        </div>
      </section>

      <section id="join" className="relative min-h-[700px] scroll-mt-18 overflow-hidden bg-paper">
        <img
          src={roles[7]?.image}
          alt="Fingerprint silhouette of an ARC Netizen"
          loading="lazy"
          width={768}
          height={1024}
          className="absolute inset-y-0 right-0 h-full w-full object-contain object-center opacity-35 mix-blend-multiply md:w-2/3"
        />
        <div className="relative mx-auto flex min-h-[700px] max-w-[1440px] flex-col justify-between px-5 py-16 lg:px-10">
          <span className="technical-label text-cobalt">Network invitation / Open</span>
          <div>
            <h2 className="display-title max-w-5xl text-[clamp(4rem,10vw,10rem)]">
              The city
              <br />
              is waiting.
            </h2>
            <Button
              variant="registry"
              size="lg"
              className="mt-10"
              onClick={() => setJoinOpen(true)}
            >
              Become a netizen <ArrowUpRight />
            </Button>
          </div>
          <div className="flex flex-col justify-between gap-8 border-t border-border pt-8 md:flex-row">
            <Mark />
            <p className="max-w-sm text-sm uppercase leading-6">
              Identity becomes ability.
              <br />
              Decisions become history.
            </p>
            <span className="technical-label text-muted-foreground">ARC Protocol / 2026</span>
          </div>
        </div>
      </section>
    </main>
  );
}
