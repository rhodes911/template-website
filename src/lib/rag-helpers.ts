/* eslint-disable @typescript-eslint/no-explicit-any */
import { searchRag, formatCitations, SearchHit } from './rag';

export function retrieveForCollection(params: {
  collection: string;
  topic?: string;
  brief?: string;
  keywords?: string[];
  section?: string;
  k?: number;
}): { hits: SearchHit[]; citations: string } {
  const { collection, topic, brief, keywords, section, k = 4 } = params;
  const q = [topic, brief, (keywords || []).join(' '), collection, section].filter(Boolean).join(' ');
  const hits = searchRag(q, { k });
  return { hits, citations: formatCitations(hits) };
}
