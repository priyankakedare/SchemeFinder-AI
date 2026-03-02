export interface UserProfile {
  age: number;
  incomeMonthly: number;
  state: string;
  district: string;
  occupation: string;
  socialCategory: string;
  gender: string;
  landholdingHectares?: number;
}

export interface SchemeEligibility {
  occupation?: string[];
  maxLandholdingHectares?: number;
  exclusions?: string[];
  socialCategory?: string[];
  maxIncomeMonthly?: number;
  minAge?: number;
  maxAge?: number;
  minEducation?: string;
  gender?: string;
}

export interface SchemeTargetDemographic {
  minAge?: number;
  maxAge?: number;
}

export interface Scheme {
  id: string;
  title: string;
  ministry: string;
  description: string;
  sourceUrl: string;
  eligibility: SchemeEligibility;
  benefits: string[];
  lifecycleState: 'Active' | 'Upcoming' | 'Closed' | 'Archived';
  targetDemographic?: SchemeTargetDemographic;
}

export interface EligibilityResult {
  isEligible: boolean;
  score: number;
  matchedCriteria: string[];
  unmatchedCriteria: string[];
}
