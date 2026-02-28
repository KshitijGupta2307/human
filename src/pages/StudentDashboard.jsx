import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  LogOut, 
  CheckCircle2, 
  Circle, 
  Clock,
  FileText,
  ExternalLink,
  Zap,
  Cog,
  Users as UsersIcon,
  TrendingUp,
  Award,
  BookOpen,
  Mail,
  Phone,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { signOut } from '../firebase/auth';
import { useNavigate } from 'react-router-dom';
import { 
  getNotesBySection, 
  getStudentProgress, 
  trackProgress 
} from '../firebase/firestore';

const SECTIONS = [
  { id: 'electrical', name: 'Electrical', icon: Zap, color: 'from-yellow-400 to-orange-500', bg: 'bg-gradient-to-br from-yellow-400 to-orange-500' },
  { id: 'mechanical', name: 'Mechanical', icon: Cog, color: 'from-blue-400 to-cyan-500', bg: 'bg-gradient-to-br from-blue-400 to-cyan-500' },
  { id: 'operator', name: 'Computer Operator', icon: UsersIcon, color: 'from-green-400 to-emerald-500', bg: 'bg-gradient-to-br from-green-400 to-emerald-500' }
];

const STATUS_OPTIONS = [
  { value: 'not-started', label: 'Not Started', icon: Circle, color: 'text-gray-400' },
  { value: 'in-progress', label: 'In Progress', icon: Clock, color: 'text-yellow-500' },
  { value: 'completed', label: 'Completed', icon: CheckCircle2, color: 'text-green-500' }
];

