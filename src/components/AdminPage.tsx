import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { Link2, Copy, MessageSquareHeart, Heart } from 'lucide-react';
import { coupleNames } from '../config/wedding';
import { PREFIXES, Prefix, buildDisplayName, buildInviteLink, buildInviteMessage } from '../lib/guest';

interface Generated {
  displayName: string;
  link: string;
  message: string;
}

async function copyText(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Fallback for non-HTTPS (e.g. testing over LAN IP)
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand('copy');
  document.body.removeChild(textarea);
  if (!ok) throw new Error('Copy command failed');
}

export const AdminPage: React.FC = () => {
  const [prefix, setPrefix] = useState<Prefix>('Mr.');
  const [guestName, setGuestName] = useState('');
  const [generated, setGenerated] = useState<Generated | null>(null);

  const previewName = buildDisplayName(prefix, guestName);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewName) {
      toast.error('Please enter a guest name.');
      return;
    }
    const link = buildInviteLink(window.location.origin, previewName);
    setGenerated({ displayName: previewName, link, message: buildInviteMessage(previewName, link) });
  };

  // Editing the inputs invalidates the previously generated link
  const updatePrefix = (value: Prefix) => {
    setPrefix(value);
    setGenerated(null);
  };
  const updateGuestName = (value: string) => {
    setGuestName(value);
    setGenerated(null);
  };

  const handleCopy = async (text: string, successMessage: string) => {
    try {
      await copyText(text);
      toast.success(successMessage);
    } catch {
      toast.error('Could not copy. Please copy it manually.');
    }
  };

  const inputClass =
    'w-full bg-white px-5 py-3.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold outline-none transition-all text-brand-mocha';
  const secondaryButtonClass =
    'flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-brand-gold/50 text-brand-mocha font-sans text-[11px] tracking-[0.2em] uppercase font-bold hover:bg-brand-gold/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent';

  return (
    <div className="min-h-screen bg-brand-champagne font-sans text-brand-mocha px-4 py-10 sm:py-16">
      <Toaster position="top-center" />

      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-10">
          <Heart className="w-6 h-6 mx-auto mb-4 text-brand-gold fill-brand-gold/20" />
          <h1 className="font-display text-4xl sm:text-5xl mb-2">{coupleNames}</h1>
          <p className="text-[11px] uppercase tracking-[0.4em] text-brand-sand font-semibold">
            Invitation Link Generator
          </p>
        </header>

        <form
          onSubmit={handleGenerate}
          className="bg-white/80 rounded-3xl border border-brand-gold/30 shadow-[0_20px_50px_rgba(127,155,184,0.12)] p-6 sm:p-10 space-y-6"
        >
          <div className="grid sm:grid-cols-[180px_1fr] gap-5">
            <div>
              <label htmlFor="prefix" className="block text-[10px] uppercase tracking-[0.2em] font-bold text-brand-sand mb-2">
                Select Prefix
              </label>
              <select
                id="prefix"
                className={`${inputClass} cursor-pointer`}
                value={prefix}
                onChange={(e) => updatePrefix(e.target.value as Prefix)}
              >
                {PREFIXES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="guestName" className="block text-[10px] uppercase tracking-[0.2em] font-bold text-brand-sand mb-2">
                Guest Name
              </label>
              <input
                id="guestName"
                type="text"
                placeholder="e.g. Sanjaya"
                className={inputClass}
                value={guestName}
                onChange={(e) => updateGuestName(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-2xl bg-brand-champagne/70 border border-brand-gold/20 px-5 py-4">
            <span className="block text-[10px] uppercase tracking-[0.2em] font-bold text-brand-sand mb-1">Greeting Preview</span>
            <p className="font-serif text-xl">
              {previewName ? `Dear ${previewName} ❤️` : <span className="text-stone-400 italic">Enter a guest name…</span>}
            </p>
            {previewName && (
              <p className="font-serif italic text-brand-sand mt-2">
                We cordially invite {previewName} to celebrate our special day with us.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 bg-brand-mocha text-brand-champagne py-4 rounded-xl font-sans tracking-[0.3em] font-bold text-[11px] uppercase hover:bg-brand-mocha/90 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.15)] active:scale-[0.99]"
          >
            <Link2 className="w-4 h-4 text-brand-gold" />
            Generate Link
          </button>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              disabled={!generated}
              onClick={() => generated && handleCopy(generated.link, 'Link copied!')}
              className={secondaryButtonClass}
            >
              <Copy className="w-4 h-4" />
              Copy Link Only
            </button>
            <button
              type="button"
              disabled={!generated}
              onClick={() => generated && handleCopy(generated.message, 'Message copied!')}
              className={secondaryButtonClass}
            >
              <MessageSquareHeart className="w-4 h-4" />
              Copy Full Message
            </button>
          </div>
        </form>

        {generated && (
          <section className="mt-8 bg-white/80 rounded-3xl border border-brand-gold/30 p-6 sm:p-10 space-y-6">
            <div>
              <span className="block text-[10px] uppercase tracking-[0.2em] font-bold text-brand-sand mb-2">Generated Link</span>
              <a
                href={generated.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block break-all rounded-xl bg-brand-champagne/70 border border-brand-gold/20 px-4 py-3 text-sm text-brand-sand underline underline-offset-4 hover:text-brand-mocha"
              >
                {generated.link}
              </a>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-[0.2em] font-bold text-brand-sand mb-2">Message Preview</span>
              <pre className="whitespace-pre-wrap break-words rounded-xl bg-brand-champagne/70 border border-brand-gold/20 px-4 py-4 font-sans text-sm leading-relaxed">
                {generated.message}
              </pre>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
