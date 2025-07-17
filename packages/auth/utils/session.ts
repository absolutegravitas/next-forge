import { auth } from '../server';
import type { CloudflareGeolocation } from './geolocation';

export interface SessionWithGeolocation {
  id: string;
  userId: string;
  expiresAt: Date;
  token: string;
  ipAddress?: string;
  userAgent?: string;
  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
  latitude?: string;
  longitude?: string;
}

export const createSessionWithGeolocation = async (
  userId: string,
  geolocation: CloudflareGeolocation,
  userAgent?: string
) => {
  try {
    const session = await auth.api.signIn.email({
      userId,
      userAgent,
      ipAddress: geolocation.ip,
      // Additional geolocation data will be stored via better-auth-cloudflare
      geolocation: {
        country: geolocation.country,
        region: geolocation.region,
        city: geolocation.city,
        timezone: geolocation.timezone,
        latitude: geolocation.latitude,
        longitude: geolocation.longitude,
      },
    });

    return session;
  } catch (error) {
    console.error('Error creating session with geolocation:', error);
    throw error;
  }
};

export const getSessionWithGeolocation = async (
  token: string
): Promise<SessionWithGeolocation | null> => {
  try {
    const session = await auth.api.getSession({
      headers: {
        cookie: `better-auth.session_token=${token}`,
      },
    });

    if (!session) return null;

    return {
      id: session.session.id,
      userId: session.user.id,
      expiresAt: new Date(session.session.expiresAt),
      token: session.session.token,
      ipAddress: session.session.ipAddress,
      userAgent: session.session.userAgent,
      country: session.session.country,
      region: session.session.region,
      city: session.session.city,
      timezone: session.session.timezone,
      latitude: session.session.latitude,
      longitude: session.session.longitude,
    };
  } catch (error) {
    console.error('Error getting session with geolocation:', error);
    return null;
  }
};

export const getAllUserSessions = async (userId: string) => {
  try {
    const sessions = await auth.api.listSessions({
      userId,
    });

    return sessions.map((session: any) => ({
      id: session.id,
      expiresAt: new Date(session.expiresAt),
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      country: session.country,
      region: session.region,
      city: session.city,
      timezone: session.timezone,
      createdAt: new Date(session.createdAt),
      isCurrent: session.isCurrent,
    }));
  } catch (error) {
    console.error('Error getting user sessions:', error);
    throw error;
  }
};

export const revokeSession = async (sessionId: string) => {
  try {
    await auth.api.revokeSession({
      sessionId,
    });
    return { success: true };
  } catch (error) {
    console.error('Error revoking session:', error);
    throw error;
  }
};

export const revokeAllSessions = async (userId: string) => {
  try {
    await auth.api.revokeAllSessions({
      userId,
    });
    return { success: true };
  } catch (error) {
    console.error('Error revoking all sessions:', error);
    throw error;
  }
};