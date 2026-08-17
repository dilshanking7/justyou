import { Request } from 'express';

export function getClientMetadata(req: Request) {
  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
    req.socket.remoteAddress ||
    '127.0.0.1';

  const userAgent = req.headers['user-agent'] || 'Unknown Browser';
  const acceptLanguage = req.headers['accept-language'] || 'en-US';

  // Country resolution from Cloud Run / CDN headers or accept-language fallback
  const countryHeader = (req.headers['x-country-code'] ||
    req.headers['cf-ipcountry'] ||
    req.headers['x-appengine-country']) as string;
  const country = countryHeader ? countryHeader.toUpperCase() : 'US';

  const language = acceptLanguage.split(',')[0].split('-')[0] || 'en';
  const timezone = (req.headers['x-timezone'] as string) || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  // Simple user agent parser
  let browser = 'Chrome/Safari';
  if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Edg')) browser = 'Edge';
  else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';

  let os = 'Desktop OS';
  if (userAgent.includes('Android')) os = 'Android';
  else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';
  else if (userAgent.includes('Macintosh')) os = 'macOS';
  else if (userAgent.includes('Windows')) os = 'Windows';
  else if (userAgent.includes('Linux')) os = 'Linux';

  let deviceType = 'DESKTOP';
  if (os === 'Android' || os === 'iOS') deviceType = 'MOBILE';

  return {
    ip,
    userAgent,
    country,
    language,
    timezone,
    browser,
    os,
    deviceType,
  };
}
