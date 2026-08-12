import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!ai && process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
}

// Expanded Stock Database with Regions, Genres, and Forecast Indicators
export interface StockItem {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  peRatio: number;
  high52: number;
  low52: number;
  sector: string;
  region: 'US' | 'Europe' | 'Asia' | 'Global';
  genre: 'Tech & AI' | 'EV & Auto' | 'Cloud & Software' | 'E-Commerce' | 'Crypto & Web3' | 'Semiconductors' | 'Finance';
  predictionDirection: 'UP' | 'DOWN' | 'SIDEWAYS';
  predictionConfidence: number; // 0-100
  target1Y: number;
  aiScore: number; // 0-10
}

const STOCK_DATABASE: Record<string, StockItem> = {
  NVDA: { ticker: "NVDA", name: "NVIDIA Corporation", price: 128.45, change: 4.25, changePercent: 3.42, volume: "42.8M", marketCap: "3.15T", peRatio: 64.2, high52: 140.76, low52: 85.20, sector: "Semiconductors / AI", region: "US", genre: "Tech & AI", predictionDirection: "UP", predictionConfidence: 92, target1Y: 165.00, aiScore: 9.6 },
  AAPL: { ticker: "AAPL", name: "Apple Inc.", price: 224.30, change: -1.15, changePercent: -0.51, volume: "38.1M", marketCap: "3.42T", peRatio: 33.8, high52: 237.23, low52: 164.08, sector: "Consumer Tech", region: "US", genre: "Tech & AI", predictionDirection: "UP", predictionConfidence: 84, target1Y: 260.00, aiScore: 8.8 },
  TSLA: { ticker: "TSLA", name: "Tesla Inc.", price: 218.80, change: 8.60, changePercent: 4.09, volume: "55.4M", marketCap: "698.5B", peRatio: 62.4, high52: 271.00, low52: 138.80, sector: "EV & Autonomous", region: "US", genre: "EV & Auto", predictionDirection: "UP", predictionConfidence: 88, target1Y: 285.00, aiScore: 8.9 },
  MSFT: { ticker: "MSFT", name: "Microsoft Corporation", price: 442.10, change: 2.80, changePercent: 0.64, volume: "21.3M", marketCap: "3.28T", peRatio: 36.1, high52: 468.35, low52: 388.00, sector: "Cloud & Software", region: "US", genre: "Cloud & Software", predictionDirection: "UP", predictionConfidence: 90, target1Y: 510.00, aiScore: 9.3 },
  AMZN: { ticker: "AMZN", name: "Amazon.com Inc.", price: 186.20, change: 1.90, changePercent: 1.03, volume: "29.7M", marketCap: "1.94T", peRatio: 41.5, high52: 201.20, low52: 139.20, sector: "E-Commerce & AWS", region: "US", genre: "E-Commerce", predictionDirection: "UP", predictionConfidence: 86, target1Y: 225.00, aiScore: 9.0 },
  ASML: { ticker: "ASML", name: "ASML Holding N.V.", price: 785.40, change: 12.30, changePercent: 1.59, volume: "2.1M", marketCap: "310.5B", peRatio: 42.1, high52: 1056.00, low52: 620.00, sector: "Semiconductor Lithography", region: "Europe", genre: "Semiconductors", predictionDirection: "UP", predictionConfidence: 89, target1Y: 960.00, aiScore: 9.2 },
  TSM: { ticker: "TSM", name: "Taiwan Semiconductor Mfg", price: 172.50, change: 3.40, changePercent: 2.01, volume: "18.9M", marketCap: "894.2B", peRatio: 28.4, high52: 193.47, low52: 84.50, sector: "Semiconductor Foundry", region: "Asia", genre: "Semiconductors", predictionDirection: "UP", predictionConfidence: 94, target1Y: 215.00, aiScore: 9.7 },
  BTC: { ticker: "BTC", name: "Bitcoin / USD", price: 63450.00, change: 1850.00, changePercent: 3.00, volume: "$28.4B", marketCap: "1.25T", peRatio: 0, high52: 73750.00, low52: 48900.00, sector: "Crypto Asset", region: "Global", genre: "Crypto & Web3", predictionDirection: "UP", predictionConfidence: 87, target1Y: 88000.00, aiScore: 8.7 },
  SAP: { ticker: "SAP", name: "SAP SE", price: 215.60, change: -1.20, changePercent: -0.55, volume: "1.8M", marketCap: "258.1B", peRatio: 38.2, high52: 228.10, low52: 140.20, sector: "Enterprise Software", region: "Europe", genre: "Cloud & Software", predictionDirection: "SIDEWAYS", predictionConfidence: 75, target1Y: 235.00, aiScore: 7.8 },
  BABA: { ticker: "BABA", name: "Alibaba Group", price: 82.40, change: -2.10, changePercent: -2.49, volume: "14.2M", marketCap: "198.4B", peRatio: 12.8, high52: 98.40, low52: 68.00, sector: "E-Commerce & Tech", region: "Asia", genre: "E-Commerce", predictionDirection: "DOWN", predictionConfidence: 78, target1Y: 76.00, aiScore: 6.2 },
  JPM: { ticker: "JPM", name: "JPMorgan Chase & Co.", price: 212.80, change: 1.10, changePercent: 0.52, volume: "8.4M", marketCap: "605.1B", peRatio: 12.4, high52: 225.40, low52: 143.20, sector: "Banking & Financials", region: "US", genre: "Finance", predictionDirection: "UP", predictionConfidence: 81, target1Y: 240.00, aiScore: 8.3 }
};

