import { useEffect, useMemo, useRef, useState } from "react";

type LandingProps = {
  onStart: () => void;
};

const categories = [
  { icon: "⚛", title: "Physics", desc: "Mechanics, thermodynamics, electromagnetism, and quantum physics", keywords: "science physics" },
  { icon: "🧪", title: "Chemistry", desc: "Organic, inorganic, physical chemistry, and reactions", keywords: "science chemistry" },
  { icon: "🧬", title: "Biology", desc: "Cell biology, genetics, ecology, and human anatomy", keywords: "science biology" },
  { icon: "📐", title: "Algebra", desc: "Equations, polynomials, and algebraic expressions", keywords: "mathematics algebra math" },
  { icon: "📏", title: "Geometry", desc: "Shapes, angles, theorems, and spatial reasoning", keywords: "mathematics geometry math" },
  { icon: "∫", title: "Calculus", desc: "Derivatives, integrals, limits, and applications", keywords: "mathematics calculus math" },
  { icon: "🎲", title: "Probability", desc: "Statistics, probability theory, and data analysis", keywords: "mathematics probability statistics math" },
  { icon: "💻", title: "Programming", desc: "Python, JavaScript, Java, C++, and algorithms", keywords: "computer programming code" },
  { icon: "🤖", title: "Artificial Intelligence", desc: "Machine learning, neural networks, and AI concepts", keywords: "computer ai artificial intelligence machine learning" },
  { icon: "🗄", title: "Databases", desc: "SQL, NoSQL, database design, and management", keywords: "computer databases sql" },
  { icon: "🌐", title: "Networking", desc: "Protocols, security, cloud computing, and infrastructure", keywords: "computer networking network" },
  { icon: "📰", title: "Current Affairs", desc: "Latest news, politics, and world events", keywords: "general knowledge current affairs news" },
  { icon: "💡", title: "Inventions", desc: "Famous inventors, discoveries, and innovations", keywords: "general knowledge inventions discovery" },
  { icon: "🌍", title: "Geography", desc: "Countries, capitals, landmarks, and physical features", keywords: "general knowledge geography world countries" },
  { icon: "🇮🇳", title: "Indian History", desc: "Ancient India, freedom struggle, and modern history", keywords: "history indian india" },
  { icon: "⚔", title: "World Wars", desc: "WWI, WWII, battles, and historical conflicts", keywords: "history world wars war" },
  { icon: "🏛", title: "Ancient Civilizations", desc: "Egypt, Rome, Greece, and Mesopotamia", keywords: "history ancient civilizations" },
  { icon: "📚", title: "Famous Books", desc: "Classic novels, modern literature, and bestsellers", keywords: "literature books reading" },
  { icon: "✍", title: "Authors", desc: "Famous writers, poets, and their works", keywords: "literature authors writers" },
  { icon: "💬", title: "Famous Quotes", desc: "Inspirational quotes and their origins", keywords: "literature quotes quotations" },
  { icon: "📈", title: "Markets", desc: "Stock markets, trading, and financial markets", keywords: "economics business markets stock" },
  { icon: "🌐", title: "Trade", desc: "International trade, imports, and exports", keywords: "economics business trade commerce" },
  { icon: "🚀", title: "Startups", desc: "Entrepreneurship, unicorns, and business models", keywords: "economics business startups entrepreneurship" },
  { icon: "💰", title: "Finance", desc: "Banking, investments, and financial planning", keywords: "economics business finance banking" },
  { icon: "🔢", title: "Numbers", desc: "Numerical ability, calculations, and problem solving", keywords: "aptitude numbers math" },
  { icon: "🧩", title: "Reasoning", desc: "Logical reasoning, patterns, and deductions", keywords: "aptitude reasoning logical" },
  { icon: "🎯", title: "Puzzles", desc: "Brain teasers, riddles, and problem solving", keywords: "aptitude puzzles brain teasers" },
  { icon: "📝", title: "Grammar", desc: "English grammar rules, syntax, and usage", keywords: "verbal grammar english" },
  { icon: "📖", title: "Vocabulary", desc: "Word meanings, synonyms, and antonyms", keywords: "verbal vocabulary words english" },
  { icon: "👓", title: "Reading Comprehension", desc: "Passage reading, understanding, and analysis", keywords: "verbal reading comprehension english" },
  { icon: "🎬", title: "Bollywood", desc: "Hindi cinema, actors, and memorable films", keywords: "entertainment movies bollywood films" },
  { icon: "🎥", title: "Hollywood", desc: "International cinema, stars, and blockbusters", keywords: "entertainment movies hollywood films" },
  { icon: "📺", title: "TV Series", desc: "Popular shows, characters, and plotlines", keywords: "entertainment tv shows series" },
  { icon: "🎤", title: "Artists", desc: "Famous musicians, singers, and bands", keywords: "music artists singers bands" },
  { icon: "🎵", title: "Lyrics", desc: "Song lyrics, meanings, and compositions", keywords: "music lyrics songs" },
  { icon: "🎸", title: "Instruments", desc: "Musical instruments and their types", keywords: "music instruments musical" },
  { icon: "🏏", title: "Cricket", desc: "Players, matches, records, and tournaments", keywords: "sports cricket" },
  { icon: "⚽", title: "Football", desc: "Teams, leagues, World Cup, and legends", keywords: "sports football soccer" },
  { icon: "🏅", title: "Olympics", desc: "Olympic games, athletes, and records", keywords: "sports olympics games" },
  { icon: "😂", title: "Memes", desc: "Internet memes, viral trends, and online culture", keywords: "pop culture memes internet" },
  { icon: "📱", title: "Trends", desc: "Social media trends and viral phenomena", keywords: "pop culture trends social media" },
  { icon: "⭐", title: "Celebrities", desc: "Famous personalities and entertainment news", keywords: "pop culture celebrities famous" },
  { icon: "🔍", title: "Pattern Recognition", desc: "Identify patterns, sequences, and trends", keywords: "analytical pattern recognition" },
  { icon: "📊", title: "Data Analysis", desc: "Interpret data, charts, and statistics", keywords: "analytical data analysis" },
];

