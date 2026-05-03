export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-600 selection:text-white">
      <div className="max-w-3xl mx-auto px-6 py-32">
        <div className="space-y-12">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter text-slate-900 uppercase">Cookie Policy</h1>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 italic">Last Updated: May 2026</p>
          </div>

          <div className="prose prose-slate max-w-none space-y-8 text-slate-600 font-medium leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">1. Why We Use Cookies</h2>
              <p>StatsUpdate uses cookies to enhance your experience. These are small text files that help us remember your game progress, keep you logged in, and analyze site traffic to improve our content delivery.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">2. Necessary Cookies</h2>
              <p>Some cookies are essential for the operation of our real-time multiplayer games. Without these, session synchronization and lobby management would not function correctly.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">3. Performance & Analytics</h2>
              <p>We use anonymous analytics cookies to understand how our users interact with our "Top 5" articles and tech deep dives. This helps us prioritize the topics you care about most.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">4. Managing Cookies</h2>
              <p>You can adjust your cookie settings through your browser. However, disabling essential cookies may impact your ability to participate in interactive gaming arenas.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
