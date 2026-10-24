import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { QrCode, CreditCard, DollarSign, MapPin, Phone, Mail, Check, AlertCircle, Save } from 'lucide-react';

export const StoreSettingsView: React.FC = () => {
  const { activeStore, updateStore } = useStore();

  if (!activeStore) return null;

  const [contactEmail, setContactEmail] = useState(activeStore.contact_email);
  const [contactPhone, setContactPhone] = useState(activeStore.contact_phone);
  const [address, setAddress] = useState(activeStore.address);
  const [currency, setCurrency] = useState(activeStore.currency);
  const [currencySymbol, setCurrencySymbol] = useState(activeStore.currency_symbol);

  // Payment settings
  const [codEnabled, setCodEnabled] = useState(activeStore.payment_settings.cod_enabled);
  const [upiEnabled, setUpiEnabled] = useState(activeStore.payment_settings.upi_enabled);
  const [upiId, setUpiId] = useState(activeStore.payment_settings.upi_id || 'merchant@upi');
  const [upiName, setUpiName] = useState(activeStore.payment_settings.upi_name || activeStore.name);

  const [savedAlert, setSavedAlert] = useState(false);

  // Computed UPI QR Code string
  const upiQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${encodeURIComponent(upiId)}%26pn=${encodeURIComponent(upiName)}%26cu=INR`;

  const handleCurrencyChange = (curr: string) => {
    setCurrency(curr);
    if (curr === 'USD') setCurrencySymbol('$');
    else if (curr === 'INR') setCurrencySymbol('₹');
    else if (curr === 'EUR') setCurrencySymbol('€');
    else if (curr === 'GBP') setCurrencySymbol('£');
  };

  const handleSave = () => {
    updateStore(activeStore.id, {
      contact_email: contactEmail,
      contact_phone: contactPhone,
      address,
      currency,
      currency_symbol: currencySymbol,
      payment_settings: {
        cod_enabled: codEnabled,
        upi_enabled: upiEnabled,
        upi_id: upiId,
        upi_name: upiName,
        qr_code_url: upiQrUrl
      }
    });

    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Store Settings & Payment Gateway</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure contact info, currency format, and merchant customer payment gateways
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Store Settings</span>
        </button>
      </div>

      {savedAlert && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Payment settings and contact information saved successfully!</span>
        </div>
      )}

      {/* Payment Options Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">Storefront Customer Payment Options</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure how your buyers pay on checkout. <strong>SaaS subscription billing remains 100% separate</strong> from your customer store order collections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Option 1: Cash on Delivery (COD) */}
          <div className={`p-5 rounded-2xl border transition-all ${
            codEnabled ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200 bg-slate-50/50'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  COD
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Cash on Delivery (COD)</h4>
                  <p className="text-[11px] text-slate-500">Collect cash upon physical courier handover</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={codEnabled}
                  onChange={e => setCodEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              When enabled, customers can finalize orders instantly with zero upfront payment and pay the delivery agent in cash.
            </p>
          </div>

          {/* Option 2: Merchant UPI Instant Payments */}
          <div className={`p-5 rounded-2xl border transition-all ${
            upiEnabled ? 'border-purple-300 bg-purple-50/20' : 'border-slate-200 bg-slate-50/50'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Direct Merchant UPI Payments</h4>
                  <p className="text-[11px] text-slate-500">Zero middleman fees · Direct to your bank account</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={upiEnabled}
                  onChange={e => setUpiEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {upiEnabled && (
              <div className="mt-4 pt-4 border-t border-purple-100 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Merchant UPI ID (VPA) *
                    </label>
                    <input
                      type="text"
                      required
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      placeholder="e.g. yourstore@okaxis"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Merchant Payee Name
                    </label>
                    <input
                      type="text"
                      value={upiName}
                      onChange={e => setUpiName(e.target.value)}
                      placeholder="Store or Business Name"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none"
                    />
                  </div>
                </div>

                {/* Scannable QR Code Live Preview */}
                <div className="p-3 bg-white rounded-xl border border-purple-200 flex items-center gap-4">
                  <img
                    src={upiQrUrl}
                    alt="UPI QR Preview"
                    className="w-20 h-20 rounded-lg border border-slate-200 p-1 bg-white shrink-0"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">Dynamic UPI QR Code</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Customers will scan this at checkout to pay via Google Pay, PhonePe, Paytm, or BHIM.
                    </p>
                    <p className="text-[10px] text-purple-700 font-mono mt-1 font-semibold truncate">
                      VPA: {upiId}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Store Contact & Regional Settings */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <h3 className="font-bold text-slate-900 text-base">Store Contact & Currency</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Support Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Support Phone</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Store Currency</label>
            <select
              value={currency}
              onChange={e => handleCurrencyChange(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white outline-none"
            >
              <option value="USD">USD ($) - US Dollar</option>
              <option value="INR">INR (₹) - Indian Rupee</option>
              <option value="EUR">EUR (€) - Euro</option>
              <option value="GBP">GBP (£) - British Pound</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Business Address</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl outline-none"
                placeholder="Street address, city, state, postal code"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
