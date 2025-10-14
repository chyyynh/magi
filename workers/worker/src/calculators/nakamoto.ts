/**
 * Calculate Nakamoto Coefficient
 * The minimum number of entities needed to control >50% of the network
 *
 * Higher is better (more decentralized)
 *
 * @param votingPowers - Array of voting powers sorted in descending order
 * @returns The Nakamoto coefficient
 */
export function calculateNakamotoCoefficient(votingPowers: number[]): number {
  if (votingPowers.length === 0) return 0;

  const sorted = [...votingPowers].sort((a, b) => b - a);
  const total = sorted.reduce((sum, power) => sum + power, 0);
  const threshold = total / 2;

  let cumulative = 0;
  let count = 0;

  for (const power of sorted) {
    cumulative += power;
    count++;
    if (cumulative > threshold) {
      break;
    }
  }

  return count;
}
