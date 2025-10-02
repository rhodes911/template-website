import { NextResponse } from 'next/server';
import { getSimpleServices } from '@/lib/server/services';

export async function GET() {
  try {
    const services = getSimpleServices();
    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching navigation services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}