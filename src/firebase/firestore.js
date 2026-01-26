import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  getDocs, 
  query, 
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './config';

// ==================== NOTES MANAGEMENT ====================

/**
 * Upload a note (PDF or link)
 */
export const uploadNote = async (noteData) => {
  try {
    const notesRef = collection(db, 'notes');
    const docRef = await addDoc(notesRef, {
      ...noteData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error uploading note:', error);
    throw error;
  }
};

/**
 * Upload PDF file to Firebase Storage
 */
export const uploadPDF = async (file, section) => {
  try {
    const timestamp = Date.now();
    const fileName = `${section}/${timestamp}_${file.name}`;
    const storageRef = ref(storage, `notes/${fileName}`);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    return {
      url: downloadURL,
      fileName: file.name,
      storagePath: fileName
    };
  } catch (error) {
    console.error('Error uploading PDF:', error);
    throw error;
  }
};

/**
 * Get all notes for a specific section
 */
export const getNotesBySection = async (section) => {
  try {
    console.log('Fetching notes for section:', section);
    const notesRef = collection(db, 'notes');
    const q = query(
      notesRef, 
      where('section', '==', section)
    );
    const querySnapshot = await getDocs(q);
    
    console.log('Query returned', querySnapshot.size, 'documents');
    const notes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Sort by createdAt on client side (avoids index requirement)
    notes.sort((a, b) => {
      const timeA = a.createdAt?.toMillis() || 0;
      const timeB = b.createdAt?.toMillis() || 0;
      return timeB - timeA; // Descending order
    });
    
    return notes;
  } catch (error) {
    console.error('Error getting notes:', error);
    throw error;
  }
};

/**
 * Get all notes
 */
export const getAllNotes = async () => {
  try {
    const notesRef = collection(db, 'notes');
    const q = query(notesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting all notes:', error);
    throw error;
  }
};

/**
 * Delete a note and all related progress records
 */
export const deleteNote = async (noteId, storagePath) => {
  try {
    // Delete the note from Firestore
    await deleteDoc(doc(db, 'notes', noteId));
    
    // Delete all progress records associated with this note
    const progressRef = collection(db, 'progress');
    const q = query(progressRef, where('noteId', '==', noteId));
    const querySnapshot = await getDocs(q);
    
    // Delete all related progress documents
    const deletePromises = querySnapshot.docs.map(progressDoc => 
      deleteDoc(doc(db, 'progress', progressDoc.id))
    );
    await Promise.all(deletePromises);
    
    console.log(`Deleted ${querySnapshot.size} progress records for note ${noteId}`);
    
    // Delete from Storage if it's a PDF
    if (storagePath) {
      try {
        const storageRef = ref(storage, storagePath);
        await deleteObject(storageRef);
        console.log('PDF file deleted from storage');
      } catch (storageError) {
        console.warn('Storage file not found or already deleted:', storageError);
        // Continue even if storage deletion fails
      }
    }
    
    console.log('Note and related data deleted successfully');
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};

// ==================== PROGRESS TRACKING ====================

/**
 * Track student progress for a note
 */
export const trackProgress = async (userId, noteId, status) => {
  try {
    // Get user profile to retrieve student name
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    const studentName = userSnap.exists() ? userSnap.data().displayName : 'Unknown Student';
    
    const progressRef = collection(db, 'progress');
    const q = query(
      progressRef,
      where('userId', '==', userId),
      where('noteId', '==', noteId)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // Create new progress entry
      await addDoc(progressRef, {
        userId,
        studentName, // Store student name
        noteId,
        status, // 'not-started', 'in-progress', 'completed'
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } else {
      // Update existing progress
      const progressDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, 'progress', progressDoc.id), {
        studentName, // Update student name
        status,
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error tracking progress:', error);
    throw error;
  }
};

/**
 * Get student progress for all notes
 */
export const getStudentProgress = async (userId) => {
  try {
    const progressRef = collection(db, 'progress');
    const q = query(progressRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting student progress:', error);
    throw error;
  }
};

/**
 * Get all students progress (for admin)
 */
export const getAllProgress = async () => {
  try {
    const progressRef = collection(db, 'progress');
    const querySnapshot = await getDocs(progressRef);
    
    const progressData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Fetch user information for each progress entry
    const progressWithUsers = await Promise.all(
      progressData.map(async (progress) => {
        try {
          const userDoc = await getDoc(doc(db, 'users', progress.userId));
          const userData = userDoc.exists() ? userDoc.data() : null;
          
          return {
            ...progress,
            userName: userData?.displayName || 'Unknown User',
            userEmail: userData?.email || 'N/A'
          };
        } catch (error) {
          console.error('Error fetching user for progress:', error);
          return {
            ...progress,
            userName: 'Unknown User',
            userEmail: 'N/A'
          };
        }
      })
    );

    return progressWithUsers;
  } catch (error) {
    console.error('Error getting all progress:', error);
    throw error;
  }
};

// ==================== USER MANAGEMENT ====================

/**
 * Get user profile
 */
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Get all users
 */
export const getAllUsers = async () => {
  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

/**
 * Get users by section
 */
export const getUsersBySection = async (section) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('section', '==', section));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting users by section:', error);
    throw error;
  }
};