// Stock Market News Database
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  timestamp: string;
  region: string;
  genre: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  impactScore: number; // 1 to 10
  relatedTickers: string[];
  readTime: string;
}

const STOCK_NEWS: NewsItem[] = [
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
    title: "Federal Reserve Signals Potential Rate Cut Cut as Inflation Cools to 2-Year Lows",
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
    id: "news-[4]",
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

// Endpoint: Get stocks with optional filters
app.get("/api/stocks", (req, res) => {
  const { region, genre, search } = req.query;
  let stocks = Object.values(STOCK_DATABASE);

  if (region && region !== "All") {
    stocks = stocks.filter(s => s.region === region);
  }
  if (genre && genre !== "All") {
    stocks = stocks.filter(s => s.genre === genre);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    stocks = stocks.filter(s => s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.sector.toLowerCase().includes(q));
  }

  res.json({ stocks });
});

// Endpoint: Get news with optional filters
app.get("/api/news", (req, res) => {
  const { region, genre, sentiment, search } = req.query;
  let news = [...STOCK_NEWS];

  if (region && region !== "All") {
    news = news.filter(n => n.region === region);
  }
  if (genre && genre !== "All") {
    news = news.filter(n => n.genre === genre);
  }
  if (sentiment && sentiment !== "All") {
    news = news.filter(n => n.sentiment === sentiment);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    news = news.filter(n => n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q) || n.relatedTickers.some(t => t.toLowerCase().includes(q)));
  }

  res.json({ news });
});

