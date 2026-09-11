import fs from 'fs';
import path from 'path';

const possiblePaths = [
    path.join(process.cwd(), 'src', 'routes', 'index.tsx'),
    path.join(process.cwd(), 'src', 'pages', 'index.tsx'),
    path.join(process.cwd(), 'src', 'App.tsx')
];

let targetPath = possiblePaths.find(p => fs.existsSync(p));
if (!targetPath) {
    targetPath = path.join(process.cwd(), 'src', 'routes', 'index.tsx');
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
}

const homepageContent = `import { Link } from '@tanstack/react-router';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-500 selection:text-white" dir="rtl">
      {/* Hero Section */}
      <header className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-purple-950/40 via-slate-950 to-slate-950 py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
            🎮 GameCastle Store & Anime Nexus
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
            عالم الأنمي، الألعاب، والقصص الملحمية
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto">
            وجهتك الأولى لأحدث خلفيات الأنمي، بطاقات الألعاب الرقمية، والدليل الشامل لأكثر من 600,000 صفحة مرتبطة بالمحتوى المفضل لديك.
          </p>
        </div>
      </header>

      {/* Main Hub Categories */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Anime Hub */}
          <div className="group relative bg-slate-900/80 border border-slate-800 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col justify-between">
            <div>
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 text-xl font-bold group-hover:scale-110 transition-transform">
                🌸
              </div>
              <h2 className="text-2xl font-bold text-slate-100 mb-3 group-hover:text-purple-400 transition-colors">
                وحدة الأنمي والخلفيات
              </h2>
              <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                استكشف أضخم مكتبة لخلفيات الأنمي بدقة 8K، عروض الفيديو الترويجية، وأرشيف أشهر السلاسل (One Piece, Jujutsu Kaisen, Attack on Titan والمزيد).
              </p>
              <div className="space-y-2 mb-8 text-xs text-slate-400">
                <div className="flex items-center gap-2"><span>✨</span> خلفيات عمودية للهواتف الذكية</div>
                <div className="flex items-center gap-2"><span>🎬</span> مقاطع دعائية وتصاميم شخصيات</div>
              </div>
            </div>
            <Link 
              to="/anime" 
              className="inline-flex items-center justify-center w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors shadow-lg shadow-purple-600/20"
            >
              استعرض كافة صفحات الأنمي ←
            </Link>
          </div>

          {/* Games & Gift Cards Hub */}
          <div className="group relative bg-slate-900/80 border border-slate-800 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col justify-between">
            <div>
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 text-xl font-bold group-hover:scale-110 transition-transform">
                🎮
              </div>
              <h2 className="text-2xl font-bold text-slate-100 mb-3 group-hover:text-cyan-400 transition-colors">
                وحدة الألعاب والبطاقات
              </h2>
              <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                احصل على أفضل عروض بطاقات الألعاب الرقمية (Steam, PlayStation, Xbox, Roblox, PUBG) مع حاسبات العملات ومراكز الموارد.
              </p>
              <div className="space-y-2 mb-8 text-xs text-slate-400">
                <div className="flex items-center gap-2"><span>💳</span> بطاقات هدايا الألعاب الرسمية</div>
                <div className="flex items-center gap-2"><span>⚡</span> أدلة الشحن وأسعار العملات</div>
              </div>
            </div>
            <Link 
              to="/games" 
              className="inline-flex items-center justify-center w-full py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors shadow-lg shadow-cyan-600/20"
            >
              استعرض كافة صفحات الألعاب ←
            </Link>
          </div>

          {/* Stories & Manga Hub */}
          <div className="group relative bg-slate-900/80 border border-slate-800 rounded-2xl p-8 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between">
            <div>
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 text-xl font-bold group-hover:scale-110 transition-transform">
                📖
              </div>
              <h2 className="text-2xl font-bold text-slate-100 mb-3 group-hover:text-amber-400 transition-colors">
                وحدة القصص والمانغا
              </h2>
              <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                أرشيف عميق يضم أكثر من 500,000 قصة وفصل مانغا وتحليلات شاملة لأحداث وشخصيات العوالم الخيالية المختلفة.
              </p>
              <div className="space-y-2 mb-8 text-xs text-slate-400">
                <div className="flex items-center gap-2"><span>📚</span> فصول وقصص متجددة باستمرار</div>
                <div className="flex items-center gap-2"><span>🔍</span> أدلة تحليلية وتغطيات عميقة</div>
              </div>
            </div>
            <Link 
              to="/stories" 
              className="inline-flex items-center justify-center w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium transition-colors shadow-lg shadow-amber-600/20"
            >
              استعرض كافة صفحات القصص ←
            </Link>
          </div>

        </div>

        {/* Programmatic SEO Quick Discovery Section */}
        <div className="mt-16 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-semibold text-slate-200 mb-4">فهرس المحتوى الشامل (600,000+ صفحة مرتبطة)</h3>
          <p className="text-slate-400 text-sm max-w-3xl mx-auto mb-6">
            اضغط على أي من المواضيع أدناه للانتقال المباشر إلى الأرشيف المرتبط والصفحات الفرعية المؤرشفة:
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-purple-900/50 transition-colors cursor-pointer">One Piece</span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-purple-900/50 transition-colors cursor-pointer">Jujutsu Kaisen</span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-purple-900/50 transition-colors cursor-pointer">Attack on Titan</span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-cyan-900/50 transition-colors cursor-pointer">Steam Cards</span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-cyan-900/50 transition-colors cursor-pointer">PlayStation Network</span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-cyan-900/50 transition-colors cursor-pointer">Roblox Gift Cards</span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-amber-900/50 transition-colors cursor-pointer">Solo Leveling</span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-amber-900/50 transition-colors cursor-pointer">Dragon Ball</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-slate-500 text-xs">
        <p>© 2026 GameCastle Store. جميع الحقوق محفوظة. منصة الأنمي والبطاقات الرقمية الأولى.</p>
      </footer>
    </div>
  );
}
`;

fs.writeFileSync(targetPath, homepageContent, 'utf8');
console.log('✅ Homepage updated successfully with Anime, Games, and Stories units!');
