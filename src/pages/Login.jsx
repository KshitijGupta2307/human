import { motion } from 'framer-motion';
import { Brain, BookOpen, TrendingUp, Users, Mail, Phone } from 'lucide-react';
import { signInWithGoogle } from '../firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Failed to sign in. Please try again.');
    }
  };

  const features = [
    { icon: BookOpen, title: 'Organized Learning', description: 'Access notes and resources organized by sections' },
    { icon: TrendingUp, title: 'Track Progress', description: 'Monitor your learning journey and achievements' },
    { icon: Users, title: 'Collaborative', description: 'Learn together with peers in your section' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center">
            <Brain className="h-6 w-6 sm:h-7 sm:w-7 text-primary-600" />
            <span className="ml-2 text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              CogMech Analytics
            </span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 w-full">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-5 leading-tight">
                Master Your Learning Journey
              </h1>
              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                A comprehensive platform designed to track and enhance student progress
                across Electrical, Mechanical, and Computer Operator sections.
              </p>

              <motion.button
                onClick={handleGoogleSignIn}
                className="group relative inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-gray-200 rounded-xl shadow-md hover:shadow-xl hover:border-gray-300 transition-all duration-300 w-full sm:w-auto justify-center sm:justify-start"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="text-gray-700 font-semibold text-base sm:text-lg">
                  Sign in with Google
                </span>
              </motion.button>

              <p className="mt-3 text-xs sm:text-sm text-gray-400">
                Stay logged in until you choose to sign out
              </p>
            </motion.div>

            {/* Right - Features */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="space-y-4"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + index * 0.1 }}
                  className="bg-white rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg p-2.5 flex-shrink-0">
                      <feature.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 sm:mt-16 grid grid-cols-3 gap-4 sm:gap-8"
          >
            {[
              { label: 'Sections', value: '3+' },
              { label: 'Resources', value: 'Unlimited' },
              { label: 'Tracking', value: 'Real-time' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary-600" />
              <span className="text-sm font-semibold text-gray-700">CogMech Analytics</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-gray-500">
              <a href="mailto:guptakshitij266@gmail.com" className="flex items-center gap-1 hover:text-primary-600 transition-colors">
                <Mail className="h-3.5 w-3.5" />
                guptakshitij266@gmail.com
              </a>
              <a href="tel:8679930799" className="flex items-center gap-1 hover:text-primary-600 transition-colors">
                <Phone className="h-3.5 w-3.5" />
                8679930799
              </a>
            </div>

            <div className="text-xs text-gray-400">
              © {new Date().getFullYear()} All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
