

export interface MarketStat {
  city: string;
  avgPricePerMeter: number;
  changePercentage: number;
  trend: 'up' | 'down' | 'stable';
}

export interface PropertyType {
  id: string;
  name: string;
}

export interface ValuationRequest {
  city: string;
  district: string;
  area: number;
  type: string;
  bedrooms: number;
  age: number;
  streetWidth?: string;
  direction?: string;
  finishing?: string;
}

export interface ValuationResponse {
  estimatedPrice: {
    min: number;
    max: number;
    confidence: number;
  };
  pricePerMeter: number;
  marketAnalysis: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  comparables: string[];
  locationScore: number; // 0-10
  futureGrowth: number; // Percentage
  propertyRating: {
    location: number;
    services: number;
    price: number;
    future: number;
  };
}

export interface PortfolioItem {
  id: string;
  title: string;
  location: string;
  purchasePrice: number;
  currentValue: number;
  roi: number;
  type: string;
}

export interface InvestmentProfile {
  budget: number;
  cities: string[];
  goal: 'Capital Appreciation' | 'Rental Income' | 'Balanced';
  riskTolerance: 'Low' | 'Medium' | 'High';
  propertyTypes: string[];
}

export interface InvestmentOpportunity {
  id: string;
  title: string;
  location: string;
  type: string;
  price: number;
  expectedROI: number;
  matchScore: number;
  reason: string;
  riskFactors: string[];
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export type UserRole = 'investor' | 'agent' | 'admin' | 'developer';

export interface BrokerDetails {
  falNumber: string;
  crNumber: string;
  agencyName: string;
  iban: string;
  locations: string[];
  profileImage?: string; // Added profile image
}

export interface DeveloperDetails {
  companyName: string;
  crNumber: string;
  taxNumber: string;
  headquarters: string;
  website: string;
  logo: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  preferences: {
    notifications: boolean;
    newsletter: boolean;
  };
  brokerDetails?: BrokerDetails;
  developerDetails?: DeveloperDetails;
}

export type SellerType = 'Developer' | 'Broker' | 'Owner';

export interface PropertyListing {
  id: string;
  ticker: string; // e.g., "RYD-MALQA-01"
  title: string;
  location: string;
  price: number;
  lastPrice: number;
  change24h: number;
  volume: number; // number of views/bids
  sellerType: SellerType;
  sellerName: string;
  type: 'Residential' | 'Commercial' | 'Land';
  status: 'Active' | 'Halted' | 'Sold';
  isIPO: boolean; // If true, it's a new project launch
  completionDate?: string;
}

export type PartnerType = 'Developer' | 'Broker' | 'Marketer';

export interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  rank: number;
  nawafizScore: number; // 0-100 Trust Score
  verified: boolean;
  dealsClosed: number;
  activeListingsCount: number;
  collaborationRate: string; // e.g. "50/50" or "2.5%"
  location: string;
  logo: string;
  description: string;
  specialties: string[];
}

// --- Developer Inventory & Marketing Types ---

export type UnitStatus = 'Available' | 'Reserved' | 'Sold' | 'Blocked';

export interface ProjectUnit {
  id: string;
  unitNumber: string;
  projectId: string;
  type: 'Villa' | 'Apartment' | 'Duplex' | 'Land';
  area: number;
  price: number;
  floor?: number;
  bedrooms?: number;
  status: UnitStatus;
  lastUpdated: string;
}

export interface MarketingAsset {
  id: string;
  title: string;
  type: 'Image' | 'Video' | 'Brochure' | 'Floorplan';
  url: string;
  fileSize: string;
  downloads: number;
}

// --- Affiliate Network Types (B2B Alliance) ---

export type LeadStatus = 'New' | 'Contacted' | 'Negotiation' | 'Closed' | 'Rejected';
export type ContractType = 'MARKETING' | 'CO_BROKING' | 'BROKERAGE';
export type ContractStatus = 'DRAFT' | 'ACTIVE' | 'EXPIRED' | 'TERMINATED';

// Simulates the 'Listings' table in DB
export interface Listing {
  id: string;
  developerId: string;
  developerName: string;
  title: string;
  location: string;
  commissionRate: number; // e.g. 2.5
  commissionDisplay: string; // "2.5% - approx 50k SAR"
  status: 'Active' | 'Sold Out';
  assets: { type: 'image' | 'video' | 'pdf', url: string }[];
  thumbnail: string;
}

// Simulates the 'Contracts' table
export interface Contract {
  id: string;
  type: ContractType;
  brokerId: string; // The user signing
  referenceId: string; // ListingID or CobrokingRequestID
  partyA: string; // Developer or Counter-Broker
  partyB: string; // Current User
  signedAt: string; // ISO Date
  termsVersion: string; // "v1.0"
  status: ContractStatus;
  expiryDate?: string;
}

// Simulates the 'Leads' table
export interface Lead {
  id: string;
  brokerId: string;
  listingId: string;
  clientName: string;
  clientPhone: string; // Sanitized
  submittedAt: string;
  expiryDate: string; // submittedAt + 60 days
  status: LeadStatus;
  potentialCommission: number;
  isProtected: boolean;
}

// Simulates 'Wallets' table
export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  pendingAmount: number;
  history: { id: string, amount: number, date: string, type: 'Credit' | 'Debit', ref: string }[];
}

export interface CobrokingRequest {
  id: string;
  type: 'Have Buyer' | 'Have Property';
  title: string; 
  location: string;
  budget: string;
  commissionSplit: string; // "50/50"
  postedBy: {
    id: string;
    name: string;
    phone: string;
    company: string;
    verified: boolean;
  }; 
  date: string;
  urgency: 'High' | 'Medium' | 'Low';
  description: string;
}

// --- Payout & Tracking System Types ---

export type TransactionStatus = 'PENDING' | 'CLEARED' | 'PAID' | 'REJECTED';
export type TransactionType = 'COMMISSION' | 'WITHDRAWAL' | 'BONUS' | 'PENALTY';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  date: string;
  reference: string; // e.g. "Deal #104 - Sedra Villa"
  description: string;
}

export interface DealTracker {
  id: string;
  leadName: string;
  projectName: string;
  dealValue: number;
  commissionAmount: number;
  stage: 'Lead_Protected' | 'SPA_Signed' | 'Developer_Verified' | 'Commission_Released';
  lastUpdated: string;
  nextAction: string;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  MARKET = 'MARKET',
  MY_LISTINGS = 'MY_LISTINGS',
  PARTNERS = 'PARTNERS',
  AFFILIATE = 'AFFILIATE',
  DEVELOPER = 'DEVELOPER', 
  BROKER_CENTER = 'BROKER_CENTER', // New Broker App View
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD', // Super Admin
  PAYOUTS = 'PAYOUTS', 
  MAP = 'MAP',
  VALUATION = 'VALUATION',
  WALLET = 'WALLET',
  MATCHING = 'MATCHING',
  SETTINGS = 'SETTINGS',
}