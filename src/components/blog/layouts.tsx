import React from 'react';
import type { BlogPost } from '@/lib/blog';
import Markdown from 'react-markdown';

// Shared minimal props
interface LayoutProps { post: BlogPost; children: React.ReactNode }

// 1 Narrative layout
export const NarrativeLayout: React.FC<LayoutProps> = ({ post, children }) => (
  <article className="prose prose-neutral max-w-none">
    <header className="mb-10">
      <h1 className="text-4xl font-bold leading-tight mb-4 tracking-tight">{post.title}</h1>
      <p className="text-xl text-neutral-600 max-w-3xl">{post.excerpt}</p>
    </header>
    <div className="space-y-10 narrative-body">{children}</div>
  </article>
);

// 2 Modular playbook (side index + blocks)
export const PlaybookLayout: React.FC<LayoutProps> = ({ post, children }) => (
  <div className="grid lg:grid-cols-[260px_1fr] gap-12">
    <aside className="hidden lg:block sticky top-28 h-max text-sm font-medium space-y-4">
      <div className="p-4 rounded-xl bg-gradient-to-br from-primary-50 to-white border border-primary-100 shadow-sm">
        <h2 className="text-primary-700 text-sm font-semibold mb-2">Playbook</h2>
        <ul className="space-y-1" id="layout-toc"></ul>
      </div>
    </aside>
    <article className="playbook prose max-w-none">
      <header className="mb-12">
        <h1 className="text-4xl font-bold leading-tight mb-4">{post.title}</h1>
        <p className="text-lg text-neutral-600 max-w-2xl">{post.excerpt}</p>
      </header>
      {children}
    </article>
  </div>
);

// 3 Decision advisor (interactive framing placeholder)
export const AdvisorLayout: React.FC<LayoutProps> = ({ post, children }) => (
  <article className="advisor-layout">
    <header className="mb-8 pb-6 border-b border-neutral-200">
      <h1 className="text-4xl font-bold mb-3">{post.title}</h1>
      <div className="text-neutral-600 max-w-3xl">{post.excerpt}</div>
    </header>
    <div className="rounded-2xl bg-neutral-900 text-neutral-50 p-6 mb-10 grid gap-4 md:grid-cols-3">
      <div>
        <p className="text-xs uppercase tracking-wide text-neutral-400 mb-1">You Are Here</p>
        <p className="font-semibold">Scenario Matrix Placeholder</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-neutral-400 mb-1">Decision Path</p>
        <p className="font-semibold">Auto-highlights branch</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-neutral-400 mb-1">Next Gate</p>
        <p className="font-semibold">30‑Day Metric Trigger</p>
      </div>
    </div>
    <div className="advisor-body space-y-12">{children}</div>
  </article>
);

// 4 Benchmark report (data blocks styling)
export const BenchmarkLayout: React.FC<LayoutProps> = ({ post, children }) => (
  <article className="benchmark-layout">
    <header className="mb-10">
      <h1 className="text-4xl font-extrabold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-600">{post.title}</h1>
      <p className="text-neutral-600 max-w-3xl text-lg">{post.excerpt}</p>
    </header>
    <div className="space-y-14 benchmark-body">{children}</div>
  </article>
);

// 5 Field notes (timeline)
export const FieldNotesLayout: React.FC<LayoutProps> = ({ post, children }) => (
  <article className="fieldnotes-layout">
    <header className="mb-8">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-neutral-600">{post.excerpt}</p>
    </header>
    <div className="relative pl-6 border-l-2 border-neutral-200 space-y-10 fieldnotes-body">
      {children}
    </div>
  </article>
);

export function renderLayout(post: BlogPost, md: string) {
  const key = post.layout || 'default';
  const body = <Markdown>{md}</Markdown>;
  switch (key) {
    case 'narrative': return <NarrativeLayout post={post}>{body}</NarrativeLayout>;
    case 'playbook': return <PlaybookLayout post={post}>{body}</PlaybookLayout>;
    case 'advisor': return <AdvisorLayout post={post}>{body}</AdvisorLayout>;
    case 'benchmark': return <BenchmarkLayout post={post}>{body}</BenchmarkLayout>;
    case 'fieldnotes': return <FieldNotesLayout post={post}>{body}</FieldNotesLayout>;
    default:
      return <NarrativeLayout post={post}>{body}</NarrativeLayout>;
  }
}
