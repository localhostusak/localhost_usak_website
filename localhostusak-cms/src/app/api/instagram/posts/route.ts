import { NextRequest, NextResponse } from 'next/server'

// ─── Basit bellek cache'i ───────────────────────────────────────────────────
let cache: {
  data: InstagramPost[] | null
  fetchedAt: number
} = { data: null, fetchedAt: 0 }

const CACHE_TTL_MS = 15 * 60 * 1000 // 15 dakika

export interface InstagramPost {
  id: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url: string
  thumbnail_url?: string // VIDEO tipi için
  permalink: string
  caption?: string
  timestamp: string
}

function getCorsHeaders(req: NextRequest): Record<string, string> {
  const origin = req.headers.get('origin') || ''
  const allowedOrigins = [
    'https://localhostusak.tech',
    'https://www.localhostusak.tech',
    'https://localhostusak.com',
    'https://www.localhostusak.com',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.WEB_URL,
  ].filter(Boolean) as string[]

  const isAllowed =
    allowedOrigins.includes(origin) ||
    !origin ||
    origin.endsWith('.localhostusak.tech') ||
    origin.endsWith('.localhostusak.com')

  const allowOrigin = isAllowed && origin ? origin : (allowedOrigins[0] || '*')

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'application/json',
  }
}

// ─── GET /api/instagram/posts ───────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const headers = getCorsHeaders(req)
  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  const userId = process.env.INSTAGRAM_USER_ID

  if (!token || !userId) {
    // 200 dönerek konsol kırmızı log kirliliğini ve CORS blokajını engelliyoruz
    return NextResponse.json(
      { posts: [], message: 'Instagram credentials not configured' },
      { status: 200, headers }
    )
  }

  // Cache geçerliyse direkt dön
  const now = Date.now()
  if (cache.data && now - cache.fetchedAt < CACHE_TTL_MS) {
    return NextResponse.json({ posts: cache.data, cached: true }, { headers })
  }

  try {
    const fields = 'id,media_type,media_url,thumbnail_url,permalink,caption,timestamp'
    const url = `https://graph.instagram.com/${userId}/media?fields=${fields}&limit=3&access_token=${token}`

    const res = await fetch(url, { next: { revalidate: 900 } })

    if (!res.ok) {
      const errBody = await res.text()
      console.warn('[Instagram API] Warning:', res.status, errBody)
      if (cache.data) {
        return NextResponse.json({ posts: cache.data, cached: true, stale: true }, { headers })
      }
      return NextResponse.json(
        { posts: [], error: 'Instagram API response error', detail: errBody },
        { status: 200, headers }
      )
    }

    const json = await res.json()
    const posts: InstagramPost[] = json.data ?? []

    // Cache güncelle
    cache = { data: posts, fetchedAt: now }

    return NextResponse.json({ posts, cached: false }, { headers })
  } catch (err) {
    console.error('[Instagram API] Fetch failed:', err)
    if (cache.data) {
      return NextResponse.json({ posts: cache.data, cached: true, stale: true }, { headers })
    }
    return NextResponse.json(
      { posts: [], error: 'Failed to fetch Instagram posts' },
      { status: 200, headers }
    )
  }
}

// OPTIONS — preflight için
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(req),
  })
}
