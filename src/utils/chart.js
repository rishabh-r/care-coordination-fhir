export function extractChartData(text) {
  const match = text.match(/\[CHART:(\{[\s\S]*?\})\]/);
  if (!match) return { cleanText: text, chartData: null };
  try {
    return { cleanText: text.replace(match[0], "").trim(), chartData: JSON.parse(match[1]) };
  } catch(e) {
    return { cleanText: text.replace(match[0], "").trim(), chartData: null };
  }
}
