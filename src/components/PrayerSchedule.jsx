import { useState, useEffect } from 'react';

const PrayerSchedule = () => {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);

  // ID 1301 adalah kode permanen untuk Kota Jakarta di API My-Quran
  const JAKARTA_ID = '1301';

  useEffect(() => {
    const fetchJakartaSchedule = async () => {
      const date = new Date();
      const y = date.getFullYear();
      
      // PERBAIKAN: API mewajibkan format 2 digit (contoh: 03, bukan 3)
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');

      try {
        const url = `https://api.my-quran.com/v2/sholat/jadwal/${JAKARTA_ID}/${y}/${m}/${d}`;
        const res = await fetch(url);
        
        if (!res.ok) throw new Error("Gagal koneksi ke API");
        
        const data = await res.json();
        if (data.status) {
          setSchedule(data.data.jadwal);
        }
      } catch (err) {
        console.error("Detail Error Sholat:", err);
        setSchedule(null);
      } finally {
        setLoading(false);
      }
    };

    fetchJakartaSchedule();
  }, []);

  // Daftar waktu yang ingin ditampilkan
  const prayerTimes = [
    { key: 'imsak', label: 'Imsak', icon: '⏳' },
    { key: 'subuh', label: 'Subuh', icon: '🕌' },
    { key: 'dzuhur', label: 'Dzuhur', icon: '☀️' },
    { key: 'ashar', label: 'Ashar', icon: '⛅' },
    { key: 'maghrib', label: 'Maghrib', icon: '🌙' },
    { key: 'isya', label: 'Isya', icon: '⭐' },
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-amber-400 font-serif text-xl flex items-center gap-2">
          <span className="animate-pulse text-red-500 text-sm">📍</span> Jakarta
        </h3>
        <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase bg-slate-950 px-2 py-1 rounded-md border border-slate-800">
          WIB
        </span>
      </div>

      {loading ? (
        <div className="py-10 text-center">
          <div className="inline-block w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-2"></div>
          <p className="text-xs text-slate-500 animate-pulse font-serif">Menghubungkan ke pusat waktu...</p>
        </div>
      ) : schedule ? (
        <div className="grid grid-cols-2 gap-3">
          {prayerTimes.map((p) => {
            const isMaghrib = p.key === 'maghrib';
            return (
              <div 
                key={p.key} 
                className={`flex justify-between items-center p-3 rounded-2xl border transition-all duration-300 ${
                  isMaghrib 
                  ? 'bg-amber-600/20 border-amber-600 shadow-[0_0_15px_rgba(217,119,6,0.15)]' 
                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col">
                  <span className={`text-[9px] uppercase tracking-tighter mb-0.5 ${isMaghrib ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
                    {p.label}
                  </span>
                  <span className={`text-lg font-mono font-bold ${isMaghrib ? 'text-amber-100' : 'text-slate-200'}`}>
                    {schedule[p.key]}
                  </span>
                </div>
                <span className={`text-xl ${isMaghrib ? 'opacity-100' : 'opacity-40'}`}>
                  {p.icon}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6">
           <p className="text-xs text-red-400/80 italic">Gagal memuat jadwal. <br/> Pastikan koneksi internet aktif.</p>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-slate-800/50 flex justify-between items-center">
        <p className="text-[9px] text-slate-600 italic">Kemenag RI</p>
        <p className="text-[9px] text-slate-600 font-mono">
          {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>
    </div>
  );
};

export default PrayerSchedule;