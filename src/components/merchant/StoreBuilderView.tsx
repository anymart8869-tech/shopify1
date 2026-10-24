import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Palette, Image, Layout, Sparkles, Check, ExternalLink, Save, Eye, Undo2 } from 'lucide-react';

const COLOR_PRESETS = [
  { name: 'Shopify Emerald', hex: '#008060', text: 'emerald' },
  { name: 'Electric Indigo', hex: '#6366f1', text: 'indigo' },
  { name: 'Royal Cobalt', hex: '#2563eb', text: 'blue' },
  { name: 'Sunset Crimson', hex: '#e11d48', text: 'rose' },
  { name: 'Obsidian Minimal', hex: '#0f172a', text: 'slate' },
  { name: 'Warm Terracotta', hex: '#c2410c', text: 'orange' }
];

const BANNER_PRESETS = [
  { name: 'Modern Minimal Boutique', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80' },
  { name: 'Urban Streetwear', url: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1600&auto=format&fit=crop&q=80' },
  { name: 'Organic Lifestyle', url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1600&auto=format&fit=crop&q=80' },
  { name: 'Clean Workspace', url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1600&auto=format&fit=crop&q=80' }
];

export const StoreBuilderView: React.FC<{ onNavigateToStorefront: (slug: string) => void }> = ({ onNavigateToStorefront }) => {
  const { activeStore, updateStore } = useStore();

  if (!activeStore) return null;

  const [name, setName] = useState(activeStore.name);
  const [tagline, setTagline] = useState(activeStore.tagline);
  const [description, setDescription] = useState(activeStore.description);
  const [primaryColor, setPrimaryColor] = useState(activeStore.primary_color);
  const [logoUrl, setLogoUrl] = useState(activeStore.logo_url);
  const [bannerUrl, setBannerUrl] = useState(activeStore.banner_url);

  // Layout settings
  const [heroTitle, setHeroTitle] = useState(activeStore.layout_settings.hero_title);
  const [heroSubtitle, setHeroSubtitle] = useState(activeStore.layout_settings.hero_subtitle);
  const [heroButtonText, setHeroButtonText] = useState(activeStore.layout_settings.hero_button_text);
  const [showAnnouncement, setShowAnnouncement] = useState(activeStore.layout_settings.show_announcement);
  const [announcementText, setAnnouncementText] = useState(activeStore.layout_settings.announcement_text);
  const [showFeatured, setShowFeatured] = useState(activeStore.layout_settings.show_featured_products);
  const [showNewsletter, setShowNewsletter] = useState(activeStore.layout_settings.show_newsletter);

  const [savedAlert, setSavedAlert] = useState(false);

  const handleSave = () => {
    updateStore(activeStore.id, {
      name,
      tagline,
      description,
      primary_color: primaryColor,
      logo_url: logoUrl,
      banner_url: bannerUrl,
      layout_settings: {
        ...activeStore.layout_settings,
        hero_title: heroTitle,
        hero_subtitle: heroSubtitle,
        hero_button_text: heroButtonText,
        show_announcement: showAnnouncement,
        announcement_text: announcementText,
        show_featured_products: showFeatured,
        show_newsletter: showNewsletter
      }
    });

    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Visual Storefront Builder & Customizer</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Design your brand identity, color schemes, and storefront layout in real time
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateToStorefront(activeStore.slug)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>Open Public Store</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {savedAlert && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Store customizations saved successfully! Public storefront updated.</span>
        </div>
      )}

      {/* Grid: Editor on Left (5 cols) & Live Preview on Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form Editor */}
        <div className="lg:col-span-5 space-y-6">
          {/* Brand Identity & Colors */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-emerald-600" />
              Brand Theme & Colors
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Store Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Primary Accent Color Presets */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Primary Brand Accent Color
              </label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={e => setPrimaryColor(e.target.value)}
                  className="w-9 h-9 rounded-xl cursor-pointer border border-slate-300 p-0.5"
                />
                <span className="text-xs font-mono font-bold text-slate-800 uppercase">{primaryColor}</span>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {COLOR_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrimaryColor(preset.hex)}
                    className={`p-1.5 rounded-lg border text-[11px] flex items-center gap-1.5 transition-all ${
                      primaryColor.toLowerCase() === preset.hex.toLowerCase()
                        ? 'border-emerald-500 bg-emerald-50 font-bold text-slate-900 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-xs ring-1 ring-black/10"
                      style={{ backgroundColor: preset.hex }}
                    />
                    <span className="truncate">{preset.name.split(' ')[1]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Media Imagery */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Image className="w-4 h-4 text-emerald-600" />
              Logo & Hero Banner
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Logo URL</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={logoUrl}
                  onChange={e => setLogoUrl(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-xl outline-none"
                />
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Banner Image URL</label>
              <input
                type="url"
                value={bannerUrl}
                onChange={e => setBannerUrl(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl outline-none mb-2"
              />

              <p className="text-[11px] text-slate-500 mb-1 font-semibold">Or Pick a Banner Preset:</p>
              <div className="grid grid-cols-2 gap-1.5">
                {BANNER_PRESETS.map((bp, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setBannerUrl(bp.url)}
                    className="p-1 rounded-lg border border-slate-200 hover:border-emerald-400 text-[10px] text-left truncate bg-slate-50"
                  >
                    {bp.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Announcement Bar & Layout Sections */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Layout className="w-4 h-4 text-emerald-600" />
              Homepage Layout Sections
            </h3>

            {/* Announcement toggle */}
            <div className="space-y-2 pb-3 border-b border-slate-100">
              <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                <span>Top Announcement Bar</span>
                <input
                  type="checkbox"
                  checked={showAnnouncement}
                  onChange={e => setShowAnnouncement(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </label>
              {showAnnouncement && (
                <input
                  type="text"
                  value={announcementText}
                  onChange={e => setAnnouncementText(e.target.value)}
                  placeholder="e.g. Free shipping on orders over $50"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl outline-none"
                />
              )}
            </div>

            {/* Hero text */}
            <div className="space-y-2 pb-3 border-b border-slate-100">
              <label className="block text-xs font-semibold text-slate-700">Hero Section Headline</label>
              <input
                type="text"
                value={heroTitle}
                onChange={e => setHeroTitle(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl outline-none"
              />
              <textarea
                rows={2}
                value={heroSubtitle}
                onChange={e => setHeroSubtitle(e.target.value)}
                placeholder="Hero subtitle"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl outline-none"
              />
              <input
                type="text"
                value={heroButtonText}
                onChange={e => setHeroButtonText(e.target.value)}
                placeholder="CTA Button Text"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl outline-none"
              />
            </div>

            {/* Additional Toggles */}
            <div className="space-y-2">
              <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                <span>Featured Collection Grid</span>
                <input
                  type="checkbox"
                  checked={showFeatured}
                  onChange={e => setShowFeatured(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                <span>Newsletter Subscription Form</span>
                <input
                  type="checkbox"
                  checked={showNewsletter}
                  onChange={e => setShowNewsletter(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Live Preview Frame */}
        <div className="lg:col-span-7 sticky top-24">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-2 shadow-2xl">
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 text-slate-400 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                <span className="ml-2 font-mono text-[11px] text-slate-300">Live Preview: /store/{activeStore.slug}</span>
              </div>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-semibold">
                Dynamic Theme Engine
              </span>
            </div>

            {/* Scaled Preview Frame */}
            <div className="bg-white rounded-xl overflow-hidden mt-1 text-slate-900 max-h-[600px] overflow-y-auto">
              {/* Preview Announcement */}
              {showAnnouncement && (
                <div
                  style={{ backgroundColor: primaryColor }}
                  className="text-white text-[11px] font-medium py-1.5 px-3 text-center"
                >
                  {announcementText}
                </div>
              )}

              {/* Preview Header */}
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={logoUrl}
                    alt={name}
                    className="w-7 h-7 rounded-lg object-cover"
                  />
                  <span className="font-bold text-xs text-slate-900">{name}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span>Catalog</span>
                  <span>About</span>
                  <span
                    style={{ backgroundColor: primaryColor }}
                    className="text-white font-bold px-2 py-0.5 rounded-md text-[10px]"
                  >
                    Cart (0)
                  </span>
                </div>
              </div>

              {/* Preview Hero Banner */}
              <div className="relative h-44 overflow-hidden bg-slate-900">
                <img
                  src={bannerUrl}
                  alt={name}
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
                  <h4 className="font-bold text-base leading-snug drop-shadow-sm">{heroTitle}</h4>
                  <p className="text-[11px] text-slate-200 mt-1 line-clamp-2 max-w-sm">{heroSubtitle}</p>
                  <div className="mt-2.5">
                    <span
                      style={{ backgroundColor: primaryColor }}
                      className="inline-block px-3 py-1 rounded-lg text-white font-bold text-[10px] shadow-sm"
                    >
                      {heroButtonText}
                    </span>
                  </div>
                </div>
              </div>

              {/* Preview Featured Grid Teaser */}
              {showFeatured && (
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Featured Curations</span>
                    <span className="text-[10px] text-slate-500">View All →</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="border border-slate-100 rounded-lg p-2 bg-slate-50">
                      <div className="w-full h-16 rounded bg-slate-200 overflow-hidden mb-1">
                        <img
                          src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=200&auto=format&fit=crop&q=80"
                          alt="demo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-[10px] font-semibold text-slate-800 truncate">Relaxed Boxy Hoodie</p>
                      <p className="text-[10px] font-bold" style={{ color: primaryColor }}>$69.00</p>
                    </div>
                    <div className="border border-slate-100 rounded-lg p-2 bg-slate-50">
                      <div className="w-full h-16 rounded bg-slate-200 overflow-hidden mb-1">
                        <img
                          src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&auto=format&fit=crop&q=80"
                          alt="demo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-[10px] font-semibold text-slate-800 truncate">Leather Structured Tote</p>
                      <p className="text-[10px] font-bold" style={{ color: primaryColor }}>$115.00</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
