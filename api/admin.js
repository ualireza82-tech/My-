import { kv } from '@vercel/kv';

export default async function handler(req) {
  // یک پسورد ساده در متغیرهای محیطی ورسل ست کنید: ADMIN_SECRET
  const adminSecret = process.env.ADMIN_SECRET; 

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { secret, action, payload } = req.body;

  if (secret !== adminSecret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    if (action === 'UPDATE_MATCHES') {
      // ذخیره مستقیم فرمان در دیتابیس KV
      await kv.set('live_matches', payload);
      return res.status(200).json({ success: true, message: 'Matches updated instantly' });
    }
    
    return res.status(400).json({ error: 'Invalid Action' });
  } catch (error) {
    return res.status(500).json({ error: 'Database update failed' });
  }
}
