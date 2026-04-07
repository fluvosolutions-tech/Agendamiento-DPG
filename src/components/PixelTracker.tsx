import { useEffect } from 'react';

// Declaración para TypeScript para que reconozca la función fbq de Meta
declare global {
  interface Window {
    fbq: any;
  }
}

interface PixelTrackerProps {
  eventName: string;
  data?: Record<string, any>;
}

/**
 * Componente para manejar el seguimiento de píxeles (Meta Pixel)
 * Se activa automáticamente al montar el componente.
 */
export default function PixelTracker({ eventName, data }: PixelTrackerProps) {
  useEffect(() => {
    console.log(`[Pixel Tracker] Enviando evento a Meta: ${eventName}`, data);

    // Llamada real al Meta Pixel
    if (typeof window.fbq === 'function') {
      window.fbq('track', eventName, data);
    } else {
      console.warn('[Pixel Tracker] Meta Pixel (fbq) no está inicializado.');
    }

    // Simulación de evento interno para demostración
    const event = new CustomEvent('pixel_event', { detail: { eventName, data } });
    window.dispatchEvent(event);
  }, [eventName, data]);

  return null;
}
