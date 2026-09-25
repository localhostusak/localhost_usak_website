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

// ─── Token yapılandırılmadığında gösterilecek topluluk gönderileri ─────────
const FALLBACK_POSTS: InstagramPost[] = [
  {
    id: 'fallback-1',
    media_type: 'IMAGE',
    media_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    permalink: 'https://www.instagram.com/localhostusak',
    caption: '☕ Laptopunu ve kahveni al! Localhost Uşak olarak her hafta sonu aynı masada bir araya geliyor, bağımsız projelerimizi geliştiriyoruz. #localhostusak #developer #community',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'fallback-2',
    media_type: 'CAROUSEL_ALBUM',
    media_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    permalink: 'https://www.instagram.com/localhostusak',
    caption: '🚀 Açık Kaynak Geliştirme Günleri: Uşak teknoloji ekosistemini birlikte büyütüyoruz. Takım kurmak ve fikirlerini paylaşmak için aramıza katıl! #opensource #tech #usak',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'fallback-3',
    media_type: 'IMAGE',
    media_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    permalink: 'https://www.instagram.com/localhostusak',
    caption: '💡 Coworking Buluşmaları: Yazılımcılar, tasarımcılar ve mühendis adayları bir arada. Birbirimizden öğreniyor, birlikte üretiyoruz. #coworking #software #networking',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

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

  // Token veya User ID tanımlı değilse topluluk gönderilerini fallback olarak dön
  if (!token || !userId) {
    return NextResponse.json(
      { posts: FALLBACK_POSTS, isFallback: true },
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
      if (cache.data && cache.data.length > 0) {
        return NextResponse.json({ posts: cache.data, cached: true, stale: true }, { headers })
      }
      return NextResponse.json(
        { posts: FALLBACK_POSTS, isFallback: true, error: 'Instagram API response error', detail: errBody },
        { status: 200, headers }
      )
    }

    const json = await res.json()
    const posts: InstagramPost[] = json.data ?? []

    if (posts.length === 0) {
      return NextResponse.json({ posts: FALLBACK_POSTS, isFallback: true }, { headers })
    }

    // Cache güncelle
    cache = { data: posts, fetchedAt: now }

    return NextResponse.json({ posts, cached: false }, { headers })
  } catch (err) {
    console.error('[Instagram API] Fetch failed:', err)
    if (cache.data && cache.data.length > 0) {
      return NextResponse.json({ posts: cache.data, cached: true, stale: true }, { headers })
    }
    return NextResponse.json(
      { posts: FALLBACK_POSTS, isFallback: true, error: 'Failed to fetch Instagram posts' },
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
