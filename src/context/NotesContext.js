import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, isToday, isThisWeek } from 'date-fns';

export const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const notesData = await AsyncStorage.getItem('workNotes');
      if (notesData) {
        setNotes(JSON.parse(notesData));
      } else {
        setNotes([]);
      }
    } catch (e) {
      console.error('Failed to load notes', e);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (note) => {
    try {
      // Validate note data
      if (!validateNote(note)) {
        return false;
      }

      const newNote = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...note,
      };
      
      const updatedNotes = [...notes, newNote];
      await AsyncStorage.setItem('workNotes', JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
      return true;
    } catch (e) {
      console.error('Failed to add note', e);
      return false;
    }
  };

  const updateNote = async (updatedNote) => {
    try {
      // Validate note data
      if (!validateNote(updatedNote)) {
        return false;
      }

      const updatedNotes = notes.map(note => 
        note.id === updatedNote.id ? { 
          ...note, 
          ...updatedNote,
          updatedAt: new Date().toISOString() 
        } : note
      );
      await AsyncStorage.setItem('workNotes', JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
      return true;
    } catch (e) {
      console.error('Failed to update note', e);
      return false;
    }
  };

  const deleteNote = async (noteId) => {
    try {
      const updatedNotes = notes.filter(note => note.id !== noteId);
      await AsyncStorage.setItem('workNotes', JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
      return true;
    } catch (e) {
      console.error('Failed to delete note', e);
      return false;
    }
  };

  const validateNote = (note) => {
    // Check required fields
    if (!note.title || !note.title.trim()) {
      return false;
    }
    
    if (!note.content || !note.content.trim()) {
      return false;
    }
    
    // Check field lengths
    if (note.title.trim().length > 100) {
      return false;
    }
    
    if (note.content.trim().length > 300) {
      return false;
    }
    
    // Ensure reminder time is valid
    if (!note.reminderTime || isNaN(new Date(note.reminderTime).getTime())) {
      return false;
    }
    
    // Ensure reminder days is an array
    if (!note.reminderDays || !Array.isArray(note.reminderDays)) {
      return false;
    }
    
    return true;
  };

  const getRecentNotes = (limit = 3) => {
    // Sort notes by updated time, most recent first
    return [...notes]
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
      .slice(0, limit);
  };

  const getTodayNotes = () => {
    // Get notes with reminders for today
    return notes.filter(note => {
      // Check if today is in the reminder days
      const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, ...
      const reminderDay = today === 0 ? 7 : today; // Convert to 1-7 format where 7 is Sunday
      
      return note.reminderDays.includes(reminderDay);
    });
  };

  const getWeeklyNotes = () => {
    // Get notes created or updated this week
    return notes.filter(note => {
      const noteDate = new Date(note.updatedAt || note.createdAt);
      return isThisWeek(noteDate);
    });
  };

  const searchNotes = (query) => {
    if (!query || query.trim() === '') {
      return [];
    }
    
    const searchTerm = query.toLowerCase().trim();
    
    return notes.filter(note => 
      note.title.toLowerCase().includes(searchTerm) || 
      note.content.toLowerCase().includes(searchTerm)
    );
  };

  return (
    <NotesContext.Provider value={{
      notes,
      loading,
      addNote,
      updateNote,
      deleteNote,
      getRecentNotes,
      getTodayNotes,
      getWeeklyNotes,
      searchNotes,
      refreshNotes: loadNotes
    }}>
      {children}
    </NotesContext.Provider>
  );
};