'use client';

import { createContext, useContext, type ReactNode } from 'react';

/**
 * Server-detected geo, piped from middleware → layout.tsx → this provider.
 * Both values may be null when the platform doesn't inject geo headers
 * (local dev, some self-hosted setups). In that case useGeoPrice falls
 * back to its client-side detection path (timezone + ipapi.co).
 */
export interface InitialGeo {
  initialCountry: string | null;
  initialCity: string | null;
}

const GeoContext = createContext<InitialGeo>({
  initialCountry: null,
  initialCity: null,
});

export function GeoProvider({
  initialCountry,
  initialCity,
  children,
}: InitialGeo & { children: ReactNode }) {
  return (
    <GeoContext.Provider value={{ initialCountry, initialCity }}>
      {children}
    </GeoContext.Provider>
  );
}

/** Read the server-detected geo. Returns nulls when unavailable. */
export function useInitialGeo(): InitialGeo {
  return useContext(GeoContext);
}
