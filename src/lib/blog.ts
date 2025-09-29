import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  // Optional subheading/deck used as visible H2 under the H1
  subheading?: string;
  excerpt: string;
  featuredImage: string;
  alt: string;
  layout?: string; // custom layout key
  author: {
    name: string;
    bio: string;
    avatar: string;
    linkedin?: string;
    twitter?: string;
  };
  categories?: string[];
  tags?: string[];
  keywords: string[];
  publishDate: string;
  lastModified?: string;
  featured?: boolean;
  readingTime: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    noIndex?: boolean;
  };
  socialShare?: {
    title?: string;
    description?: string;
    image?: string;
  };
  content: string;
}

const blogDirectory = path.join(process.cwd(), 'content/blog');

// Fallback author if frontmatter omits one
const DEFAULT_AUTHOR = {
  name: 'Ellie Edwards',
  bio: 'Strategic marketing consultant helping SMEs unlock growth with positioning, demand and retention systems.',
  avatar: '/images/ellie-edwards-profile.jpg',
  linkedin: 'https://www.linkedin.com/in/ellieedwards'
};

export function getBlogPosts(): BlogPost[] {
  // Return empty array if directory doesn't exist yet
  if (!fs.existsSync(blogDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(blogDirectory);
  const posts = fileNames
    .filter(name => name.endsWith('.md'))
    .map(name => {
      const slug = name.replace(/\.md$/, '');
      const fullPath = path.join(blogDirectory, name);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title,
        subheading: data.subheading || data.subTitle || data.subtitle || data.deck,
        excerpt: data.excerpt,
        featuredImage: data.featuredImage,
        alt: data.alt,
  layout: data.layout || data.design || undefined,
        author: data.author ? {
          ...DEFAULT_AUTHOR,
          ...data.author,
          avatar: data.author.avatar || DEFAULT_AUTHOR.avatar
        } : DEFAULT_AUTHOR,
        categories: data.categories || [],
        tags: data.tags || [],
        keywords: data.keywords || [],
        publishDate: data.publishDate,
        lastModified: data.lastModified,
        featured: data.featured || false,
        readingTime: data.readingTime || 5,
        seo: data.seo,
        socialShare: data.socialShare,
        content,
      } as BlogPost;
    })
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  return posts;
}

export function getBlogPost(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(blogDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title,
      subheading: data.subheading || data.subTitle || data.subtitle || data.deck,
      excerpt: data.excerpt,
      featuredImage: data.featuredImage,
      alt: data.alt,
  layout: data.layout || data.design || undefined,
      author: data.author ? {
        ...DEFAULT_AUTHOR,
        ...data.author,
        avatar: data.author.avatar || DEFAULT_AUTHOR.avatar
      } : DEFAULT_AUTHOR,
      categories: data.categories || [],
      tags: data.tags || [],
      keywords: data.keywords || [],
      publishDate: data.publishDate,
      lastModified: data.lastModified,
      featured: data.featured || false,
      readingTime: data.readingTime || 5,
      seo: data.seo,
      socialShare: data.socialShare,
      content,
    } as BlogPost;
  } catch {
    return null;
  }
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  const posts = getBlogPosts();
  return posts.filter(post => 
    post.categories?.some(cat => 
      cat.toLowerCase().replace(/\s+/g, '-') === category.toLowerCase()
    )
  );
}

export function getBlogPostsByTag(tag: string): BlogPost[] {
  const posts = getBlogPosts();
  return posts.filter(post => 
    post.tags?.some(t => 
      t.toLowerCase().replace(/\s+/g, '-') === tag.toLowerCase()
    )
  );
}

export function getRelatedPosts(currentPost: BlogPost, limit = 3): BlogPost[] {
  const posts = getBlogPosts();
  const otherPosts = posts.filter(post => post.slug !== currentPost.slug);
  
  // Score posts based on shared categories and tags
  const scoredPosts = otherPosts.map(post => {
    let score = 0;
    
    // Add points for shared categories
    if (currentPost.categories && post.categories) {
      const sharedCategories = currentPost.categories.filter(cat => 
        post.categories?.includes(cat)
      );
      score += sharedCategories.length * 3;
    }
    
    // Add points for shared tags
    if (currentPost.tags && post.tags) {
      const sharedTags = currentPost.tags.filter(tag => 
        post.tags?.includes(tag)
      );
      score += sharedTags.length * 2;
    }
    
    return { post, score };
  });
  
  // Sort by score and return top posts
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function getAllCategories(): string[] {
  const posts = getBlogPosts();
  const categories = new Set<string>();
  
  posts.forEach(post => {
    if (post.categories) {
      post.categories.forEach(category => categories.add(category));
    }
  });
  
  return Array.from(categories).sort();
}

export function getAllTags(): string[] {
  const posts = getBlogPosts();
  const tags = new Set<string>();
  
  posts.forEach(post => {
    if (post.tags) {
      post.tags.forEach(tag => tags.add(tag));
    }
  });
  
  return Array.from(tags).sort();
}
