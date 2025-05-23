
import { useState, useEffect } from 'react';

type SaveFunction<T> = (data: T) => Promise<void> | void;
interface UseAutosaveOptions {
  interval?: number;
  debounce?: number;
  enabled?: boolean;
  key?: string;
}

export function useAutosave<T>(
  data: T, 
  saveFunction: SaveFunction<T>, 
  options: UseAutosaveOptions = {}
) {
  const { 
    interval = 30000, // 30 seconds default
    debounce = 1000,  // 1 second default
    enabled = true,
    key = 'autosave_data'
  } = options;
  
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [localData, setLocalData] = useState<T | null>(null);
  
  // Load any saved data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(key);
      if (savedData) {
        setLocalData(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Failed to load autosave data', error);
    }
  }, [key]);
  
  // Track changes
  useEffect(() => {
    if (enabled) {
      setHasChanges(true);
      setTimerActive(true);
      
      // Save to localStorage
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save to localStorage', error);
      }
      
      // Debounce the changes
      const debounceTimer = setTimeout(() => {
        // After debounce, signal that we're ready for autosave timer
        setTimerActive(false);
      }, debounce);
      
      return () => clearTimeout(debounceTimer);
    }
    
    return undefined;
  }, [data, debounce, enabled, key]);
  
  // Autosave timer
  useEffect(() => {
    if (!enabled || !hasChanges || timerActive) return undefined;
    
    const saveTimer = setTimeout(() => {
      saveData();
    }, interval);
    
    return () => clearTimeout(saveTimer);
  }, [hasChanges, timerActive, enabled, interval]);
  
  // Function to save data
  const saveData = async () => {
    if (!enabled || !hasChanges) return;
    
    try {
      setIsSaving(true);
      await saveFunction(data);
      setLastSaved(new Date());
      setHasChanges(false);
      
      // Clear localStorage after successful save
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Autosave failed', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Manual save function
  const save = () => {
    saveData();
  };
  
  // Clear any saved data
  const clearSaved = () => {
    localStorage.removeItem(key);
    setLocalData(null);
  };
  
  return {
    lastSaved,
    isSaving,
    hasChanges,
    localData,
    save,
    clearSaved
  };
}
