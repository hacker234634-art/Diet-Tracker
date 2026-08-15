import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  Share2,
  Download,
  Copy,
  Check,
  Apple,
  Laptop,
  QrCode,
  Sparkles,
  ExternalLink,
  Info,
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: BeforeInstallPromptEvent | null;
  onInstalled?: () => void;
}

export const InstallShareModal: React.FC<InstallShareModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onInstalled,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'share' | 'ios' | 'android' | 'desktop'>('share');
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setCanNativeShare(true);
    }
  }, []);

  if (!isOpen) return null;

  // Use the actual current URL or fallback
  const shareUrl = typeof window !== 'undefined' ? window.location.href.split('#')[0] : '';

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const input = document.createElement('input');
        input.value = shareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Meal Timing & Interval Tracker',
          text: 'Check out this Meal Timing Tracker app! You can install it on your phone or computer.',
          url: shareUrl,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  const handleTriggerInstallPrompt = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted' && onInstalled) {
          onInstalled();
        }
      } catch (err) {
        console.log('Install prompt error:', err);
      }
    }
  };

  // Generate a simple high-contrast QR code URL for quick mobile scanning
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    shareUrl
  )}&bgcolor=0f172a&color=34d399&margin=10`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div
        id="install-share-modal"
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl my-6 flex flex-col max-h-[92vh] animate-fadeIn"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
              <Smartphone className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Cross-Platform PWA Installation
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                Install on Any Device & Share
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Quick Direct 1-Click Install Banner (if supported by browser) */}
          {deferredPrompt && (
            <div className="bg-gradient-to-r from-emerald-500/20 via-slate-800 to-slate-800 border border-emerald-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-emerald-400" />
                  Instant Install Available
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Your browser supports 1-click standalone installation.
                </p>
              </div>
              <button
                id="btn-trigger-pwa-install"
                onClick={handleTriggerInstallPrompt}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/30 transition-all active:scale-95 shrink-0"
              >
                <Download className="w-4 h-4 stroke-[3]" />
                Install App Now
              </button>
            </div>
          )}

          {/* Quick Share Link Box */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                Shareable App Link (Send to anyone):
              </label>
              {copied && (
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 animate-fadeIn">
                  <Check className="w-3.5 h-3.5" /> Copied!
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-slate-900 border border-slate-700 text-slate-300 rounded-xl px-3 py-2 text-xs font-mono select-all focus:outline-none"
              />
              <button
                id="btn-copy-share-link"
                onClick={handleCopyLink}
                className="bg-slate-700 hover:bg-emerald-500 hover:text-slate-950 text-slate-100 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>
              {canNativeShare && (
                <button
                  id="btn-native-share"
                  onClick={handleNativeShare}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shrink-0"
                >
                  <Share2 className="w-4 h-4 stroke-[2.5]" />
                  <span>Send</span>
                </button>
              )}
            </div>
          </div>

          {/* Device Tabs */}
          <div>
            <div className="flex items-center gap-1.5 p-1 bg-slate-950/60 rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('share')}
                className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'share'
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                <span>QR Scan</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ios')}
                className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'ios'
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Apple className="w-3.5 h-3.5 text-slate-200" />
                <span>iPhone / iPad</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('android')}
                className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'android'
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Android</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('desktop')}
                className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'desktop'
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Laptop className="w-3.5 h-3.5 text-sky-400" />
                <span>PC / Mac</span>
              </button>
            </div>

            {/* Tab 1: QR Code & Sharing */}
            {activeTab === 'share' && (
              <div className="mt-3 bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="p-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-inner shrink-0">
                  <img
                    src={qrCodeUrl}
                    alt="Scan to open app on phone"
                    className="w-32 h-32 rounded-xl object-contain"
                    onError={(e) => {
                      // fallback if offline
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    Scan with Phone Camera
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Point any phone’s camera at the QR code above to instantly open and install the app with zero app store downloads required.
                  </p>
                  <div className="pt-1 flex flex-wrap gap-2 justify-center sm:justify-start">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-700 text-slate-300">
                      Works on iOS & Android
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-700 text-slate-300">
                      No App Store Needed
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: iOS Instructions */}
            {activeTab === 'ios' && (
              <div className="mt-3 bg-slate-800/40 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-xs">
                  <Apple className="w-4 h-4 text-slate-300" />
                  Install on iPhone & iPad (Safari Browser)
                </div>
                <ol className="space-y-2.5 text-xs text-slate-300 pl-1">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <span>
                      Open this link in <strong>Safari</strong> on your iPhone or iPad.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <span>
                      Tap the <strong>Share button</strong> (the square with an arrow pointing up at the bottom of the screen).
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <span>
                      Scroll down and tap <strong>"Add to Home Screen"</strong> (➕).
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      4
                    </span>
                    <span>
                      Tap <strong>"Add"</strong> in the top right corner. The app icon will appear directly on your home screen!
                    </span>
                  </li>
                </ol>
              </div>
            )}

            {/* Tab 3: Android Instructions */}
            {activeTab === 'android' && (
              <div className="mt-3 bg-slate-800/40 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-xs">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  Install on Android Phone & Tablet (Chrome / Samsung Internet)
                </div>
                <ol className="space-y-2.5 text-xs text-slate-300 pl-1">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <span>
                      Open this link in <strong>Chrome</strong> or your preferred Android browser.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <span>
                      Tap the <strong>"Install App"</strong> prompt banner at the bottom or click the <strong>3 vertical dots (⋮)</strong> in the top right.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <span>
                      Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      4
                    </span>
                    <span>
                      Confirm install. The app launches standalone in full-screen mode like a native app.
                    </span>
                  </li>
                </ol>
              </div>
            )}

            {/* Tab 4: Desktop Instructions */}
            {activeTab === 'desktop' && (
              <div className="mt-3 bg-slate-800/40 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-xs">
                  <Laptop className="w-4 h-4 text-sky-400" />
                  Install on Windows PC, Mac, or Chromebook
                </div>
                <ol className="space-y-2.5 text-xs text-slate-300 pl-1">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <span>
                      Open this website in <strong>Google Chrome</strong>, <strong>Microsoft Edge</strong>, or <strong>Brave</strong>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <span>
                      Look in the address bar (URL bar) at the top right for the <strong>Install icon (🖥️ or ➕)</strong>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <span>
                      Click <strong>"Install"</strong>. The app will open in its own clean window and be added to your Applications / Start menu.
                    </span>
                  </li>
                </ol>
              </div>
            )}
          </div>

          {/* Information Footer */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Anyone you send this link to can immediately open, use, and install it on their device without registering on an app store or creating an account.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
          <button
            onClick={handleCopyLink}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Link Copied to Clipboard' : 'Copy Share Link'}
          </button>
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
