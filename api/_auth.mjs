// Shared internal-only gate for Explorer API functions (Decisions 0005 / 0017).
// When Supabase is configured we require a valid session; optionally restrict to one email domain.
// Returns { ok:true, user } or { ok:false, status, message }.
export async function verifyInternal(req) {
  const url = process.env.SUPABASE_URL;
  const anon = process.env.SUPABASE_ANON_KEY;
  const requireAuth = process.env.REQUIRE_AUTH === 'true' || (!!url && !!anon);
  if (!requireAuth) return { ok: true, user: null };

  const auth = req.headers['authorization'] || req.headers['Authorization'] || '';
  const token = String(auth).replace(/^Bearer\s+/i, '').trim();
  if (!token) return { ok: false, status: 401, message: 'Sign in — the Explorer is internal-only.' };
  try {
    const r = await fetch(`${url}/auth/v1/user`, { headers: { apikey: anon, authorization: `Bearer ${token}` } });
    if (!r.ok) return { ok: false, status: 401, message: 'Your session is invalid or has expired. Sign in again.' };
    const user = await r.json();
    const domain = (process.env.ALLOWED_EMAIL_DOMAIN || '').toLowerCase().replace(/^@/, '');
    if (domain && !String(user.email || '').toLowerCase().endsWith('@' + domain))
      return { ok: false, status: 403, message: 'This workspace is internal-only.' };
    return { ok: true, user };
  } catch {
    return { ok: false, status: 401, message: 'Could not verify your session.' };
  }
}
