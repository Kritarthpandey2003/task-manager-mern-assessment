import { useState } from 'react';
import { Trash2, Check, Pencil, X, Save, Clock } from 'lucide-react';
import { editTaskTitle } from '../utils/api';
import toast from 'react-hot-toast';

interface Task {
  id: number;
  title: string;
  isCompleted: boolean;
  created_at?: string; // New time field
}

interface Props {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}

const TaskItem = ({ task, onToggle, onDelete }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [currentTitle, setCurrentTitle] = useState(task.title);

  // Format time (e.g., "10:30 AM")
  const formatTime = (timestamp: string) => {
    // 1. Create a Date object from the UTC timestamp (which contains a 'Z' for Zulu/UTC)
    const date = new Date(timestamp);
    
    // 2. Format using local settings, which should now correctly apply the IST offset.
    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true, // Forces AM/PM format
    });
  };

  const timeString = task.created_at 
    ? formatTime(task.created_at)
    : 'Just now';

  const handleSave = async () => {
    if (!editedTitle.trim()) return;
    try {
      await editTaskTitle(task.id, editedTitle);
      setCurrentTitle(editedTitle);
      setIsEditing(false);
      toast.success("Task updated!");
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="group flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:shadow-md hover:border-indigo-100 transition-all duration-300">
      
      {/* LEFT SIDE: Checkbox + Content */}
      <div className="flex items-center gap-4 flex-1">
        
        {/* Checkbox */}
        <div 
          onClick={onToggle}
          className={`
            cursor-pointer w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 border-2 flex-shrink-0
            ${task.isCompleted 
              ? 'bg-green-500 border-green-500 scale-105 shadow-sm' 
              : 'bg-transparent border-gray-300 hover:border-indigo-400'
            }
          `}
        >
          <Check size={14} className={`text-white ${task.isCompleted ? 'opacity-100' : 'opacity-0'}`} strokeWidth={4} />
        </div>

        {/* Content Area (Text OR Input) */}
        <div className="flex-1">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input 
                autoFocus
                className="w-full bg-gray-50 border border-indigo-200 rounded-lg px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              />
            </div>
          ) : (
            <div onClick={onToggle} className="cursor-pointer select-none">
              <p className={`text-base font-medium transition-all ${task.isCompleted ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                {currentTitle}
              </p>
              {/* Time Display */}
              <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                <Clock size={10} /> {timeString}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE: Action Buttons */}
      <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors">
              <Save size={18} />
            </button>
            <button onClick={() => setIsEditing(false)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors">
              <X size={18} />
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={() => setIsEditing(true)} 
              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
            >
              <Pencil size={18} />
            </button>
            <button 
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskItem;