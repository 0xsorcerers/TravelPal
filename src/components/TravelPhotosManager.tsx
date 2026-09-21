import { useRef } from 'react'
import { createPortal } from 'react-dom'
import { Camera, X, ImageIcon, Upload } from 'lucide-react'

interface Props {
  userPhotos: string[]
  useMyPhotos: boolean
  onAddPhotos: (files: FileList) => void
  onRemovePhoto: (idx: number) => void
  onToggleMyPhotos: (val: boolean) => void
  onClose: () => void
}

export function TravelPhotosManager({
  userPhotos,
  useMyPhotos,
  onAddPhotos,
  onRemovePhoto,
  onToggleMyPhotos,
  onClose,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return createPortal(
    <div
      className="fixed inset-0 flex items-end justify-center"
      style={{ zIndex: 9999, background: 'rgba(5,12,25,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="glass-card rounded-t-2xl w-full max-w-md animate-fade-in-up"
        style={{ maxHeight: '80dvh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Spectral strip */}
        <div className="spectral-strip rounded-t-2xl" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <div className="flex items-center gap-2">
            <Camera size={18} style={{ color: 'var(--accent)' }} />
            <span className="display font-semibold text-base" style={{ color: 'var(--ink)' }}>
              My Travel Photos
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded-full" style={{ color: 'var(--muted)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Use my photos toggle */}
        <div className="mx-5 mb-4 flex items-center justify-between glass-card rounded-xl px-4 py-3">
          <div>
            <div className="text-sm font-medium" style={{ color: 'var(--ink)' }}>Use my photos as backgrounds</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              {userPhotos.length > 0 ? `${userPhotos.length} photo${userPhotos.length !== 1 ? 's' : ''} saved` : 'Upload photos below first'}
            </div>
          </div>
          <button
            onClick={() => onToggleMyPhotos(!useMyPhotos)}
            disabled={userPhotos.length === 0}
            className="relative w-11 h-6 rounded-full transition-all"
            style={{
              background: useMyPhotos && userPhotos.length > 0 ? 'var(--accent)' : 'var(--surface-muted)',
              opacity: userPhotos.length === 0 ? 0.4 : 1,
            }}
          >
            <span
              className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
              style={{ transform: useMyPhotos && userPhotos.length > 0 ? 'translateX(20px)' : 'translateX(0)' }}
            />
          </button>
        </div>

        {/* Scrollable photo grid */}
        <div className="flex-1 overflow-y-auto px-5 pb-2">
          {userPhotos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3" style={{ color: 'var(--subtle)' }}>
              <ImageIcon size={40} strokeWidth={1} />
              <p className="text-sm text-center">
                Upload your travel photos and use them as backgrounds
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {userPhotos.map((photo, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group">
                  <img src={photo} alt={`Travel photo ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => onRemovePhoto(idx)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'rgba(0,0,0,0.7)' }}
                  >
                    <X size={12} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upload button */}
        <div className="px-5 pb-6 pt-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/webp,image/jpeg,image/png,image/jpg"
            multiple
            className="hidden"
            onChange={e => { if (e.target.files) onAddPhotos(e.target.files) }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={userPhotos.length >= 20}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3 font-semibold text-sm transition-all active:scale-95"
            style={{
              background: 'var(--accent)',
              color: '#0a1628',
              opacity: userPhotos.length >= 20 ? 0.5 : 1,
            }}
          >
            <Upload size={16} />
            {userPhotos.length >= 20 ? 'Max 20 photos reached' : 'Upload Photos'}
          </button>
          {userPhotos.length > 0 && (
            <p className="text-center text-xs mt-2" style={{ color: 'var(--subtle)' }}>
              {userPhotos.length}/20 photos · tap photo to remove
            </p>
          )}
        </div>
      </div>
    </div>
  , document.body)
}
