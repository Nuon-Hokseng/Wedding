export default function Header({ coupleNames }: { coupleNames: string }) {
  return (
    <header className="hidden md:block sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-rose-100">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            P&M
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-rose-600">{coupleNames}</h1>
            <p className="text-xs text-gray-500">April 25, 2026</p>
          </div>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
          <a href="#details" className="hover:text-rose-600 transition">
            ព័ត៌មានពីពិធីមង្គលការ
          </a>
          <a href="#gallery" className="hover:text-rose-600 transition">
            រូបភាព
          </a>
          <a href="#story" className="hover:text-rose-600 transition">
            សាច់រឿងរបស់យើង
          </a>
          <a href="#rsvp" className="hover:text-rose-600 transition">
            សារជូនពរដល់គូរភរិយា
          </a>
        </nav>
      </div>
    </header>
  );
}
