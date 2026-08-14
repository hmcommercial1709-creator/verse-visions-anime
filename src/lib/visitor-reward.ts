export const REWARD_THRESHOLD_MS = 7 * 60 * 1000;
export const REWARD_PROGRESS_KEY = "gamecastle.reward.anime-wallpapers.progress.v1";
export const REWARD_UNLOCKED_KEY = "gamecastle.reward.anime-wallpapers.unlocked.v1";
export const REWARD_NOTICE_KEY = "gamecastle.reward.anime-wallpapers.notice.v1";

export function clampRewardProgress(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return Math.min(parsed, REWARD_THRESHOLD_MS);
}

export function addVisibleBrowsingTime(progress: number, elapsedMs: number): number {
  const safeElapsed = Number.isFinite(elapsedMs) ? Math.max(0, Math.min(elapsedMs, 5_000)) : 0;
  return clampRewardProgress(progress + safeElapsed);
}
