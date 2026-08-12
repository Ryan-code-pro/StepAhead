export type AppTab = 'market' | 'news' | 'prediction-hub';

export type StockRegion = 'All' | 'US' | 'Europe' | 'Asia' | 'Global';
export type StockGenre = 'All' | 'Tech & AI' | 'EV & Auto' | 'Cloud & Software' | 'E-Commerce' | 'Crypto & Web3' | 'Semiconductors' | 'Finance';
export type NewsSentiment = 'All' | 'BULLISH' | 'BEARISH' | 'NEUTRAL';

export interface StockQuote {
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
  aiScore: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  timestamp: string;
  region: string;
  genre: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  impactScore: number;
  relatedTickers: string[];
  readTime: string;
}

export interface TimelinePoint {
  period: string;
  price: number;
  upperBand: number;
  lowerBand: number;
}

export interface PredictionResult {
  ticker: string;
  signal: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG_SELL';
  confidence: number;
  targetPrice1M: number;
  targetPrice3M: number;
  targetPrice6M: number;
  targetPrice1Y: number;
  rsi: number;
  macdSignal: string;
  movingAverageSignal: string;
  bullishProbability: number;
  bearishProbability: number;
  neutralProbability: number;
  summary: string;
  catalysts: string[];
  risks: string[];
  projectedTimeline: TimelinePoint[];
}

export interface InvestmentAdvice {
  ticker: string;
  stockName: string;
  currentPrice: number;
  portfolioBudget: number;
  riskTolerance: 'Conservative' | 'Balanced' | 'Aggressive';
  horizon: string;
  recommendedAmount: number;
  percentageOfPortfolio: number;
  sharesCount: number;
  stopLossPrice: number;
  takeProfitTarget: number;
  riskRating: string;
  expectedReturnPercent: string;
  rationale: string;
  actionPlan: string[];
}

export interface PortfolioPosition {
  ticker: string;
  name: string;
  shares: number;
  averageBuyPrice: number;
  totalInvested: number;
  currentValue: number;
  unrealizedGain: number;
  unrealizedGainPercent: number;
}

export interface ChartDataPoint {
  date: string;
  historical?: number;
  projected?: number;
  upperBand?: number;
  lowerBand?: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
}
