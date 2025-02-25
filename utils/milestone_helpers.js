export function checkMilestoneEligibility(streakCount) {
  const milestones = [];
  
  // Weekly milestone (7 days)
  if (streakCount === 7) {
    milestones.push({ type: 'weekly', days: 7 });
  }
  
  // Monthly milestone (30 days)
  if (streakCount === 30) {
    milestones.push({ type: 'monthly', days: 30 });
  }
  
  // Custom milestones (can add more)
  const customMilestones = [90, 180, 365];
  if (customMilestones.includes(streakCount)) {
    milestones.push({ type: 'goal_reached', days: streakCount });
  }
  
  return milestones;
} 