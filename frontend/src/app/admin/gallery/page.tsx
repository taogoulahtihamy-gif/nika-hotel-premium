'use client';

import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type GalleryImage = {
  filename: string;
  url: string;
};

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchImages = () => {
    setLoading(true);
    fetch(`${API}/api/upload`)
      .then((r) => r.json())
      .then((j) => { setImages(j.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchImages(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    await fetch(`${API}/api/upload`, { method: 'POST', body: formData });
    setUploading(false);
    fetchImages();
    e.target.value = '';
  };

  const deleteImage = async (filename: string) => {
    if (!confirm('Supprimer cette image ?')) return;
    await fetch(`${API}/api/upload/${filename}`, { method: 'DELETE' });
    fetchImages();
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  if (loading) return <p style={{ color: 'rgba(255,255,255,0.5)' }}>Chargement...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Bodoni Moda', serif", color: '#fff', margin: 0 }}>Galerie Photos</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 4 }}>Uploader, voir et supprimer des photos</p>
        </div>
        <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
          {uploading ? 'Upload...' : '+ Ajouter'}
          <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
        </label>
      </div>

      {images.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 48, color: 'rgba(255,255,255,0.3)' }}>
          <p style={{ fontSize: 48, marginBottom: 8 }}>🖼️</p>
          <p>Aucune image uploadée. Cliquez sur "+ Ajouter" pour commencer.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {images.map((img) => (
            <div key={img.filename} className="glass-card" style={{ padding: 12, textAlign: 'center' }}>
              <div style={{ height: 150, borderRadius: 10, backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url(${API}${img.url})`, marginBottom: 8 }} />
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: '0 0 8px', wordBreak: 'break-all' }}>{img.filename}</p>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', fontSize: 11 }} onClick={() => copyUrl(`${API}${img.url}`)}>Copier URL</button>
                <button className="btn btn-sm" style={{ background: '#ef5350', color: '#fff', border: 'none', fontSize: 11 }} onClick={() => deleteImage(img.filename)}>Suppr.</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
