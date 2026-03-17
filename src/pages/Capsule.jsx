import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useNavigate } from 'react-router-dom';

const Capsule = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [capsule, setCapsule] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Cek apakah hari ini sudah melewati tanggal buka kapsul
  const isUnlocked = capsule ? new Date() >= new Date(capsule.unlock_date) : false;

  useEffect(() => {
    // Mengecek siapa yang sedang login
    const checkUserAndCapsule = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Kalau belum login, lempar kembali ke halaman depan
        navigate('/auth');
        return;
      }

      setUser(session.user);

      // Cek apakah user ini sudah pernah membuat kapsul
      const { data, error } = await supabase
        .from('time_capsules')
        .select('*')
        .eq('user_id', session.user.id)
        .single(); // Ambil 1 data saja

      if (data) {
        setCapsule(data);
      }
      setLoading(false);
    };

    checkUserAndCapsule();
  }, [navigate]);

  const handleSaveCapsule = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Set tanggal buka kapsul: Misalnya H-7 Ramadhan tahun depan (sekitar awal Februari 2027)
    const unlockDate = new Date('2027-02-01T00:00:00Z'); 

    const { error } = await supabase
      .from('time_capsules')
      .insert([
        { 
          user_id: user.id, 
          content: content,
          unlock_date: unlockDate.toISOString()
        }
      ]);

    if (!error) {
      // Reload halaman agar status berubah menjadi "Terkunci"
      window.location.reload(); 
    } else {
      alert("Gagal menyimpan kapsul: " + error.message);
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex justify-center items-center text-amber-400">Memuat ruang waktu...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        
        {/* Tombol Logout */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-slate-400 text-sm">Masuk sebagai: {user?.email}</p>
          <button onClick={handleLogout} className="text-slate-500 hover:text-amber-400 text-sm transition-colors cursor-pointer">
            Keluar
          </button>
        </div>

        {/* JIKA SUDAH PUNYA KAPSUL */}
        {capsule ? (
          isUnlocked ? (
            /* TAMPILAN JIKA WAKTUNYA SUDAH TIBA (KAPSUL TERBUKA) */
            <div className="bg-slate-900 p-8 rounded-2xl border border-amber-500/50 shadow-xl shadow-amber-900/20 transition-all">
              <div className="text-5xl mb-4 text-center">📖</div>
              <h2 className="text-3xl font-serif text-amber-400 mb-6 text-center">Pesan dari Masa Lalu</h2>
              <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 leading-relaxed whitespace-pre-wrap">
                {capsule.content}
              </div>
              <p className="text-slate-500 text-sm mt-6 text-center italic">
                Ditulis pada: {new Date(capsule.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          ) : (
            /* TAMPILAN JIKA KAPSUL MASIH TERKUNCI */
            <div className="bg-slate-900 p-10 rounded-2xl border border-slate-800 text-center shadow-xl shadow-black/50">
              <div className="text-6xl mb-6 animate-pulse">🔒</div>
              <h2 className="text-2xl font-serif text-amber-400 mb-4">Kapsul Waktu Terkunci</h2>
              <p className="text-slate-400 mb-2">
                Suratmu sedang berjalan melintasi waktu menuju masa depan.
              </p>
              <p className="text-amber-200/70 text-sm bg-slate-800/50 inline-block px-4 py-2 rounded-lg mt-4 border border-amber-900/30">
                Kapsul baru bisa dibuka pada: {new Date(capsule.unlock_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          )
        ) : (
          
          /* JIKA BELUM PUNYA KAPSUL (FORM TULIS SURAT) */
          <form onSubmit={handleSaveCapsule} className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl shadow-black/50">
            <h2 className="text-3xl font-serif text-amber-400 mb-2">Pesan untuk Masa Depan</h2>
            <p className="text-slate-400 mb-6 text-sm">
              Tuliskan penyesalan, harapan, atau sekadar pengingat untuk dirimu di Ramadhan tahun depan. Jujurlah pada dirimu sendiri.
            </p>
            
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Wahai diriku di masa depan, saat membaca surat ini, kuharap engkau..."
              className="w-full h-64 p-5 rounded-xl bg-slate-950/50 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors resize-none leading-relaxed"
            ></textarea>

            <button
              type="submit"
              disabled={saving || !content.trim()}
              className="w-full mt-6 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium py-3 rounded-lg transition-colors cursor-pointer"
            >
              {saving ? 'Menyegel Kapsul...' : 'Kunci Kapsul Ini'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default Capsule;