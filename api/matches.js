import { kv } from '@vercel/kv';

export const config = {
  runtime: 'edge', // اجرای روی لبه برای سرعت میلی‌ثانیه‌ای
};

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200 });
  }

  try {
    // خواندن لیست بازی‌ها از کش سریع KV
    const matches = await kv.get('live_matches') || [];
    
    return new Response(JSON.stringify(matches), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // کشینگ فوق‌هوشمند: ۵ ثانیه روی لبه، ۱۵ ثانیه اجازه استیل بودن
        'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=15'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Server Error" }), { status: 500 });
  }
}

