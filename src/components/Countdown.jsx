// src/components/Countdown.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Countdown = () => {
  // Target waktu: 20 Maret 2026 (Perkiraan Idul Fitri)
  const targetDate = new Date('2026-03-20T00:00:00').getTime();

  const [timeLeft, setTimeLeft] = useState({
    hari: 0, jam: 0, menit: 0, detik: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        hari: Math.floor(distance / (1000 * 60 * 60 * 24)),
        jam: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        menit: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        detik: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const timeUnits = [
    { label: 'Hari', value: timeLeft.hari },
    { label: 'Jam', value: timeLeft.jam },
    { label: 'Menit', value: timeLeft.menit },
    { label: 'Detik', value: timeLeft.detik }
  ];

  return (
    <div className="flex gap-4 justify-center items-center my-8">
      {timeUnits.map((unit, index) => (
        <div key={index} className="flex flex-col items-center">
          <motion.div 
            key={unit.value}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 text-amber-400 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-lg text-2xl md:text-4xl font-bold shadow-lg shadow-amber-900/20"
          >
            {unit.value.toString().padStart(2, '0')}
          </motion.div>
          <span className="text-slate-400 text-xs md:text-sm mt-3 uppercase tracking-widest">{unit.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Countdown;