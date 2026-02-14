'use client';

import DashboardSidebar from '@/app/components/DashboardSidebar';
import DashboardTopbar from '@/app/components/DashboardTopbar';
import DashboardFooter from '@/app/components/DashboardFooter';
import { usePrivy } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DeveloperBlueprintPage() {
  const router = useRouter();
  const { user, logout, ready } = usePrivy();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedPage, setSelectedPage] = useState('dev-blueprint');
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
            <div className="text-center mb-12">
              <h1 className="text-5xl font-black text-white mb-3" style={{fontStyle: 'italic', letterSpacing: '0.05em'}}>Developer Blueprint</h1>
              <p className="text-gray-400 text-lg">A guide for developers whose projects now have a token associated with them on Faith.</p>
            </div>

            <div className="space-y-8 text-gray-300">
              {/* Why You're Reading This */}
              <section>
                <h2 className="text-3xl font-bold text-white mb-4">Why You're Reading This</h2>
                <p className="mb-3">
                  If this page reached you, it likely means a token has been created around your project through Faith.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>You're probably receiving messages telling you to "claim it."</li>
                  <li>You might feel confused. Skeptical. Concerned about your reputation.</li>
                </ul>
                <p className="mt-4 font-semibold text-white">That's normal.</p>
                <p className="mt-3">
                  This guide exists to help you:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
                  <li>Understand what's happening</li>
                  <li>Decide whether claiming makes sense for you</li>
                  <li>Avoid common mistakes if you do claim</li>
                  <li>Protect your reputation either way</li>
                </ul>
                <p className="mt-4">
                  We've seen many developers in this exact situation. The difference between projects that thrive and projects that implode is rarely technical — it's about communication.
                </p>
              </section>

              {/* Step 1: Should You Claim? */}
              <section className="bg-gray-900/30 border border-gray-800 rounded-lg p-6">
                <h2 className="text-3xl font-bold text-white mb-4">Step 1: Should You Claim?</h2>
                <p className="mb-4">
                  Claiming is optional. It's not required. And it's not right for everyone.
                </p>
                
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-green-400 mb-3">Consider claiming if:</h3>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>You're willing to publicly engage with a community.</li>
                    <li>You have a clear direction for your project.</li>
                    <li>You see potential alignment between the token and your long-term vision.</li>
                    <li>You're ready to be present during the early stage.</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-red-400 mb-3">Do NOT claim if:</h3>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>You plan to collect fees and disappear.</li>
                    <li>You don't want public attention.</li>
                    <li>You dislike ongoing communication.</li>
                    <li>You view it as "free money" with no responsibility.</li>
                  </ul>
                </div>

                <p className="italic">
                  Claiming creates expectations — even if nothing formal is written. If you claim and go silent, it will likely harm your reputation more than simply declining.
                </p>
                <p className="mt-3 font-semibold">
                  Be honest with yourself before making a decision.
                </p>
              </section>

              {/* If You Decide Not to Claim */}
              <section>
                <h2 className="text-3xl font-bold text-white mb-4">If You Decide Not to Claim</h2>
                <p className="mb-3">
                  That's completely fine.
                </p>
                <p className="mb-3">
                  The best move is clarity.
                </p>
                <p className="mb-3 italic">
                  A simple statement such as: "I'm aware of the token associated with [project]. I've chosen not to claim or engage with it. I remain focused on building."
                </p>
                <p>
                  Clear communication stops speculation. Ambiguity invites endless messages.
                </p>
              </section>

              {/* If You Claim */}
              <section className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                <h2 className="text-3xl font-bold text-white mb-4">If You Claim — Understand What It Signals</h2>
                <p className="mb-4">
                  Claiming is not a finish line. It's the starting signal.
                </p>
                <p className="mb-3">
                  The moment you claim, people interpret it as:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2 mb-4">
                  <li>You acknowledge the token.</li>
                  <li>You are aware of the community.</li>
                  <li>You may be aligned with its existence.</li>
                </ul>
                <p>
                  Whether you intend it or not, that's how it's perceived. Transparency about that expectation matters.
                </p>
              </section>

              {/* The First Few Hours Matter */}
              <section>
                <h2 className="text-3xl font-bold text-white mb-4">The First Few Hours Matter</h2>
                <p className="mb-4">Plan your claim. Do not claim randomly or right before you log off.</p>
                
                <h3 className="text-xl font-bold text-green-400 mb-3">Immediate actions:</h3>
                <ul className="list-disc list-inside space-y-2 ml-2 mb-6">
                  <li>Publicly acknowledge what's happening.</li>
                  <li>Clarify what you are building.</li>
                  <li>Share your stance clearly.</li>
                  <li>Engage with early supporters.</li>
                </ul>

                <h3 className="text-xl font-bold text-red-400 mb-3">Avoid:</h3>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Claiming and disappearing.</li>
                  <li>Hinting privately before announcing publicly.</li>
                  <li>Teasing indecision ("maybe I will…").</li>
                  <li>Creating artificial hype without substance.</li>
                </ul>
                <p className="mt-4 font-semibold">
                  Clarity beats suspense.
                </p>
              </section>

              {/* The First 72 Hours */}
              <section className="bg-gray-900/30 border border-gray-800 rounded-lg p-6">
                <h2 className="text-3xl font-bold text-white mb-4">The First 72 Hours: Foundation Phase</h2>
                <p className="mb-4">
                  The early window shapes long-term perception.
                </p>
                
                <p className="mb-3">During this period:</p>
                <ul className="list-disc list-inside space-y-2 ml-2 mb-6">
                  <li>People are evaluating your seriousness.</li>
                  <li>New holders are forming opinions.</li>
                  <li>Your communication pattern is being established.</li>
                </ul>

                <p className="mb-3">Your objective is simple:</p>
                <ul className="list-disc list-inside space-y-2 ml-2 mb-6">
                  <li>Show you are real and present.</li>
                  <li>Explain your vision clearly.</li>
                  <li>Begin building trust through interaction.</li>
                </ul>

                <p className="mb-3">In this phase, communication frequency should be higher than normal.</p>
                <p><span className="font-semibold">Silence creates fear.</span> <span className="font-semibold">Visibility builds credibility.</span></p>
              </section>

              {/* What Should You Share? */}
              <section>
                <h2 className="text-3xl font-bold text-white mb-4">What Should You Share?</h2>
                <p className="mb-4">
                  Your community wants reasons to believe. They can't support what they don't understand.
                </p>
                <p className="mb-4">
                  We call this "Signal." Signal is concrete, shareable proof of momentum.
                </p>
                <p className="mb-6 text-center font-semibold text-lg">
                  Without signal → speculation.<br/>
                  With signal → advocacy.
                </p>

                <h3 className="text-xl font-bold text-green-400 mb-3">Examples of strong signal:</h3>
                <ul className="list-disc list-inside space-y-2 ml-2 mb-6">
                  <li>Feature releases</li>
                  <li>Screenshots or demos</li>
                  <li>Roadmap clarity</li>
                  <li>Milestones reached</li>
                  <li>Clear technical updates</li>
                  <li>Direct answers to real questions</li>
                </ul>

                <h3 className="text-xl font-bold text-red-400 mb-3">Weak communication looks like:</h3>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>"Big things coming soon."</li>
                  <li>"We're thinking about stuff."</li>
                  <li>Vague excitement without substance.</li>
                </ul>
                <p className="mt-4 font-semibold">
                  Specificity builds trust.
                </p>
              </section>

              {/* Common Mistakes */}
              <section className="bg-gray-900/30 border border-gray-800 rounded-lg p-6">
                <h2 className="text-3xl font-bold text-white mb-4">Common Mistakes to Avoid</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">1. Going Quiet</h3>
                    <p>
                      Silence is interpreted as abandonment. Even short updates maintain confidence.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">2. Relying on Past Credentials</h3>
                    <p>
                      Your résumé might spark initial interest. It will not sustain belief. Consistent action matters more than history.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">3. Public Indecision</h3>
                    <p>
                      Internal debate is fine. Public uncertainty creates instability. Decide first. Then speak.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">4. Lack of Transparency Around Fees</h3>
                    <p>
                      If fees exist, people will ask what they're for. If it appears extractive, trust erodes quickly. Clarity about purpose — even simple honesty — builds alignment.
                    </p>
                  </div>
                </div>
              </section>

              {/* Private Messages Rule */}
              <section>
                <h2 className="text-3xl font-bold text-white mb-4">A Critical Rule About Private Messages</h2>
                <p className="mb-4">
                  Assume everything shared in DMs becomes public.
                </p>
                <p className="mb-4">
                  Information spreads quickly in token communities.
                </p>
                <p className="mb-4">
                  If you share:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2 mb-4">
                  <li>Future announcements</li>
                  <li>Partnership hints</li>
                  <li>Timelines</li>
                  <li>"Between us" updates</li>
                </ul>
                <p>
                  It will circulate.
                </p>
                <p className="mt-4 font-semibold">
                  If it's not ready for public release — don't share it privately.
                </p>
                <p className="mt-2">
                  This protects fairness and integrity.
                </p>
              </section>

              {/* Handling Criticism */}
              <section className="bg-gray-900/30 border border-gray-800 rounded-lg p-6">
                <h2 className="text-3xl font-bold text-white mb-4">Handling Criticism & Volatility</h2>
                <p className="mb-4">
                  Token environments can be intense. Price fluctuations create emotional reactions.
                </p>
                <p className="mb-4">
                  Clarity reduces hostility.
                </p>
                <p className="mb-4">
                  When you:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2 mb-4">
                  <li>Define expectations clearly</li>
                  <li>Communicate roadmap details</li>
                  <li>Maintain visibility</li>
                </ul>
                <p className="mb-4">
                  Discussions shift from personal attacks to product debate.
                </p>
                <p className="mb-2"><span className="font-semibold">Ambiguity makes you the target.</span></p>
                <p className="mb-4"><span className="font-semibold">Clarity distributes the conversation.</span></p>
                <p>
                  Ignore trolls. Answer legitimate questions. Stay steady.
                </p>
              </section>

              {/* Sustainable Growth */}
              <section>
                <h2 className="text-3xl font-bold text-white mb-4">Sustainable Growth</h2>
                <p className="mb-4">
                  You won't need early-stage intensity forever. But you must earn the right to slow down.
                </p>

                <h3 className="text-xl font-bold text-green-400 mb-3">Early Stage:</h3>
                <ul className="list-disc list-inside space-y-2 ml-2 mb-6">
                  <li>Frequent updates</li>
                  <li>Active engagement</li>
                  <li>Vision reinforcement</li>
                </ul>

                <h3 className="text-xl font-bold text-blue-400 mb-3">Later Stage:</h3>
                <ul className="list-disc list-inside space-y-2 ml-2 mb-6">
                  <li>Major milestones</li>
                  <li>Consistent execution</li>
                  <li>Community self-organizes</li>
                </ul>

                <p className="italic">
                  When holders start explaining your vision without you — that's sustainability.
                </p>
                <p className="mt-3">
                  But that only happens after consistency.
                </p>
              </section>

              {/* Most Powerful Strategy */}
              <section className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                <h2 className="text-3xl font-bold text-white mb-4">The Most Powerful Strategy</h2>
                <p className="mb-3">
                  Build something people genuinely want.
                </p>
                <p className="mb-3">
                  Virality outside of token circles strengthens both product and community.
                </p>
                <p className="mb-3">
                  Ask your community to help spread meaningful updates — not hype.
                </p>
                <p className="font-bold text-lg">
                  Execution + communication = long-term strength.
                </p>
                <p className="text-red-400 mt-2">
                  One without the other fails.
                </p>
              </section>

              {/* Legal Note */}
              <section className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                <h2 className="text-3xl font-bold text-white mb-4">Legal Note</h2>
                <p className="mb-3">
                  You did not create or deploy the token yourself.
                </p>
                <p className="mb-3">
                  You are deciding whether to associate with it.
                </p>
                <p className="mb-4">
                  That distinction can matter legally. If uncertain, consult legal counsel.
                </p>
                <p className="mb-3">
                  You may share this summary with them:
                </p>
                <p className="italic bg-gray-800 p-3 rounded">
                  "A third party created a token associated with my project on Faith. I did not deploy or launch it. The platform allows me to optionally claim future fee participation. I am evaluating the implications."
                </p>
              </section>

              {/* In Short */}
              <section className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
                <h2 className="text-3xl font-bold text-white mb-4">In Short</h2>
                <ul className="list-disc list-inside space-y-2 ml-2 text-lg">
                  <li>Claiming implies engagement.</li>
                  <li>If you can't communicate, don't claim.</li>
                  <li>The early window sets tone.</li>
                  <li>Give your community clear signal.</li>
                  <li>Silence damages. Clarity protects.</li>
                  <li>Build consistently.</li>
                </ul>
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
