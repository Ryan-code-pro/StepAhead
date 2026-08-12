import { StockQuote, NewsArticle, ChartDataPoint, PredictionResult } from '../types';

export const INITIAL_STOCKS: StockQuote[] = [
  { ticker: "NVDA", name: "NVIDIA Corporation", price: 128.45, change: 4.25, changePercent: 3.42, volume: "42.8M", marketCap: "3.15T", peRatio: 64.2, high52: 140.76, low52: 85.20, sector: "Semiconductors / AI", region: "US", genre: "Tech & AI", predictionDirection: "UP", predictionConfidence: 92, target1Y: 165.00, aiScore: 9.6 },
  { ticker: "AAPL", name: "Apple Inc.", price: 224.30, change: -1.15, changePercent: -0.51, volume: "38.1M", marketCap: "3.42T", peRatio: 33.8, high52: 237.23, low52: 164.08, sector: "Consumer Tech", region: "US", genre: "Tech & AI", predictionDirection: "UP", predictionConfidence: 84, target1Y: 260.00, aiScore: 8.8 },
  { ticker: "TSLA", name: "Tesla Inc.", price: 218.80, change: 8.60, changePercent: 4.09, volume: "55.4M", marketCap: "698.5B", peRatio: 62.4, high52: 271.00, low52: 138.80, sector: "EV & Autonomous", region: "US", genre: "EV & Auto", predictionDirection: "UP", predictionConfidence: 88, target1Y: 285.00, aiScore: 8.9 },
  { ticker: "MSFT", name: "Microsoft Corporation", price: 442.10, change: 2.80, changePercent: 0.64, volume: "21.3M", marketCap: "3.28T", peRatio: 36.1, high52: 468.35, low52: 388.00, sector: "Cloud & Software", region: "US", genre: "Cloud & Software", predictionDirection: "UP", predictionConfidence: 90, target1Y: 510.00, aiScore: 9.3 },
  { ticker: "AMZN", name: "Amazon.com Inc.", price: 186.20, change: 1.90, changePercent: 1.03, volume: "29.7M", marketCap: "1.94T", peRatio: 41.5, high52: 201.20, low52: 139.20, sector: "E-Commerce & AWS", region: "US", genre: "E-Commerce", predictionDirection: "UP", predictionConfidence: 86, target1Y: 225.00, aiScore: 9.0 },
  { ticker: "ASML", name: "ASML Holding N.V.", price: 785.40, change: 12.30, changePercent: 1.59, volume: "2.1M", marketCap: "310.5B", peRatio: 42.1, high52: 1056.00, low52: 620.00, sector: "Semiconductor Lithography", region: "Europe", genre: "Semiconductors", predictionDirection: "UP", predictionConfidence: 89, target1Y: 960.00, aiScore: 9.2 },
  { ticker: "TSM", name: "Taiwan Semiconductor Mfg", price: 172.50, change: 3.40, changePercent: 2.01, volume: "18.9M", marketCap: "894.2B", peRatio: 28.4, high52: 193.47, low52: 84.50, sector: "Semiconductor Foundry", region: "Asia", genre: "Semiconductors", predictionDirection: "UP", predictionConfidence: 94, target1Y: 215.00, aiScore: 9.7 },
  { ticker: "BTC", name: "Bitcoin / USD", price: 63450.00, change: 1850.00, changePercent: 3.00, volume: "$28.4B", marketCap: "1.25T", peRatio: 0, high52: 73750.00, low52: 48900.00, sector: "Crypto Asset", region: "Global", genre: "Crypto & Web3", predictionDirection: "UP", predictionConfidence: 87, target1Y: 88000.00, aiScore: 8.7 },
  { ticker: "SAP", name: "SAP SE", price: 215.60, change: -1.20, changePercent: -0.55, volume: "1.8M", marketCap: "258.1B", peRatio: 38.2, high52: 228.10, low52: 140.20, sector: "Enterprise Software", region: "Europe", genre: "Cloud & Software", predictionDirection: "SIDEWAYS", predictionConfidence: 75, target1Y: 235.00, aiScore: 7.8 },
  { ticker: "BABA", name: "Alibaba Group", price: 82.40, change: -2.10, changePercent: -2.49, volume: "14.2M", marketCap: "198.4B", peRatio: 12.8, high52: 98.40, low52: 68.00, sector: "E-Commerce & Tech", region: "Asia", genre: "E-Commerce", predictionDirection: "DOWN", predictionConfidence: 78, target1Y: 76.00, aiScore: 6.2 },
  { ticker: "JPM", name: "JPMorgan Chase & Co.", price: 212.80, change: 1.10, changePercent: 0.52, volume: "8.4M", marketCap: "605.1B", peRatio: 12.4, high52: 225.40, low52: 143.20, sector: "Banking & Financials", region: "US", genre: "Finance", predictionDirection: "UP", predictionConfidence: 81, target1Y: 240.00, aiScore: 8.3 }
];

