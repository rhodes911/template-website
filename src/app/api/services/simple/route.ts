import { NextResponse } from 'next/server';
import { getSimpleServices } from '@/lib/server/services';

export async function GET() {
  try {
    console.log('Attempting to fetch simple services...');
    const services = getSimpleServices();
    console.log('Successfully fetched services:', services.length);
    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching simple services:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json({ error: 'Failed to fetch services', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
