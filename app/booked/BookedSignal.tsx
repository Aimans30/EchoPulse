'use client';

import { useEffect } from 'react';
import { trackCallBooked } from '@/lib/analytics';

/**
 * Records the booking once. Inside the booking modal's iframe it tells the
 * parent page (which knows where the visitor was) to record it; opened as a
 * normal tab it records the event itself. sessionStorage stops a refresh of
 * this page from counting the same booking twice.
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
      trackCallBooked('/booked');
    }
  }, []);
  return null;
}
