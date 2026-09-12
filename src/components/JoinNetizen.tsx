import { useMemo, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, Download } from "lucide-react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NetizenCard } from "@/components/NetizenCard";
import { roles, type Role } from "@/lib/arc-data";
import { questions, resolveRole } from "@/lib/assessment";
import { supabase } from "@/integrations/supabase/client";

const ARC_X = "https://x.com/arc_netizen";
const ARC_PINNED_POST_URL = "https://x.com/arc_netizen";

const roleQuotes: Record<string, string> = {
  Merchant:
    "I am the Merchant of City Zero.\nValue only matters when it moves — so I keep it moving.\nDifferent roles. Same humanity.",
  Builder:
    "I am the Builder of City Zero.\nI turn ideas into something that still stands tomorrow.\nDifferent roles. Same humanity.",
  Traveler:
    "I am the Traveler of City Zero.\nEvery edge of the map is just a route nobody has walked yet.\nDifferent roles. Same humanity.",
  Trader:
    "I am the Trader of City Zero.\nI read the motion of markets and find the opening.\nDifferent roles. Same humanity.",
  Architect:
    "I am the Architect of City Zero.\nI design the systems the city quietly relies on.\nDifferent roles. Same humanity.",
  Creator:
    "I am the Creator of City Zero.\nI bring the city's story on-chain so it is never forgotten.\nDifferent roles. Same humanity.",
  Guardian:
    "I am the Guardian of City Zero.\nI stand between the network and everything that would break it.\nDifferent roles. Same humanity.",
  Visionary:
    "I am the Visionary of City Zero.\nI see the future arriving before it does.\nDifferent roles. Same humanity.",
};

