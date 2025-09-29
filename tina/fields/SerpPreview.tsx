import React from 'react'

type FormLike = {
  getState: () => { values?: Record<string, any> }
}

type Props = { form: FormLike }

export default function SerpPreview({ form }: Props) {
  const values = form.getState().values || {}
  const seo = values.seo || {}
  const title: string = seo.metaTitle || '(Set a meta title)'
  const description: string = seo.metaDescription || '(Add a compelling description)'
  const canonical: string = seo.canonicalUrl || '(e.g. /contact)'

  const titleLen = (seo.metaTitle || '').length
  const descLen = (seo.metaDescription || '').length

  const okTitle = titleLen >= 50 && titleLen <= 60
  const okDesc = descLen >= 150 && descLen <= 160

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, background: '#fafafa' }}>
      <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>SERP preview (approx.)</div>
      <div style={{ color: '#1a0dab', fontSize: 18, lineHeight: 1.2, marginBottom: 4 }}>{title}</div>
      <div style={{ color: '#006621', fontSize: 12, marginBottom: 6 }}>{canonical}</div>
      <div style={{ color: '#4b5563', fontSize: 13 }}>{description}</div>
      <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
        Title: {titleLen} chars {okTitle ? '✓' : '(aim 50–60)'} · Description: {descLen} chars {okDesc ? '✓' : '(aim 150–160)'}
      </div>
    </div>
  )
}
