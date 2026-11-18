'use client';

import { useEffect } from 'react';
import { trackBookingConfirmed } from '@/lib/analytics';

/**
 * Records the booking once, as `booking_confirmed`. Inside a booking iframe it
 * tells the parent page (which knows where the visitor was) to record it.
 * Opened as a normal tab (the Cal.com links that open in a new tab), it
 * records the event itself, crediting the page and button remembered at the
 * click (lib/attribution.ts rememberBookingClick), not "/booked".
 * sessionStorage stops a refresh of this page from counting the same booking
 * twice.
 */
export default function BookedSignal() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem('ep_booked') === '1') return;
      sessionStorage.setItem('ep_booked', '1');
    } catch {
      /* storage blocked: count it anyway */
    }
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'ep:call_booked' }, window.location.origin);
    } else {
      trackBookingConfirmed('new_tab');
    }
  }, []);
  return null;
}
