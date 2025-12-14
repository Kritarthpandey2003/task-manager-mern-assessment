import { useEffect, useState } from 'react';
import Layout from './components/Layout';
import TaskItem from './components/TaskItem';
import { Plus, Sparkles, CalendarDays } from 'lucide-react';
import { getTasks, createTask, updateTask, deleteTask } from './utils/api';
import toast, { Toaster } from 'react-hot-toast';

interface Task {
  id: number;
  title: string;
  isCompleted: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      toast.error("Failed to connect to server");
    }
  };

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    try {
      const task = await createTask(newTask);
      setTasks([...tasks, task]);
      setNewTask('');
      toast.success("Task created!", { icon: '✨' });
    } catch (error) {
      toast.error("Failed to add task");
    }
  };

  const toggleTask = async (id: number, currentStatus: boolean) => {
    try {
      setTasks(tasks.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
      await updateTask(id, !currentStatus);
    } catch (error) {
      toast.error("Failed to update");
      loadTasks();
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setTasks(tasks.filter(t => t.id !== id));
      await deleteTask(id);
      toast.success("Task deleted");
    } catch (error) {
      toast.error("Failed to delete");
      loadTasks();
    }
  };

  const pendingCount = tasks.filter(t => !t.isCompleted).length;

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center flex items-center justify-center p-4">
      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>

      <Toaster position="top-center" />

      {/* Glassmorphism Card */}
      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50 ring-1 ring-black/5">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                My Day <Sparkles className="text-yellow-300" size={24} />
              </h1>
              <p className="text-indigo-100 mt-1 flex items-center gap-2 text-sm font-medium">
                <CalendarDays size={14} /> {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border border-white/20">
              {pendingCount} Pending
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 pb-2">
          <div className="relative group">
            <input
              type="text"
              placeholder="What's your main focus today?"
              className="w-full bg-gray-50 text-gray-800 placeholder-gray-400 border-2 border-gray-100 rounded-2xl py-4 pl-5 pr-14 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            />
            <button 
              onClick={handleAddTask}
              className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 text-white w-12 rounded-xl flex items-center justify-center transition-all shadow-lg shadow-indigo-500/30 active:scale-95"
            >
              <Plus size={24} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="p-4 h-[400px] overflow-y-auto custom-scrollbar">
          {tasks.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
              <div className="bg-indigo-50 p-4 rounded-full mb-4">
                <Sparkles size={32} className="text-indigo-400" />
              </div>
              <p className="text-gray-500 font-medium">No tasks yet.</p>
              <p className="text-xs text-gray-400 mt-1">Add one above to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onToggle={() => toggleTask(task.id, task.isCompleted)} 
                  onDelete={() => handleDelete(task.id)} 
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-3 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider border-t">
          Powered by Neon DB ⚡
        </div>
      </div>
    </div>
  );
}

export default App;
