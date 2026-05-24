/**
 * CareerForge Pro - Frontend Application
 * Complete React + Tailwind + Framer Motion Implementation
 * Production-Ready SaaS Resume Builder
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, LogOut, Settings, Plus, Upload, Download, Share2,
  CheckCircle, AlertCircle, Zap, Lock, Star, ChevronRight,
  FileText, Wand2, BarChart3, Eye, Edit, Trash2, Copy,
  Moon, Sun, CreditCard, Calendar, ArrowUp, TrendingUp
} from 'lucide-react';

// ==================== THEME & CONSTANTS ====================
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const STRIPE_PK = process.env.REACT_APP_STRIPE_PUBLIC_KEY;

// ==================== AUTHENTICATION CONTEXT ====================
const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('token');
        setToken(null);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    }
    return { success: false, error: data.message };
  };

  const register = async (email, password, name) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    }
    return { success: false, error: data.message };
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => React.useContext(AuthContext);

// ==================== NAVBAR COMPONENT ====================
const Navbar = ({ isDark, setIsDark }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-md border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">CF</span>
            </div>
            <span className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
              CareerForge Pro
            </span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {user ? (
              <>
                <a href="#dashboard" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  Dashboard
                </a>
                <a href="#builder" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  Builder
                </a>
                <a href="#analyzer" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  Analyzer
                </a>
              </>
            ) : null}
            
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-lg ${isDark ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {user.email}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <a href="#login" className={`px-4 py-2 rounded-lg ${isDark ? 'text-white hover:bg-gray-800' : 'text-gray-900 hover:bg-gray-100'}`}>
                  Login
                </a>
                <a href="#register" className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transition-shadow">
                  Sign Up
                </a>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              className={`mt-4 pt-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'} md:hidden`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="space-y-3">
                {user && (
                  <>
                    <a href="#dashboard" className="block py-2">Dashboard</a>
                    <a href="#builder" className="block py-2">Builder</a>
                    <a href="#analyzer" className="block py-2">Analyzer</a>
                  </>
                )}
                {!user && (
                  <>
                    <a href="#login" className="block py-2">Login</a>
                    <a href="#register" className="block py-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white">Sign Up</a>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

// ==================== LANDING PAGE ====================
const LandingPage = ({ isDark }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'} pt-20`}>
      {/* Hero Section */}
      <motion.section 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center" variants={itemVariants}>
          <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Your Resume,
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"> Supercharged</span>
          </h1>
          <p className={`text-xl md:text-2xl mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-3xl mx-auto`}>
            Build ATS-optimized resumes with AI-powered rewriting, real-time analysis, and stunning templates. Land more interviews.
          </p>
        </motion.div>

        <motion.div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-16" variants={itemVariants}>
          <a href="#register" className="px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-xl transition-all transform hover:scale-105">
            Start Free Trial
          </a>
          <a href="#pricing" className={`px-8 py-4 rounded-lg border-2 ${isDark ? 'border-gray-700 text-white hover:bg-gray-800' : 'border-gray-300 text-gray-900 hover:bg-gray-100'} font-semibold transition-all`}>
            View Pricing
          </a>
        </motion.div>

        {/* Feature Grid */}
        <motion.div className="grid md:grid-cols-3 gap-6 mb-20" variants={itemVariants}>
          {[
            { icon: <BarChart3 size={32} />, title: 'ATS Score Analysis', desc: 'Real-time ATS scoring and keyword optimization' },
            { icon: <Wand2 size={32} />, title: 'AI Rewriter', desc: 'Professional bullet points optimized for impact' },
            { icon: <FileText size={32} />, title: 'Premium Templates', desc: 'Modern, minimal, corporate, and developer designs' },
          ].map((feature, i) => (
            <motion.div 
              key={i} 
              className={`p-8 rounded-xl ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}
              whileHover={{ y: -10, boxShadow: '0 20px 25px rgba(0,0,0,0.1)' }}
            >
              <div className="text-blue-500 mb-4">{feature.icon}</div>
              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {feature.title}
              </h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className={`${isDark ? 'bg-gray-800' : 'bg-gray-100'} py-20`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: '50K+', label: 'Resumes Built' },
              { number: '95%', label: 'Interview Rate Increase' },
              { number: '4.9/5', label: 'User Rating' },
              { number: '24/7', label: 'AI Support' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

// ==================== LOGIN PAGE ====================
const LoginPage = ({ isDark, setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    if (result.success) {
      setCurrentPage('dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <motion.div 
      className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'} flex items-center justify-center pt-20`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className={`w-full max-w-md p-8 rounded-xl ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-xl`}
        initial={{ y: 20 }}
        animate={{ y: 0 }}
      >
        <h2 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Welcome Back
        </h2>

        {error && (
          <motion.div className="mb-4 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-500 flex items-start gap-3">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className={`mt-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Don't have an account?{' '}
          <button onClick={() => setCurrentPage('register')} className="text-blue-500 hover:text-blue-600 font-semibold">
            Sign up
          </button>
        </p>
      </motion.div>
    </motion.div>
  );
};

// ==================== REGISTER PAGE ====================
const RegisterPage = ({ isDark, setCurrentPage }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await register(email, password, name);
    if (result.success) {
      setCurrentPage('dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <motion.div 
      className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'} flex items-center justify-center pt-20`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div 
        className={`w-full max-w-md p-8 rounded-xl ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-xl`}
        initial={{ y: 20 }}
        animate={{ y: 0 }}
      >
        <h2 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Create Account
        </h2>

        {error && (
          <motion.div className="mb-4 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-500 flex items-start gap-3">
            <AlertCircle size={20} />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className={`mt-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Already have an account?{' '}
          <button onClick={() => setCurrentPage('login')} className="text-blue-500 hover:text-blue-600 font-semibold">
            Sign in
          </button>
        </p>
      </motion.div>
    </motion.div>
  );
};

// ==================== DASHBOARD PAGE ====================
const DashboardPage = ({ isDark, setCurrentPage }) => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalResumes: 0,
    avgATSScore: 0,
    lastUpdated: null,
  });

  useEffect(() => {
    fetchResumes();
    fetchStats();
  }, []);

  const fetchResumes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/resumes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setResumes(data.resumes || []);
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setStats(data.stats || {});
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} pt-24`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage your resumes and track your progress toward landing your dream job.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Total Resumes', value: stats.totalResumes, icon: <FileText /> },
            { label: 'Avg ATS Score', value: stats.avgATSScore?.toFixed(1) || '0', icon: <BarChart3 /> },
            { label: 'Last Updated', value: stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleDateString() : 'Never', icon: <Calendar /> },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              className={`p-6 rounded-xl ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.label}
                  </p>
                  <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'} text-blue-500`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Resumes Section */}
        <motion.div 
          className={`${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} rounded-xl p-8`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              My Resumes
            </h2>
            <button 
              onClick={() => setCurrentPage('builder')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transition-all"
            >
              <Plus size={20} />
              New Resume
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : resumes.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {resumes.map((resume) => (
                <motion.div
                  key={resume._id}
                  className={`p-6 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'} border ${isDark ? 'border-gray-600' : 'border-gray-200'} hover:shadow-lg transition-all`}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {resume.title}
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Created {new Date(resume.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {resume.atsScore && (
                      <div className="flex items-center gap-2 bg-green-500/20 text-green-500 px-3 py-1 rounded-full">
                        <CheckCircle size={16} />
                        <span className="font-semibold">{resume.atsScore}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 rounded-lg bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                      <Edit size={16} />
                      Edit
                    </button>
                    <button className="flex-1 px-3 py-2 rounded-lg bg-purple-500/20 text-purple-500 hover:bg-purple-500/30 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                      <Download size={16} />
                      Download
                    </button>
                    <button className="px-3 py-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                No resumes yet. Create your first resume to get started!
              </p>
              <button 
                onClick={() => setCurrentPage('builder')}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold"
              >
                Create Resume
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// ==================== RESUME BUILDER PAGE ====================
const ResumeBuilderPage = ({ isDark }) => {
  const [template, setTemplate] = useState('modern');
  const [resumeData, setResumeData] = useState({
    title: 'My Resume',
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
    },
    experience: [],
    education: [],
    skills: [],
  });

  const templates = [
    { id: 'modern', name: 'Modern', color: 'from-blue-500 to-purple-600' },
    { id: 'minimal', name: 'Minimal', color: 'from-gray-400 to-gray-600' },
    { id: 'corporate', name: 'Corporate', color: 'from-slate-500 to-slate-700' },
    { id: 'developer', name: 'Developer', color: 'from-green-500 to-emerald-600' },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} pt-24`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className={`text-4xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Resume Builder
          </h1>

          {/* Template Selection */}
          <div className="mb-12">
            <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Choose Template
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {templates.map((t) => (
                <motion.button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    template === t.id
                      ? `border-blue-500 ${isDark ? 'bg-gray-800' : 'bg-white'} ring-2 ring-blue-500`
                      : `border-gray-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`
                  }`}
                  whileHover={{ y: -5 }}
                >
                  <div className={`w-full h-32 rounded-lg bg-gradient-to-br ${t.color} mb-4`}></div>
                  <p className={`font-semibold text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {t.name}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Builder Form */}
          <motion.div 
            className={`${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} rounded-xl p-8`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Personal Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {['fullName', 'email', 'phone', 'location'].map((field) => (
                <div key={field}>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type="text"
                    value={resumeData.personalInfo[field] || ''}
                    onChange={(e) =>
                      setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, [field]: e.target.value },
                      })
                    }
                    className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
              ))}
            </div>

            <div className="mb-8">
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Professional Summary
              </label>
              <textarea
                value={resumeData.personalInfo.summary || ''}
                onChange={(e) =>
                  setResumeData({
                    ...resumeData,
                    personalInfo: { ...resumeData.personalInfo, summary: e.target.value },
                  })
                }
                className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 h-24`}
                placeholder="Brief professional summary..."
              />
            </div>

            <div className="flex gap-4">
              <button className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-lg transition-all">
                Save Resume
              </button>
              <button className={`flex-1 px-6 py-3 rounded-lg border-2 ${isDark ? 'border-gray-600 text-white hover:bg-gray-700' : 'border-gray-300 text-gray-900 hover:bg-gray-50'} font-semibold transition-all`}>
                Preview PDF
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

// ==================== ATS ANALYZER PAGE ====================
const ATSAnalyzerPage = ({ isDark }) => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const handleAnalyze = async () => {
    if (!file || !jobDescription) {
      alert('Please upload a resume and enter a job description');
      return;
    }

    setAnalyzing(true);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/analyze/ats`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} pt-24`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className={`text-4xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            ATS Resume Analyzer
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <motion.div 
              className={`${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} rounded-xl p-8`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Upload & Analyze
              </h2>

              {/* File Upload */}
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Upload Resume (PDF or DOCX)
                </label>
                <motion.div
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDark ? 'border-gray-600 hover:border-blue-500 hover:bg-gray-700' : 'border-gray-300 hover:border-blue-500 hover:bg-gray-50'}`}
                  whileHover={{ scale: 1.02 }}
                >
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <Upload size={32} className={`mx-auto mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    <p className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {file ? file.name : 'Click to upload your resume'}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      or drag and drop
                    </p>
                  </label>
                </motion.div>
              </div>

              {/* Job Description */}
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  className={`w-full h-48 px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {analyzing ? 'Analyzing...' : 'Analyze Resume'}
              </button>
            </motion.div>

            {/* Results Section */}
            <motion.div 
              className={`${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} rounded-xl p-8`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Analysis Results
              </h2>

              {results ? (
                <div className="space-y-6">
                  {/* ATS Score */}
                  <div className="text-center">
                    <p className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      ATS Score
                    </p>
                    <motion.div 
                      className="text-6xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.6, type: 'spring' }}
                    >
                      {results.atsScore}%
                    </motion.div>
                    <motion.div 
                      className="mt-4 h-2 bg-gray-300 rounded-full overflow-hidden"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                    >
                      <motion.div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${results.atsScore}%` }}
                        transition={{ duration: 1 }}
                      />
                    </motion.div>
                  </div>

                  {/* Missing Keywords */}
                  <div>
                    <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      <AlertCircle size={20} className="text-yellow-500" />
                      Missing Keywords
                    </h3>
                    <div className="space-y-2">
                      {results.missingKeywords?.slice(0, 5).map((keyword, i) => (
                        <motion.div
                          key={i}
                          className={`px-4 py-2 rounded-lg ${isDark ? 'bg-yellow-500/10 text-yellow-500' : 'bg-yellow-50 text-yellow-700'} text-sm font-medium`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          {keyword}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div>
                    <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      <Zap size={20} className="text-blue-500" />
                      Suggestions
                    </h3>
                    <div className="space-y-2">
                      {results.suggestions?.slice(0, 3).map((suggestion, i) => (
                        <motion.div
                          key={i}
                          className={`px-4 py-2 rounded-lg ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-700'} text-sm`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          {suggestion}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Upload a resume to get started with ATS analysis
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ==================== PRICING PAGE ====================
const PricingPage = ({ isDark }) => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for getting started',
      features: [
        '1 Resume',
        'Basic ATS Scan',
        'Standard Templates',
        'Email Support',
        'Community Access',
      ],
      button: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      description: 'Most popular for job seekers',
      features: [
        'Unlimited Resumes',
        'Advanced ATS Analysis',
        'Premium Templates',
        'AI Resume Rewriter',
        'Cover Letter Generator',
        'Priority Support',
        'Skill Suggestions',
      ],
      button: 'Start Free Trial',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For teams and organizations',
      features: [
        'Everything in Pro',
        'Team Management',
        'Advanced Analytics',
        'API Access',
        'Custom Integrations',
        'Dedicated Support',
        'White Label Options',
      ],
      button: 'Contact Sales',
      highlighted: false,
    },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} pt-24 pb-20`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Simple, Transparent Pricing
          </h1>
          <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Choose the perfect plan for your career goals
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              className={`relative rounded-2xl overflow-hidden ${
                plan.highlighted
                  ? isDark
                    ? 'bg-gradient-to-br from-blue-600 to-purple-700 border-0'
                    : 'bg-gradient-to-br from-blue-500 to-purple-600 border-0'
                  : isDark
                  ? 'bg-gray-800 border border-gray-700'
                  : 'bg-white border border-gray-200'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 to-pink-500 text-center text-sm font-bold text-white py-2">
                  MOST POPULAR
                </div>
              )}

              <div className={`p-8 ${plan.highlighted ? 'text-white pt-16' : ''}`}>
                <h3 className={`text-2xl font-bold mb-2 ${!plan.highlighted && isDark ? 'text-white' : ''}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.highlighted ? 'text-blue-100' : isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {plan.description}
                </p>

                <div className="mb-6">
                  <span className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : isDark ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={`${plan.highlighted ? 'text-blue-100' : isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {plan.period}
                    </span>
                  )}
                </div>

                <button
                  className={`w-full py-3 rounded-lg font-semibold mb-8 transition-all ${
                    plan.highlighted
                      ? 'bg-white text-blue-600 hover:bg-gray-100'
                      : isDark
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {plan.button}
                </button>

                <ul className="space-y-3">
                  {plan.features.map((feature, j) => (
                    <motion.li
                      key={j}
                      className={`flex items-center gap-3 ${plan.highlighted ? 'text-white' : isDark ? 'text-gray-300' : 'text-gray-700'}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: j * 0.05 }}
                    >
                      <CheckCircle size={20} className={`flex-shrink-0 ${plan.highlighted ? 'text-blue-100' : 'text-green-500'}`} />
                      <span className="text-sm">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div 
          className="mt-20 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className={`text-3xl font-bold text-center mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              { q: 'Can I cancel anytime?', a: 'Yes, cancel your subscription anytime without penalties.' },
              { q: 'Is there a free trial?', a: 'Yes! Get 14 days free with Pro plan, no credit card required.' },
              { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, Apple Pay, and Google Pay.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <h3 className={`font-bold mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <ChevronRight size={20} />
                  {item.q}
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {item.a}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ==================== MAIN APP COMPONENT ====================
export default function CareerForgeApp() {
  const [isDark, setIsDark] = useState(true);
  const [currentPage, setCurrentPage] = useState('landing');
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Auto-redirect to dashboard if logged in
  React.useEffect(() => {
    if (user && currentPage === 'landing') {
      setCurrentPage('dashboard');
    }
  }, [user, currentPage]);

  return (
    <div className={`${isDark ? 'dark' : 'light'}`}>
      <AuthProvider>
        <Navbar isDark={isDark} setIsDark={setIsDark} />
        
        <AnimatePresence mode="wait">
          {currentPage === 'landing' && !user && (
            <LandingPage key="landing" isDark={isDark} />
          )}
          {currentPage === 'login' && !user && (
            <LoginPage key="login" isDark={isDark} setCurrentPage={setCurrentPage} />
          )}
          {currentPage === 'register' && !user && (
            <RegisterPage key="register" isDark={isDark} setCurrentPage={setCurrentPage} />
          )}
          {currentPage === 'dashboard' && user && (
            <DashboardPage key="dashboard" isDark={isDark} setCurrentPage={setCurrentPage} />
          )}
          {currentPage === 'builder' && user && (
            <ResumeBuilderPage key="builder" isDark={isDark} />
          )}
          {currentPage === 'analyzer' && user && (
            <ATSAnalyzerPage key="analyzer" isDark={isDark} />
          )}
          {currentPage === 'pricing' && (
            <PricingPage key="pricing" isDark={isDark} />
          )}
        </AnimatePresence>
      </AuthProvider>
    </div>
  );
}