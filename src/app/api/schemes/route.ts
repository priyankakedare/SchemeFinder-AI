import { NextResponse } from 'next/server';
import { UserProfile, Scheme } from '../../../types';
import { rankSchemes } from '../../../lib/eligibilityEngine';
import schemesData from '../../../data/schemes.json';

export async function POST(request: Request) {
  try {
    const profile: UserProfile = await request.json();

    if (!profile) {
      return NextResponse.json(
        { error: 'User profile is required' },
        { status: 400 }
      );
    }

    const candidateSchemes: Scheme[] = schemesData.schemes as Scheme[];

    const recommendedSchemes = rankSchemes(profile, candidateSchemes);

    return NextResponse.json({
      recommendations: recommendedSchemes
    });

  } catch (error) {
    console.error('Schemes API error:', error);
    return NextResponse.json(
      { error: 'Failed to process schemes' },
      { status: 500 }
    );
  }
}