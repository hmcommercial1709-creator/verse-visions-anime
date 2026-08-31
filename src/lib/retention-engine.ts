export interface UserRetentionReward {
  userId: string;
  dailyStreak: number;
  unlockedBadges: string[];
  rewardPoints: number;
  lastClaimDate: string;
}

export function calculateDailyEngagementBonus(currentStreak: number): { points: number; bonusMessage: string } {
  const basePoints = 50;
  const multiplier = Math.min(currentStreak, 10);
  const totalPoints = basePoints * multiplier;

  return {
    points: totalPoints,
    bonusMessage: `🔥 Streak x${currentStreak}: You unlocked ${totalPoints} bonus gaming credits & anime wallpapers!`
  };
}

export function triggerInteractiveLoop(userAction: string): { nextAction: string; dopamineTrigger: boolean } {
  switch (userAction) {
    case "spin_wheel":
      return { nextAction: "Claim mystery Steam key or rare anime art piece", dopamineTrigger: true };
    case "unlock_chapter":
      return { nextAction: "Proceed to next high-resolution gallery instantly", dopamineTrigger: true };
    default:
      return { nextAction: "Explore trending 2026 global deals", dopamineTrigger: false };
  }
}
