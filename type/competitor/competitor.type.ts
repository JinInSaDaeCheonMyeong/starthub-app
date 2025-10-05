import { Response } from "../util/response.type";

export interface CompetitorRequest {
    bmcId : number,
    searchKeywords : string[]
}

export interface CompetitorResponse extends Response {
    data: CompetitorAnalysisData;
}

export interface CompetitorAnalysisData {
    userBmc: UserBmc;
    userScale: UserScale;
    strengths: Strengths;
    weaknesses: Weaknesses;
    globalExpansionStrategy: GlobalExpansionStrategy;
}

interface UserBmc {
    title: string;
    valueProposition: string;
    targetCustomer: string;
    keyStrengths: string[];
}

interface UserScale {
    estimatedUserBase: string;
    marketPosition: string;
    growthPotential: string;
    competitorComparison: CompetitorComparison[];
}

interface CompetitorComparison {
    name: string;
    logoUrl: string;
    websiteUrl: string;
    estimatedScale: string;
    marketShare: string;
    similarities: string[];
    differences: string[];
}

interface Strengths {
    competitiveAdvantages: string[];
    uniqueValuePropositions: string[];
    marketOpportunities: string[];
    strategicRecommendations: string[];
}

interface Weaknesses {
    competitiveDisadvantages: string[];
    marketChallenges: string[];
    resourceLimitations: string[];
    improvementAreas: string[];
}

export interface GlobalExpansionStrategy {
    priorityMarkets: string[];
    entryStrategies: string[];
    localizationRequirements: string[];
    partnershipOpportunities: string[];
    expectedChallenges: string[];
}
