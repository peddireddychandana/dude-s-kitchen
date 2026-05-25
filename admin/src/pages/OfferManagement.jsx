import { useState, useEffect } from 'react';
import { getOffers, createOffer, updateOffer, deleteOffer, uploadImage } from '../utils/api';
import Modal from '../components/Modal';
import { Plus, Pencil, Trash2, Loader2, Percent, Upload } from 'lucide-react';

const emptyForm = {
  title: '',
  description: '',
  price: '',
  discount: '',
  banner: '',
  expiryDate: '',
};

const imgUrl = (path) =>
  path ? (path.startsWith('http') ? path : `http://localhost:5000${path}`) : '';

export default function OfferManagement() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const res = await getOffers();
      setOffers(res.data || []);
    } catch (err) {
      console.error('Failed to fetch offers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await uploadImage(fd);
      setForm({ ...form, banner: res.data.url });
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (offer) => {
    setEditingId(offer._id);
    setForm({
      title: offer.title || '',
      description: offer.description || '',
      price: offer.price || '',
      discount: offer.discount || '',
      banner: offer.banner || '',
      expiryDate: offer.expiryDate ? offer.expiryDate.split('T')[0] : '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...form, discount: Number(form.discount), price: Number(form.price) };
      if (editingId) {
        await updateOffer(editingId, data);
      } else {
        await createOffer(data);
      }
      setShowModal(false);
      setEditingId(null);
      setForm(emptyForm);
      fetchOffers();
    } catch (err) {
      console.error('Failed to save offer:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this offer?')) return;
    try {
      await deleteOffer(id);
      fetchOffers();
    } catch (err) {
      console.error('Failed to delete offer:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-brand-yellow" size={32} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Offer Management</h1>
          <p className="text-zinc-500 mt-1">
            {offers.length} offer{offers.length !== 1 ? 's' : ''} active
          </p>
        </div>
        <button
          onClick={openAdd}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add Offer
        </button>
      </div>

      {offers.length === 0 ? (
        <div className="glow-card text-center py-16">
          <Percent className="mx-auto text-zinc-600 mb-4" size={48} />
          <p className="text-zinc-500">No offers yet. Create your first promotion!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
          {offers.map((offer) => (
            <div
              key={offer._id}
              className="group relative bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden hover:border-brand-yellow/30 transition-all duration-200"
            >
              {offer.banner && (
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={imgUrl(offer.banner)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-white truncate pr-2">
                      {offer.title}
                    </h3>
                    {offer.discount && (
                      <span className="inline-block mt-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        {offer.discount}% OFF
                      </span>
                    )}
                    {offer.price > 0 && (
                      <span className="inline-block mt-1 ml-1 text-xs font-bold text-brand-yellow bg-brand-yellow/10 px-2 py-0.5 rounded-full">
                        ₹{offer.price}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 transition-all flex-shrink-0">
                    <button
                      onClick={() => openEdit(offer)}
                      className="p-1.5 text-zinc-500 hover:text-brand-yellow hover:bg-brand-yellow/10 rounded-lg"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(offer._id)}
                      className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {offer.description && (
                  <p className="text-zinc-400 text-xs mb-2 line-clamp-2">{offer.description}</p>
                )}
                {offer.expiryDate && (
                  <p className="text-[10px] text-zinc-600">
                    Expires: {new Date(offer.expiryDate).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title={editingId ? 'Edit Offer' : 'Add New Offer'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input-field"
                placeholder="Summer Special"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input-field resize-none"
                rows={3}
                placeholder="Get 20% off on all biryanis..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Price (₹)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="input-field"
                  min={0}
                  placeholder="199"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Discount (%)</label>
                <input
                  type="number"
                  value={form.discount}
                  onChange={(e) => setForm({ ...form, discount: e.target.value })}
                  className="input-field"
                  min={0}
                  max={100}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Expiry Date</label>
              <input
                type="date"
                value={form.expiryDate}
                onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Banner Image</label>
              <label className="flex items-center gap-3 px-4 py-3 rounded-lg border border-dashed border-zinc-600 cursor-pointer hover:border-brand-yellow/50 transition-colors">
                <Upload className="w-5 h-5 text-zinc-400" />
                <span className="text-sm text-zinc-400">
                  {uploading ? 'Uploading...' : form.banner ? 'Change Banner' : 'Upload Banner'}
                </span>
                <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" disabled={uploading} />
              </label>
              {form.banner && (
                <div className="mt-2 rounded-lg overflow-hidden h-24 border border-zinc-700">
                  <img src={imgUrl(form.banner)} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="btn-ghost">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                {saving && <Loader2 className="animate-spin" size={16} />}
                {editingId ? 'Update Offer' : 'Create Offer'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
