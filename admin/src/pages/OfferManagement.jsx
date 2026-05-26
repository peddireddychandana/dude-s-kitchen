import { useState, useEffect } from 'react';
import { getOffers, createOffer, updateOffer, deleteOffer, uploadImage } from '../utils/api';
import Modal from '../components/Modal';
import { Plus, Pencil, Trash2, Loader2, Percent, Upload } from 'lucide-react';

const offerTypes = [
  { value: 'default', label: 'Special Offer' },
  { value: 'monday', label: 'Monday Offer' },
  { value: 'tuesday', label: 'Tuesday Offer' },
  { value: 'wednesday', label: 'Wednesday Offer' },
  { value: 'thursday', label: 'Thursday Offer' },
  { value: 'friday', label: 'Friday Offer' },
  { value: 'saturday', label: 'Saturday Offer' },
  { value: 'sunday', label: 'Sunday Special' },
  { value: 'yearly', label: '365 Day Offer' },
];

const typeLabels = {
  default: 'Special Offer',
  monday: 'Monday Offer',
  tuesday: 'Tuesday Offer',
  wednesday: 'Wednesday Offer',
  thursday: 'Thursday Offer',
  friday: 'Friday Offer',
  saturday: 'Saturday Offer',
  sunday: 'Sunday Special',
  yearly: '365 Day Offer',
};

const emptyForm = {
  title: '',
  description: '',
  price: '',
  discount: '',
  type: 'default',
  banner: '',
};

const imgUrl = (path) =>
  path ? (path.startsWith('http') ? path : `https://dude-s-kitchen-server.onrender.com${path}`) : '';

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
      const msg = err.response?.data?.message || err.message || 'Upload failed';
      alert('Upload failed: ' + msg);
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
      type: offer.type || 'default',
      banner: offer.banner || '',
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
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {offers.map((offer) => (
            <div
              key={offer._id}
              className="group relative bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden hover:border-brand-yellow/30 transition-all duration-200 flex flex-col"
            >
              {offer.banner ? (
                <div className="relative h-36 overflow-hidden flex-shrink-0">
                  <img
                    src={imgUrl(offer.banner)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                </div>
              ) : (
                <div className="h-12 flex-shrink-0" />
              )}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-white leading-tight">
                      {offer.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
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
                  <p className="text-zinc-400 text-xs mb-3 line-clamp-2 leading-relaxed">{offer.description}</p>
                )}
                <div className="flex flex-wrap items-center gap-2 mt-auto">
                  {offer.type && offer.type !== 'default' && (
                    <span className="text-[10px] font-bold text-black bg-gradient-to-r from-[#FFD700] to-[#E6B800] px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {typeLabels[offer.type] || offer.type}
                    </span>
                  )}
                  {offer.discount > 0 && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      {offer.discount}% OFF
                    </span>
                  )}
                  {offer.price > 0 && (
                    <span className="text-[10px] font-bold text-brand-yellow bg-brand-yellow/10 px-2 py-0.5 rounded-full">
                      ₹{offer.price}
                    </span>
                  )}
                </div>
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
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Offer Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="input-field"
              >
                {offerTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Banner Image</label>
              <label className="flex items-center gap-3 px-4 py-3 rounded-lg border border-dashed border-zinc-600 cursor-pointer hover:border-brand-yellow/50 transition-colors">
                <Upload className="w-5 h-5 text-zinc-400" />
                <span className="text-sm text-zinc-400">
                  {uploading ? 'Uploading...' : form.banner ? 'Change Banner' : 'Upload Banner'}
                </span>
                <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" capture="environment" onChange={handleBannerUpload} className="hidden" disabled={uploading} />
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
