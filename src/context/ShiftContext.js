import React, { createContext, useState, useContext, useEffect } from 'react';

const ShiftContext = createContext();

export const useShift = () => {
  const context = useContext(ShiftContext);
  if (!context) {
    throw new Error('useShift must be used within a ShiftProvider');
  }
  return context;
};

export const ShiftProvider = ({ children }) => {
  const [shifts, setShifts] = useState([]);
  const [activeShift, setActiveShift] = useState(null);

  // Load shifts from storage when component mounts
  useEffect(() => {
    loadShifts();
  }, []);

  const loadShifts = async () => {
    try {
      // TODO: Implement actual storage logic
      // For now, we'll use localStorage as a temporary solution
      const savedShifts = localStorage.getItem('shifts');
      if (savedShifts) {
        setShifts(JSON.parse(savedShifts));
      }
    } catch (error) {
      console.error('Error loading shifts:', error);
    }
  };

  const saveShifts = async (updatedShifts) => {
    try {
      // TODO: Implement actual storage logic
      localStorage.setItem('shifts', JSON.stringify(updatedShifts));
    } catch (error) {
      console.error('Error saving shifts:', error);
    }
  };

  const createShift = async (shiftData) => {
    const newShift = {
      id: Date.now().toString(),
      ...shiftData,
      createdAt: new Date().toISOString(),
    };

    const updatedShifts = [...shifts, newShift];
    setShifts(updatedShifts);
    await saveShifts(updatedShifts);
    return newShift;
  };

  const updateShift = async (shiftId, updateData) => {
    const updatedShifts = shifts.map(shift =>
      shift.id === shiftId ? { ...shift, ...updateData } : shift
    );
    setShifts(updatedShifts);
    await saveShifts(updatedShifts);
  };

  const deleteShift = async (shiftId) => {
    const updatedShifts = shifts.filter(shift => shift.id !== shiftId);
    setShifts(updatedShifts);
    await saveShifts(updatedShifts);
  };

  const startShift = (shiftId) => {
    setActiveShift(shiftId);
  };

  const endShift = () => {
    setActiveShift(null);
  };

  const getShift = (shiftId) => {
    return shifts.find(shift => shift.id === shiftId);
  };

  const value = {
    shifts,
    activeShift,
    createShift,
    updateShift,
    deleteShift,
    startShift,
    endShift,
    getShift,
  };

  return (
    <ShiftContext.Provider value={value}>
      {children}
    </ShiftContext.Provider>
  );
};