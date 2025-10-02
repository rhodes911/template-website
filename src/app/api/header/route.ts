import { NextResponse } from 'next/server';
import { getHeaderData } from '@/lib/site-data';

export async function GET() {
  try {
    const headerData = getHeaderData();
    return NextResponse.json(headerData);
  } catch (error) {
    console.error('Error fetching header data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch header data' },
      { status: 500 }
    );
  }
}