export default function formatPercentage(
  numPresent: number,
  totalDates: number,
) {
  console.log("numPresent", numPresent);
  console.log("totalDates", totalDates);
  if (totalDates === 0) {
    return 0;
  }

  return Math.round((numPresent / totalDates) * 10000) / 100;
}
