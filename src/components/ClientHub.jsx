import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import AksanaLogoImg from '../assets/AKSANA - LOGO.png';

const ClientHub = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState('client-dash');
  const [todos, setTodos] = useState([
    { id: 1, text: "Finalisasi draft SOP HR", owner: "Budi", completed: true },
    { id: 2, text: "Review financial projection", owner: "Siti", completed: false },
    { id: 3, text: "Kirim tagihan ke vendor IT", owner: "", completed: false }
  ]);

  const salesTrafficChartRef = useRef(null);
  const scorecardChartRef = useRef(null);
  const salesTrafficInstance = useRef(null);
  const scorecardInstance = useRef(null);

  const navConfig = [
    { id: 'client-dash', label: 'Executive Dashboard', icon: '📈' },
    { id: 'client-todo', label: 'L10 & To-Do', icon: '✅' },
    { id: 'client-docs', label: 'Documents', icon: '📁' }
  ];

  useEffect(() => {
    if (currentView === 'client-dash') {
      renderCharts();
    }
    return () => {
      if (salesTrafficInstance.current) salesTrafficInstance.current.destroy();
      if (scorecardInstance.current) scorecardInstance.current.destroy();
    };
  }, [currentView]);

  const renderCharts = () => {
    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#94A3B8' : '#64748B';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

    // 1. Sales & Traffic Chart
    if (salesTrafficChartRef.current) {
      if (salesTrafficInstance.current) salesTrafficInstance.current.destroy();
      const ctx = salesTrafficChartRef.current.getContext('2d');
      const barGradient = ctx.createLinearGradient(0, 0, 0, 400);
      barGradient.addColorStop(0, 'rgba(0, 102, 204, 0.8)');
      barGradient.addColorStop(1, 'rgba(0, 102, 204, 0.1)');

      salesTrafficInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt'],
          datasets: [
            {
              label: 'Traffic / Leads (User)',
              type: 'line',
              data: [15000, 18000, 17500, 21000, 22500, 24500],
              borderColor: '#8B5CF6',
              backgroundColor: '#8B5CF6',
              borderWidth: 3,
              tension: 0.4,
              yAxisID: 'y1',
              pointBackgroundColor: isDark ? '#181C20' : '#FFFFFF',
              pointBorderWidth: 2,
              pointRadius: 5
            },
            {
              label: 'Penjualan (Juta Rp)',
              type: 'bar',
              data: [450, 520, 490, 610, 750, 845],
              backgroundColor: barGradient,
              borderRadius: 6,
              borderSkipped: false,
              yAxisID: 'y'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { position: 'top', labels: { color: textColor, usePointStyle: true, boxWidth: 10, font: {family: 'Inter'} } }
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: textColor, font: {family: 'Inter'} } },
            y: { type: 'linear', display: true, position: 'left', title: { display: true, text: 'Penjualan (Juta Rp)', color: textColor, font: {size: 11, family: 'Inter'} }, grid: { color: gridColor }, ticks: { color: textColor, font: {family: 'Inter'} } },
            y1: { type: 'linear', display: true, position: 'right', title: { display: true, text: 'Traffic (User)', color: textColor, font: {size: 11, family: 'Inter'} }, grid: { drawOnChartArea: false }, ticks: { color: textColor, font: {family: 'Inter'} } }
          }
        }
      });
    }

    // 2. Scorecard Chart
    if (scorecardChartRef.current) {
      if (scorecardInstance.current) scorecardInstance.current.destroy();
      const ctx = scorecardChartRef.current.getContext('2d');
      scorecardInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['W1', 'W2', 'W3', 'W4', 'W5'],
          datasets: [
            { label: 'Target', data: [100, 100, 100, 100, 100], borderColor: isDark ? '#475569' : '#CBD5E1', borderDash: [5, 5], tension: 0, pointRadius: 0, borderWidth: 2 },
            { label: 'Aktual', data: [85, 95, 92, 105, 110], borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)', fill: true, tension: 0.3, pointBackgroundColor: '#10B981', pointRadius: 4, borderWidth: 2 }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: textColor, font: {family: 'Inter'} } },
            y: { grid: { color: gridColor }, ticks: { color: textColor, font: {family: 'Inter'} }, min: 50 }
          }
        }
      });
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const updateOwner = (id, owner) => {
    setTodos(todos.map(t => t.id === id ? { ...t, owner } : t));
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-aksana-dark transition-colors duration-300">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-white dark:bg-[#181C20] border-r border-slate-200 dark:border-slate-800 flex-shrink-0 flex flex-col transition-colors z-10">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <img 
            src={AksanaLogoImg} 
            alt="Aksana Logo" 
            className="w-8 h-8 rounded-lg object-contain"
          />
          <span className="font-semibold tracking-tight text-slate-900 dark:text-white text-lg">Aksana Hub</span>
        </div>
        
        <nav className="p-4 flex-grow space-y-2 overflow-y-auto">
          {navConfig.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`touch-target w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-sm font-medium transition-all text-left ${
                currentView === item.id 
                ? 'bg-aksana-primary text-white shadow-md shadow-aksana-primary/20' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="text-lg w-6 text-center">{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-lg">🏢</div>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate w-32">PT Makmur Sentosa</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Client Access</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="touch-target w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-xl transition-colors text-sm font-medium py-2"
          >
            🚪 Keluar
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow p-4 md:p-8 lg:p-10 overflow-y-auto h-screen relative w-full">
        
        {/* VIEW 1: EXECUTIVE DASHBOARD */}
        {currentView === 'client-dash' && (
          <div className="space-y-8 fade-enter pb-10">
            <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-aksana-primary dark:text-aksana-accent font-semibold mb-1 text-sm tracking-wide">PERFORMA BISNIS</p>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Executive Dashboard</h1>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-[#181C20] px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-sm">
                <span className="text-slate-500">Periode:</span>
                <select className="bg-transparent font-medium text-slate-900 dark:text-white outline-none cursor-pointer">
                  <option>Q3 2024 (Berjalan)</option>
                  <option>Q2 2024</option>
                </select>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Total Penjualan (MTD)', value: 'Rp 845.5M', delta: '↗ +12.5%', color: 'blue', icon: '💰', sub: 'vs Rp 750M bulan lalu' },
                { label: 'Total Traffic / Leads', value: '24,500', delta: '↗ +8.2%', color: 'purple', icon: '👥', sub: 'Pengunjung unik / Prospek' },
                { label: 'Tingkat Konversi', value: '3.45%', delta: '↘ -1.1%', color: 'amber', icon: '⚡', sub: 'Butuh optimasi funnel' }
              ].map((card, i) => (
                <div key={i} className="bg-white dark:bg-[#181C20] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-${card.color}-50 dark:bg-${card.color}-900/20 text-${card.color}-600 flex items-center justify-center text-xl`}>{card.icon}</div>
                    <span className={`inline-flex items-center gap-1 py-1 px-2.5 rounded-full text-xs font-medium ${card.delta.includes('↗') ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {card.delta}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{card.label}</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{card.value}</h3>
                    <p className="text-xs text-slate-400 mt-2">{card.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <section className="bg-white dark:bg-[#181C20] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Tren Penjualan & Traffic Bisnis</h2>
                  <p className="text-sm text-slate-500">Korelasi pengunjung dengan total pendapatan (6 Bulan Terakhir).</p>
                </div>
                <button className="touch-target px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-xl transition-colors">
                  📥 Export Laporan
                </button>
              </div>
              <div className="chart-container chart-large">
                <canvas ref={salesTrafficChartRef}></canvas>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <section className="bg-white dark:bg-[#181C20] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Scorecard (Aktual vs Target)</h2>
                  <span className="text-xs bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 py-1 px-3 rounded-full border border-green-200 dark:border-green-800/30 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Live Sync
                  </span>
                </div>
                <div className="chart-container" style={{ height: '220px' }}>
                  <canvas ref={scorecardChartRef}></canvas>
                </div>
              </section>

              <section className="bg-white dark:bg-[#181C20] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Progres 90-Day Rocks</h2>
                  <span className="text-xs bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 py-1 px-3 rounded-full border border-slate-200 dark:border-slate-700">Q3 Goals</span>
                </div>
                <div className="space-y-6 flex-grow">
                  {[
                    { label: 'Rilis Fitur Produk Baru', progress: 85, color: 'green' },
                    { label: 'Rekrutmen Tim Sales Regional', progress: 45, color: 'yellow' },
                    { label: 'Implementasi CRM Enterprise', progress: 20, color: 'blue' }
                  ].map((rock, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-slate-800 dark:text-slate-200">{rock.label}</span>
                        <span className={`font-bold text-${rock.color}-600 dark:text-${rock.color}-400`}>{rock.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                        <div className={`bg-${rock.color}-500 h-2.5 rounded-full transition-all duration-1000`} style={{ width: `${rock.progress}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {/* VIEW 2: L10 & TO-DO */}
        {currentView === 'client-todo' && (
          <div className="space-y-8 fade-enter pb-10">
            <header className="mb-8">
              <p className="text-aksana-primary dark:text-aksana-accent font-semibold mb-1 text-sm tracking-wide">AKSI & NOTULENSI</p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">L10 Meetings & To-Do</h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <section className="lg:col-span-1 bg-white dark:bg-[#181C20] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col min-h-[500px]">
                <h2 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Meeting Notes</h2>
                <p className="text-sm text-slate-500 mb-4">Arsip catatan rapat mingguan.</p>
                <textarea className="flex-grow w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 resize-none focus:ring-2 focus:ring-aksana-primary outline-none transition-all dark:text-white font-mono text-sm leading-relaxed" placeholder="Ketik catatan rapat Level 10 di sini..."></textarea>
                <button className="touch-target mt-4 w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-medium rounded-xl hover:opacity-90 transition-opacity py-3">
                  Simpan Catatan
                </button>
              </section>

              <section className="lg:col-span-2 bg-white dark:bg-[#181C20] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col min-h-[500px]">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">To-Do Tracker</h2>
                    <p className="text-sm text-slate-500 mt-1">Gunakan text-box untuk menetapkan PIC.</p>
                  </div>
                  <button className="text-aksana-primary dark:text-aksana-accent text-sm font-medium hover:underline flex items-center gap-1 touch-target px-2">
                    ➕ Tambah Tugas
                  </button>
                </div>
                
                <div className="flex-grow overflow-y-auto space-y-3 pr-2">
                  {todos.map((todo) => (
                    <div key={todo.id} className={`flex flex-col md:flex-row md:items-center gap-3 md:gap-4 p-4 rounded-xl border ${todo.completed ? 'bg-slate-50 border-transparent dark:bg-slate-900/30' : 'bg-white border-slate-200 dark:bg-[#181C20] dark:border-slate-700'} transition-all hover:shadow-sm`}>
                      <div className="flex items-center gap-3 flex-grow cursor-pointer" onClick={() => toggleTodo(todo.id)}>
                        <div className={`w-7 h-7 flex-shrink-0 rounded-lg border-2 flex items-center justify-center transition-colors ${todo.completed ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 dark:border-slate-600 text-transparent hover:border-aksana-primary'}`}>
                          {todo.completed ? '✓' : ''}
                        </div>
                        <span className={`text-sm select-none ${todo.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-50'}`}>{todo.text}</span>
                      </div>
                      <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                        <input 
                          type="text" 
                          placeholder="PIC..." 
                          value={todo.owner} 
                          onChange={(e) => updateOwner(todo.id, e.target.value)}
                          disabled={todo.completed}
                          className="touch-target flex-grow md:w-32 px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-aksana-primary outline-none transition-all dark:text-white" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {/* VIEW 3: DOCUMENTS */}
        {currentView === 'client-docs' && (
          <div className="space-y-8 fade-enter pb-10">
            <header className="mb-8">
              <p className="text-aksana-primary dark:text-aksana-accent font-semibold mb-1 text-sm tracking-wide">ARSIP DIGITAL</p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Document Center</h1>
            </header>

            <div className="bg-white dark:bg-[#181C20] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-2">
              {[
                { name: 'Laporan Kuartal 3 - 2024.pdf', date: '12 Okt 2024', size: '2.4 MB', icon: '📄', color: 'red' },
                { name: 'Presentasi Strategi Q4.pptx', date: '05 Okt 2024', size: '5.1 MB', icon: '📊', color: 'orange' }
              ].map((doc, i) => (
                <div key={i} className={`flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-2xl transition-colors ${i !== 0 ? 'border-t border-slate-100 dark:border-slate-800/50' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-${doc.color}-100 dark:bg-${doc.color}-900/30 text-${doc.color}-600 dark:text-${doc.color}-400 flex items-center justify-center text-2xl`}>{doc.icon}</div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-slate-50">{doc.name}</h3>
                      <p className="text-xs text-slate-500">{doc.date} • {doc.size}</p>
                    </div>
                  </div>
                  <button className="touch-target px-4 text-aksana-primary hover:bg-aksana-primary/10 rounded-xl transition-colors text-sm font-medium">Download</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ClientHub;
