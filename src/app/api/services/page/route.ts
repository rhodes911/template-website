import { NextResponse } from 'next/server';
import { getServicesForPage } from '@/lib/server/services';

export async function GET() {
  try {
    const services = getServicesForPage();
    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services for page:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}
