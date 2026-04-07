import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

// Declaración para TypeScript
declare global {
  interface Window {
    fbq: any;
  }
}

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [pixelStatus, setPixelStatus] = useState<'waiting' | 'sent' | 'error'>('waiting');

  useEffect(() => {
    setIsLoaded(true);
    
    // 1. Lanzar confeti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    // 2. Disparar Meta Pixel Event
    const firePixelEvent = () => {
      if (typeof window.fbq === 'function') {
        console.log('[Meta Pixel] Disparando evento Schedule...');
        window.fbq('track', 'Schedule', {
          content_name: 'Agendamiento Confirmado',
          currency: 'USD',
          value: 0
        });
        setPixelStatus('sent');
        return true;
      }
      return false;
    };

    // Intentar disparar inmediatamente
    if (!firePixelEvent()) {
      let attempts = 0;
      const retryInterval = setInterval(() => {
        attempts++;
        if (firePixelEvent() || attempts >= 20) {
          clearInterval(retryInterval);
          if (attempts >= 20) setPixelStatus('error');
        }
      }, 500);
    }

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] font-sans flex items-center justify-center selection:bg-emerald-100 selection:text-emerald-900 relative">
      
      <main className="max-w-3xl mx-auto px-6 py-12">
        <AnimatePresence>
          {isLoaded && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mb-2"
                >
                  <CheckCircle2 size={48} />
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
                  ¡Agendamiento Confirmado!
                </h1>
                <p className="text-lg text-slate-500 max-w-md mx-auto">
                  Hemos enviado los detalles de tu cita a tu correo electrónico. ¡Nos vemos pronto!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* PANEL DE DEPURACIÓN (Visualización del estado del Píxel) */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className={`px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold flex flex-col gap-2 transition-all duration-500 ${
          pixelStatus === 'sent' ? 'bg-emerald-900 border-emerald-500 text-emerald-100' : 
          pixelStatus === 'error' ? 'bg-red-900 border-red-500 text-red-100' : 
          'bg-slate-900 border-slate-700 text-slate-100'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              pixelStatus === 'sent' ? 'bg-emerald-400' : 
              pixelStatus === 'error' ? 'bg-red-400' : 'bg-yellow-400'
            }`} />
            ESTADO DEL PÍXEL: {pixelStatus === 'sent' ? 'EVENTO ENVIADO' : pixelStatus === 'error' ? 'ERROR DE CARGA' : 'ESPERANDO...'}
          </div>
          <div className="opacity-60 text-[10px] font-mono">
            ID: 1039040052894510<br/>
            Evento: Schedule
          </div>
        </div>
      </div>
    </div>
  );
}

