'use client';

export default function DashboardFooter() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t backdrop-blur flex items-center justify-between px-8 py-4 z-40" 
      style={{
        backgroundColor: '#0d0d0f',
        borderTopColor: '#2f3031',
        marginLeft: '0'
      }}>
      <div className="flex items-center gap-8">
        <a href="#" className="text-gray-400 text-sm hover:text-green-400 transition">Terms</a>
        <a href="#" className="text-gray-400 text-sm hover:text-green-400 transition">Dev Blueprint</a>
        <a href="#" className="text-gray-400 text-sm hover:text-green-400 transition">Community</a>
        <a href="#" className="text-gray-400 text-sm hover:text-green-400 transition">Support</a>
        <a href="#" className="text-gray-400 text-sm hover:text-green-400 transition">Report</a>
      </div>
      <p className="text-gray-400 text-sm">© 2026 Faith, Inc.</p>
    </footer>
  );
}
