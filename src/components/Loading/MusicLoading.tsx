import RemixIcon from '@/components/RemixIcon'

export default function MusicLoading() {
  const bars = Array.from({ length: 7 })
  return (
    <div className="c-flex flex-col gap-3 w-full h-full p-6">
      <div className="c-flex gap-2">
        <RemixIcon name="music-2-fill" size={28} style={{ color: 'hsl(var(--primary-hsl))' }} />
        <div className="font-semibold" style={{ color: 'hsl(var(--primary-hsl))' }}>
          正在加载...
        </div>
      </div>
      <div className="flex items-end gap-1 h-16">
        {bars.map((_, i) => (
          <div
            key={i}
            className="eq-bar rounded-sm"
            style={{
              width: '6px',
              height: '100%',
              backgroundColor: 'hsl(var(--primary-hsl))',
              animationDelay: `${i * 0.1}s`,
              opacity: 0.9,
            }}
          />
        ))}
      </div>
    </div>
  )
}