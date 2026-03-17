const BASE_URL = 'http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno';

export default async function handler(req, res) {
  const { url, headers, method } = req;
  if (method && method !== 'GET' && method !== 'HEAD') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET, HEAD');
    res.end('Method Not Allowed');
    return;
  }

  try {
    const requestUrl = new URL(url, `http://${headers.host}`);
    const targetPath = requestUrl.pathname.replace(/^\/api\/viaggiatreno\/?/, '');
    const targetUrl = `${BASE_URL}/${targetPath}${requestUrl.search}`;

    const upstream = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    const buffer = Buffer.from(await upstream.arrayBuffer());
    res.statusCode = upstream.status;
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    res.end(buffer);
  } catch (error) {
    res.statusCode = 502;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'upstream_failed' }));
  }
}
