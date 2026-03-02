import { UserProfile, Scheme, EligibilityResult } from '../types';

/**
 * Deterministic engine to evaluate user eligibility for a specific scheme.
 * Strict zero-hallucination logic based only on provided data.
 */
export function evaluateEligibility(user: UserProfile, scheme: Scheme): EligibilityResult {
  const result: EligibilityResult = {
    isEligible: true, // Assume true until a criteria fails
    score: 0,
    matchedCriteria: [],
    unmatchedCriteria: []
  };

  const { eligibility } = scheme;

  // 1. Occupation Check
  if (eligibility.occupation && eligibility.occupation.length > 0) {
    if (eligibility.occupation.includes(user.occupation)) {
      result.matchedCriteria.push(`Occupation matches: ${user.occupation}`);
      result.score += 20;
    } else {
      result.isEligible = false;
      result.unmatchedCriteria.push(`Occupation must be one of: ${eligibility.occupation.join(', ')}`);
    }
  }

  // 2. Income Check
  if (eligibility.maxIncomeMonthly !== undefined) {
    if (user.incomeMonthly <= eligibility.maxIncomeMonthly) {
      result.matchedCriteria.push(`Monthly income (₹${user.incomeMonthly}) is within limit (₹${eligibility.maxIncomeMonthly})`);
      result.score += 15;
    } else {
      result.isEligible = false;
      result.unmatchedCriteria.push(`Monthly income exceeds limit of ₹${eligibility.maxIncomeMonthly}`);
    }
  }

  // 3. Social Category Check
  if (eligibility.socialCategory && eligibility.socialCategory.length > 0) {
      if (eligibility.socialCategory.includes(user.socialCategory)) {
        result.matchedCriteria.push(`Social category matches: ${user.socialCategory}`);
        result.score += 15;
      } else {
         result.isEligible = false;
         result.unmatchedCriteria.push(`Social category must be one of: ${eligibility.socialCategory.join(', ')}`)
      }
  }

  // 4. Age Check
  if (eligibility.minAge !== undefined) {
      if (user.age >= eligibility.minAge) {
          result.matchedCriteria.push(`Age (${user.age}) meets minimum requirement (${eligibility.minAge})`);
          result.score += 10;
      } else {
          result.isEligible = false;
          result.unmatchedCriteria.push(`Age must be at least ${eligibility.minAge}`)
      }
  }

   if (eligibility.maxAge !== undefined) {
      if (user.age <= eligibility.maxAge) {
          result.matchedCriteria.push(`Age (${user.age}) is within maximum limit (${eligibility.maxAge})`);
          result.score += 10;
      } else {
          result.isEligible = false;
          result.unmatchedCriteria.push(`Age cannot exceed ${eligibility.maxAge}`)
      }
  }

  // 5. Gender Check
  if (eligibility.gender) {
      if (user.gender.toLowerCase() === eligibility.gender.toLowerCase()) {
         result.matchedCriteria.push(`Gender requirement met: ${eligibility.gender}`);
         result.score += 10;
      } else {
          result.isEligible = false;
          result.unmatchedCriteria.push(`Scheme is exclusively for ${eligibility.gender} applicants.`);
      }
  }


  // 6. Landholding Check (Specific to farmers)
  if (eligibility.maxLandholdingHectares !== undefined && user.landholdingHectares !== undefined) {
      if (user.landholdingHectares <= eligibility.maxLandholdingHectares) {
           result.matchedCriteria.push(`Landholding (${user.landholdingHectares} ha) is within limit (${eligibility.maxLandholdingHectares} ha)`);
           result.score += 10;
      } else {
          result.isEligible = false;
          result.unmatchedCriteria.push(`Landholding exceeds maximum limit of ${eligibility.maxLandholdingHectares} hectares`);
      }
  }

  return result;
}

export function rankSchemes(user: UserProfile, schemes: Scheme[]): { scheme: Scheme, evaluation: EligibilityResult }[] {
    const evaluatedSchemes = schemes.map(scheme => ({
        scheme,
        evaluation: evaluateEligibility(user, scheme)
    }));

    // Filter only eligible schemes and sort by score descending
    return evaluatedSchemes
        .filter(item => item.evaluation.isEligible)
        .sort((a, b) => b.evaluation.score - a.evaluation.score);
}
