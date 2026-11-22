import {json,setCookie} from '../../_lib.js';

export async function onRequestGet({request, env}) {
  if (!env.DISCORD_CLIENT_ID || !env.DISCORD_REDIRECT_URI) {
    return json({error:'Discord OAuth is not configured yet. Add DISCORD_CLIENT_ID and DISCORD_REDIRECT_URI in Cloudflare.'},503);
  }
  const state = crypto.randomUUID();
  const url = new URL('https://discord.com/oauth2/authorize');
  url.searchParams.set('client_id', env.DISCORD_CLIENT_ID);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('redirect_uri', env.DISCORD_REDIRECT_URI);
  url.searchParams.set('scope', 'identify');
  url.searchParams.set('state', state);
  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
      'Set-Cookie': setCookie('classic_oauth_state', state, 600),
      'Cache-Control': 'no-store'
    }
  });
}
