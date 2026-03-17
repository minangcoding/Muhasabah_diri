import { useState } from 'react';
import { supabase } from '../config/supabase';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Mengirim Magic Link via Supabase
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        // Alihkan ke halaman kapsul setelah klik link di email
        emailRedirectTo: `${window.location.origin}/capsule`
      }
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Cek email kamu! Kami telah mengirimkan link ajaib untuk masuk.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900 p-8 rounded-2xl shadow-xl shadow-black/50 border border-slate-800">
        <h2 className="text-3xl font-serif text-amber-400 mb-2 text-center">Identitas Kapsul</h2>
        <p className="text-slate-400 text-center mb-8 text-sm">
          Masukkan emailmu. Ini akan menjadi kuncimu untuk membuka kapsul ini di Ramadhan tahun depan.
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-700 text-white font-medium py-3 rounded-lg transition-colors cursor-pointer"
          >
            {loading ? 'Mengirim...' : 'Kirim Kunci Rahasia'}
          </button>
        </form>

        {message && (
          <div className="mt-6 p-4 rounded-lg bg-slate-800 border border-slate-700 text-sm text-center text-amber-200">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;