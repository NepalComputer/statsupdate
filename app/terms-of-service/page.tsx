export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-600 selection:text-white">
      <div className="max-w-3xl mx-auto px-6 py-32">
        <div className="space-y-12">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter text-slate-900 uppercase">Terms of Service</h1>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 italic">Effective Date: May 2026</p>
          </div>

          <div className="prose prose-slate max-w-none space-y-8 text-slate-600 font-medium leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">1. Acceptance of Terms</h2>
              <p>By accessing StatsUpdate, you agree to comply with these Terms of Service. If you do not agree, please refrain from using our services, including our interactive games and editorial content.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">2. Conduct & Fair Play</h2>
              <p>Our multiplayer games (Word Chain, NPAT) are designed for fair competition. Any attempt to use automated scripts, bots, or external hacks to manipulate game outcomes will result in a permanent ban from the platform.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">3. Intellectual Property</h2>
              <p>All editorial content, high-resolution imagery, and unique game mechanics are the intellectual property of StatsUpdate. Reproduction or distribution without explicit permission is prohibited.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">4. Liability</h2>
              <p>StatsUpdate provides information and entertainment for general purposes. We are not liable for any decisions made based on the data provided in our sports or tech analytics.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
