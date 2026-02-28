import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Link as LinkIcon, 
  Zap, 
  Cog, 
  Users as UsersIcon,
  FileText,
  LogOut,
  Brain,
  BarChart3,
  Plus,
  X,
  Trash2,
  Mail,
  Phone,
  Menu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { signOut } from '../firebase/auth';
import { useNavigate } from 'react-router-dom';
import { 
  uploadNote, 
  uploadPDF, 
  getAllNotes, 
  deleteNote,
  getAllUsers,
  getAllProgress,
  updateUserProfile
} from '../firebase/firestore';

const SECTIONS = [
  { id: 'electrical', name: 'Electrical', icon: Zap, color: 'from-yellow-400 to-orange-500', bg: 'bg-gradient-to-br from-yellow-400 to-orange-500' },
  { id: 'mechanical', name: 'Mechanical', icon: Cog, color: 'from-blue-400 to-cyan-500', bg: 'bg-gradient-to-br from-blue-400 to-cyan-500' },
  { id: 'operator', name: 'Computer Operator', icon: UsersIcon, color: 'from-green-400 to-emerald-500', bg: 'bg-gradient-to-br from-green-400 to-emerald-500' }
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upload');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [notes, setNotes] = useState([]);
  const [users, setUsers] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterSection, setFilterSection] = useState('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Upload form state
  const [noteType, setNoteType] = useState('pdf');
  const [selectedSection, setSelectedSection] = useState('electrical');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDescription, setNoteDescription] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [linkUrl, setLinkUrl] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [notesData, usersData, progressData] = await Promise.all([
        getAllNotes(),
        getAllUsers(),
        getAllProgress()
      ]);
      setNotes(notesData);
      setUsers(usersData);
      setProgress(progressData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const handleUploadNote = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let noteData = {
        title: noteTitle,
        description: noteDescription,
        section: selectedSection,
        type: noteType,
        uploadedBy: user.uid,
        uploaderName: user.displayName
      };

      if (noteType === 'pdf' && pdfFile) {
        const { url, fileName, storagePath } = await uploadPDF(pdfFile, selectedSection);
        noteData.url = url;
        noteData.fileName = fileName;
        noteData.storagePath = storagePath;
      } else if (noteType === 'link') {
        noteData.url = linkUrl;
      }

      await uploadNote(noteData);
      setNoteTitle('');
      setNoteDescription('');
      setPdfFile(null);
      setLinkUrl('');
      setShowUploadModal(false);
      await loadData();
      alert('Note uploaded successfully!');
    } catch (error) {
      console.error('Error uploading note:', error);
      alert('Failed to upload note. Please try again.');
    }
    setLoading(false);
  };

  const handleDeleteNote = async (noteId, storagePath) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    try {
      await deleteNote(noteId, storagePath);
      await loadData();
      alert('Note deleted successfully!');
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note.');
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await updateUserProfile(userId, { role: newRole });
      await loadData();
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role.');
    }
  };

  const handleUpdateUserSection = async (userId, newSection) => {
    try {
      await updateUserProfile(userId, { section: newSection });
      await loadData();
    } catch (error) {
      console.error('Error updating user section:', error);
      alert('Failed to update user section.');
    }
  };

  const getProgressStats = () => {
    const stats = { total: notes.length, bySection: {} };
    SECTIONS.forEach(section => {
      const sectionNotes = notes.filter(n => n.section === section.id);
      const sectionProgress = progress.filter(p => {
        const note = notes.find(n => n.id === p.noteId);
        return note && note.section === section.id;
      });
      stats.bySection[section.id] = {
        totalNotes: sectionNotes.length,
        completed: sectionProgress.filter(p => p.status === 'completed').length,
        inProgress: sectionProgress.filter(p => p.status === 'in-progress').length
      };
    });
    return stats;
  };

  const stats = getProgressStats();

  const TABS = [
    { id: 'upload', label: 'Upload', fullLabel: 'Upload Notes', icon: Upload },
    { id: 'manage', label: 'Manage', fullLabel: 'Manage Notes', icon: FileText },
    { id: 'users', label: 'Users', fullLabel: 'Manage Users', icon: UsersIcon },
    { id: 'analytics', label: 'Analytics', fullLabel: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 sm:h-7 sm:w-7 text-primary-600 flex-shrink-0" />
              <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent truncate">
                CogMech Analytics
              </span>
              <span className="hidden sm:inline-block ml-2 px-2.5 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                Admin
              </span>
            </div>

            {/* Desktop */}
            <div className="hidden sm:flex items-center gap-3">
              <img src={user?.photoURL} alt={user?.displayName} className="w-9 h-9 rounded-full border-2 border-primary-400" />
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

            {/* Mobile */}
            <div className="flex sm:hidden items-center gap-2">
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full">Admin</span>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1.5 rounded-lg hover:bg-gray-100">
                {mobileMenuOpen ? <X className="h-5 w-5 text-gray-600" /> : <Menu className="h-5 w-5 text-gray-600" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="sm:hidden overflow-hidden border-t border-gray-100"
              >
                <div className="py-3 flex items-center gap-3">
                  <img src={user?.photoURL} alt={user?.displayName} className="w-10 h-10 rounded-full border-2 border-primary-400" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800 truncate">{user?.displayName}</div>
                    <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1.5 text-sm font-medium flex-shrink-0"
                  >
                    <LogOut className="h-4 w-4" />
                    Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Total Notes</p>
                <p className="text-xl sm:text-3xl font-bold text-primary-600">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-primary-400 opacity-60" />
            </div>
          </motion.div>

          {SECTIONS.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index + 1) * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">{section.name}</p>
                  <p className="text-xl sm:text-3xl font-bold text-gray-800">{stats.bySection[section.id]?.totalNotes || 0}</p>
                  <p className="text-[10px] sm:text-xs text-green-600 font-medium mt-0.5">
                    {stats.bySection[section.id]?.completed || 0} completed
                  </p>
                </div>
                <section.icon className="h-8 w-8 sm:h-10 sm:w-10 opacity-30" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex border-b overflow-x-auto scrollbar-hide">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-0 px-3 sm:px-6 py-3 sm:py-4 font-medium transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-4 w-4 flex-shrink-0" />
                <span className="sm:hidden">{tab.label}</span>
                <span className="hidden sm:inline">{tab.fullLabel}</span>
              </button>
            ))}
          </div>

          <div className="p-4 sm:p-6">
            {/* Upload Tab */}
            {activeTab === 'upload' && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Upload New Note</h2>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowUploadModal(true)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-shadow text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    Add Note
                  </motion.button>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  {SECTIONS.map((section, index) => (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`${section.bg} rounded-xl p-4 sm:p-6 text-white shadow-md`}
                    >
                      <section.icon className="h-7 w-7 sm:h-10 sm:w-10 mb-2 sm:mb-3" />
                      <h3 className="text-sm sm:text-lg font-bold mb-0.5 sm:mb-1">{section.name}</h3>
                      <p className="text-[10px] sm:text-sm opacity-90">
                        {notes.filter(n => n.section === section.id).length} notes
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Manage Notes Tab */}
            {activeTab === 'manage' && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Manage Notes</h2>
                  <select
                    value={filterSection}
                    onChange={(e) => setFilterSection(e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                  >
                    <option value="all">All Sections</option>
                    {SECTIONS.map(section => (
                      <option key={section.id} value={section.id}>{section.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  {notes.filter(note => filterSection === 'all' || note.section === filterSection).map(note => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-100"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                            <h3 className="font-semibold text-sm text-gray-800">{note.title}</h3>
                            <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-[10px] sm:text-xs rounded-full font-medium">
                              {SECTIONS.find(s => s.id === note.section)?.name}
                            </span>
                            <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-[10px] sm:text-xs rounded-full font-medium">
                              {note.type.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mb-1 line-clamp-2">{note.description}</p>
                          <p className="text-[10px] sm:text-xs text-gray-400">by {note.uploaderName}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <a
                            href={note.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-xs font-medium"
                          >
                            View
                          </a>
                          <button
                            onClick={() => handleDeleteNote(note.id, note.storagePath)}
                            className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {notes.filter(note => filterSection === 'all' || note.section === filterSection).length === 0 && (
                    <div className="text-center py-10 text-gray-400">
                      <FileText className="h-10 w-10 mx-auto mb-2" />
                      <p>No notes found</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-5">Manage Users</h2>
                <div className="space-y-3">
                  {users.map(userData => (
                    <motion.div
                      key={userData.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-100"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <img
                            src={userData.photoURL}
                            alt={userData.displayName}
                            className="w-10 h-10 rounded-full flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <h3 className="font-semibold text-sm text-gray-800 truncate">{userData.displayName}</h3>
                            <p className="text-xs text-gray-500 truncate">{userData.email}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <select
                            value={userData.role || 'student'}
                            onChange={(e) => handleUpdateUserRole(userData.id, e.target.value)}
                            className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white font-medium"
                          >
                            <option value="student">Student</option>
                            <option value="admin">Admin</option>
                          </select>
                          <select
                            value={userData.section || ''}
                            onChange={(e) => handleUpdateUserSection(userData.id, e.target.value)}
                            className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white font-medium"
                          >
                            <option value="">No Section</option>
                            {SECTIONS.map(section => (
                              <option key={section.id} value={section.id}>{section.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {users.length === 0 && (
                    <div className="text-center py-10 text-gray-400">
                      <UsersIcon className="h-10 w-10 mx-auto mb-2" />
                      <p>No users found</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-5">Progress Analytics</h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                  {SECTIONS.map(section => (
                    <div key={section.id} className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-100">
                      <h3 className="font-semibold text-sm sm:text-base mb-3 flex items-center gap-2">
                        <section.icon className="h-5 w-5" />
                        {section.name}
                      </h3>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-lg sm:text-2xl font-bold text-primary-600">{stats.bySection[section.id]?.totalNotes || 0}</p>
                          <p className="text-[10px] sm:text-xs text-gray-500">Notes</p>
                        </div>
                        <div>
                          <p className="text-lg sm:text-2xl font-bold text-green-600">{stats.bySection[section.id]?.completed || 0}</p>
                          <p className="text-[10px] sm:text-xs text-gray-500">Done</p>
                        </div>
                        <div>
                          <p className="text-lg sm:text-2xl font-bold text-yellow-600">{stats.bySection[section.id]?.inProgress || 0}</p>
                          <p className="text-[10px] sm:text-xs text-gray-500">Active</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3">Student Progress</h3>
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-5 py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase">Student</th>
                        <th className="px-3 sm:px-5 py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Email</th>
                        <th className="px-3 sm:px-5 py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase">Note</th>
                        <th className="px-3 sm:px-5 py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {progress.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="px-5 py-8 text-center text-gray-400 text-sm">
                            No progress data yet
                          </td>
                        </tr>
                      ) : (
                        progress.map((prog) => {
                          const note = notes.find(n => n.id === prog.noteId);
                          return (
                            <tr key={prog.id} className="hover:bg-gray-50">
                              <td className="px-3 sm:px-5 py-3 text-xs sm:text-sm font-medium text-gray-800">{prog.userName}</td>
                              <td className="px-3 sm:px-5 py-3 text-xs text-gray-500 hidden sm:table-cell">{prog.userEmail}</td>
                              <td className="px-3 sm:px-5 py-3">
                                <div className="text-xs sm:text-sm text-gray-800">{note?.title || 'Deleted'}</div>
                                <div className="text-[10px] text-gray-400">{note?.section || 'N/A'}</div>
                              </td>
                              <td className="px-3 sm:px-5 py-3">
                                <span className={`px-2 py-0.5 inline-flex text-[10px] sm:text-xs font-semibold rounded-full ${
                                  prog.status === 'completed' ? 'bg-green-100 text-green-700' :
                                  prog.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-gray-100 text-gray-600'
                                }`}>
                                  {prog.status === 'not-started' ? 'Not Started' :
                                   prog.status === 'in-progress' ? 'In Progress' :
                                   'Completed'}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-5 sm:p-6">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">Upload New Note</h2>
                  <button onClick={() => setShowUploadModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleUploadNote} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Note Type</label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setNoteType('pdf')}
                        className={`flex-1 px-3 py-2.5 rounded-lg border-2 font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                          noteType === 'pdf' ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        <Upload className="h-4 w-4" /> PDF Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => setNoteType('link')}
                        className={`flex-1 px-3 py-2.5 rounded-lg border-2 font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                          noteType === 'link' ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        <LinkIcon className="h-4 w-4" /> External Link
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Section</label>
                    <select
                      value={selectedSection}
                      onChange={(e) => setSelectedSection(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      required
                    >
                      {SECTIONS.map(section => (
                        <option key={section.id} value={section.id}>{section.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Title</label>
                    <input
                      type="text"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      placeholder="Enter note title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
                    <textarea
                      value={noteDescription}
                      onChange={(e) => setNoteDescription(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      rows="3"
                      placeholder="Enter note description"
                      required
                    />
                  </div>

                  {noteType === 'pdf' ? (
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Upload PDF</label>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setPdfFile(e.target.files[0])}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-primary-50 file:text-primary-700"
                        required
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">External Link URL</label>
                      <input
                        type="url"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                        placeholder="https://example.com/resource"
                        required
                      />
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowUploadModal(false)}
                      className="flex-1 px-4 py-2.5 border-2 border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-shadow disabled:opacity-50 text-sm"
                    >
                      {loading ? 'Uploading...' : 'Upload Note'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary-600" />
              <span className="text-sm font-semibold text-gray-700">CogMech Analytics - Admin</span>
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

export default AdminDashboard;
