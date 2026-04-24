import { expect, test } from "@playwright/test"

const MATCH_DATE_ID = "match_date"
const AWAY_TEAM_ID = "away_team"

function futureDate(): string {
  const d = new Date()
  d.setDate(d.getDate() + 7)
  return d.toISOString().slice(0, 16)
}

test.describe("Match management dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard")
    await page.waitForLoadState("networkidle")
  })

  test("Dashboard page loads and shows correct heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "管理面板" })).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "添加新比赛" }),
    ).toBeVisible()
    await expect(page.getByRole("heading", { name: "比赛列表" })).toBeVisible()
  })

  test("Create a new match", async ({ page }) => {
    const opponentName = `测试对手-${Date.now()}`

    await page.locator(`#${MATCH_DATE_ID}`).fill(futureDate())
    await page.locator(`#${AWAY_TEAM_ID}`).fill(opponentName)

    await page.getByRole("button", { name: "发布比赛" }).click()

    await expect(page.getByText("比赛已创建")).toBeVisible()
    await expect(page.getByText(opponentName)).toBeVisible()
  })

  test("Edit a match inline", async ({ page }) => {
    const opponentName = `编辑测试-${Date.now()}`

    await page.locator(`#${MATCH_DATE_ID}`).fill(futureDate())
    await page.locator(`#${AWAY_TEAM_ID}`).fill(opponentName)
    await page.getByRole("button", { name: "发布比赛" }).click()
    await expect(page.getByText("比赛已创建")).toBeVisible()

    const matchRow = page
      .locator("div")
      .filter({ hasText: opponentName })
      .last()
    await matchRow.getByRole("button", { name: "编辑" }).click()

    const editForm = page.locator("#edit_away_team")
    await expect(editForm).toBeVisible()

    const updatedName = `${opponentName}-已编辑`
    await editForm.fill(updatedName)
    await page.getByRole("button", { name: "保存" }).click()

    await expect(page.getByText("比赛已更新")).toBeVisible()
    await expect(page.getByText(updatedName)).toBeVisible()
  })

  test("Toggle match status (upcoming → live → completed)", async ({
    page,
  }) => {
    const opponentName = `状态测试-${Date.now()}`

    await page.locator(`#${MATCH_DATE_ID}`).fill(futureDate())
    await page.locator(`#${AWAY_TEAM_ID}`).fill(opponentName)
    await page.getByRole("button", { name: "发布比赛" }).click()
    await expect(page.getByText("比赛已创建")).toBeVisible()

    const matchRow = page
      .locator("div")
      .filter({ hasText: opponentName })
      .last()

    await matchRow.getByRole("button", { name: "开始比赛" }).click()
    await expect(page.getByText("比赛已更新")).toBeVisible()

    await matchRow.getByRole("button", { name: "结束比赛" }).click()
    await expect(page.getByText("比赛已更新")).toBeVisible()
  })

  test("Delete a match with confirmation dialog", async ({ page }) => {
    const opponentName = `删除测试-${Date.now()}`

    await page.locator(`#${MATCH_DATE_ID}`).fill(futureDate())
    await page.locator(`#${AWAY_TEAM_ID}`).fill(opponentName)
    await page.getByRole("button", { name: "发布比赛" }).click()
    await expect(page.getByText("比赛已创建")).toBeVisible()

    const matchRow = page
      .locator("div")
      .filter({ hasText: opponentName })
      .last()

    await matchRow.getByRole("button", { name: "删除" }).click()

    const dialog = page.getByRole("alertdialog")
    await expect(dialog).toBeVisible()
    await expect(dialog.getByText("确认删除")).toBeVisible()

    await dialog.getByRole("button", { name: "取消" }).click()
    await expect(dialog).not.toBeVisible()
    await expect(page.getByText(opponentName)).toBeVisible()

    await matchRow.getByRole("button", { name: "删除" }).click()
    await page
      .getByRole("alertdialog")
      .getByRole("button", { name: "删除" })
      .click()

    await expect(page.getByText("比赛已删除")).toBeVisible()
  })

  test("Filter matches by status tabs", async ({ page }) => {
    await expect(page.getByRole("button", { name: "全部" })).toBeVisible()
    await expect(page.getByRole("button", { name: "即将开始" })).toBeVisible()
    await expect(page.getByRole("button", { name: "进行中" })).toBeVisible()
    await expect(page.getByRole("button", { name: "已结束" })).toBeVisible()

    await page.getByRole("button", { name: "即将开始" }).click()
    await page.waitForLoadState("networkidle")

    await page.getByRole("button", { name: "全部" }).click()
    await page.waitForLoadState("networkidle")
  })

  test("Live score widget shows placeholder when no live match", async ({
    page,
  }) => {
    await expect(page.getByText("暂无进行中的比赛")).toBeVisible()
  })
})
