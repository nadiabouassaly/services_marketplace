import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center text-[#0a74ff] text-2xl font-bold tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
      <img src="/logo.svg" alt="Logo" className="h-8 w-8 mr-1.5" />
      PeerPoint
    </Link>
  );
}