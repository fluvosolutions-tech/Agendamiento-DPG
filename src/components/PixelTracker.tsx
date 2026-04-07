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
    const trackEvent = () => {
      if (typeof window.fbq === 'function') {
        console.log(`[Pixel Tracker] Enviando evento a Meta: ${eventName}`, data);
        window.fbq('track', eventName, data);
        return true;
      }
      return false;
    };

    // Intentar disparar el evento inmediatamente
    if (!trackEvent()) {
      console.warn('[Pixel Tracker] Meta Pixel (fbq) no está listo. Reintentando...');
      
      // Reintentar cada 500ms hasta un máximo de 10 veces
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (trackEvent() || attempts >= 10) {
          clearInterval(interval);
          if (attempts >= 10 && typeof window.fbq !== 'function') {
            console.error('[Pixel Tracker] No se pudo encontrar Meta Pixel después de varios intentos.');
          }
        }
      }, 500);

      return () => clearInterval(interval);
    }

    // Simulación de evento interno para demostración
    const event = new CustomEvent('pixel_event', { detail: { eventName, data } });
    window.dispatchEvent(event);
  }, [eventName, data]);

  return null;
}
