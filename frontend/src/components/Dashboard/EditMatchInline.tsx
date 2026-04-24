import type { MatchPatch, MatchPublic } from "@/client"
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
    }
    onSave(body)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 border-t-2 border-[#E5E5E5] pt-4"
    >
      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <label
            htmlFor="edit_match_date"
            className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#707072]"
          >
            比赛时间
          </label>
          <input
            id="edit_match_date"
            name="match_date"
            type="datetime-local"
            defaultValue={toBeijingDatetimeLocal(match.match_date)}
            className="w-full rounded-lg border-2 border-[#E5E5E5] bg-white px-3 py-2 text-sm focus:border-[#111111] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-1"
          />
        </div>
        <div>
          <label
            htmlFor="edit_home_team"
            className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#707072]"
          >
            主队
          </label>
          <input
            id="edit_home_team"
            name="home_team"
            defaultValue={match.home_team}
            className="w-full rounded-lg border-2 border-[#E5E5E5] bg-white px-3 py-2 text-sm focus:border-[#111111] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-1"
          />
        </div>
        <div>
          <label
            htmlFor="edit_away_team"
            className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#707072]"
          >
            客队
          </label>
          <input
            id="edit_away_team"
            name="away_team"
            defaultValue={match.away_team}
            className="w-full rounded-lg border-2 border-[#E5E5E5] bg-white px-3 py-2 text-sm focus:border-[#111111] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-1"
          />
        </div>
        <div>
          <label
            htmlFor="edit_home_score"
            className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#707072]"
          >
            主队比分
          </label>
          <input
            id="edit_home_score"
            name="home_score"
            type="number"
            min={0}
            defaultValue={match.home_score ?? ""}
            className="w-full rounded-lg border-2 border-[#E5E5E5] bg-white px-3 py-2 text-sm focus:border-[#111111] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-1"
          />
        </div>
        <div>
          <label
            htmlFor="edit_away_score"
            className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#707072]"
          >
            客队比分
          </label>
          <input
            id="edit_away_score"
            name="away_score"
            type="number"
            min={0}
            defaultValue={match.away_score ?? ""}
            className="w-full rounded-lg border-2 border-[#E5E5E5] bg-white px-3 py-2 text-sm focus:border-[#111111] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-1"
          />
        </div>
        <div>
          <label
            htmlFor="edit_precautions"
            className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#707072]"
          >
            注意事项
          </label>
          <input
            id="edit_precautions"
            name="precautions"
            defaultValue={match.precautions ?? ""}
            className="w-full rounded-lg border-2 border-[#E5E5E5] bg-white px-3 py-2 text-sm focus:border-[#111111] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-1"
          />
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-[30px] bg-[#111111] px-5 py-2 font-display text-xs tracking-wide text-white transition-colors hover:bg-[#292929] disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2"
          style={{ fontWeight: 700 }}
        >
          保存
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-[30px] border-2 border-[#E5E5E5] px-5 py-2 font-display text-xs tracking-wide text-[#707072] transition-colors hover:border-[#111111] hover:text-[#111111] outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2"
          style={{ fontWeight: 700 }}
        >
          取消
        </button>
      </div>
    </form>
  )
}
