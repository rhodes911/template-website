import { NextResponse } from 'next/server';
import { getAboutData } from '@/lib/about';

export async function GET() {
  try {
    const aboutData = getAboutData();
    return NextResponse.json(aboutData);
  } catch (error) {
    console.error('Error fetching about data:', error);
    return NextResponse.json({ error: 'Failed to fetch about data' }, { status: 500 });
  }
}
