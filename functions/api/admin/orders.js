import {json,getSession,isAdmin} from '../../_lib.js';

export async function onRequestGet({request,env}) {
  const user = await getSession(request,env);
  if (!isAdmin(user,env)) return json({error:'Forbidden. Sign in with the configured administrator Discord account.'},403);
  if (!env.DB) return json({error:'D1 is not connected. Add the DB binding named DB.'},503);
  const {results=[]} = await env.DB.prepare('SELECT * FROM orders ORDER BY id DESC LIMIT 200').all();
  return json({orders:results});
}

export async function onRequestPatch({request,env}) {
  const user = await getSession(request,env);
  if (!isAdmin(user,env)) return json({error:'Forbidden.'},403);
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) return json({error:'Cross-origin request blocked.'},403);
  if (!env.DB) return json({error:'D1 is not connected. Add the DB binding named DB.'},503);
  let body;
  try { body = await request.json(); } catch { return json({error:'Invalid JSON.'},400); }
  const id = Number(body.id), status = String(body.status||'');
  if (!Number.isInteger(id) || !['pending','accepted','in_progress','completed','rejected'].includes(status)) return json({error:'Invalid order or status.'},400);
  const result = await env.DB.prepare('UPDATE orders SET status=? WHERE id=?').bind(status,id).run();
  if (!result.meta.changes) return json({error:'Order not found.'},404);
  return json({ok:true});
}
