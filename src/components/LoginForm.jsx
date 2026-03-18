import React, { useState } from 'react';

const LoginForm = ({ onBack, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
    // Simulate successful login for now
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 relative">
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-aksana-primary transition-colors font-semibold"
      >
        <i className="fa-solid fa-arrow-left"></i> Kembali ke Beranda
      </button>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 dark:border-slate-700 transition-all">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Masuk ke Aksana</h2>
          <p className="text-slate-500 dark:text-slate-400">Silakan login untuk mengakses Workspace & Tools.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email</label>
            <input 
              required
              type="email" 
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full min-h-[44px] rounded-xl px-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-aksana-primary dark:focus:ring-aksana-accent text-slate-900 dark:text-white transition-all"
            />
          </div>

          <div className="flex flex-col gap-2 relative">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
            </div>
            <input 
              required
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full min-h-[44px] rounded-xl px-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-aksana-primary dark:focus:ring-aksana-accent text-slate-900 dark:text-white transition-all"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-aksana-primary text-white font-bold py-3 rounded-xl hover:bg-opacity-90 transition-all active:scale-95 shadow-lg shadow-aksana-primary/20 flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-right-to-bracket"></i> Masuk Sekarang
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          Mengalami kendala saat login? <br/>
          <span className="font-medium text-slate-700 dark:text-slate-300">Silakan hubungi Manajer Akun Anda.</span>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
