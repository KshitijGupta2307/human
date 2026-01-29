import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Mail
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
  { id: 'electrical', name: 'Electrical', icon: Zap, color: 'from-yellow-400 to-orange-500' },
  { id: 'mechanical', name: 'Mechanical', icon: Cog, color: 'from-blue-400 to-cyan-500' },
  { id: 'operator', name: 'Computer Operator', icon: UsersIcon, color: 'from-green-400 to-emerald-500' }
];

const AdminDashboard = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upload');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [notes, setNotes] = useState([]);
  const [users, setUsers] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterSection, setFilterSection] = useState('all'); // For filtering view

  // Upload form state
  const [noteType, setNoteType] = useState('pdf'); // 'pdf' or 'link'
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
      
      // Reset form
      setNoteTitle('');
      setNoteDescription('');
      setPdfFile(null);
      setLinkUrl('');
      setShowUploadModal(false);
      
      // Reload notes
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
      alert('User role updated successfully!');
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role.');
    }
  };

  const handleUpdateUserSection = async (userId, newSection) => {
    try {
      await updateUserProfile(userId, { section: newSection });
      await loadData();
      alert('User section updated successfully!');
    } catch (error) {
      console.error('Error updating user section:', error);
      alert('Failed to update user section.');
    }
  };

  const getProgressStats = () => {
    const stats = {
      total: notes.length,
      bySection: {}
    };

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
              <span className="ml-4 px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
                Admin
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
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Notes</p>
                <p className="text-3xl font-bold text-primary-600">{stats.total}</p>
              </div>
              <FileText className="h-12 w-12 text-primary-500 opacity-50" />
            </div>
          </motion.div>

          {SECTIONS.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{section.name}</p>
                  <p className="text-3xl font-bold bg-gradient-to-r ${section.color} bg-clip-text text-transparent">
                    {stats.bySection[section.id]?.totalNotes || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.bySection[section.id]?.completed || 0} completed
                  </p>
                </div>
                <section.icon className="h-12 w-12 opacity-30" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex border-b">
            {[
              { id: 'upload', label: 'Upload Notes', icon: Upload },
              { id: 'manage', label: 'Manage Notes', icon: FileText },
              { id: 'users', label: 'Manage Users', icon: UsersIcon },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Upload Tab */}
            {activeTab === 'upload' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Upload New Note</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowUploadModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <Plus className="h-5 w-5" />
                    Add Note
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {SECTIONS.map((section, index) => (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-br ${section.color} rounded-xl p-6 text-white shadow-lg"
                    >
                      <section.icon className="h-12 w-12 mb-4" />
                      <h3 className="text-xl font-bold mb-2">{section.name}</h3>
                      <p className="text-sm opacity-90">
                        {notes.filter(n => n.section === section.id).length} notes available
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Manage Notes Tab */}
            {activeTab === 'manage' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Manage Notes</h2>
                  <select
                    value={filterSection}
                    onChange={(e) => setFilterSection(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="all">All Sections</option>
                    {SECTIONS.map(section => (
                      <option key={section.id} value={section.id}>
                        {section.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-4">
                  {notes.filter(note => filterSection === 'all' || note.section === filterSection).map(note => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-gray-50 rounded-lg p-4 flex justify-between items-start"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-800">{note.title}</h3>
                          <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                            {SECTIONS.find(s => s.id === note.section)?.name}
                          </span>
                          <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                            {note.type.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{note.description}</p>
                        <p className="text-xs text-gray-500">
                          Uploaded by: {note.uploaderName}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={note.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm"
                        >
                          View
                        </a>
                        <button
                          onClick={() => handleDeleteNote(note.id, note.storagePath)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Users</h2>
                <div className="space-y-4">
                  {users.map(userData => (
                    <motion.div
                      key={userData.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-gray-50 rounded-lg p-4 flex justify-between items-center"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={userData.photoURL}
                          alt={userData.displayName}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-800">{userData.displayName}</h3>
                          <p className="text-sm text-gray-600">{userData.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <select
                          value={userData.role || 'student'}
                          onChange={(e) => handleUpdateUserRole(userData.id, e.target.value)}
                          className="px-3 py-2 border rounded-lg text-sm"
                        >
                          <option value="student">Student</option>
                          <option value="admin">Admin</option>
                        </select>
                        <select
                          value={userData.section || ''}
                          onChange={(e) => handleUpdateUserSection(userData.id, e.target.value)}
                          className="px-3 py-2 border rounded-lg text-sm"
                        >
                          <option value="">No Section</option>
                          {SECTIONS.map(section => (
                            <option key={section.id} value={section.id}>
                              {section.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Progress Analytics</h2>
                
                {/* Summary Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {SECTIONS.map(section => (
                    <div key={section.id} className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <section.icon className="h-6 w-6" />
                        {section.name}
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Total Notes</p>
                          <p className="text-2xl font-bold text-primary-600">
                            {stats.bySection[section.id]?.totalNotes || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Completed</p>
                          <p className="text-2xl font-bold text-green-600">
                            {stats.bySection[section.id]?.completed || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">In Progress</p>
                          <p className="text-2xl font-bold text-yellow-600">
                            {stats.bySection[section.id]?.inProgress || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Detailed Student Progress */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Student Progress Details</h3>
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Student Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Note Title
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {progress.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                              No student progress data available yet
                            </td>
                          </tr>
                        ) : (
                          progress.map((prog) => {
                            const note = notes.find(n => n.id === prog.noteId);
                            return (
                              <tr key={prog.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">
                                    {prog.userName}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-500">
                                    {prog.userEmail}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-sm text-gray-900">
                                    {note?.title || 'Note not found'}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {note?.section || 'N/A'}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    prog.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    prog.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
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
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Upload New Note</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleUploadNote} className="space-y-6">
                {/* Note Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Note Type
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setNoteType('pdf')}
                      className={`flex-1 px-4 py-3 rounded-lg border-2 font-semibold transition-all ${
                        noteType === 'pdf'
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Upload className="h-5 w-5 mx-auto mb-1" />
                      PDF Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setNoteType('link')}
                      className={`flex-1 px-4 py-3 rounded-lg border-2 font-semibold transition-all ${
                        noteType === 'link'
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <LinkIcon className="h-5 w-5 mx-auto mb-1" />
                      External Link
                    </button>
                  </div>
                </div>

                {/* Section */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Section
                  </label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    {SECTIONS.map(section => (
                      <option key={section.id} value={section.id}>
                        {section.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter note title"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={noteDescription}
                    onChange={(e) => setNoteDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows="3"
                    placeholder="Enter note description"
                    required
                  />
                </div>

                {/* PDF Upload or Link Input */}
                {noteType === 'pdf' ? (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Upload PDF
                    </label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setPdfFile(e.target.files[0])}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      External Link URL
                    </label>
                    <input
                      type="url"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="https://example.com/resource"
                      required
                    />
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50"
                  >
                    {loading ? 'Uploading...' : 'Upload Note'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Footer - Contact Section */}
      <footer className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Brain className="h-5 w-5 text-primary-600" />
            <span className="ml-2 text-sm font-semibold text-gray-800">
              CogMech Analytics - Admin Panel
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <Mail className="h-4 w-4" />
            <span className="text-sm">Support:</span>
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
  );
};

export default AdminDashboard;
