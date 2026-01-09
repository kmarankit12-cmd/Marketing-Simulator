export enum StepType {
  // Traffic & Sources
  TRAFFIC = 'TRAFFIC',
  AD = 'AD',
  SOCIAL = 'SOCIAL',
  CONTENT = 'CONTENT',
  AFFILIATE = 'AFFILIATE',
  
  // Pages
  LANDING = 'LANDING',
  OPTIN = 'OPTIN',
  SALES = 'SALES',
  CHECKOUT = 'CHECKOUT',
  UPSELL = 'UPSELL',
  DOWNSELL = 'DOWNSELL',
  THANK_YOU = 'THANK_YOU',
  SURVEY = 'SURVEY',
  APPLICATION = 'APPLICATION',
  
  // Engagement / Events
  WEBINAR = 'WEBINAR',
  CALL = 'CALL', // Phone selling
  
  // Messaging / Automation
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  BOT = 'BOT',
}

export interface FunnelStep {
  id: string;
  type: StepType;
  name: string;
  description?: string;
  url?: string; // Step URL or Destination URL
  
  // Graph Connections
  nextSteps: string[]; // Array of Step IDs this step connects TO
  variantWeights?: Record<string, number>; // Map of targetId -> Percentage (0-100)
  
  // Organization
  groupName?: string; // For visual grouping

  // Metrics Inputs
  conversionRate: number; // percentage 0-100 (Click rate, Open rate, Booking rate, etc.)
  productPrice: number; // currency amount
  trafficVolume?: number; // only for Source types
  cpc?: number; // Cost Per Click - only for Source types
  cpl?: number; // Cost Per Lead - only for Source types
  cpa?: number; // Cost Per Acquisition - applicable to all steps
  
  // Calculated Metrics (Runtime)
  visitorsIn: number;
  visitorsOut: number;
  revenue: number;
  cost: number;
}

export interface SimulationTotals {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  roas: number;
  epa: number; // Earnings per attendee/visitor
  conversionRateOverall: number;
}

export interface ChartDataPoint {
  name: string;
  revenue: number;
  profit: number;
  cumulativeRevenue: number;
}

export const INITIAL_FUNNEL: FunnelStep[] = [
  {
    id: '1',
    type: StepType.AD,
    name: 'Facebook Ad',
    conversionRate: 100,
    productPrice: 0,
    trafficVolume: 2000,
    cpc: 1.50,
    cpl: 0,
    cpa: 0,
    visitorsIn: 0,
    visitorsOut: 0,
    revenue: 0,
    cost: 0,
    url: '',
    nextSteps: ['2'],
    groupName: 'Acquisition'
  },
  {
    id: '2',
    type: StepType.LANDING,
    name: 'Landing Page',
    conversionRate: 25,
    productPrice: 0,
    visitorsIn: 0,
    visitorsOut: 0,
    revenue: 0,
    cost: 0,
    cpa: 0,
    url: 'https://example.com/landing',
    nextSteps: ['3', '4'], // Example of branching: Some go to email, some go directly to sales
    variantWeights: { '3': 80, '4': 20 }, // 80% to email, 20% direct to sales
    groupName: 'Acquisition'
  },
  {
    id: '3',
    type: StepType.EMAIL,
    name: 'Email Follow-up',
    conversionRate: 15,
    productPrice: 0,
    visitorsIn: 0,
    visitorsOut: 0,
    revenue: 0,
    cost: 0,
    cpa: 0,
    nextSteps: ['4'], // Merging back to Sales Page
    groupName: 'Nurture'
  },
  {
    id: '4',
    type: StepType.SALES,
    name: 'Sales Page',
    conversionRate: 4,
    productPrice: 197,
    visitorsIn: 0,
    visitorsOut: 0,
    revenue: 0,
    cost: 0,
    cpa: 0,
    url: 'https://example.com/sales',
    nextSteps: ['5'],
    groupName: 'Conversion'
  },
  {
    id: '5',
    type: StepType.CHECKOUT,
    name: 'Checkout',
    conversionRate: 60, 
    productPrice: 0,
    visitorsIn: 0,
    visitorsOut: 0,
    revenue: 0,
    cost: 0,
    cpa: 0,
    url: 'https://example.com/checkout',
    nextSteps: ['6'],
    groupName: 'Conversion'
  },
  {
    id: '6',
    type: StepType.THANK_YOU,
    name: 'Thank You',
    conversionRate: 0,
    productPrice: 0,
    visitorsIn: 0,
    visitorsOut: 0,
    revenue: 0,
    cost: 0,
    cpa: 0,
    url: 'https://example.com/thank-you',
    nextSteps: []
  }
];