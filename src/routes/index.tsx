import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { EXAMPLE_ACTOR, EXAMPLE_BRIEF, EXAMPLE_SHOTS, type Shot } from "@/data/example-plan";
import { buildShotPlan } from "@/lib/plan.functions";
import {
  FREE_CREDITS_DEFAULT,
  IMAGE_CREDITS,
  KEYFRAME_CREDITS,
  MODEL_NAMES,
  SCENARIOS,
  SHOT_COUNT,
  keyframesFor,
  planCoverage,
  planTotal,
  scenarioTotal,
  shotCredits,
  testImagesFor,
  timingLabel,
  type ModelName,
} from "@/lib/pricing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Launchpad — Plan your first HexCoded ad" },
      {
        name: "description",
        content:
          "Turn a client brief into a five shot plan, then see exactly what your 40 free HexCoded credits cover and what the finished ad costs.",
      },
      { property: "og:title", content: "Launchpad — Plan your first HexCoded ad" },
      {
        property: "og:description",
        content:
          "Plan the whole ad first. Spend your free credits on one project instead of unrelated test images.",
      },
    ],
  }),
  component: Launchpad,
});

const STEPS = ["Brief", "Shot plan", "Actor", "Credits and cost"];

function Launchpad() {
  const [step, setStep] = useState(1);
  const [brief, setBrief] = useState("");
  const [shots, setShots] = useState<Shot[]>(EXAMPLE_SHOTS);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [briefError, setBriefError] = useState<string | null>(null);
  const generate = useServerFn(buildShotPlan);

  const total = useMemo(() => planTotal(shots.map((s) => s.model)), [shots]);

  async function handleBuild() {
    const text = brief.trim();
    if (!text) {
      setBriefError("Add a brief or a product link first, or use the example brief below.");
      return;
    }
    if (/^https?:\/\//i.test(text)) {
      try {
        const url = new URL(text);
        if (!url.hostname.includes(".")) throw new Error("bad host");
      } catch {
        setBriefError("That link does not look valid. Paste a full address such as https://example.com/product.");
        return;
      }
    }
    setBriefError(null);
    setLoading(true);
    setNotice(null);
    try {
      const result = await generate({ data: { brief: text } });
      setShots(result.shots);
      setNotice(result.notice ?? null);
      setStep(2);
    } catch {
      setShots(EXAMPLE_SHOTS);
      setNotice(
        "The request did not go through, so Launchpad loaded the worked example plan instead. Everything below is editable.",
      );
      setStep(2);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <header className="border-b border-rule pb-6">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">HexCoded</p>
        <h1 className="mt-2 text-3xl sm:text-4xl">Launchpad</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Plan the whole ad before you spend a credit. Five shots, one actor, and a clear picture of what your
          free credits cover versus the finished 15 second ad.
        </p>
      </header>

      <Progress step={step} onSelect={setStep} />

      {notice && step > 1 && (
        <p className="mb-6 border-l-2 border-navy bg-surface px-4 py-3 text-sm text-foreground">{notice}</p>
      )}

      {step === 1 && (
        <StepBrief
          brief={brief}
          setBrief={(v) => {
            setBrief(v);
            setBriefError(null);
          }}
          error={briefError}
          loading={loading}
          onBuild={handleBuild}
        />
      )}
      {step === 2 && <StepShots shots={shots} setShots={setShots} total={total} onNext={() => setStep(3)} />}
      {step === 3 && <StepActor onNext={() => setStep(4)} onBack={() => setStep(2)} />}
      {step === 4 && <StepCredits shots={shots} total={total} onBack={() => setStep(3)} />}
    </main>
  );
}

function Progress({ step, onSelect }: { step: number; onSelect: (n: number) => void }) {
  return (
    <nav aria-label="Progress" className="my-8 grid grid-cols-2 gap-px border border-rule bg-rule sm:grid-cols-4">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const active = n === step;
        return (
          <button
            key={label}
            type="button"
            onClick={() => onSelect(n)}
            aria-current={active ? "step" : undefined}
            className={`flex min-w-0 items-center gap-2 px-3 py-3 text-left text-sm transition-colors ${
              active ? "bg-navy text-navy-foreground" : "bg-background text-muted-foreground hover:bg-surface"
            }`}
          >
            <span className="shrink-0 text-xs font-medium tabular-nums opacity-80">{n}</span>
            <span className="truncate">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function StepBrief({
  brief,
  setBrief,
  error,
  loading,
  onBuild,
}: {
  brief: string;
  setBrief: (v: string) => void;
  error: string | null;
  loading: boolean;
  onBuild: () => void;
}) {
  return (
    <section>
      <h2 className="text-xl">Brief</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Paste a client brief or a product link. Launchpad turns it into a five shot plan for a 15 second ad.
      </p>
      <label htmlFor="brief" className="mt-6 block text-sm font-medium">
        Client brief or product link
      </label>
      <textarea
        id="brief"
        value={brief}
        onChange={(e) => setBrief(e.target.value)}
        rows={8}
        placeholder="A 15 second vertical ad for..."
        aria-invalid={Boolean(error)}
        className="field mt-2"
      />
      {error && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={onBuild}
          disabled={loading}
          className="bg-navy px-5 py-2.5 text-sm font-medium text-navy-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Building your shot plan..." : "Build my shot plan"}
        </button>
        <button
          type="button"
          onClick={() => setBrief(EXAMPLE_BRIEF)}
          className="text-sm text-navy underline underline-offset-4"
        >
          Try the example brief
        </button>
      </div>
    </section>
  );
}

function StepShots({
  shots,
  setShots,
  total,
  onNext,
}: {
  shots: Shot[];
  setShots: (s: Shot[]) => void;
  total: number;
  onNext: () => void;
}) {
  function update(id: string, patch: Partial<Shot>) {
    setShots(shots.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  return (
    <section>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4">
        <h2 className="min-w-0 text-xl">Shot plan</h2>
        <p className="shrink-0 text-sm tabular-nums text-muted-foreground">
          Running total <span className="font-medium text-foreground">{total.toLocaleString()}</span> credits
        </p>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">Every field is editable. Switching a model updates its cost.</p>

      <ol className="mt-6 space-y-5">
        {shots.map((shot, i) => (
          <li key={shot.id} className="border border-rule">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-rule bg-surface px-4 py-3">
              <p className="min-w-0 truncate text-sm font-medium">
                Shot {i + 1} <span className="text-muted-foreground">· {timingLabel(i)}</span>
              </p>
              <p className="shrink-0 text-sm tabular-nums">{shotCredits(shot.model).toLocaleString()} credits</p>
            </div>
            <div className="space-y-4 p-4">
              <div className="border border-dashed border-rule bg-surface p-4">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  No image generated — prompt preview
                </p>
                <p className="mt-2 text-sm leading-relaxed">{shot.scene || "Add a scene description."}</p>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  Scene description
                </label>
                <textarea
                  value={shot.scene}
                  rows={3}
                  onChange={(e) => update(shot.id, { scene: e.target.value })}
                  className="field mt-1"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    On screen text
                  </label>
                  <input
                    value={shot.onScreenText}
                    onChange={(e) => update(shot.id, { onScreenText: e.target.value })}
                    className="field mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    Model
                  </label>
                  <select
                    value={shot.model}
                    onChange={(e) => update(shot.id, { model: e.target.value as ModelName })}
                    className="field mt-1"
                  >
                    {MODEL_NAMES.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <button
        type="button"
        onClick={onNext}
        className="mt-8 bg-navy px-5 py-2.5 text-sm font-medium text-navy-foreground hover:opacity-90"
      >
        Next: your actor
      </button>
    </section>
  );
}

const HANDLE_RE = /^[a-z0-9_-]{2,32}$/;
const AGE_RANGES = ["18 to 24", "25 to 34", "35 to 44", "45 to 60"];

function handleError(handle: string): string | null {
  if (handle.length === 0) return "Enter a handle.";
  if (/\s/.test(handle)) return "Handles cannot contain spaces.";
  if (/[A-Z]/.test(handle)) return "Handles must be lowercase.";
  if (/[^a-z0-9_-]/.test(handle)) return "Handles can only use lowercase letters, numbers, dash or underscore.";
  if (handle.length < 2) return "Handles must be at least 2 characters.";
  if (handle.length > 32) return "Handles must be 32 characters or fewer.";
  return null;
}

function StepActor({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [displayName, setDisplayName] = useState("");
  const [handle, setHandle] = useState("");
  const [gender, setGender] = useState("Female");
  const [ageRange, setAgeRange] = useState<string>(AGE_RANGES[1]!);
  const [language, setLanguage] = useState("Hindi");
  const [vibe, setVibe] = useState("");
  const [description, setDescription] = useState("");

  // Validation runs as the user types, not on submit.
  const nameMissing = displayName.trim().length === 0;
  const handleErr = handleError(handle);

  const ageConflict = useMemo(() => {
    const parts = ageRange.split(" to ").map(Number);
    const lo = parts[0] ?? 0;
    const hi = parts[1] ?? 200;
    const ages = Array.from(description.matchAll(/\b(1[6-9]|[2-6]\d)\b/g)).map((m) => Number(m[1]));
    const off = ages.find((a) => a < lo || a > hi);
    return off ? { age: off, lo, hi } : null;
  }, [ageRange, description]);

  const missing = [nameMissing ? "display name" : null, handleErr ? "handle" : null].filter(Boolean) as string[];
  const canSubmit = missing.length === 0;

  function fillExample() {
    setDisplayName(EXAMPLE_ACTOR.displayName);
    setHandle(EXAMPLE_ACTOR.handle);
    setGender(EXAMPLE_ACTOR.gender);
    setAgeRange(EXAMPLE_ACTOR.ageRange);
    setLanguage(EXAMPLE_ACTOR.language);
    setVibe(EXAMPLE_ACTOR.vibe);
    setDescription(EXAMPLE_ACTOR.description);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onNext();
  }

  return (
    <section>
      <h2 className="text-xl">Actor</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        One recurring character keeps every shot consistent and stops wasted regenerations.
      </p>
      <button type="button" onClick={fillExample} className="mt-3 text-sm text-navy underline underline-offset-4">
        Fill the example actor
      </button>

      <form onSubmit={submit} noValidate className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="displayName" className="text-sm font-medium">
            Display name <span className="text-destructive">*</span>
          </label>
          <p className="text-xs text-muted-foreground">The name shown in your actor library.</p>
          <input
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            aria-invalid={nameMissing}
            className="field mt-1"
          />
          {nameMissing && (
            <p role="alert" className="mt-1 text-sm text-destructive">
              Enter a display name.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="handle" className="text-sm font-medium">
            Handle <span className="text-destructive">*</span>
          </label>
          <p className="text-xs text-muted-foreground">2 to 32 characters, lowercase letters, numbers, dash or underscore</p>
          <input
            id="handle"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            aria-invalid={Boolean(handleErr)}
            className="field mt-1"
          />
          {handleErr ? (
            <p role="alert" className="mt-1 text-sm text-destructive">
              {handleErr}
            </p>
          ) : (
            <p className="mt-1 text-sm text-success">&#10003; Handle looks good</p>
          )}
        </div>

        <div>
          <label htmlFor="gender" className="text-sm font-medium">
            Gender
          </label>
          <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} className="field mt-1">
            {["Female", "Male", "Non-binary", "Prefer not to say"].map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="ageRange" className="text-sm font-medium">
            Age range
          </label>
          <select id="ageRange" value={ageRange} onChange={(e) => setAgeRange(e.target.value)} className="field mt-1">
            {AGE_RANGES.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
          {ageConflict && (
            <p role="alert" className="mt-1 text-sm text-warning">
              Age range says {ageConflict.lo} to {ageConflict.hi}, but the description mentions {ageConflict.age}.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="language" className="text-sm font-medium">
            Primary language
          </label>
          <input id="language" value={language} onChange={(e) => setLanguage(e.target.value)} className="field mt-1" />
        </div>

        <div>
          <label htmlFor="vibe" className="text-sm font-medium">
            Vibe
          </label>
          <input
            id="vibe"
            value={vibe}
            placeholder="Calm, clean, everyday"
            onChange={(e) => setVibe(e.target.value)}
            className="field mt-1"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Who they are, how they move, how they speak to camera."
            className="field mt-1"
          />
          {ageConflict && (
            <p role="alert" className="mt-1 text-sm text-warning">
              The description mentions {ageConflict.age}, which sits outside the age range {ageConflict.lo} to{" "}
              {ageConflict.hi}.
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={!canSubmit}
              className="bg-navy px-5 py-2.5 text-sm font-medium text-navy-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              Build actor
            </button>
            <button type="button" onClick={onBack} className="border border-rule px-5 py-2.5 text-sm font-medium">
              Back
            </button>
          </div>
          {!canSubmit && (
            <p className="mt-2 text-sm text-muted-foreground">Still needed: {missing.join(", ")}.</p>
          )}
        </div>
      </form>
    </section>
  );
}

function StepCredits({ shots, total, onBack }: { shots: Shot[]; total: number; onBack: () => void }) {
  const [balance, setBalance] = useState(FREE_CREDITS_DEFAULT);
  const keyframes = keyframesFor(balance);
  const perShot = Math.min(keyframes, SHOT_COUNT);

  return (
    <section>
      <h2 className="text-xl">Credits and cost</h2>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="border border-rule p-5">
          <h3 className="text-lg">Your free credits</h3>
          <label htmlFor="balance" className="mt-4 block text-sm font-medium">
            Credit balance
          </label>
          <input
            id="balance"
            type="number"
            min={0}
            value={balance}
            onChange={(e) => setBalance(Math.max(0, Number(e.target.value) || 0))}
            className="field mt-1 max-w-[10rem]"
          />
          <p className="mt-4 text-sm leading-relaxed">
            {balance} credits equals {keyframes} keyframes at {KEYFRAME_CREDITS} credits each — enough to anchor{" "}
            {perShot} of your {shots.length} shots.
          </p>
          <ul className="mt-4 space-y-1 text-sm">
            {shots.map((shot, i) => (
              <li key={shot.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-rule py-1.5">
                <span className="min-w-0 truncate text-muted-foreground">
                  Shot {i + 1} · {timingLabel(i)}
                </span>
                <span className="shrink-0 tabular-nums">
                  {i < perShot ? `${KEYFRAME_CREDITS} credits` : "not covered"}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Without a plan, {balance} credits equals {testImagesFor(balance)} unrelated test images at{" "}
            {IMAGE_CREDITS} credits each.
          </p>
        </div>

        <div className="border border-rule p-5">
          <h3 className="text-lg">Full project cost</h3>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b border-rule text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
                <th className="py-2 font-medium">Shot</th>
                <th className="py-2 font-medium">Model</th>
                <th className="py-2 text-right font-medium">Credits</th>
              </tr>
            </thead>
            <tbody>
              {shots.map((shot, i) => (
                <tr key={shot.id} className="border-b border-rule">
                  <td className="py-2">{i + 1}</td>
                  <td className="py-2">{shot.model}</td>
                  <td className="py-2 text-right tabular-nums">{shotCredits(shot.model).toLocaleString()}</td>
                </tr>
              ))}
              <tr>
                <td className="py-2 font-medium" colSpan={2}>
                  Total
                </td>
                <td className="py-2 text-right font-medium tabular-nums">{total.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {SCENARIOS.map((s) => {
              const t = scenarioTotal(s);
              const { plan, ads } = planCoverage(t);
              return (
                <div key={s.key} className="border border-rule bg-surface p-3">
                  <p className="text-sm font-medium">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.detail}</p>
                  <p className="mt-2 text-lg tabular-nums">{t.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">credits per ad</p>
                  <p className="mt-2 text-xs">
                    {plan} covers about {ads} ads a month
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a
          href="https://hexcoded.ai"
          target="_blank"
          rel="noreferrer"
          className="bg-navy px-8 py-3.5 text-base font-medium text-navy-foreground hover:opacity-90"
        >
          Open in HexCoded
        </a>
        <button type="button" onClick={onBack} className="border border-rule px-5 py-2.5 text-sm font-medium">
          Back
        </button>
      </div>
    </section>
  );
}