export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: "news-1",
    title: "NVIDIA Unveils Next-Gen AI Chip Architecture, Surpassing Enterprise Demand Expectations",
    summary: "NVIDIA announced its latest Blackwell Ultra AI platform with unprecedented compute efficiency, sparking a surge in chipmaker futures across US and Asian supply chains.",
    source: "Aether Market Wire",
    timestamp: "12 mins ago",
    region: "US",
    genre: "Tech & AI",
    sentiment: "BULLISH",
    impactScore: 9.8,
    relatedTickers: ["NVDA", "TSM", "AMD"],
    readTime: "2 min read"
  },
  {
    id: "news-2",
    title: "Federal Reserve Signals Potential Rate Cut as Inflation Cools to 2-Year Lows",
    summary: "Chairman Jerome Powell hinted at recalibrating monetary policy during the upcoming FOMC session, sending US bond yields down and equity indices higher.",
    source: "Global Macro Digest",
    timestamp: "45 mins ago",
    region: "US",
    genre: "Macroeconomics",
    sentiment: "BULLISH",
    impactScore: 9.2,
    relatedTickers: ["JPM", "MSFT", "AAPL"],
    readTime: "3 min read"
  },
  {
    id: "news-3",
    title: "European Semiconductor Alliance Secures €10B Subsidies for ASML Lithography R&D",
    summary: "The European Union ratified a major tech infrastructure bill granting research funding to ASML and European tech conglomerates to strengthen domestic silicon resilience.",
    source: "EuroMarkets Daily",
    timestamp: "2 hours ago",
    region: "Europe",
    genre: "Semiconductors",
    sentiment: "BULLISH",
    impactScore: 8.5,
    relatedTickers: ["ASML", "SAP"],
    readTime: "3 min read"
  },
  {
    id: "news-4",
    title: "Asian Markets Rally as TSMC Reports Record Quarterly Foundry Revenues",
    summary: "Taiwan Semiconductor Manufacturing Company recorded a 32% year-over-year revenue surge driven by high-margin 3nm enterprise AI orders from Silicon Valley.",
    source: "Asia Financial Insider",
    timestamp: "3 hours ago",
    region: "Asia",
    genre: "Semiconductors",
    sentiment: "BULLISH",
    impactScore: 9.4,
    relatedTickers: ["TSM", "NVDA", "BABA"],
    readTime: "2 min read"
  },
  {
    id: "news-5",
    title: "Bitcoin Surges Past $63,000 Following Record Institutional Spot ETF Inflows",
    summary: "Institutional asset managers recorded over $850M in single-day net inflows into spot Bitcoin funds, signaling strong momentum across crypto asset markets.",
    source: "Crypto Pulse",
    timestamp: "4 hours ago",
    region: "Global",
    genre: "Crypto & Web3",
    sentiment: "BULLISH",
    impactScore: 8.9,
    relatedTickers: ["BTC"],
    readTime: "2 min read"
  },
  {
    id: "news-6",
    title: "Tesla Expands Full Self-Driving Beta to European & Asian Pilot Markets",
    summary: "Regulatory approvals in key international jurisdictions pave the way for Tesla to roll out software subscription revenues in Q4.",
    source: "Automotive Tech Today",
    timestamp: "5 hours ago",
    region: "Global",
    genre: "EV & Auto",
    sentiment: "BULLISH",
    impactScore: 8.2,
    relatedTickers: ["TSLA"],
    readTime: "3 min read"
  },
  {
    id: "news-7",
    title: "Global Supply Chain Regulations May Press Asian E-Commerce Margins Temporarily",
    summary: "New cross-border shipping tariffs and compliance audits could introduce short-term friction for international shipping logistics in East Asian retail hubs.",
    source: "Trade Economics Review",
    timestamp: "6 hours ago",
    region: "Asia",
    genre: "E-Commerce",
    sentiment: "BEARISH",
    impactScore: 7.1,
    relatedTickers: ["BABA", "AMZN"],
    readTime: "4 min read"
  }
];