function openX(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function Step({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-border bg-background p-5">
      <div className="technical-label flex items-center justify-between text-muted-foreground">
        <span>Task {index}</span>
      </div>
      <h4 className="mt-3 text-sm font-semibold uppercase">{title}</h4>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function Done({ label }: { label: string }) {
  return (
    <p className="technical-label flex items-center gap-2 text-cobalt">
      <Check className="size-4" /> {label}
    </p>
  );
}

export function JoinNetizen({
  open,
  onOpenChange,
  selected,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  selected: number;
  onSelect: (i: number) => void;
}) {
  const [username, setUsername] = useState("");
  const [openedFollow, setOpenedFollow] = useState(false);
  const [openedLike, setOpenedLike] = useState(false);
  const [openedRepost, setOpenedRepost] = useState(false);
  const [openedComment, setOpenedComment] = useState(false);
  const [openedQuote, setOpenedQuote] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [commented, setCommented] = useState(false);
  const [picks, setPicks] = useState<string[]>([]);
  const [role, setRole] = useState<Role | null>(null);
  const [quoteUrl, setQuoteUrl] = useState("");
  const [quoteDone, setQuoteDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const [wallet, setWallet] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [record, setRecord] = useState<{ number: string } | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const finalCardRef = useRef<HTMLDivElement>(null);

  const cardNumber = useMemo(
    () => (role ? String(Math.floor(1000 + Math.random() * 8999)) : ""),
    [role],
  );

  const tasksDone = followed && liked && reposted && commented;
  const walletValid = /^0x[a-fA-F0-9]{40}$/.test(wallet.trim());
  const handle = username.trim().replace(/^@/, "");
  const caption = role ? (roleQuotes[role.name] ?? "") : "";

  function reset(v: boolean) {
    onOpenChange(v);
    if (!v) {
      setUsername("");
      setOpenedFollow(false);
      setOpenedLike(false);
      setOpenedRepost(false);
      setOpenedComment(false);
      setOpenedQuote(false);
      setFollowed(false);
      setLiked(false);
      setReposted(false);
      setCommented(false);
      setPicks([]);
      setRole(null);
      setQuoteUrl("");
      setQuoteDone(false);
      setCopied(false);
      setWallet("");
      setError(null);
      setRecord(null);
    }
  }

  function answer(roleName: string) {
    const next = [...picks, roleName];
    setPicks(next);
    if (next.length === questions.length) {
      const resolved = resolveRole(next);
      setRole(resolved);
      const index = roles.findIndex((r) => r.name === resolved.name);
      if (index >= 0) onSelect(index);
    }
  }

  async function download(node: HTMLDivElement | null, label: string) {
    if (!node) return;
    const dataUrl = await toPng(node, {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: "#ffffff",
    });
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `arc-netizen-${label}.png`;
    link.click();
  }

  async function copyCaption() {
    await navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function join() {
    if (!role || !walletValid) return;
    setSaving(true);
    setError(null);
    const { data, error: insertError } = await supabase
      .from("netizens")
      .insert({
        x_username: handle,
        wallet_address: wallet.trim(),
        role_slug: role.name.toLowerCase(),
      })
      .select("netizen_number")
      .single();

    setSaving(false);
    if (insertError) {
      setError(
        insertError.code === "23505"
          ? "This X username or wallet is already in the registry."
          : "Your record could not be saved right now. Please try again.",
      );
      return;
    }
    setRecord({
      number: String((data as { netizen_number?: number } | null)?.netizen_number ?? cardNumber),
    });
  }

  const activeRole = role ?? roles[selected] ?? roles[0]!;
  const question = questions[picks.length];

  return (
    <Dialog open={open} onOpenChange={reset}>
      <DialogContent className="max-h-[88vh] max-w-lg gap-0 overflow-y-auto rounded-none border-border bg-paper p-0">
        <DialogHeader className="border-b border-border p-6">
          <DialogTitle className="text-left text-sm font-semibold uppercase tracking-widest">
            {record ? "Netizen registry — joined" : "Earn your netizen card"}
          </DialogTitle>
        </DialogHeader>

        {record ? (
          <div className="space-y-5 p-6">
            <div className="flex justify-center">
              <div ref={finalCardRef}>
                <NetizenCard
                  role={activeRole}
                  number={String(record.number).padStart(4, "0")}
                  username={handle || "netizen"}
                />
              </div>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              You are recorded in the public Netizen Registry as Netizen #
              {String(record.number).padStart(4, "0")}, The {activeRole.name}.
            </p>
            <Button
              variant="registryOutline"
              className="w-full"
              onClick={() => download(finalCardRef.current, String(record.number))}
            >
              Download your netizen card <Download />
            </Button>
            <Button variant="registry" className="w-full" asChild>
              <a href="/registry">
                Open the registry <ArrowUpRight />
              </a>
            </Button>
          </div>
        ) : (
          <div className="space-y-4 p-6">
            <div>
              <Label htmlFor="x-username" className="technical-label text-muted-foreground">
                Your X username
              </Label>
              <Input
                id="x-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="@yourhandle"
                className="mt-3 rounded-none border-border bg-background"
              />
            </div>

            <Step index="01" title="Follow @arc_netizen">
              <Button
                variant="registryOutline"
                className="w-full"
                onClick={() => {
                  setOpenedFollow(true);
                  openX(ARC_X);
                }}
              >
                Follow on X <ArrowUpRight />
              </Button>
              {followed ? (
                <Done label="Follow completed" />
              ) : (
                <>
                  <Button
                    variant="registry"
                    className="w-full"
                    disabled={!openedFollow}
                    onClick={() => setFollowed(true)}
                  >
                    I completed this
                  </Button>
                  {!openedFollow && (
                    <p className="text-xs text-muted-foreground">Open the X link first.</p>
                  )}
                </>
              )}
            </Step>

            <Step index="02" title="Like the pinned ARC post">
              <Button
                variant="registryOutline"
                className="w-full"
                onClick={() => {
                  setOpenedLike(true);
                  openX(ARC_PINNED_POST_URL);
                }}
              >
                Open ARC post <ArrowUpRight />
              </Button>
              {liked ? (
                <Done label="Task 02 complete" />
              ) : (
                <Button
                  variant="registry"
                  className="w-full"
                  disabled={!openedLike}
                  onClick={() => setLiked(true)}
                >
                  I liked the post
                </Button>
              )}
              {!openedLike && (
                <p className="text-xs text-muted-foreground">Open the ARC post first.</p>
              )}
            </Step>

            <Step index="03" title="Repost the pinned ARC post">
              <Button
                variant="registryOutline"
                className="w-full"
                onClick={() => {
                  setOpenedRepost(true);
                  openX(ARC_PINNED_POST_URL);
                }}
              >
                Open ARC post <ArrowUpRight />
              </Button>
              {reposted ? (
                <Done label="Task 03 complete" />
              ) : (
                <Button
                  variant="registry"
                  className="w-full"
                  disabled={!openedRepost}
                  onClick={() => setReposted(true)}
                >
                  I reposted the post
                </Button>
              )}
              {!openedRepost && (
                <p className="text-xs text-muted-foreground">Open the ARC post first.</p>
              )}
            </Step>

            <Step index="04" title="Comment on the pinned ARC post">
              <Button
                variant="registryOutline"
                className="w-full"
                onClick={() => {
                  setOpenedComment(true);
                  openX(ARC_PINNED_POST_URL);
                }}
              >
                Comment on X <ArrowUpRight />
              </Button>
              {commented ? (
                <Done label="Task 04 complete" />
              ) : (
                <>
                  <Button
                    variant="registry"
                    className="w-full"
                    disabled={!openedComment}
                    onClick={() => setCommented(true)}
                  >
                    I posted my comment
                  </Button>
                  {!openedComment && (
                    <p className="text-xs text-muted-foreground">Open the ARC post first.</p>
                  )}
                </>
              )}
            </Step>

            <Step index="05" title="Discover your netizen role">
              {!tasksDone && (
                <p className="text-xs text-muted-foreground">Complete tasks 01–04 to unlock.</p>
              )}
              {tasksDone && !role && question && (
                <div>
                  <p className="technical-label text-muted-foreground">
                    Question {picks.length + 1} / {questions.length}
                  </p>
                  <p className="mt-2 text-sm font-semibold uppercase leading-5">
                    {question.prompt}
                  </p>
                  <div className="mt-3 space-y-2">
                    {question.answers.map((a) => (
                      <button
                        key={a.label}
                        type="button"
                        onClick={() => answer(a.role)}
                        className="w-full border border-border px-3 py-3 text-left text-sm transition-colors hover:border-foreground hover:bg-cobalt-soft"
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {role && <Done label={`Role discovered — the ${role.name}`} />}
            </Step>

            {role && (
              <Step index="06" title="Quote your netizen card">
                <div className="flex justify-center">
                  <div ref={cardRef}>
                    <NetizenCard role={role} number={cardNumber} username={handle || "netizen"} />
                  </div>
                </div>
                <Button
                  variant="registryOutline"
                  className="w-full"
                  onClick={() => download(cardRef.current, cardNumber)}
                >
                  Download your netizen card <Download />
                </Button>
                <p className="text-xs leading-5 text-muted-foreground">
                  Share your Netizen Card on X and add your own thought — or use these lines written
                  for The {role.name}.
                </p>
                <div className="border border-border bg-paper p-4">
                  <p className="whitespace-pre-line text-sm leading-6">{caption}</p>
                  <Button
                    variant="registryOutline"
                    size="sm"
                    className="mt-3"
                    onClick={copyCaption}
                  >
                    {copied ? "Copied" : "Copy these lines"} <Copy />
                  </Button>
                </div>
                <Button
                  variant="registryOutline"
                  className="w-full"
                  onClick={() => {
                    setOpenedQuote(true);
                    openX(`https://x.com/intent/post?text=${encodeURIComponent(caption)}`);
                  }}
                >
                  Quote your card on X <ArrowUpRight />
                </Button>
                <Label htmlFor="quote-url" className="technical-label text-muted-foreground">
                  Paste your quote post URL
                </Label>
                <Input
                  id="quote-url"
                  value={quoteUrl}
                  onChange={(e) => setQuoteUrl(e.target.value)}
                  placeholder="https://x.com/username/status/..."
                  className="rounded-none border-border bg-background"
                />
                {quoteDone ? (
                  <Done label="Task 06 complete — submitted" />
                ) : (
                  <>
                    <Button
                      variant="registry"
                      className="w-full"
                      disabled={!openedQuote || !quoteUrl.trim()}
                      onClick={() => setQuoteDone(true)}
                    >
                      I completed this
                    </Button>
                    {!openedQuote && (
                      <p className="text-xs text-muted-foreground">
                        Open X and post your quote first.
                      </p>
                    )}
                  </>
                )}
              </Step>
            )}

            {quoteDone && (
              <Step index="07" title="Enter your EVM wallet">
                <Input
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                  placeholder="0x…"
                  className="rounded-none border-border bg-background font-mono"
                  aria-label="EVM wallet address"
                />
                {wallet && !walletValid && (
                  <p className="text-xs text-destructive">
                    Enter a valid EVM address (0x + 40 characters).
                  </p>
                )}
                <p className="technical-label text-muted-foreground">
                  Your details are safeguarded.
                </p>
                {error && <p className="text-xs text-destructive">{error}</p>}
                <Button
                  variant="registry"
                  className="w-full"
                  disabled={!walletValid || !handle || saving}
                  onClick={join}
                >
                  {saving ? "Joining…" : "Join the netizen registry"} <ArrowUpRight />
                </Button>
              </Step>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
