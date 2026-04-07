import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Calendar, Clock, MapPin, ArrowLeft, Share2, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import PixelTracker from './components/PixelTracker';

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    // Lanzar confeti al cargar
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] font-sans flex items-center justify-center selection:bg-emerald-100 selection:text-emerald-900">
      {/* Pixel Tracker se activa al cargar la página */}
      <PixelTracker 
        eventName="Schedule" 
        data={{ 
          content_name: 'Agendamiento Confirmado',
          currency: 'USD'
        }} 
      />

      <main className="max-w-3xl mx-auto px-6 py-12">
        <AnimatePresence>
          {isLoaded && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-8"
            >
              {/* Header Section */}
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
    </div>
  );
}
