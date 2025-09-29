"use client";
import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Plus, X, ListChecks, Sparkles } from 'lucide-react';

interface ServicePageData {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  results: string[];
  href: string;
}

interface Props {
  services: ServicePageData[];
}

// Local storage key for persisting shortlist across funnel steps
const LS_KEY = 'eem_selected_services_v1';
const LS_KEY_FEATURES = 'eem_selected_features_v1';

// Simple slug util for feature param encoding
function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,60);
}

export default function ServicesListingClient({ services }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [capabilityFocus, setCapabilityFocus] = useState<string | null>(null);
  const [showMatrix, setShowMatrix] = useState(false);
  const [featureSelections, setFeatureSelections] = useState<Record<string,string[]>>({});
  const [showGranular, setShowGranular] = useState(true);

  // Load persisted selections & feature granular picks
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setSelected(JSON.parse(raw));
      const rawF = localStorage.getItem(LS_KEY_FEATURES);
      if (rawF) setFeatureSelections(JSON.parse(rawF));
    } catch {}
  }, []);

  // Persist selections
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(selected)); } catch {}
  }, [selected]);

  // Persist features
  useEffect(() => {
    try { localStorage.setItem(LS_KEY_FEATURES, JSON.stringify(featureSelections)); } catch {}
  }, [featureSelections]);

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      if (prev.includes(id)) {
        // remove service & its feature selections
        const copy = { ...featureSelections };
        delete copy[id];
        setFeatureSelections(copy);
        return prev.filter(s => s !== id);
      }
      // add service with default (first two features if available)
      const svc = services.find(s => s.id === id);
      if (svc) {
        setFeatureSelections(fs => ({ ...fs, [id]: svc.features.slice(0,2) }));
      }
      return [...prev, id];
    });
  };

  const toggleFeature = (serviceId: string, feature: string) => {
    setFeatureSelections(prev => {
      const current = new Set(prev[serviceId] || []);
      if (current.has(feature)) {
        current.delete(feature);
      } else {
        current.add(feature);
      }
      return { ...prev, [serviceId]: Array.from(current) };
    });
  };

  // Derive a lightweight capability list from top features
  const capabilities = useMemo(() => {
    const caps = new Set<string>();
    services.forEach(s => s.features.slice(0,6).forEach(f => caps.add(f)));
    return Array.from(caps).slice(0,12);
  }, [services]);

  const matrixData = useMemo(() => capabilities.map(c => ({
    capability: c,
    matches: services.map(s => s.features.includes(c))
  })), [capabilities, services]);

  // Build plan wizard param with selected & granular feature picks
  const planHref = useMemo(() => {
    if (!selected.length) return '/plan';
    const svcParam = selected.join(',');
    const featParts = selected.map(sid => {
      const feats = featureSelections[sid] || [];
      if (!feats.length) return null;
      return `${sid}~${feats.map(f=>slugify(f)).join('+')}`;
    }).filter(Boolean);
    const featParam = featParts.length ? `&feat=${encodeURIComponent(featParts.join(','))}` : '';
    return `/plan?pref=${svcParam}${featParam}`;
  }, [selected, featureSelections]);

  return (
    <section className="py-16 bg-white border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">Explore Services</h2>
            <p className="text-neutral-600 text-sm md:text-base leading-relaxed">Select services to compare what you get. Your selections carry into the upcoming marketing plan wizard for deeper tailoring.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowMatrix(m => !m)} className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border-2 border-primary-600 text-primary-600 font-semibold hover:bg-primary-50 transition-colors">
              <ListChecks className="w-4 h-4"/> {showMatrix ? 'Hide Matrix' : 'Show Matrix'}
            </button>
            <button onClick={() => setShowGranular(g => !g)} className="hidden sm:inline-flex items-center gap-2 px-5 py-3 rounded-lg border-2 border-neutral-300 text-neutral-700 font-semibold hover:bg-neutral-50 transition-colors">
              {showGranular ? 'Hide Feature Picks' : 'Show Feature Picks'}
            </button>
            <Link href={planHref} className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors">
              <Sparkles className="w-4 h-4"/> Get Marketing Plan
            </Link>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map(s => {
            const active = selected.includes(s.id);
            return (
              <div key={s.id} className="relative group h-full bg-gradient-to-br from-white via-neutral-50/50 to-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-[radial-gradient(circle_at_30%_30%,rgba(236,72,153,0.25),transparent)]" />
                <div className="flex items-start gap-4 mb-4">
                  <h3 className="text-xl font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors flex-1">{s.title}</h3>
                  <button aria-label={active ? 'Remove from compare' : 'Add to compare'} onClick={() => toggleSelect(s.id)} className={`w-10 h-10 rounded-full flex items-center justify-center border text-sm font-semibold transition-all ${active ? 'bg-primary-600 border-primary-600 text-white shadow-md' : 'bg-primary-50 border-primary-200 text-primary-600 hover:bg-primary-100' }`}>
                    {active ? <X className="w-4 h-4"/> : <Plus className="w-4 h-4"/>}
                  </button>
                </div>
                <p className="text-neutral-600 mb-6 leading-relaxed flex-grow line-clamp-5">{s.description}</p>
                <ul className="space-y-2 mb-6">
                  {s.features.slice(0,4).map((f,i)=>(
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-600 group-hover:text-neutral-700">
                      <CheckCircle2 className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0"/>
                      <span className="line-clamp-2">{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex items-center gap-3 pt-4 border-t border-neutral-100">
                  <Link href={s.href} className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">Details <ArrowRight className="w-4 h-4"/></Link>
                  {active && <span className="text-xs px-2 py-1 rounded bg-primary-100 text-primary-700 font-medium">Selected</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Capability Matrix */}
        {showMatrix && (
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-2xl font-bold text-neutral-900">Capability Matrix</h3>
              <p className="text-neutral-500 text-sm">Highlight a capability to filter related services. Future: click to refine plan wizard inputs.</p>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-neutral-50/70">
                    <th className="text-left px-5 py-4 font-semibold text-neutral-700 sticky left-0 bg-neutral-50/70">Capability</th>
                    {services.map(s => (
                      <th key={s.id} className="px-5 py-4 font-semibold text-neutral-700 text-left">{s.title}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matrixData.map(row => (
                    <tr key={row.capability} className="border-t border-neutral-200 hover:bg-primary-50/40 transition-colors">
                      <td className={`px-5 py-3 font-medium cursor-pointer sticky left-0 bg-white/90 backdrop-blur-sm ${capabilityFocus === row.capability ? 'text-primary-700' : 'text-neutral-700'}`} onClick={() => setCapabilityFocus(c => c === row.capability ? null : row.capability)}>
                        {row.capability}
                      </td>
                      {row.matches.map((m,i) => {
                        const sid = services[i].id;
                        const subdued = capabilityFocus && !m;
                        return (
                          <td key={sid+row.capability} className={`px-5 py-3 text-center font-medium transition-colors ${m ? 'text-primary-600' : 'text-neutral-300'} ${subdued ? 'opacity-20' : ''}`}>{m ? '●' : '—'}</td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {capabilityFocus && (
              <div className="mt-6 p-5 rounded-xl bg-gradient-to-br from-primary-50 via-white to-neutral-50 border border-primary-100 text-sm text-neutral-700">
                <p><span className="font-semibold text-primary-700">{capabilityFocus}</span> selected. Future step: ask deeper intent (priority, current tooling, internal ownership) to personalize the marketing plan.</p>
              </div>
            )}
          </div>
        )}

        {/* Funnel Helper / Advisor Preview */}
        <div className="rounded-3xl border border-neutral-200 bg-gradient-to-br from-white via-primary-50/30 to-white p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-neutral-900 mb-4">Your Strategy Blueprint Preview</h3>
          <p className="text-neutral-600 text-sm leading-relaxed mb-6">When you continue, we pre-fill a draft plan with: <strong>{selected.length || '0'}</strong> selected services{selected.length ? ':' : '.'} {selected.length ? selected.map(sid => services.find(s => s.id===sid)?.title).filter(Boolean).join(', ') : 'Select some services or highlight capabilities to shape your tailored wizard.'}</p>
          <div className="flex flex-wrap gap-3 mb-6">
            {selected.map(id => {
              const svc = services.find(s => s.id === id); if (!svc) return null;
              return <span key={id} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary-100 text-primary-700 text-xs font-medium">{svc.title} <button onClick={()=>toggleSelect(id)} aria-label="Remove" className="hover:text-primary-900"><X className="w-3 h-3"/></button></span>;
            })}
          </div>
          {showGranular && selected.length > 0 && (
            <div className="space-y-8 mb-8">
              {selected.map(sid => {
                const svc = services.find(s=>s.id===sid); if (!svc) return null;
                const chosen = new Set(featureSelections[sid] || []);
                return (
                  <div key={sid} className="border border-neutral-200 rounded-2xl p-5 bg-white/70 backdrop-blur-sm">
                    <h4 className="font-semibold text-neutral-900 mb-3 text-sm tracking-wide flex items-center gap-2">{svc.title} Focus <span className="text-xs font-medium text-primary-600">({chosen.size}/{svc.features.slice(0,8).length})</span></h4>
                    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {svc.features.slice(0,8).map(f => {
                        const active = chosen.has(f);
                        return (
                          <li key={f}>
                            <button type="button" onClick={()=>toggleFeature(sid,f)} className={`w-full text-left px-3 py-2 rounded-lg border text-xs leading-snug transition-colors ${active ? 'bg-primary-600 border-primary-600 text-white shadow-sm' : 'bg-white border-neutral-200 text-neutral-600 hover:border-primary-300 hover:bg-primary-50/40'}`}>{f}</button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
          <Link href={planHref} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors">
            Continue to Plan Wizard <ArrowRight className="w-4 h-4"/>
          </Link>
          <div className="mt-8 text-xs text-neutral-500 leading-relaxed">
            <p>Next: Plan Wizard will ask context questions based on selected features (e.g. ownership, urgency, tooling). We can also surface relevant blog insights to build trust.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
