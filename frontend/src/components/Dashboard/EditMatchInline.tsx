import type { MatchPatch, MatchPublic } from "@/client"
import { Checkbox } from "@/components/ui/checkbox"
import { BEIJING_TZ_OFFSET, toBeijingDatetimeLocal } from "./shared"

export function EditMatchInline({
  match,
  onSave,
  onCancel,
  isPending,
}: {
  match: MatchPublic
  onSave: (body: MatchPatch) => void
  onCancel: () => void
  isPending: boolean
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const rawDate = fd.get("match_date") as string
    const precautionsVal = (fd.get("precautions") as string) ?? ""
    const body: MatchPatch = {
      match_date: rawDate ? `${rawDate}${BEIJING_TZ_OFFSET}` : undefined,
      home_team: (fd.get("home_team") as string) || undefined,
      away_team: (fd.get("away_team") as string) || undefined,
      precautions:
        precautionsVal !== (match.precautions ?? "")
          ? precautionsVal || null
          : undefined,
      home_score: fd.get("home_score")
        ? Number(fd.get("home_score"))
        : undefined,
      away_score: fd.get("away_score")
        ? Number(fd.get("away_score"))
        : undefined,
      is_public: fd.get("is_public") === "on",
    }
    onSave(body)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 border-t-1 border-border pt-4"
    >
      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <label
            htmlFor="edit_match_date"
            className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground"
          >
            比赛时间
          </label>
          <input
            id="edit_match_date"
            name="match_date"
            type="datetime-local"
            defaultValue={toBeijingDatetimeLocal(match.match_date)}
            className="w-full rounded-lg border-1 border-input bg-background px-3 py-2 text-sm transition-colors focus:border-ring focus:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
          />
        </div>
        <div>
          <label
            htmlFor="edit_home_team"
            className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground"
          >
            主队
          </label>
          <input
            id="edit_home_team"
            name="home_team"
            defaultValue={match.home_team}
            className="w-full rounded-lg border-1 border-input bg-background px-3 py-2 text-sm transition-colors focus:border-ring focus:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
          />
        </div>
        <div>
          <label
            htmlFor="edit_away_team"
            className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground"
          >
            客队
          </label>
          <input
            id="edit_away_team"
            name="away_team"
            defaultValue={match.away_team}
            className="w-full rounded-lg border-1 border-input bg-background px-3 py-2 text-sm transition-colors focus:border-ring focus:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
          />
        </div>
        <div>
          <label
            htmlFor="edit_home_score"
            className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground"
          >
            主队比分
          </label>
          <input
            id="edit_home_score"
            name="home_score"
            type="number"
            min={0}
            defaultValue={match.home_score ?? ""}
            className="w-full rounded-lg border-1 border-input bg-background px-3 py-2 text-sm transition-colors focus:border-ring focus:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
          />
        </div>
        <div>
          <label
            htmlFor="edit_away_score"
            className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground"
          >
            客队比分
          </label>
          <input
            id="edit_away_score"
            name="away_score"
            type="number"
            min={0}
            defaultValue={match.away_score ?? ""}
            className="w-full rounded-lg border-1 border-input bg-background px-3 py-2 text-sm transition-colors focus:border-ring focus:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
          />
        </div>
        <div>
          <label
            htmlFor="edit_precautions"
            className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground"
          >
            注意事项
          </label>
          <input
            id="edit_precautions"
            name="precautions"
            defaultValue={match.precautions ?? ""}
            className="w-full rounded-lg border-1 border-input bg-background px-3 py-2 text-sm transition-colors focus:border-ring focus:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
          />
        </div>
        <div className="md:col-span-3">
          <label
            htmlFor="edit_is_public"
            className="flex items-start gap-3 rounded-lg border-1 border-border bg-card p-3 transition-colors hover:border-ring"
          >
            <Checkbox
              id="edit_is_public"
              name="is_public"
              defaultChecked={match.is_public !== false}
            />
            <span className="flex flex-col gap-1">
              <span
                className="font-display text-xs tracking-wide text-foreground"
                style={{ fontWeight: 700 }}
              >
                公开展示比赛数据
              </span>
              <span className="font-body text-xs text-muted-foreground">
                关闭后，公众页面将隐藏该比赛的赛程、比分、动态和媒体。
              </span>
            </span>
          </label>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-[30px] bg-primary px-5 py-2 font-display text-xs tracking-wide text-primary-foreground transition-colors hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          style={{ fontWeight: 700 }}
        >
          保存
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-[30px] border-1 border-border px-5 py-2 font-display text-xs tracking-wide text-muted-foreground transition-colors hover:border-ring hover:text-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          style={{ fontWeight: 700 }}
        >
          取消
        </button>
      </div>
    </form>
  )
}
