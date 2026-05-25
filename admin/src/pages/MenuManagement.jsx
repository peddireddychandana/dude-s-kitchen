import { useState, useEffect } from 'react';
import { getFoods, createFood, updateFood, deleteFood, getCategories, uploadImage } from '../utils/api';
import Modal from '../components/Modal';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Search,
  Upload,
} from 'lucide-react';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  veg: false,
  available: true,
  image: '',
};

const imgUrl = (path) =>
  path ? (path.startsWith('http') ? path : `https://dude-s-kitchen-server.onrender.com${path}`) : '';

export default function MenuManagement() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const saved = localStorage.getItem('adminMenuCategory');
    return saved === "DUDE'S KITCHEN SPECIAL" ? saved : (saved || '');
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    Promise.all([fetchFoods(), fetchCategories()]);
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await getFoods();
      setFoods(res.data || []);
    } catch (err) {
      console.error('Failed to fetch foods:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (food) => {
    setEditingId(food._id);
    setForm({
      name: food.name || '',
      description: food.description || '',
      price: food.price || '',
      category: food.category || '',
      veg: food.veg || false,
      available: food.available ?? true,
      image: food.image || '',
    });
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadImage(formData);
      setForm({ ...form, image: res.data.url });
      console.log('Upload success:', res.data.url);
    } catch (err) {
      console.error('Upload failed:', err);
      const msg = err.response?.data?.message || err.message || 'Upload failed';
      alert('Upload failed: ' + msg);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
    };
    try {
      if (editingId) {
        await updateFood(editingId, payload);
      } else {
        await createFood(payload);
      }
      setShowModal(false);
      fetchFoods();
    } catch (err) {
      console.error('Failed to save food:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await deleteFood(id);
      fetchFoods();
    } catch (err) {
      console.error('Failed to delete food:', err);
    }
  };

  const toggleAvailability = async (food) => {
    try {
      await updateFood(food._id, { available: !food.available });
      fetchFoods();
    } catch (err) {
      console.error('Failed to toggle availability:', err);
    }
  };

  const filteredFoods = foods.filter((f) => {
    const matchesSearch = f.name?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || f.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
          <h1 className="text-2xl md:text-3xl font-bold text-white">Menu Management</h1>
          <p className="text-zinc-500 mt-1">
            {foods.length} item{foods.length !== 1 ? 's' : ''} on the menu
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Add Item
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
        <input
          type="text"
          placeholder="Search menu items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => { setSelectedCategory(''); localStorage.removeItem('adminMenuCategory'); }}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
            !selectedCategory
              ? 'bg-brand-yellow text-black'
              : 'bg-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => { setSelectedCategory(cat.name); localStorage.setItem('adminMenuCategory', cat.name); }}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedCategory === cat.name
                ? 'bg-brand-yellow text-black'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {filteredFoods.length === 0 ? (
        <div className="glow-card text-center py-12">
          <p className="text-zinc-500">
            {search ? 'No items match your search.' : 'No food items yet. Add your first item!'}
          </p>
        </div>
      ) : (
        <>
          <div className="hidden md:block glow-card overflow-hidden p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left text-zinc-400 text-sm font-medium px-6 py-4">Item</th>
                  <th className="text-left text-zinc-400 text-sm font-medium px-6 py-4">Category</th>
                  <th className="text-left text-zinc-400 text-sm font-medium px-6 py-4">Price</th>
                  <th className="text-left text-zinc-400 text-sm font-medium px-6 py-4">Available</th>
                  <th className="text-right text-zinc-400 text-sm font-medium px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFoods.map((food) => (
                  <tr key={food._id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {food.image && (
                          <img
                            src={imgUrl(food.image)}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="text-white font-medium">{food.name}</p>
                          {food.veg && (
                            <span className="text-xs text-emerald-400">Veg</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-zinc-400">
                        {food.category?.name || food.category || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-medium">₹{food.price}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleAvailability(food)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          food.available ? 'bg-emerald-500' : 'bg-zinc-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            food.available ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(food)} className="p-2 text-zinc-400 hover:text-brand-yellow hover:bg-brand-yellow/10 rounded-lg transition-all">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleDelete(food._id)} className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {filteredFoods.map((food) => (
              <div key={food._id} className="glow-card p-4">
                <div className="flex items-start gap-3">
                  {food.image && (
                    <img src={imgUrl(food.image)} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-white font-medium truncate">{food.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-zinc-400 text-xs">{food.category?.name || food.category || '—'}</span>
                          <span className="text-zinc-600 text-[10px]">•</span>
                          <span className="text-white font-bold text-sm">₹{food.price}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => openEdit(food)} className="p-1.5 text-zinc-400 hover:text-brand-yellow rounded-lg">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(food._id)} className="p-1.5 text-zinc-400 hover:text-red-400 rounded-lg">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleAvailability(food)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            food.available ? 'bg-emerald-500' : 'bg-zinc-700'
                          }`}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                              food.available ? 'translate-x-[18px]' : 'translate-x-1'
                            }`}
                          />
                        </button>
                        <span className={`text-xs font-medium ${food.available ? 'text-emerald-400' : 'text-zinc-500'}`}>
                          {food.available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {food.veg && (
                          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Veg</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showModal && (
        <Modal
          title={editingId ? 'Edit Food Item' : 'Add New Food Item'}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field"
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
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Food Image</label>
              <div className="flex items-center gap-3">
                <label className="flex-1 flex items-center gap-3 px-4 py-3 rounded-lg border border-dashed border-zinc-600 cursor-pointer hover:border-brand-yellow/50 transition-colors">
                  <Upload className="w-5 h-5 text-zinc-400" />
                  <span className="text-sm text-zinc-400">
                    {uploading ? 'Uploading...' : form.image ? 'Change Image' : 'Upload Image'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {form.image && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, image: '' })}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                )}
              </div>
              {form.image && (
                <div className="mt-2 rounded-lg overflow-hidden w-20 h-20 border border-zinc-700">
                  <img src={imgUrl(form.image)} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.veg}
                  onChange={(e) => setForm({ ...form, veg: e.target.checked })}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
                />
                Vegetarian
              </label>
              <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.available}
                  onChange={(e) => setForm({ ...form, available: e.target.checked })}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-brand-yellow focus:ring-brand-yellow"
                />
                Available
              </label>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="btn-ghost">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {editingId ? 'Update' : 'Add'} Item
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
