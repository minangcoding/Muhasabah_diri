import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

const Admin = () => {
  const [muhasabahs, setMuhasabahs] = useState([]);
  const [newText, setNewText] = useState('');
  const [videoId, setVideoId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: mData } = await supabase.from('muhasabah_list').select('*').order('created_at', { ascending: false });
    const { data: vData } = await supabase.from('video_content').select('*').single();
    if (mData) setMuhasabahs(mData);
    if (vData) setVideoId(vData.youtube_id);
  };

  const addMuhasabah = async () => {
    if (!newText) return;
    await supabase.from('muhasabah_list').insert([{ text: newText }]);
    setNewText('');
    fetchData();
  };

  const deleteMuhasabah = async (id) => {
    await supabase.from('muhasabah_list').delete().eq('id', id);
    fetchData();
  };

  const updateVideo = async () => {
    await supabase.from('video_content').update({ youtube_id: videoId }).eq('id', 1);
    alert("Video diupdate!");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-3xl font-serif text-amber-400 mb-10">Admin Panel (Khusus Saya)</h1>
      
      {/* CRUD Video */}
      <div className="bg-slate-900 p-6 rounded-xl mb-10 border border-slate-800">
        <h2 className="text-xl mb-4">Ganti Video YouTube (ID-nya saja)</h2>
        <div className="flex gap-4">
          <input 
            value={videoId} 
            onChange={(e) => setVideoId(e.target.value)}
            className="bg-slate-800 p-2 rounded flex-1"
            placeholder="Contoh: 5mE9U-D2v3o"
          />
          <button onClick={updateVideo} className="bg-amber-600 px-4 py-2 rounded">Simpan Video</button>
        </div>
      </div>

      {/* CRUD Muhasabah */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
        <h2 className="text-xl mb-4">Tambah Card Muhasabah</h2>
        <div className="flex gap-4 mb-6">
          <input 
            value={newText} 
            onChange={(e) => setNewText(e.target.value)}
            className="bg-slate-800 p-2 rounded flex-1"
            placeholder="Tulis renungan baru..."
          />
          <button onClick={addMuhasabah} className="bg-green-600 px-4 py-2 rounded">Tambah</button>
        </div>

        <div className="space-y-3">
          {muhasabahs.map(item => (
            <div key={item.id} className="flex justify-between bg-slate-800 p-3 rounded">
              <span>{item.text}</span>
              <button onClick={() => deleteMuhasabah(item.id)} className="text-red-500">Hapus</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;