export default function Landing({ onStart }: LandingProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    if (!term) return categories;
    return categories.filter((c) =>
      `${c.title} ${c.desc} ${c.keywords}`.toLowerCase().includes(term)
    );
  }, [search]);

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modalOpen]);

  return (
    <div ref={containerRef}>
      <nav className="qh-nav">
        <div className="nav-left">
          <div className="logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>QuizHub</div>
        </div>
        <div className="nav-center">
          <button className="nav-btn" onClick={onStart}>Play</button>
          <button className="nav-btn" onClick={() => containerRef.current?.scrollIntoView({ behavior: "smooth" })}>Categories</button>
          <button className="nav-btn">Leaderboard</button>
        </div>
        <div className="nav-right">
          <button className="btn-secondary">Contact Support</button>
          <button className="btn-primary" onClick={() => setModalOpen(true)}>Log In</button>
        </div>
      </nav>

      <section className="hero">
        <div className="gradient-bg" />
        <div className="gradient-bg" />

        <div className="hero-content">
          <h1>Challenge Your Mind</h1>
          <p className="subtitle">Discover thousands of quizzes across every topic imaginable. Learn, compete, and have fun!</p>
        </div>

        <div className="search-container">
          <input
            type="text"
            className="search-box"
            placeholder="Search for quiz categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="search-icon" aria-hidden>🔍</span>
        </div>

        <div className="categories-section">
          <h2 className="section-title">All Quiz Categories</h2>
          <div className="categories-grid">
            {filtered.map((c) => (
              <div key={c.title} className="category-card" onClick={() => alert(`Starting ${c.title} quiz...`)}>
                <span className="category-icon">{c.icon}</span>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {modalOpen && (
        <div className="modal active" onClick={(e) => { if (e.currentTarget === e.target) setModalOpen(false); }}>
          <div className="modal-content">
            <button className="close-btn" onClick={() => setModalOpen(false)}>&times;</button>

            <div id="loginForm">
              <h2 className="modal-title">Welcome Back</h2>
              <p className="modal-subtitle">Log in to continue your quiz journey</p>

              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="Enter your email" />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" placeholder="Enter your password" />
              </div>

              <button className="submit-btn" onClick={() => setModalOpen(false)}>Log In</button>

              <div className="toggle-form">
                Don't have an account? <a onClick={(e) => { e.preventDefault(); /* future: switch to signup */ }}>Sign up</a>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .qh-nav { position: fixed; top: 0; width: 100%; padding: 20px 50px; display: flex; justify-content: space-between; align-items: center; z-index: 1000; background: rgba(10,10,10,0.9); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255,255,255,0.05); }
        .nav-left { display: flex; align-items: center; gap: 40px; }
        .logo { font-size: 26px; font-weight: 700; background: linear-gradient(135deg,#667eea 0%,#764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; cursor: pointer; }
        .nav-center { display: flex; gap: 30px; align-items: center; }
        .nav-btn { color: #999; text-decoration: none; font-weight: 500; transition: color .3s; cursor: pointer; background: none; border: none; font-size: 15px; }
        .nav-btn:hover { color: #fff; }
        .nav-right { display: flex; gap: 15px; }
        .btn-primary { padding: 10px 24px; background: linear-gradient(135deg,#667eea 0%,#764ba2 100%); color: #fff; text-decoration: none; border-radius: 25px; font-weight: 600; transition: transform .3s, box-shadow .3s; box-shadow: 0 4px 15px rgba(102,126,234,.3); border: none; cursor: pointer; font-size: 14px; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(102,126,234,.5); }
        .btn-secondary { padding: 10px 24px; background: rgba(255,255,255,.05); color: #fff; text-decoration: none; border-radius: 25px; font-weight: 600; transition: background .3s; border: 1px solid rgba(255,255,255,.1); cursor: pointer; font-size: 14px; }
        .btn-secondary:hover { background: rgba(255,255,255,.1); }

        .hero { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; padding: 120px 50px 80px; background: #0a0a0a; color: #fff; }
        .gradient-bg { position: absolute; width: 600px; height: 600px; background: radial-gradient(circle, rgba(102,126,234,.3) 0%, transparent 70%); border-radius: 50%; filter: blur(100px); animation: float 8s ease-in-out infinite; pointer-events: none; }
        .gradient-bg + .gradient-bg { background: radial-gradient(circle, rgba(118,75,162,.3) 0%, transparent 70%); animation-delay: -4s; left: 60%; }
        @keyframes float { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(50px, 50px); } }
        .hero-content { max-width: 700px; text-align: center; position: relative; z-index: 1; margin-bottom: 60px; }
        h1 { font-size: 64px; font-weight: 800; margin-bottom: 20px; line-height: 1.1; background: linear-gradient(135deg,#667eea 0%,#764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .subtitle { font-size: 20px; color: #999; margin-bottom: 40px; line-height: 1.6; }

        .search-container { position: relative; z-index: 1; max-width: 600px; width: 100%; margin-bottom: 80px; }
        .search-box { width: 100%; padding: 20px 60px 20px 24px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); border-radius: 50px; color: #fff; font-size: 16px; outline: none; transition: all .3s; backdrop-filter: blur(10px); }
        .search-box::placeholder { color: #666; }
        .search-box:focus { background: rgba(255,255,255,.08); border-color: rgba(102,126,234,.5); box-shadow: 0 0 30px rgba(102,126,234,.2); }
        .search-icon { position: absolute; right: 24px; top: 50%; transform: translateY(-50%); font-size: 20px; color: #999; }

        .categories-section { position: relative; z-index: 1; max-width: 1200px; width: 100%; }
        .section-title { font-size: 32px; font-weight: 700; margin-bottom: 40px; text-align: center; }
        .categories-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; margin-bottom: 100px; }
        .category-card { background: rgba(255,255,255,.03); padding: 30px 25px; border-radius: 20px; border: 1px solid rgba(255,255,255,.1); transition: transform .3s, background .3s, box-shadow .3s; cursor: pointer; }
        .category-card:hover { transform: translateY(-10px); background: rgba(255,255,255,.05); box-shadow: 0 20px 40px rgba(0,0,0,.3); }
        .category-icon { font-size: 48px; margin-bottom: 16px; display: block; }
        .category-card h3 { font-size: 22px; margin-bottom: 12px; }
        .category-card p { color: #999; font-size: 13px; line-height: 1.5; }

        .modal { display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,.8); backdrop-filter: blur(10px); z-index: 2000; justify-content: center; align-items: center; }
        .modal-content { background: rgba(20,20,20,.95); padding: 50px 40px; border-radius: 30px; border: 1px solid rgba(255,255,255,.1); max-width: 450px; width: 90%; position: relative; box-shadow: 0 30px 60px rgba(0,0,0,.5); }
        .close-btn { position: absolute; top: 20px; right: 20px; background: none; border: none; color: #999; font-size: 28px; cursor: pointer; transition: color .3s; }
        .close-btn:hover { color: #fff; }
        .modal-title { font-size: 32px; font-weight: 700; margin-bottom: 10px; background: linear-gradient(135deg,#667eea 0%,#764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .modal-subtitle { color: #999; margin-bottom: 30px; font-size: 14px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; color: #ccc; font-size: 14px; font-weight: 500; }
        .form-group input { width: 100%; padding: 14px 18px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); border-radius: 12px; color: #fff; font-size: 15px; outline: none; transition: all .3s; }
        .form-group input:focus { background: rgba(255,255,255,.08); border-color: rgba(102,126,234,.5); }
        .submit-btn { width: 100%; padding: 16px; background: linear-gradient(135deg,#667eea 0%,#764ba2 100%); color: #fff; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; transition: transform .3s, box-shadow .3s; margin-top: 10px; }
        .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(102,126,234,.4); }
        .toggle-form { text-align: center; margin-top: 20px; color: #999; font-size: 14px; }
        .toggle-form a { color: #667eea; text-decoration: none; font-weight: 600; cursor: pointer; }
        .toggle-form a:hover { text-decoration: underline; }

        @media (max-width: 768px) {
          .qh-nav { padding: 15px 20px; flex-wrap: wrap; }
          .nav-center { order: 3; width: 100%; margin-top: 15px; justify-content: center; }
          h1 { font-size: 42px; }
          .subtitle { font-size: 16px; }
          .hero { padding: 100px 20px 60px; }
          .categories-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
