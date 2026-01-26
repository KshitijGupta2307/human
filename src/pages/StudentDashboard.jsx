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
  Mail
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
  { id: 'electrical', name: 'Electrical', icon: Zap, color: 'from-yellow-400 to-orange-500' },
  { id: 'mechanical', name: 'Mechanical', icon: Cog, color: 'from-blue-400 to-cyan-500' },
  { id: 'operator', name: 'Operator', icon: UsersIcon, color: 'from-green-400 to-emerald-500' }
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
      console.log('Loading notes for section:', selectedSection);
      const notesData = await getNotesBySection(selectedSection);
      console.log('Notes loaded:', notesData);
      setNotes(notesData);
    } catch (error) {
      console.error('Error loading notes:', error);
      alert('Error loading notes: ' + error.message);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                CogMech Analytics
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={user?.photoURL}
                  alt={user?.displayName}
                  className="w-10 h-10 rounded-full border-2 border-primary-500"
                />
                <div>
                  <div className="font-semibold text-gray-800">{user?.displayName}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white"
        >
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.displayName?.split(' ')[0]}! 👋</h1>
          <p className="text-primary-100">Track your learning progress and access course materials</p>
        </motion.div>

        {/* Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="h-10 w-10 text-primary-500" />
              <div className="text-right">
                <p className="text-3xl font-bold text-primary-600">{stats.totalNotes}</p>
                <p className="text-sm text-gray-600">Total Notes</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
              <div className="text-right">
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Clock className="h-10 w-10 text-yellow-500" />
              <div className="text-right">
                <p className="text-3xl font-bold text-yellow-600">{stats.inProgress}</p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Award className="h-10 w-10 text-purple-500" />
              <div className="text-right">
                <p className="text-3xl font-bold text-purple-600">{stats.completionRate}%</p>
                <p className="text-sm text-gray-600">Completion Rate</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.completionRate}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full"
              />
            </div>
          </motion.div>
        </div>

        {/* Section Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Select Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SECTIONS.map((section, index) => (
              <motion.button
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedSection(section.id)}
                className={`p-6 rounded-xl transition-all ${
                  selectedSection === section.id
                    ? `bg-gradient-to-br ${section.color} text-white shadow-lg`
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <section.icon className="h-10 w-10 mb-3 mx-auto" />
                <h3 className="font-bold text-lg">{section.name}</h3>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Notes List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              {currentSection && <currentSection.icon className="h-7 w-7" />}
              {currentSection?.name} Notes
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp className="h-5 w-5" />
              <span>{notes.length} resources available</span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-600"></div>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No notes available for this section yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {notes.map((note, index) => {
                  const noteStatus = getNoteProgress(note.id);
                  const statusOption = STATUS_OPTIONS.find(s => s.value === noteStatus);
                  const StatusIcon = statusOption.icon;

                  return (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <FileText className="h-6 w-6 text-primary-600" />
                            <h3 className="text-lg font-bold text-gray-800">{note.title}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              note.type === 'pdf' 
                                ? 'bg-red-100 text-red-700' 
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {note.type.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-4">{note.description}</p>
                          
                          <div className="flex items-center gap-4">
                            <a
                              href={note.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Open {note.type === 'pdf' ? 'PDF' : 'Link'}
                            </a>

                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600 font-medium">Status:</span>
                              <select
                                value={noteStatus}
                                onChange={(e) => handleStatusChange(note.id, e.target.value)}
                                className={`px-3 py-2 rounded-lg border-2 font-semibold text-sm transition-all cursor-pointer ${
                                  noteStatus === 'completed' 
                                    ? 'border-green-500 bg-green-50 text-green-700'
                                    : noteStatus === 'in-progress'
                                    ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                                    : 'border-gray-300 bg-gray-50 text-gray-700'
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

                        <div className="ml-4">
                          <StatusIcon className={`h-8 w-8 ${statusOption.color}`} />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Motivational Footer */}
        {stats.completionRate === 100 && notes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl shadow-xl p-8 text-white text-center"
          >
            <Award className="h-16 w-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">🎉 Congratulations! 🎉</h2>
            <p className="text-lg">You've completed all notes in the {currentSection?.name} section!</p>
          </motion.div>
        )}

        {/* Footer - Contact Section */}
        <footer className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <Brain className="h-5 w-5 text-primary-600" />
              <span className="ml-2 text-sm font-semibold text-gray-800">
                CogMech Analytics
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="h-4 w-4" />
              <span className="text-sm">Need help?</span>
              <a 
                href="mailto:guptakshitij266@gmail.com" 
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors text-sm"
              >
                guptakshitij266@gmail.com
              </a>
            </div>
            
            <div className="text-xs text-gray-500 mt-4 md:mt-0">
              © {new Date().getFullYear()} All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default StudentDashboard;
