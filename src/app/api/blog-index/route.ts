import { NextResponse } from 'next/server';
import { getBlogPosts } from '@/lib/blog';

export function GET() {
  try {
    const posts = getBlogPosts().map(p => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      tags: p.tags || [],
      categories: p.categories || [],
      publishDate: p.publishDate,
    }));
    return NextResponse.json({ posts });
  } catch (e) {
    return NextResponse.json({ posts: [] }, { status: 200 });
  }
}
