/**
 * Calculate Gini Coefficient
 * Measure of inequality (0 = perfect equality, 1 = perfect inequality)
 *
 * Lower is better (more equal distribution)
 *
 * @param votingPowers - Array of voting powers
 * @returns The Gini coefficient (0-1)
 */
export function calculateGiniCoefficient(votingPowers: number[]): number {
  if (votingPowers.length === 0) return 0;

  const sorted = [...votingPowers].sort((a, b) => a - b);
  const n = sorted.length;

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    numerator += (i + 1) * sorted[i];
    denominator += sorted[i];
  }

  if (denominator === 0) return 0;

  return (2 * numerator) / (n * denominator) - (n + 1) / n;
}
