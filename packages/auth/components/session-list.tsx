"use client";

import { useEffect, useState } from 'react';
import { useSession } from '../client';
import { getAllUserSessions, revokeSession } from '../utils/session';
import { formatLocationString } from '../utils/geolocation';

interface SessionData {
  id: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
  createdAt: Date;
  isCurrent: boolean;
}

export function SessionList() {
  const { session } = useSession();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSessions() {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        const userSessions = await getAllUserSessions(session.user.id);
        setSessions(userSessions);
      } catch (err) {
        setError('Failed to load sessions');
        console.error('Error loading sessions:', err);
      } finally {
        setLoading(false);
      }
    }

    loadSessions();
  }, [session?.user?.id]);

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await revokeSession(sessionId);
      // Refresh the session list
      setSessions(prev => prev.filter(s => s.id !== sessionId));
    } catch (err) {
      setError('Failed to revoke session');
      console.error('Error revoking session:', err);
    }
  };

  if (!session?.user) {
    return (
      <div className="p-4">
        <p>Please sign in to view your sessions.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4">
        <p>Loading sessions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Active Sessions</h2>
      
      {sessions.length === 0 ? (
        <p className="text-gray-600">No active sessions found.</p>
      ) : (
        <div className="space-y-4">
          {sessions.map((sessionData) => (
            <div
              key={sessionData.id}
              className={`border rounded-lg p-4 ${
                sessionData.isCurrent ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">
                      {sessionData.isCurrent ? 'Current Session' : 'Session'}
                    </h3>
                    {sessionData.isCurrent && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        Current
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-1">Location</h4>
                      <p className="text-sm">
                        {formatLocationString({
                          city: sessionData.city,
                          region: sessionData.region,
                          country: sessionData.country,
                        })}
                      </p>
                      {sessionData.timezone && (
                        <p className="text-sm text-gray-600">
                          Timezone: {sessionData.timezone}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-1">Device Info</h4>
                      <p className="text-sm text-gray-600">
                        IP: {sessionData.ipAddress || 'Unknown'}
                      </p>
                      {sessionData.userAgent && (
                        <p className="text-sm text-gray-600 truncate" title={sessionData.userAgent}>
                          {sessionData.userAgent}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3 flex gap-4 text-sm text-gray-600">
                    <span>Created: {sessionData.createdAt.toLocaleDateString()}</span>
                    <span>Expires: {sessionData.expiresAt.toLocaleDateString()}</span>
                  </div>
                </div>
                
                {!sessionData.isCurrent && (
                  <button
                    onClick={() => handleRevokeSession(sessionData.id)}
                    className="ml-4 px-3 py-1 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50"
                  >
                    Revoke
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6 pt-6 border-t">
        <h3 className="font-semibold mb-2">Security Actions</h3>
        <p className="text-sm text-gray-600 mb-3">
          If you notice any suspicious sessions, you can revoke them individually or sign out from all devices.
        </p>
        <button
          onClick={() => {
            // Implement revoke all sessions
            console.log('Revoke all sessions');
          }}
          className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50"
        >
          Sign Out All Devices
        </button>
      </div>
    </div>
  );
}