export function generateHistoricalChartData(basePrice: number): ChartDataPoint[] {
  const dates = ["6M ago", "5M ago", "4M ago", "3M ago", "2M ago", "1M ago", "Current"];
  let currentVal = basePrice * 0.82;
  
  return dates.map((date, idx) => {
    const factor = 1 + (Math.sin(idx * 1.2) * 0.05) + (idx * 0.03);
    const close = Math.round((currentVal * factor) * 100) / 100;
    const open = Math.round((close * (1 + (Math.sin(idx) * 0.02 - 0.01))) * 100) / 100;
    const high = Math.round((Math.max(open, close) * 1.025) * 100) / 100;
    const low = Math.round((Math.min(open, close) * 0.975) * 100) / 100;

    return {
      date,
      historical: close,
      open,
      high,
      low,
      close,
      volume: Math.round(15000000 + Math.random() * 25000000)
    };
  });
}

export function generateDefaultPrediction(stock: StockQuote): PredictionResult {
  const price = stock.price;
  const target1M = Number((price * 1.05).toFixed(2));
  const target3M = Number((price * 1.12).toFixed(2));
  const target6M = Number((price * 1.18).toFixed(2));
  const target1Y = stock.target1Y;

  return {
    ticker: stock.ticker,
    signal: stock.predictionDirection === 'UP' ? 'STRONG_BUY' : stock.predictionDirection === 'DOWN' ? 'SELL' : 'HOLD',
    confidence: stock.predictionConfidence,
    targetPrice1M: target1M,
    targetPrice3M: target3M,
    targetPrice6M: target6M,
    targetPrice1Y: target1Y,
    rsi: 61.4,
    macdSignal: "Bullish Crossover",
    movingAverageSignal: "Above 50d & 200d SMA",
    bullishProbability: stock.predictionDirection === 'UP' ? 72 : 25,
    bearishProbability: stock.predictionDirection === 'DOWN' ? 65 : 15,
    neutralProbability: 13,
    summary: `${stock.name} demonstrates high upward momentum driven by strong sector fundamentals in ${stock.genre}. Quantum AI models project expansion toward $${target1Y}.`,
    catalysts: [
      "Surging institutional capital accumulation in high-growth equities",
      "Favorable macro liquidity environment and sector adoption",
      "Robust earnings trajectory surpassing consensus analyst targets"
    ],
    risks: [
      "Short-term technical resistance near historical high-water mark",
      "Broader macroeconomic rate decisions and volatility"
    ],
    projectedTimeline: [
      { period: "Current", price: price, upperBand: price, lowerBand: price },
      { period: "1 Month", price: target1M, upperBand: Number((target1M * 1.06).toFixed(2)), lowerBand: Number((target1M * 0.94).toFixed(2)) },
      { period: "3 Months", price: target3M, upperBand: Number((target3M * 1.08).toFixed(2)), lowerBand: Number((target3M * 0.92).toFixed(2)) },
      { period: "6 Months", price: target6M, upperBand: Number((target6M * 1.10).toFixed(2)), lowerBand: Number((target6M * 0.90).toFixed(2)) },
      { period: "1 Year", price: target1Y, upperBand: Number((target1Y * 1.14).toFixed(2)), lowerBand: Number((target1Y * 0.86).toFixed(2)) }
    ]
  };
}
