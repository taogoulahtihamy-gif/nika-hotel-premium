'use client';

import { useEffect, useState, useRef } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type GalleryImage = {
  filename: string;
  url: string;
  category?: string;
};

const categories = ['Toutes', 'Hôtel', 'Chambres', 'Restaurant', 'Bar', 'Extérieur'];

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState('Toutes');
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchImages = () => {
    setLoading(true);
    fetch(`${API}/api/upload`)
      .then((r) => r.json())
      .then((j) => { setImages(j.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchImages(); }, []);

  const uploadFile = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    await fetch(`${API}/api/upload`, { method: 'POST', body: formData });
    setUploading(false);
    fetchImages();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
    e.target.value = '';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith('image/')) await uploadFile(file);
  };

  const deleteImage = async (filename: string) => {
    if (!confirm('Supprimer cette image ?')) return;
    await fetch(`${API}/api/upload/${filename}`, { method: 'DELETE' });
    if (preview === filename) setPreview(null);
    fetchImages();
  };

  const downloadImage = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = `${API}${url}`;
    a.download = filename;
    a.click();
  };

  const filtered = category === 'Toutes' ? images : images.filter((i) => i.category === category || !i.category);

  if (loading) return <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: 48 }}>Chargement...</p>;

  return (
    <div style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Bodoni Moda', serif", color: '#fff', margin: 0 }}>Galerie Média</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 4 }}>Photos de l'hôtel et des installations</p>
        </div>
        <label className="btn btn-primary" style={{ cursor: 'pointer', height: 42, borderRadius: 999, padding: '0 24px', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          {uploading ? '⏳ Upload...' : '+ Ajouter'}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
        </label>
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {categories.map((c) => (
          <button key={c} onClick={() => setCategory(c)}
            style={{ height: 36, padding: '0 18px', borderRadius: 999, border: 'none', cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 500,
              background: category === c ? 'linear-gradient(135deg, #d9a441, #ffe2a0)' : 'rgba(255,255,255,0.06)',
              color: category === c ? '#1b1305' : 'rgba(255,255,255,0.6)' }}>
            {c}
          </button>
        ))}
      </div>

      {/* Drag & drop zone */}
      <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}
        style={{ border: `2px dashed ${dragOver ? '#d9a441' : 'rgba(255,255,255,0.1)'}`, borderRadius: 16, padding: 32, textAlign: 'center', marginBottom: 24, background: dragOver ? 'rgba(217,164,65,0.05)' : 'rgba(255,255,255,0.02)', transition: 'all 0.2s', cursor: 'pointer' }}
        onClick={() => fileRef.current?.click()}>
        <p style={{ fontSize: 36, margin: 0 }}>📁</p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 8 }}>Déposez une image ici ou cliquez pour parcourir</p>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>JPG, PNG, WebP — max 10 Mo</p>
      </div>

      {/* Preview modal */}
      {preview && (() => {
        const img = images.find((i) => i.filename === preview);
        if (!img) return null;
        return (
          <div onClick={() => setPreview(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, cursor: 'pointer' }}>
            <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 800, width: '100%', background: '#06152f', borderRadius: 20, padding: 24, position: 'relative' }}>
              <button onClick={() => setPreview(null)} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer' }}>×</button>
              <img src={`${API}${img.url}`} alt={img.filename} style={{ width: '100%', borderRadius: 12, maxHeight: 400, objectFit: 'cover' }} />
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 12 }}>{img.filename}</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-outline" onClick={() => downloadImage(img.url, img.filename)} style={{ height: 38, borderRadius: 999, padding: '0 20px', fontSize: 13 }}>Télécharger</button>
                <button className="btn btn-sm" onClick={() => { setPreview(null); deleteImage(img.filename); }} style={{ background: '#ef5350', color: '#fff', border: 'none', borderRadius: 999, height: 38, padding: '0 20px', fontSize: 13, cursor: 'pointer' }}>Supprimer</button>
              </div>
            </div>
          </div>
        );
      })()}

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 48, color: 'rgba(255,255,255,0.2)' }}>
          <p style={{ fontSize: 48, marginBottom: 8 }}>🖼️</p>
          <p>{images.length === 0 ? 'Aucune image. Cliquez ou déposez pour ajouter.' : 'Aucune image dans cette catégorie.'}</p>
        </div>
      ) : (
        <div className="gallery-grid premium-scroll">
          {filtered.map((img) => (
            <div key={img.filename} className="gallery-item" onClick={() => setPreview(img.filename)}>
              <div className="gallery-img" style={{ backgroundImage: `url(${API}${img.url})` }} />
              <div className="gallery-overlay">
                <button className="gallery-act" onClick={(e) => { e.stopPropagation(); downloadImage(img.url, img.filename); }}>⬇️</button>
                <button className="gallery-act" onClick={(e) => { e.stopPropagation(); deleteImage(img.filename); }}>🗑️</button>
              </div>
              <div className="gallery-label">{img.filename.substring(0, 20)}{img.filename.length > 20 ? '...' : ''}</div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 14px; }
        .gallery-item { border-radius: 14px; overflow: hidden; position: relative; cursor: pointer; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); transition: transform 0.2s; }
        .gallery-item:hover { transform: translateY(-2px); }
        .gallery-img { height: 150px; background-size: cover; background-position: center; }
        .gallery-overlay { position: absolute; top: 8px; right: 8px; display: flex; gap: 6px; opacity: 0; transition: opacity 0.2s; }
        .gallery-item:hover .gallery-overlay { opacity: 1; }
        .gallery-act { width: 32px; height: 32px; border-radius: 999px; border: none; background: rgba(0,0,0,0.6); color: #fff; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; }
        .gallery-act:hover { background: rgba(0,0,0,0.8); }
        .gallery-label { padding: 8px 10px; font-size: 11px; color: rgba(255,255,255,0.4); text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        @media (max-width: 600px) {
          .gallery-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .gallery-img { height: 120px; }
        }
      `}</style>
    </div>
  );
}
