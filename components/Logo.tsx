export default function Logo() {
  return (
    <div className="flex items-center text-[#0a74ff] text-2xl font-bold tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
      <img src="/logo.svg" alt="Logo" className="h-8 w-8 mr-1.5" />
      PeerPoint
    </div>
  );
}