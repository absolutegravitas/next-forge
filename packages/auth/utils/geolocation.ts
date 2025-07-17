export interface CloudflareGeolocation {
  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
  latitude?: string;
  longitude?: string;
  ip?: string;
}

export interface GeolocationContext {
  cf?: {
    country?: string;
    region?: string;
    city?: string;
    timezone?: string;
    colo?: string;
    asn?: string;
    asOrganization?: string;
  };
  ip?: string;
  userAgent?: string;
}

export const extractGeolocationFromHeaders = (headers: Headers): CloudflareGeolocation => {
  return {
    country: headers.get('cf-ipcountry') || undefined,
    region: headers.get('cf-region') || undefined,
    city: headers.get('cf-city') || undefined,
    timezone: headers.get('cf-timezone') || undefined,
    ip: headers.get('cf-connecting-ip') || headers.get('x-forwarded-for') || undefined,
  };
};

export const enrichSessionWithGeolocation = (
  session: any,
  geolocation: CloudflareGeolocation
) => {
  return {
    ...session,
    geolocation: {
      country: geolocation.country,
      region: geolocation.region,
      city: geolocation.city,
      timezone: geolocation.timezone,
      ip: geolocation.ip,
    },
  };
};

export const formatLocationString = (geolocation: CloudflareGeolocation): string => {
  const parts = [];
  
  if (geolocation.city) parts.push(geolocation.city);
  if (geolocation.region) parts.push(geolocation.region);
  if (geolocation.country) parts.push(geolocation.country);
  
  return parts.length > 0 ? parts.join(', ') : 'Unknown Location';
};

export const getTimezoneFromHeaders = (headers: Headers): string | undefined => {
  return headers.get('cf-timezone') || undefined;
};

export const getCountryFromHeaders = (headers: Headers): string | undefined => {
  return headers.get('cf-ipcountry') || undefined;
};

export const isValidTimezone = (timezone: string): boolean => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
};