import React, { useState, useEffect, useRef } from 'react';
import { db } from './firebase';
import { setDoc, doc } from 'firebase/firestore';
import Chart from 'chart.js/auto';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import logoAksana from './assets/AKSANA - LOGO.png';
import LoginForm from './components/LoginForm';

// --- COMPONENTS ---

// 1. Navigation Bar
const Navbar = ({ currentView, setView, toggleTheme, isDark }) => {
  const navItems = ['Home', 'Services', 'Contact', 'Tools'];
  
  return (
    <nav className="fixed top-0 w-full z-50 glass-panel border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('Home')}>
          <img src={logoAksana} className="w-10 h-10 object-contain min-w-[40px] min-h-[40px]" alt="Logo Aksana" />
          <span className="font-bold tracking-tight hidden sm:block text-lg md:text-xl">Aksana Business Lab</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          {navItems.map(item => (
            <button 
              key={item} 
              onClick={() => setView(item)}
              className={`min-h-[44px] min-w-[44px] font-medium transition-colors ${currentView === item ? 'text-aksana-primary dark:text-aksana-accent' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
            >
              {item === 'Home' ? 'Beranda' : item === 'Services' ? 'Layanan' : item === 'Contact' ? 'Kontak' : 'Tools'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('Login')} 
            className="hidden sm:flex min-h-[44px] px-6 py-2 bg-aksana-primary text-white rounded-xl font-semibold hover:bg-opacity-90 transition-all shadow-md active:scale-95 items-center justify-center gap-2"
          >
            <i className="fa-solid fa-right-to-bracket"></i> Login
          </button>
          
          <button 
            onClick={toggleTheme} 
            className="min-h-[44px] min-w-[44px] p-2 rounded-xl glass-panel hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center justify-center text-xl"
            aria-label="Toggle Theme"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
};

// 2. Custom Flexible Number Input Component
const FlexNumberInput = ({ label, value, onChange, unitPlaceholder }) => {
  const formatNumber = (num) => num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "";
  const parseNumber = (str) => parseInt(str.replace(/[^0-9]/g, ''), 10) || 0;

  const handleChange = (e) => {
    onChange(parseNumber(e.target.value));
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</label>
      <div className="flex items-center gap-3">
        <input 
          type="text" 
          className="flex-1 min-h-[44px] rounded-xl px-4 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-aksana-primary dark:focus:ring-aksana-accent text-slate-900 dark:text-white transition-all"
          value={formatNumber(value)}
          onChange={handleChange}
          placeholder="0"
        />
        <input 
          type="text" 
          className="w-24 min-h-[44px] rounded-xl px-3 text-center bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-aksana-primary text-slate-900 dark:text-white transition-all text-sm"
          placeholder={unitPlaceholder || "Satuan"}
        />
      </div>
    </div>
  );
};

// 3. Free Tools : Gateway Lead Magnet
const LeadGateway = ({ onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', company: '', phone: '', challenge: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem('aksana_lead', JSON.stringify(formData));
    onSuccess();
  };

  return (
    <div className="max-w-xl mx-auto mt-12 glass-panel p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Akses Free Tools Aksana</h2>
        <p className="text-slate-500 dark:text-slate-400">Silakan lengkapi data berikut untuk membuka akses penuh ke Business Growth Dashboard & Meeting Notes.</p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-medium">Nama Lengkap</label>
          <input required type="text" onChange={e => setFormData({...formData, name: e.target.value})} className="min-h-[44px] rounded-xl px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-aksana-primary outline-none" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium">Nama Perusahaan / Bisnis</label>
          <input required type="text" onChange={e => setFormData({...formData, company: e.target.value})} className="min-h-[44px] rounded-xl px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-aksana-primary outline-none" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium">Nomor WhatsApp</label>
          <input required type="tel" onChange={e => setFormData({...formData, phone: e.target.value})} className="min-h-[44px] rounded-xl px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-aksana-primary outline-none" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium">Apa tantangan terbesar bisnis Anda saat ini?</label>
          <textarea required rows="3" onChange={e => setFormData({...formData, challenge: e.target.value})} className="rounded-xl p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-aksana-primary outline-none resize-none"></textarea>
        </div>
        <button type="submit" className="min-h-[44px] w-full bg-aksana-primary text-white rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all mt-4 flex items-center justify-center">
          Buka Akses Tools
        </button>
      </form>
    </div>
  );
};

// 4. Free Tools : Workspace
const Workspace = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const exportRef = useRef(null);
  const [showCta, setShowCta] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90 * 60); // 90 minutes in seconds

  const [metrics, setMetrics] = useState({
    revTarget: 100000000, revActual: 75000000,
    profTarget: 30000000, profActual: 15000000
  });

  const [tasks, setTasks] = useState([
    { id: 1, text: 'Review performa kuartal 1', assignee: 'Budi', progress: 'Selesai 80%', done: false },
    { id: 2, text: 'Finalisasi SOP HR', assignee: 'Siti', progress: 'Drafting', done: false }
  ]);

  // Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (activeTab !== 'dashboard' || !chartRef.current) return;
    const ctx = chartRef.current.getContext('2d');
    if (chartInstance.current) { chartInstance.current.destroy(); }

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Revenue (Pendapatan)', 'Profit (Keuntungan)'],
        datasets: [
          {
            label: 'Target',
            data: [metrics.revTarget, metrics.profTarget],
            backgroundColor: 'rgba(203, 213, 225, 0.5)',
            borderColor: 'rgba(148, 163, 184, 1)',
            borderWidth: 1,
            borderRadius: 8
          },
          {
            label: 'Realisasi',
            data: [metrics.revActual, metrics.profActual],
            backgroundColor: 'rgba(6, 78, 59, 0.8)',
            borderColor: 'rgba(6, 78, 59, 1)',
            borderWidth: 1,
            borderRadius: 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            position: 'top', 
            labels: { color: document.documentElement.classList.contains('dark') ? '#f8fafc' : '#0f172a' } 
          }
        },
        scales: {
          y: { 
            beginAtZero: true, 
            grid: { color: 'rgba(148, 163, 184, 0.1)' }, 
            ticks: { color: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#64748b' } 
          },
          x: { 
            grid: { display: false }, 
            ticks: { color: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#64748b' } 
          }
        }
      }
    });

    return () => { if(chartInstance.current) chartInstance.current.destroy(); };
  }, [metrics, activeTab]);

  const addTask = () => {
    setTasks([...tasks, { id: Date.now(), text: '', assignee: '', progress: '', done: false }]);
  };
  const updateTask = (id, field, value) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const saveAllData = async () => {
    try {
      const leadData = JSON.parse(sessionStorage.getItem('aksana_lead') || '{}');
      const docId = leadData.phone || 'anonymous_' + Date.now();
      await setDoc(doc(db, "meeting_results", docId), {
        ...leadData,
        metrics,
        tasks,
        timestamp: new Date().toISOString()
      });
      alert("Data berhasil disimpan ke Cloud!");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data ke Cloud.");
    }
  };

  const handleExportPDF = async () => {
    if(!exportRef.current) return;
    try {
      const canvas = await html2canvas(exportRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Aksana_Report_${Date.now()}.pdf`);
      setShowCta(true);
    } catch (err) {
      alert("Gagal mengekspor PDF.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 flex flex-col gap-8">
      {/* Timer Display */}
      <div className="flex items-center justify-center gap-4 p-4 glass-panel rounded-2xl w-fit mx-auto border-2 border-aksana-primary">
        <span className="text-xl font-bold text-aksana-primary dark:text-aksana-accent">⏱ Timer: {formatTime(timeLeft)}</span>
      </div>

      <div className="flex gap-4 p-2 glass-panel rounded-2xl w-fit mx-auto">
        <button onClick={() => setActiveTab('dashboard')} className={`px-6 py-3 min-h-[44px] rounded-xl font-medium transition-all ${activeTab === 'dashboard' ? 'bg-white dark:bg-slate-800 shadow-sm text-aksana-primary dark:text-aksana-accent' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>📊 Dashboard</button>
        <button onClick={() => setActiveTab('notes')} className={`px-6 py-3 min-h-[44px] rounded-xl font-medium transition-all ${activeTab === 'notes' ? 'bg-white dark:bg-slate-800 shadow-sm text-aksana-primary dark:text-aksana-accent' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>📝 Notes</button>
      </div>

      <div ref={exportRef} className="glass-panel p-6 sm:p-10 rounded-2xl border border-slate-200 dark:border-slate-800 transition-all">
        <div className="mb-8 border-b border-slate-200 dark:border-slate-700 pb-6 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{activeTab === 'dashboard' ? 'Business Growth Checkup' : 'Notulensi Progres'}</h2>
            <p className="text-slate-500 dark:text-slate-400">Sistem operasi bisnis sederhana.</p>
          </div>
          <div className="text-right text-sm text-slate-400 font-medium hidden sm:block">Aksana Business Lab <br/> {new Date().toLocaleDateString('id-ID')}</div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="flex flex-col gap-6">
              <h3 className="font-bold text-lg border-b border-slate-200 dark:border-slate-800 pb-2">Data Keuangan</h3>
              <FlexNumberInput label="Target Revenue" value={metrics.revTarget} onChange={(v) => setMetrics({...metrics, revTarget: v})} unitPlaceholder="IDR" />
              <FlexNumberInput label="Realisasi Revenue" value={metrics.revActual} onChange={(v) => setMetrics({...metrics, revActual: v})} unitPlaceholder="IDR" />
              <div className="h-px bg-slate-200 dark:bg-slate-800 my-2"></div>
              <FlexNumberInput label="Target Profit" value={metrics.profTarget} onChange={(v) => setMetrics({...metrics, profTarget: v})} unitPlaceholder="IDR" />
              <FlexNumberInput label="Realisasi Profit" value={metrics.profActual} onChange={(v) => setMetrics({...metrics, profActual: v})} unitPlaceholder="IDR" />
            </div>
            <div className="flex flex-col">
              <h3 className="font-bold text-lg border-b border-slate-200 dark:border-slate-800 pb-2 mb-6">Visualisasi Gap</h3>
              <div className="chart-container flex-1 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800"><canvas ref={chartRef}></canvas></div>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-[auto_1fr_150px_150px] gap-4 px-4 py-2 bg-slate-100 dark:bg-slate-800/50 rounded-xl font-semibold text-sm text-slate-500">
              <div className="w-6 text-center">✓</div>
              <div>Tugas</div><div>PIC</div><div>Progres</div>
            </div>
            <div className="flex flex-col gap-3">
              {tasks.map(task => (
                <div key={task.id} className="grid grid-cols-[auto_1fr_150px_150px] gap-4 items-center p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <input type="checkbox" checked={task.done} onChange={(e) => updateTask(task.id, 'done', e.target.checked)} className="w-6 h-6 accent-aksana-primary" />
                  <input type="text" value={task.text} onChange={(e) => updateTask(task.id, 'text', e.target.value)} placeholder="Tulis tugas..." className={`min-h-[44px] bg-transparent outline-none px-2 ${task.done ? 'line-through text-slate-400' : ''}`} />
                  <input type="text" value={task.assignee} onChange={(e) => updateTask(task.id, 'assignee', e.target.value)} placeholder="PIC" className="min-h-[44px] bg-slate-100 dark:bg-slate-800 rounded-lg px-3 text-sm outline-none" />
                  <input type="text" value={task.progress} onChange={(e) => updateTask(task.id, 'progress', e.target.value)} placeholder="50%" className="min-h-[44px] bg-slate-100 dark:bg-slate-800 rounded-lg px-3 text-sm outline-none" />
                </div>
              ))}
            </div>
            <button onClick={addTask} className="text-aksana-primary font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl w-fit px-4 py-2 transition-colors">+ Tambah Baru</button>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-6 mb-20">
        <div className="flex gap-4">
          <button onClick={saveAllData} className="min-h-[44px] px-8 py-3 bg-aksana-primary text-white rounded-xl font-bold hover:scale-105 transition-transform shadow-lg">☁️ Simpan ke Cloud</button>
          <button onClick={handleExportPDF} className="min-h-[44px] px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg">📄 Unduh PDF</button>
        </div>
        {showCta && (
          <div className="animate-bounce mt-4 glass-panel p-6 rounded-2xl border-2 border-aksana-accent max-w-md text-center">
            <h4 className="font-bold text-lg mb-2">Butuh Bantuan Menganalisa Hasil Ini?</h4>
            <a href="https://wa.me/6281234567890?text=Halo%20Aksana,%20saya%20ingin%20berkonsultasi%20berdasarkan%20hasil%20Growth%20Dashboard%20saya." target="_blank" rel="noreferrer" className="min-h-[44px] w-full bg-aksana-accent text-white rounded-xl font-bold flex items-center justify-center gap-2">💬 Hubungi Konsultan via WA</a>
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
const App = () => {
  const [currentView, setCurrentView] = useState('Home');
  const [isDark, setIsDark] = useState(false);
  const [hasAccessTools, setHasAccessTools] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
    if (sessionStorage.getItem('aksana_lead')) {
      setHasAccessTools(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'Home':
        return (
          <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
            <div className="inline-block px-4 py-2 rounded-full glass-panel text-sm font-semibold text-aksana-primary dark:text-aksana-accent mb-8">
              Aksana Business Lab
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight max-w-4xl">
              Menjadikan Bisnis Lebih <span className="text-transparent bg-clip-text bg-gradient-to-r from-aksana-primary to-emerald-500 dark:from-aksana-accent dark:to-yellow-300">Rapi, Tumbuh,</span> dan <span className="text-transparent bg-clip-text bg-gradient-to-r from-aksana-primary to-emerald-500 dark:from-aksana-accent dark:to-yellow-300">Menenangkan.</span>
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mb-12">
              Ruang bertumbuh bagi pengusaha untuk berprogres dan membangun fondasi bisnis yang kokoh dan lebih berdaya<br/><br/>
              Pendekatan kami: Sederhana, Terukur, dan Manusiawi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => setCurrentView('Services')} className="min-h-[44px] min-w-[200px] px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold hover:scale-105 transition-transform">Pelajari Layanan</button>
              <button onClick={() => setCurrentView('Tools')} className="min-h-[44px] min-w-[200px] px-8 py-4 glass-panel rounded-2xl font-bold border-2 border-slate-200 dark:border-slate-800">Coba Free Tools</button>
            </div>
          </div>
        );
      case 'Services':
        const services = [
          { 
            icon: '🔍', 
            title: 'Business Checkup 360', 
            desc: 'Pemeriksaan Awal Menyeluruh',
            analogy: 'Membawa mobil bisnis Anda ke bengkel untuk pemeriksaan total (general check-up).',
            explanation: 'Sebelum melaju lebih jauh, kita harus mengecek seluruh kondisi "mesin" bisnis Anda. Tujuannya untuk menemukan secara pasti apa yang membuat lajunya tersendat atau terasa berat. Dengan begitu, kita bisa langsung memperbaiki akar masalahnya, bukan sekadar menebak-nebak atau membuang uang untuk mengganti onderdil yang sebenarnya masih bagus.'
          },
          { 
            icon: '⚙️', 
            title: 'Growth OS', 
            desc: 'Pemasangan Sistem Operasi Bisnis',
            analogy: 'Mengubah mobil manual yang melelahkan menjadi mobil dengan sistem otomatis (matic).',
            explanation: 'Kami membantu merakit sistem, prosedur, dan aturan main yang jelas di dalam bisnis. Tujuannya agar "kendaraan" bisnis Anda bisa melaju dengan mulus secara mandiri. Anda sebagai pemilik tidak perlu lagi kelelahan menginjak kopling, mengoper gigi, atau mengawasi setir setiap detik.'
          },
          { 
            icon: '💰', 
            title: 'Founder Finance Clarity', 
            desc: 'Kejelasan Angka & Keuangan',
            analogy: 'Belajar membaca indikator bensin dan kecepatan di dashboard depan setir Anda.',
            explanation: 'Kami mengubah laporan keuangan yang rumit menjadi angka-angka sederhana yang langsung bisa Anda pahami. Dengan begitu, Anda tahu persis kapan harus mengisi "bensin" (modal/uang masuk), kapan harus menginjak rem pengeluaran, dan seberapa jauh bisnis bisa melaju tanpa takut mendadak mogok di tengah jalan.'
          },
          { 
            icon: '👥', 
            title: 'People & Culture Reset', 
            desc: 'Penataan Tim dan Budaya Kerja',
            analogy: 'Mengatur kekompakan seluruh kru dan penumpang di dalam mobil.',
            explanation: 'Jika semua orang di dalam mobil berebut ingin memegang setir atau tidak ada yang mau membantu membaca peta, perjalanan pasti kacau. Kami membantu menata ulang pembagian tugas dan komunikasi tim Anda. Hasilnya, setiap karyawan tahu peran mereka masing-masing, sehingga suasana kerja menjadi tenang, harmonis, dan minim drama.'
          },
          { 
            icon: '🚀', 
            title: 'Market & Product Sprint', 
            desc: 'Penyelarasan Produk dan Pasar',
            analogy: 'Memastikan jenis mobil yang Anda bawa memang yang sedang dicari oleh penumpang.',
            explanation: 'Sebagus apa pun mobil sedan Anda, jika pelanggan di pasar sedang mencari mobil pick-up untuk angkut barang, mereka tidak akan naik. Kami membantu menyesuaikan produk atau layanan Anda agar benar-benar cocok dengan kebutuhan pelanggan, sehingga Anda tidak membuang waktu menawarkan sesuatu yang sulit terjual.'
          },
          { 
            icon: '🤝', 
            title: 'Aksana Partner', 
            desc: 'Pendampingan Rutin Terjadwal',
            analogy: 'Memiliki Co-Pilot atau navigator ahli yang duduk di kursi sebelah Anda.',
            explanation: 'Mengemudikan bisnis sendirian dalam perjalanan yang panjang sering kali terasa sepi dan memberikan beban pikiran yang berat. Kami hadir secara rutin menemani Anda untuk membantu melihat arah peta, mengingatkan jika ada jalan berlubang di depan, serta menjadi teman diskusi yang jernih saat Anda harus mengambil keputusan penting.'
          }
        ];
        return (
          <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Layanan Kami</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">Klik pada kartu layanan untuk melihat perumpamaan dan penjelasan lengkapnya.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((svc, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedService(svc)}
                  className="glass-panel p-8 rounded-2xl hover:-translate-y-2 hover:shadow-xl hover:border-aksana-primary/30 transition-all cursor-pointer group relative"
                >
                  <div className="text-4xl mb-6 bg-slate-100 dark:bg-slate-800 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:bg-aksana-primary group-hover:text-white transition-colors">{svc.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{svc.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-4">{svc.desc}</p>
                  <span className="text-xs font-bold text-aksana-primary dark:text-aksana-accent uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    Lihat Detail <span>→</span>
                  </span>
                </div>
              ))}
            </div>

            {/* MODAL OVERLAY */}
            {selectedService && (
              <div 
                className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in modal-overlay"
                onClick={() => setSelectedService(null)}
              >
                <div 
                  className="bg-white dark:bg-aksana-surfaceDark w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-scale-up border border-slate-200 dark:border-slate-800"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="p-8 sm:p-12 relative">
                    <button 
                      onClick={() => setSelectedService(null)}
                      className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                    
                    <div className="flex items-center gap-4 mb-8">
                      <div className="text-5xl bg-aksana-primary/10 p-4 rounded-2xl">{selectedService.icon}</div>
                      <div>
                        <h3 className="text-2xl font-bold">{selectedService.title}</h3>
                        <p className="text-aksana-primary dark:text-aksana-accent font-medium">{selectedService.desc}</p>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-l-4 border-aksana-primary">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-aksana-primary dark:text-aksana-accent mb-2">Perumpamaan</h4>
                        <p className="text-lg font-medium italic text-slate-700 dark:text-slate-200">"{selectedService.analogy}"</p>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Penjelasan</h4>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                          {selectedService.explanation}
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={() => {setSelectedService(null); setCurrentView('Contact');}}
                      className="mt-10 w-full min-h-[44px] bg-aksana-primary text-white rounded-xl font-bold py-4 hover:bg-opacity-90 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      Konsultasikan Masalah Ini <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'Contact':
        return (
          <div className="pt-32 pb-20 px-6 max-w-xl mx-auto">
            <div className="glass-panel p-8 sm:p-12 rounded-3xl text-center">
              <h2 className="text-3xl font-bold mb-2">Mari Berdiskusi!</h2>
              <p className="text-slate-500 mb-8">Jadwalkan sesi konsultasi awal secara gratis bersama tim Aksana.</p>
              
              <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="min-h-[44px] w-full bg-aksana-primary text-white rounded-xl font-bold text-lg p-4 flex items-center justify-center gap-3 hover:bg-opacity-90 transition-all shadow-md">
                <span>💬</span> Hubungi via WhatsApp
              </a>
              
              <div className="mt-8 text-sm text-slate-500">
                <p className="font-medium text-slate-700 dark:text-slate-300">Email: halloaksana@gmail.com</p>
              </div>
            </div>
          </div>
        );
      case 'Tools':
        return (
          <div className="pt-32 pb-20 px-4 sm:px-6 w-full">
            <div className="max-w-7xl mx-auto">
              {!hasAccessTools ? (
                <LeadGateway onSuccess={() => setHasAccessTools(true)} />
              ) : (
                <Workspace />
              )}
            </div>
          </div>
        );
      case 'Login':
        return <LoginForm onBack={() => setCurrentView('Home')} onLoginSuccess={() => setCurrentView('Tools')} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {currentView !== 'Login' && (
        <Navbar currentView={currentView} setView={setCurrentView} toggleTheme={toggleTheme} isDark={isDark} />
      )}
      <main className="flex-grow flex flex-col">
        {renderContent()}
      </main>
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 text-center text-sm text-slate-500 mt-auto">
        <p>© {new Date().getFullYear()} Aksana Business Lab. Menjadikan Bisnis Lebih Rapi, Tumbuh, dan Menenangkan.</p>
      </footer>
    </div>
  );
};

export default App;