// Endpoint: AI Investment Advisor - "How much should I invest in this stock?"
app.post("/api/investment-recommendation", async (req, res) => {
  try {
    const {
      ticker,
      portfolioBudget = 10000,
      riskTolerance = "Balanced", // "Conservative" | "Balanced" | "Aggressive"
      horizon = "Medium-Term Growth"
    } = req.body;

    if (!ticker) {
      res.status(400).json({ error: "Ticker is required" });
      return;
    }

    const upperTicker = ticker.toUpperCase().trim();
    const stock = STOCK_DATABASE[upperTicker] || {
      ticker: upperTicker,
      name: `${upperTicker} Inc`,
      price: 150.00,
      changePercent: 1.2,
      sector: "Technology",
      region: "US",
      genre: "Tech & AI",
      predictionDirection: "UP",
      predictionConfidence: 85,
      target1Y: 180.00,
      aiScore: 8.5
    };

    // Calculate allocation percentage based on risk tolerance & AI score
    let allocPct = 0.15; // default 15%
    if (riskTolerance === "Conservative") allocPct = 0.08;
    if (riskTolerance === "Aggressive") allocPct = 0.25;

    // Adjust slightly by AI score
    if (stock.aiScore >= 9.0) allocPct += 0.03;
    if (stock.predictionDirection === "DOWN") allocPct = 0.02;

    const recommendedDollarAmount = Math.round(portfolioBudget * allocPct);
    const sharesToBuy = Math.max(1, Math.floor(recommendedDollarAmount / stock.price));
    const actualAllocationValue = Number((sharesToBuy * stock.price).toFixed(2));
    const percentageOfPortfolio = Number(((actualAllocationValue / portfolioBudget) * 100).toFixed(1));

    const stopLossPrice = Number((stock.price * (riskTolerance === "Conservative" ? 0.95 : 0.91)).toFixed(2));
    const takeProfitTarget = Number((stock.price * (stock.target1Y > stock.price ? stock.target1Y / stock.price : 1.2)).toFixed(2));

    const client = getGeminiClient();

    if (client) {
      try {
        const prompt = `Act as an expert quantitative portfolio strategist.
The user wants to invest in stock ${stock.ticker} (${stock.name}, Current Price: $${stock.price}).
Portfolio Capital Available: $${portfolioBudget}.
Risk Profile: ${riskTolerance}.
Investment Horizon: ${horizon}.
Calculated Allocation: $${actualAllocationValue} (${percentageOfPortfolio}% of total capital), which buys ${sharesToBuy} shares.
Suggested Stop Loss: $${stopLossPrice}.
Suggested Take Profit: $${takeProfitTarget}.

Provide a concise, professional investment recommendation report containing:
1. "rationale": 2-3 sentence strategic rationale explaining why this allocation size fits their profile and stock momentum.
2. "actionPlan": 3 bullet points for step-by-step order execution strategy (e.g. Dollar-Cost Averaging, Limit Orders).
3. "riskRating": "Low" | "Moderate" | "High".
4. "expectedReturnPercent": Number (e.g. +22.4%).`;

        const geminiRes = await client.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                rationale: { type: Type.STRING },
                actionPlan: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                riskRating: { type: Type.STRING },
                expectedReturnPercent: { type: Type.STRING }
              },
              required: ["rationale", "actionPlan", "riskRating", "expectedReturnPercent"]
            }
          }
        });

        if (geminiRes.text) {
          const aiAdvice = JSON.parse(geminiRes.text);
          res.json({
            success: true,
            ticker: stock.ticker,
            stockName: stock.name,
            currentPrice: stock.price,
            portfolioBudget,
            riskTolerance,
            horizon,
            recommendedAmount: actualAllocationValue,
            percentageOfPortfolio,
            sharesCount: sharesToBuy,
            stopLossPrice,
            takeProfitTarget,
            riskRating: aiAdvice.riskRating || "Moderate",
            expectedReturnPercent: aiAdvice.expectedReturnPercent || "+22.5%",
            rationale: aiAdvice.rationale,
            actionPlan: aiAdvice.actionPlan
          });
          return;
        }
      } catch (err) {
        console.warn("Gemini investment advice warning, returning calculated model:", err);
      }
    }

    // Default response if Gemini key not set or fallback needed
    res.json({
      success: true,
      ticker: stock.ticker,
      stockName: stock.name,
      currentPrice: stock.price,
      portfolioBudget,
      riskTolerance,
      horizon,
      recommendedAmount: actualAllocationValue,
      percentageOfPortfolio,
      sharesCount: sharesToBuy,
      stopLossPrice,
      takeProfitTarget,
      riskRating: stock.aiScore >= 9.0 ? "Moderate-Low" : "Moderate",
      expectedReturnPercent: `+${((stock.target1Y / stock.price - 1) * 100).toFixed(1)}%`,
      rationale: `Allocating $${actualAllocationValue} (${percentageOfPortfolio}% of your $${portfolioBudget} portfolio) into ${stock.ticker} aligns with a ${riskTolerance} growth approach. Buying ${sharesToBuy} shares provides exposure to strong upside catalysts while preserving liquidity.`,
      actionPlan: [
        `Place a limit order around current price ($${stock.price.toFixed(2)})`,
        `Set a strict stop-loss alert at $${stopLossPrice} (-${((1 - stopLossPrice / stock.price) * 100).toFixed(1)}%)`,
        `Target initial partial profit taking at $${takeProfitTarget} (+${((takeProfitTarget / stock.price - 1) * 100).toFixed(1)}%)`
      ]
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to generate investment advice" });
  }
});

