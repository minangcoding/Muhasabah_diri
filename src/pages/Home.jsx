import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import Countdown from '../components/Countdown';
import PrayerSchedule from '../components/PrayerSchedule'; // Import komponen baru

const Home = () => {
  const navigate = useNavigate();
  const [muhasabahList, setMuhasabahList] = useState([]);
  const [videoLink, setVideoLink] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Ambil data Muhasabah
        const { data: mData } = await supabase
          .from('muhasabah_list')
          .select('*')
          .order('created_at', { ascending: true });

        // Ambil data Video
        const { data: vData } = await supabase
          .from('video_content')
          .select('*')
          .single();

        setMuhasabahList(mData || []);
        setVideoLink(vData?.youtube_id || '');
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-amber-500 animate-pulse font-serif italic text-xl">Menyiapkan ruang renungan...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center py-12 px-6">
      <div className="max-w-6xl w-full">
        
        {/* --- SECTION 1: HEADER & COUNTDOWN --- */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-serif text-amber-400 mb-6 tracking-tight text-glow">
            Menuju Fitri
          </h1>
          <p className="text-slate-400 mb-10 text-lg max-w-2xl mx-auto leading-relaxed font-light">
            Sisa waktu Ramadhan adalah permata yang paling berharga. <br/> Jangan biarkan ia luput begitu saja.
          </p>
          <Countdown />
        </div>

        {/* --- SECTION 2: KARTU UTAMA --- */}
        <div className="max-w-4xl mx-auto bg-slate-900/40 border border-slate-800 backdrop-blur-sm rounded-[2rem] p-10 shadow-2xl mb-24 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-amber-600/5 blur-[100px] rounded-full"></div>
          
          <h2 className="text-amber-500 font-serif text-2xl mb-6 tracking-widest uppercase">Muhasabah</h2>
          <blockquote className="text-slate-200 text-xl md:text-2xl italic leading-relaxed mb-10 font-light px-4">
            "Jangan biarkan Ramadhan berlalu sebagai ritual kosong. Ini adalah pertaruhan hati. Tanyakan pada dirimu: seberapa jujur shalatmu? Seberapa lembut tilawahmu? Seberapa nyata empatimu?"
          </blockquote>

          <button 
            onClick={() => navigate('/auth')}
            className="cursor-pointer bg-amber-600 hover:bg-amber-500 text-white px-12 py-4 rounded-2xl font-semibold transition-all shadow-xl hover:shadow-amber-600/20 transform hover:-translate-y-1"
          >
            Tulis Kapsul Waktu Sekarang
          </button>
        </div>

        {/* --- SECTION 3: LAYOUT GRID (KIRI: INFO | KANAN: MUHASABAH) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* KOLOM KIRI (STICKY): Video & Jadwal Shalat */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            <div className="lg:sticky lg:top-10 flex flex-col gap-8">
              
              {/* Box Video */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl overflow-hidden">
                <h3 className="text-amber-400 font-serif text-xl mb-4 flex items-center gap-2">
                  <span>🎥</span> Nutrisi Hati
                </h3>
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-800 shadow-inner bg-black">
                  {videoLink ? (
                    <iframe 
                      className="absolute top-0 left-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${videoLink}?rel=0&modestbranding=1`}
                      title="Ceramah Ramadhan" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-600 text-xs italic p-4 text-center">
                      Belum ada video yang disetel.
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-4 text-center leading-relaxed">
                  "Sempatkan waktu sejenak untuk mencharge iman."
                </p>
              </div>

              {/* Komponen Jadwal Shalat */}
              <PrayerSchedule />

            </div>
          </div>

          {/* KOLOM KANAN: MUHASABAH VARIED GRID */}
          <div className="lg:col-span-2">
            <h3 className="text-3xl font-serif text-amber-400 mb-8 flex items-center gap-4">
              <span>✦</span> Tanda Hati yang Hidup
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {muhasabahList.length > 0 ? (
                muhasabahList.map((item, index) => {
                  // Variasi ukuran: Setiap item ke-3 akan mengambil 2 kolom (Wide Card)
                  const isWide = (index + 1) % 3 === 0;
                  
                  return (
                    <div 
                      key={item.id} 
                      className={`p-8 rounded-[2rem] border border-slate-800 flex flex-col justify-center transition-all duration-500 hover:border-amber-500/30 group bg-slate-900/50 hover:bg-slate-900 ${
                        isWide ? 'md:col-span-2 min-h-[250px]' : 'min-h-[200px]'
                      }`}
                    >
                      <div className="text-amber-600/20 group-hover:text-amber-500/40 transition-colors mb-4 text-3xl">
                         ❝
                      </div>
                      <p className={`font-serif leading-relaxed italic ${
                        isWide ? 'text-xl md:text-2xl text-amber-100/90' : 'text-lg text-slate-300'
                      }`}>
                        {item.text}
                      </p>
                      <div className="mt-8 h-[1px] w-8 bg-slate-800 group-hover:w-full group-hover:bg-amber-900/30 transition-all duration-700"></div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full py-20 text-center border border-dashed border-slate-800 rounded-[2rem] text-slate-600 italic">
                  Belum ada catatan muhasabah.
                </div>
              )}
            </div>

            <p className="mt-12 text-slate-600 text-xs text-center italic">
              "Hisablah dirimu sebelum engkau dihisab."
            </p>
          </div>

        </div>

        {/* --- FOOTER --- */}
        <footer className="mt-32 pb-10 text-center text-slate-700 text-[10px] tracking-[0.4em] uppercase">
          &copy; 2026 Ramadhan Capsule • Menjaga Makna Melintasi Waktu
        </footer>

      </div>
    </div>
  );
};

export default Home;