const StudentDashboard = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState(userProfile?.section || 'electrical');
  const [notes, setNotes] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (userProfile?.section) {
      setSelectedSection(userProfile.section);
    }
  }, [userProfile]);

  useEffect(() => {
    loadNotes();
  }, [selectedSection]);

  useEffect(() => {
    loadProgress();
  }, [user]);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const notesData = await getNotesBySection(selectedSection);
      setNotes(notesData);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
    setLoading(false);
  };

  const loadProgress = async () => {
    if (!user) return;
    try {
      const progressData = await getStudentProgress(user.uid);
      setProgress(progressData);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const handleStatusChange = async (noteId, newStatus) => {
    try {
      await trackProgress(user.uid, noteId, newStatus);
      await loadProgress();
    } catch (error) {
      console.error('Error updating progress:', error);
      alert('Failed to update progress. Please try again.');
    }
  };

  const getNoteProgress = (noteId) => {
    const noteProgress = progress.find(p => p.noteId === noteId);
    return noteProgress?.status || 'not-started';
  };

  const getProgressStats = () => {
    const totalNotes = notes.length;
    const completed = notes.filter(note => getNoteProgress(note.id) === 'completed').length;
    const inProgress = notes.filter(note => getNoteProgress(note.id) === 'in-progress').length;
    const notStarted = totalNotes - completed - inProgress;
    const completionRate = totalNotes > 0 ? Math.round((completed / totalNotes) * 100) : 0;
    return { totalNotes, completed, inProgress, notStarted, completionRate };
  };

  const stats = getProgressStats();
  const currentSection = SECTIONS.find(s => s.id === selectedSection);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Sticky Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 sm:h-7 sm:w-7 text-primary-600 flex-shrink-0" />
              <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent truncate">
                CogMech Analytics
              </span>
            </div>

            {/* Desktop user area */}
            <div className="hidden sm:flex items-center gap-3">
              <img
                src={user?.photoURL}
                alt={user?.displayName}
                className="w-9 h-9 rounded-full border-2 border-primary-400"
              />
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-800 leading-tight">{user?.displayName}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSignOut}
                className="ml-2 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1.5 text-sm font-medium"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </motion.button>
            </div>

            {/* Mobile header actions */}
            <div className="flex sm:hidden items-center gap-2">
              <img
                src={user?.photoURL}
                alt={user?.displayName}
                className="w-8 h-8 rounded-full border-2 border-primary-400"
              />
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1.5 rounded-lg hover:bg-gray-100">
                {mobileMenuOpen ? <X className="h-5 w-5 text-gray-600" /> : <Menu className="h-5 w-5 text-gray-600" />}
              </button>
            </div>
          </div>

          {/* Mobile dropdown menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="sm:hidden overflow-hidden border-t border-gray-100"
              >
                <div className="py-3 space-y-2">
                  <div className="text-sm font-semibold text-gray-800">{user?.displayName}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                  <button
                    onClick={handleSignOut}
                    className="w-full mt-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-8 text-white"
        >
          <h1 className="text-xl sm:text-3xl font-bold mb-1">Welcome back, {user?.displayName?.split(' ')[0]}! 👋</h1>
          <p className="text-primary-100 text-sm sm:text-base">Track your learning progress and access course materials</p>
        </motion.div>

        {/* Progress Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { icon: BookOpen, value: stats.totalNotes, label: 'Total Notes', iconColor: 'text-primary-500', valueColor: 'text-primary-600' },
            { icon: CheckCircle2, value: stats.completed, label: 'Completed', iconColor: 'text-green-500', valueColor: 'text-green-600' },
            { icon: Clock, value: stats.inProgress, label: 'In Progress', iconColor: 'text-yellow-500', valueColor: 'text-yellow-600' },
            { icon: Award, value: `${stats.completionRate}%`, label: 'Completion', iconColor: 'text-purple-500', valueColor: 'text-purple-600', hasBar: true }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-5"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <stat.icon className={`h-7 w-7 sm:h-9 sm:w-9 ${stat.iconColor}`} />
                <p className={`text-xl sm:text-3xl font-bold ${stat.valueColor}`}>{stat.value}</p>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">{stat.label}</p>
              {stat.hasBar && (
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.completionRate}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="bg-gradient-to-r from-primary-500 to-purple-500 h-1.5 rounded-full"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Section Selector - 3 columns always visible on mobile */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
          <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3">Select Section</h2>
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {SECTIONS.map((section, index) => {
              const isSelected = selectedSection === section.id;
              return (
                <motion.button
                  key={section.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedSection(section.id)}
                  className={`relative p-3 sm:p-5 rounded-xl transition-all text-center ${
                    isSelected
                      ? `${section.bg} text-white shadow-lg`
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <section.icon className={`h-6 w-6 sm:h-9 sm:w-9 mx-auto mb-1 sm:mb-2 ${isSelected ? 'text-white' : 'text-gray-500'}`} />
                  <h3 className="font-semibold text-[11px] sm:text-base leading-tight">{section.name}</h3>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Notes List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <h2 className="text-base sm:text-xl font-bold text-gray-800 flex items-center gap-2">
              {currentSection && <currentSection.icon className="h-5 w-5 sm:h-6 sm:w-6" />}
              <span className="truncate">{currentSection?.name} Notes</span>
            </h2>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 flex-shrink-0">
              <TrendingUp className="h-4 w-4" />
              <span>{notes.length} resources</span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-3 border-b-3 border-primary-600"></div>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No notes available for this section yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {notes.map((note, index) => {
                  const noteStatus = getNoteProgress(note.id);
                  const statusOption = STATUS_OPTIONS.find(s => s.value === noteStatus);
                  const StatusIcon = statusOption.icon;

                  return (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: index * 0.03 }}
                      className="rounded-xl p-3 sm:p-5 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all bg-white"
                    >
                      <div className="flex items-start gap-3">
                        {/* Status icon - desktop only */}
                        <div className="hidden sm:flex items-center pt-1">
                          <StatusIcon className={`h-7 w-7 ${statusOption.color}`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5">
                            <h3 className="text-sm sm:text-base font-bold text-gray-800 break-words">{note.title}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold ${
                              note.type === 'pdf' 
                                ? 'bg-red-100 text-red-700' 
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {note.type.toUpperCase()}
                            </span>
                            {/* Mobile status icon inline */}
                            <StatusIcon className={`sm:hidden h-4 w-4 ${statusOption.color} ml-auto`} />
                          </div>

                          {note.description && (
                            <p className="text-xs sm:text-sm text-gray-500 mb-3 line-clamp-2">{note.description}</p>
                          )}

                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                            <a
                              href={note.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 sm:py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-md transition-shadow text-xs sm:text-sm"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              Open {note.type === 'pdf' ? 'PDF' : 'Link'}
                            </a>

                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500 font-medium">Status:</span>
                              <select
                                value={noteStatus}
                                onChange={(e) => handleStatusChange(note.id, e.target.value)}
                                className={`flex-1 sm:flex-none px-2 py-1.5 rounded-lg border-2 font-semibold text-xs transition-all cursor-pointer ${
                                  noteStatus === 'completed' 
                                    ? 'border-green-400 bg-green-50 text-green-700'
                                    : noteStatus === 'in-progress'
                                    ? 'border-yellow-400 bg-yellow-50 text-yellow-700'
                                    : 'border-gray-200 bg-gray-50 text-gray-600'
                                }`}
                              >
                                {STATUS_OPTIONS.map(option => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Completion Celebration */}
        {stats.completionRate === 100 && notes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl shadow-lg p-6 sm:p-8 text-white text-center"
          >
            <Award className="h-12 w-12 mx-auto mb-3" />
            <h2 className="text-xl sm:text-2xl font-bold mb-1">🎉 Congratulations! 🎉</h2>
            <p className="text-sm sm:text-base">You've completed all notes in the {currentSection?.name} section!</p>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-gray-200">
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

export default StudentDashboard;