// Endpoint: Full Stock AI Forecast
app.post("/api/predict", async (req, res) => {
  try {
    const { ticker, timeHorizon = "3M" } = req.body;
    if (!ticker) {
      res.status(400).json({ error: "Ticker symbol is required" });
      return;
    }

    const upperTicker = ticker.toUpperCase().trim();
    const stock = STOCK_DATABASE[upperTicker] || {
      ticker: upperTicker,
      name: `${upperTicker} Corp`,
      price: 150.00,
      change: 1.5,
      changePercent: 1.0,
      volume: "15.0M",
      marketCap: "100.0B",
      peRatio: 25.0,
      high52: 180.00,
      low52: 110.00,
      sector: "General Market",
      region: "US",
      genre: "Tech & AI",
      predictionDirection: "UP",
      predictionConfidence: 85,
      target1Y: 185.00,
      aiScore: 8.5
    };

    const client = getGeminiClient();

    if (client) {
      try {
        const prompt = `Analyze stock ${stock.ticker} (${stock.name}) at price $${stock.price}. Sector: ${stock.sector}, Region: ${stock.region}.
Time Horizon: ${timeHorizon}.
Generate a comprehensive financial forecast JSON matching the required schema.`;

        const geminiRes = await client.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                ticker: { type: Type.STRING },
                signal: { type: Type.STRING, description: "STRONG_BUY | BUY | HOLD | SELL | STRONG_SELL" },
                confidence: { type: Type.NUMBER },
                targetPrice1M: { type: Type.NUMBER },
                targetPrice3M: { type: Type.NUMBER },
                targetPrice6M: { type: Type.NUMBER },
                targetPrice1Y: { type: Type.NUMBER },
                rsi: { type: Type.NUMBER },
                macdSignal: { type: Type.STRING },
                movingAverageSignal: { type: Type.STRING },
                bullishProbability: { type: Type.NUMBER },
                bearishProbability: { type: Type.NUMBER },
                neutralProbability: { type: Type.NUMBER },
                summary: { type: Type.STRING },
                catalysts: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                risks: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                projectedTimeline: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      period: { type: Type.STRING },
                      price: { type: Type.NUMBER },
                      upperBand: { type: Type.NUMBER },
                      lowerBand: { type: Type.NUMBER }
                    },
                    required: ["period", "price", "upperBand", "lowerBand"]
                  }
                }
              },
              required: [
                "ticker", "signal", "confidence", "targetPrice1M", "targetPrice3M", "targetPrice6M", "targetPrice1Y",
                "rsi", "macdSignal", "movingAverageSignal", "bullishProbability", "bearishProbability", "neutralProbability",
                "summary", "catalysts", "risks", "projectedTimeline"
              ]
            }
          }
        });

        if (geminiRes.text) {
          const predictionData = JSON.parse(geminiRes.text);
          res.json({
            success: true,
            stockInfo: stock,
            prediction: predictionData,
            aiSource: "Gemini 3.6 Flash"
          });
          return;
        }
      } catch (geminiError) {
        console.warn("Gemini API call warning, using analytical model:", geminiError);
      }
    }

    // Default analytical prediction
    const currentPrice = stock.price;
    const target1M = Number((currentPrice * 1.05).toFixed(2));
    const target3M = Number((currentPrice * 1.10).toFixed(2));
    const target6M = Number((currentPrice * 1.16).toFixed(2));
    const target1Y = stock.target1Y;

    const timeline = [
      { period: "Current", price: currentPrice, upperBand: currentPrice, lowerBand: currentPrice },
      { period: "1 Month", price: target1M, upperBand: Number((target1M * 1.05).toFixed(2)), lowerBand: Number((target1M * 0.95).toFixed(2)) },
      { period: "3 Months", price: target3M, upperBand: Number((target3M * 1.08).toFixed(2)), lowerBand: Number((target3M * 0.92).toFixed(2)) },
      { period: "6 Months", price: target6M, upperBand: Number((target6M * 1.10).toFixed(2)), lowerBand: Number((target6M * 0.90).toFixed(2)) },
      { period: "1 Year", price: target1Y, upperBand: Number((target1Y * 1.12).toFixed(2)), lowerBand: Number((target1Y * 0.88).toFixed(2)) }
    ];

    res.json({
      success: true,
      stockInfo: stock,
      prediction: {
        ticker: stock.ticker,
        signal: stock.predictionDirection === "UP" ? "STRONG_BUY" : stock.predictionDirection === "DOWN" ? "SELL" : "HOLD",
        confidence: stock.predictionConfidence,
        targetPrice1M: target1M,
        targetPrice3M: target3M,
        targetPrice6M: target6M,
        targetPrice1Y: target1Y,
        rsi: 61.2,
        macdSignal: "Bullish Crossover",
        movingAverageSignal: "Above 50d & 200d SMA",
        bullishProbability: stock.predictionDirection === "UP" ? 70 : 25,
        bearishProbability: stock.predictionDirection === "DOWN" ? 65 : 15,
        neutralProbability: 15,
        summary: `${stock.name} demonstrates clear institutional momentum in the ${stock.genre} sector. Quantitative AI models signal expansion toward $${target1Y}.`,
        catalysts: [
          "Strong operational performance exceeding consensus estimates",
          "Institutional accumulation index at 3-month highs",
          "Favorable tailwinds across regional market"
        ],
        risks: [
          "Macroeconomic rate volatility",
          "Short-term technical resistance levels"
        ],
        projectedTimeline: timeline
      },
      aiSource: "Aether AI Engine"
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to generate prediction" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
