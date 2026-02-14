'use client';

import DashboardSidebar from '@/app/components/DashboardSidebar';
import DashboardTopbar from '@/app/components/DashboardTopbar';
import DashboardFooter from '@/app/components/DashboardFooter';
import { usePrivy } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TermsPage() {
  const router = useRouter();
  const { user, logout, ready } = usePrivy();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedPage, setSelectedPage] = useState('terms');
  const [isMobile, setIsMobile] = useState(false);
  const authenticated = !!user;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-black" style={{backgroundColor: '#060a0a'}}>
      {/* Sidebar */}
      {sidebarOpen && (
        <DashboardSidebar
          sidebarOpen={sidebarOpen}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
          user={user ? { avatarUrl: user.linkedAccounts?.[0]?.profilePictureUrl || null, name: user.linkedAccounts?.[0]?.username || 'User' } : null}
          handleLogout={handleLogout}
          isMobile={isMobile}
          onCloseMobile={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${sidebarOpen && !isMobile ? (sidebarCollapsed ? 'ml-20' : 'ml-64') : ''}`}>
        {/* Topbar */}
        <DashboardTopbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          user={user ? { avatarUrl: user.linkedAccounts?.[0]?.profilePictureUrl || null, username: user.linkedAccounts?.[0]?.username || 'User' } : null}
        />

        {/* Content */}
        <main className="flex-1 overflow-y-auto pb-24 pt-32 px-4 sm:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
            <p className="text-gray-400 mb-8">Last Updated: February 14, 2026</p>

            <div className="space-y-6 text-gray-300">
              {/* Section 1 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-3">1. Introduction</h2>
                <p>
                  These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and Faith ("Faith," "we," "our," or "us") governing your access to and use of the Faith website, applications, and related services (collectively, the "Services").
                </p>
                <p className="mt-2">
                  By accessing or using the Services, or by clicking "I Agree," you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.
                </p>
                <p className="mt-2">
                  If you do not agree to these Terms, you must not access or use the Services.
                </p>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-3">2. Changes to These Terms</h2>
                <p>
                  We may update or modify these Terms at any time in our sole discretion. Updates become effective immediately upon posting. Your continued use of the Services after changes are posted constitutes your acceptance of those changes.
                </p>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-3">3. Description of Services</h2>
                <p>Faith provides a web-based platform that may include:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Account-based user access</li>
                  <li>Social or interactive features</li>
                  <li>Information related to digital assets or blockchain-based technologies</li>
                  <li>Integration with third-party services</li>
                  <li>Wallet connectivity or blockchain interactions (if applicable)</li>
                </ul>
                <p className="mt-3">
                  Faith does not provide brokerage, investment, tax, or legal advice.
                </p>
                <p className="mt-2">
                  All information provided through the Services is for general informational purposes only.
                </p>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-3">4. Eligibility</h2>
                <p>To use the Services, you must:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Be at least 18 years old</li>
                  <li>Have the legal capacity to enter into binding agreements</li>
                  <li>Not be prohibited from using the Services under applicable law</li>
                </ul>
                <p className="mt-3">
                  By using the Services, you represent and warrant that you meet these requirements.
                </p>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-3">5. Accounts</h2>
                <p>You may be required to create an account to access certain features.</p>
                <p className="mt-2">You agree to:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the confidentiality of your login credentials</li>
                  <li>Accept responsibility for all activity under your account</li>
                </ul>
                <p className="mt-3">
                  We reserve the right to suspend or terminate accounts at our discretion.
                </p>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-3">6. Digital Assets & Blockchain Risks (If Applicable)</h2>
                <p>If the Services involve blockchain technology or digital assets, you acknowledge:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Blockchain transactions are irreversible.</li>
                  <li>Digital assets are volatile and may lose value.</li>
                  <li>We do not custody assets unless explicitly stated.</li>
                  <li>You are solely responsible for safeguarding your private keys or wallets.</li>
                  <li>We are not responsible for transaction errors, network failures, or loss of digital assets.</li>
                  <li>You assume all risks associated with blockchain usage.</li>
                </ul>
              </section>

              {/* Section 7 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-3">7. No Financial Advice</h2>
                <p>Faith does not provide:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Investment advice</li>
                  <li>Financial advice</li>
                  <li>Tax advice</li>
                  <li>Legal advice</li>
                </ul>
                <p className="mt-3">
                  Nothing on the platform should be interpreted as a recommendation to buy, sell, or hold any digital asset or financial instrument.
                </p>
                <p className="mt-2">
                  You are solely responsible for your decisions.
                </p>
              </section>

              {/* Section 8 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-3">8. Prohibited Conduct</h2>
                <p>You agree not to:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Violate any applicable laws</li>
                  <li>Engage in fraudulent or deceptive practices</li>
                  <li>Impersonate others</li>
                  <li>Interfere with the Services</li>
                  <li>Upload malicious code</li>
                  <li>Exploit the platform for unauthorized data collection</li>
                  <li>Use automated systems (bots, scrapers) without permission</li>
                  <li>Engage in harassment, abuse, or unlawful activity</li>
                </ul>
                <p className="mt-3">
                  Violation may result in account termination.
                </p>
              </section>

              {/* Section 9 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-3">9. Third-Party Services</h2>
                <p>The Services may integrate or link to third-party platforms.</p>
                <p className="mt-2">We do not control and are not responsible for:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Third-party websites</li>
                  <li>Smart contracts</li>
                  <li>External applications</li>
                  <li>Wallet providers</li>
                  <li>Blockchain networks</li>
                </ul>
                <p className="mt-3">
                  Your use of third-party services is at your own risk.
                </p>
              </section>

              {/* Section 10 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-3">10. Intellectual Property</h2>
                <p>All content, design, branding, and technology related to Faith are owned by Faith or its licensors.</p>
                <p className="mt-2">You may not:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Copy</li>
                  <li>Reproduce</li>
                  <li>Modify</li>
                  <li>Distribute</li>
                  <li>Reverse engineer</li>
                  <li>Create derivative works</li>
                </ul>
                <p className="mt-3">
                  Without prior written consent.
                </p>
              </section>

              {/* Section 11 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-3">11. Disclaimers</h2>
                <p>The Services are provided "AS IS" and "AS AVAILABLE."</p>
                <p className="mt-2">We make no warranties regarding:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Availability</li>
                  <li>Accuracy</li>
                  <li>Security</li>
                  <li>Reliability</li>
                  <li>Error-free operation</li>
                </ul>
                <p className="mt-3">
                  To the fullest extent permitted by law, we disclaim all implied warranties.
                </p>
              </section>

              {/* Section 12 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-3">12. Limitation of Liability</h2>
                <p>To the maximum extent permitted by law:</p>
                <p className="mt-2">Faith shall not be liable for:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Indirect damages</li>
                  <li>Lost profits</li>
                  <li>Loss of digital assets</li>
                  <li>Data loss</li>
                  <li>Business interruption</li>
                  <li>Consequential damages</li>
                </ul>
                <p className="mt-3">
                  Our total liability shall not exceed the greater of:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>$100 USD</li>
                  <li>OR The amount you paid us in the past six months (if any).</li>
                </ul>
              </section>

              {/* Section 13 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-3">13. Indemnification</h2>
                <p>You agree to defend and indemnify Faith against any claims, damages, liabilities, or expenses arising from:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Your use of the Services</li>
                  <li>Your violation of these Terms</li>
                  <li>Your violation of applicable laws</li>
                  <li>Your misuse of digital assets or third-party integrations</li>
                </ul>
              </section>

              {/* Section 14 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-3">14. Termination</h2>
                <p>We may suspend or terminate your access at any time without prior notice if:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>You violate these Terms</li>
                  <li>We suspect fraudulent or unlawful activity</li>
                  <li>Required by law</li>
                </ul>
              </section>

              {/* Section 15 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-3">15. Dispute Resolution</h2>
                <p>Any disputes arising from these Terms shall be resolved through binding arbitration, unless prohibited by applicable law.</p>
                <p className="mt-2">
                  You waive the right to participate in class actions.
                </p>
                <p className="mt-2">
                  The governing law shall be determined by applicable jurisdiction.
                </p>
              </section>

              {/* Section 16 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-3">16. Governing Law</h2>
                <p>These Terms shall be governed by the laws of applicable jurisdiction, without regard to conflict of law principles.</p>
              </section>

              {/* Section 17 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-3">17. Entire Agreement</h2>
                <p>These Terms constitute the entire agreement between you and Faith regarding use of the Services and supersede prior agreements.</p>
              </section>

              {/* Important Notice */}
              <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 mt-8">
                <h2 className="text-2xl font-bold text-white mb-3">Important Notice</h2>
                <p>Faith is not:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>A broker-dealer</li>
                  <li>A registered investment adviser</li>
                  <li>A financial institution</li>
                  <li>A custodian (unless explicitly stated)</li>
                </ul>
                <p className="mt-3 font-semibold">
                  Use of the Services may involve significant financial risk.
                </p>
              </section>
            </div>
          </div>
        </main>

        {/* Footer */}
        <DashboardFooter />
      </div>
    </div>
  );
}
