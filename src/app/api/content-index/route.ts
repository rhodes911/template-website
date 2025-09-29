import { NextResponse } from 'next/server';
import { getContentIndex } from '@/lib/servicesHub/contentIndex';

export const revalidate = 60; // ISR style cache

export async function GET() {
  try {
    const entries = getContentIndex();
    return NextResponse.json({ entries, count: entries.length });
  } catch {
    return NextResponse.json({ entries: [], error: 'failed' }, { status: 500 });
  }
}
