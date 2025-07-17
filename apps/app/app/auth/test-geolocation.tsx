"use client";

import { useSession, useCloudflareContext, useUserGeolocation } from '@repo/auth';
import { formatLocationString } from '@repo/auth/utils/geolocation';

export default function TestGeolocation() {
  const session = useSession();
  const cloudflareContext = useCloudflareContext();
  const geolocation = useUserGeolocation();

  if (!session?.user) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Geolocation Test</h1>
        <p>Please sign in to view geolocation data.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Cloudflare Geolocation Test</h1>
      
      <div className="space-y-6">
        {/* Current Session Info */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Current Session</h2>
          <div className="space-y-2">
            <p><strong>User:</strong> {session.user.name || session.user.email}</p>
            <p><strong>Session ID:</strong> {session.session?.id}</p>
            <p><strong>IP Address:</strong> {session.session?.ipAddress || 'Not available'}</p>
          </div>
        </div>

        {/* Cloudflare Context */}
        <div className="bg-blue-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Cloudflare Context</h2>
          <div className="space-y-2">
            <p><strong>IP:</strong> {cloudflareContext.ip || 'Not available'}</p>
            <p><strong>Country:</strong> {cloudflareContext.country || 'Not available'}</p>
            <p><strong>Region:</strong> {cloudflareContext.region || 'Not available'}</p>
            <p><strong>City:</strong> {cloudflareContext.city || 'Not available'}</p>
            <p><strong>Timezone:</strong> {cloudflareContext.timezone || 'Not available'}</p>
            <p><strong>Location String:</strong> {formatLocationString(cloudflareContext)}</p>
          </div>
        </div>

        {/* Raw Cloudflare Data */}
        {cloudflareContext.cf && (
          <div className="bg-green-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Raw Cloudflare Data</h2>
            <pre className="text-sm overflow-auto bg-white p-2 rounded">
              {JSON.stringify(cloudflareContext.cf, null, 2)}
            </pre>
          </div>
        )}

        {/* Browser Geolocation */}
        {geolocation && (
          <div className="bg-yellow-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Browser Geolocation</h2>
            <div className="space-y-2">
              <p><strong>Latitude:</strong> {geolocation.latitude}</p>
              <p><strong>Longitude:</strong> {geolocation.longitude}</p>
              <p><strong>Accuracy:</strong> {geolocation.accuracy}m</p>
            </div>
          </div>
        )}

        {/* Session Location History */}
        <div className="bg-purple-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Session Location Data</h2>
          <div className="space-y-2">
            <p><strong>Country:</strong> {session.session?.country || 'Not tracked'}</p>
            <p><strong>Region:</strong> {session.session?.region || 'Not tracked'}</p>
            <p><strong>City:</strong> {session.session?.city || 'Not tracked'}</p>
            <p><strong>Timezone:</strong> {session.session?.timezone || 'Not tracked'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}