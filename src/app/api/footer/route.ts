import { NextResponse } from 'next/server';
import { getFooterData } from '@/lib/site-data';

export async function GET() {
  try {
    const footerData = getFooterData();
    return NextResponse.json(footerData);
  } catch (error) {
    console.error('Error fetching footer data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch footer data' },
      { status: 500 }
    );
  }
}