'use client';

export default function DashboardFooter() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t backdrop-blur flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 py-3 sm:py-4 z-40 gap-2 sm:gap-0" 
      style={{
        backgroundColor: '#0d0d0f',
        borderTopColor: '#2f3031',
        marginLeft: '0'
      }}>
      <div className="flex items-center gap-4 sm:gap-8 flex-wrap justify-center">
        <a href="#" className="text-gray-400 text-xs sm:text-sm hover:text-green-400 transition">Terms</a>
        <a href="#" className="text-gray-400 text-xs sm:text-sm hover:text-green-400 transition">Dev Blueprint</a>
        <a href="#" className="text-gray-400 text-xs sm:text-sm hover:text-green-400 transition">Community</a>
        <a href="#" className="text-gray-400 text-xs sm:text-sm hover:text-green-400 transition">Support</a>
        <a href="#" className="text-gray-400 text-xs sm:text-sm hover:text-green-400 transition">Report</a>
      </div>
      <p className="text-gray-400 text-xs sm:text-sm">&copy; 2026 Faith, Inc.</p>
    </footer>
  );
}
