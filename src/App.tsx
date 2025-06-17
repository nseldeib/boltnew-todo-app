import React, { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import Sidebar from './components/Sidebar'
import TaskList from './components/TaskList'
import TaskModal from './components/TaskModal'
import ProjectModal from './components/ProjectModal'
import Settings from './components/Settings'
import { Plus, Menu, X } from 'lucide-react'

interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  completed: boolean | null
  priority: string | null
  due_date: string | null
  starred: boolean | null
  emoji: string | null
  project_id: string | null
  created_at: string | null
  updated_at: string | null
}

interface Project {
  id: string
  user_id: string
  title: string
  description: string | null
  emoji: string | null
  color: string | null
  completed: boolean | null
  created_at: string | null
  updated_at: string | null
}

function Dashboard() {
  const { user } = useAuth()
  const [currentView, setCurrentView] = useState('all-tasks')
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchTasks()
      fetchProjects()
    }
  }, [user])

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const createTask = async (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([{ ...taskData, user_id: user?.id }])
        .select()

      if (error) throw error
      if (data) {
        setTasks([data[0], ...tasks])
      }
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .update(updates)
        .eq('id', taskId)
        .select()

      if (error) throw error
      if (data) {
        setTasks(tasks.map(task => task.id === taskId ? data[0] : task))
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', taskId)

      if (error) throw error
      setTasks(tasks.filter(task => task.id !== taskId))
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const createProject = async (projectData: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'completed'>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{ ...projectData, user_id: user?.id }])
        .select()

      if (error) throw error
      if (data) {
        setProjects([data[0], ...projects])
      }
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .select()

      if (error) throw error
      if (data) {
        setProjects(projects.map(project => project.id === projectId ? data[0] : project))
      }
    } catch (error) {
      console.error('Error updating project:', error)
    }
  }

  const getFilteredTasks = () => {
    switch (currentView) {
      case 'important':
        return tasks.filter(task => task.starred)
      case 'all-tasks':
        return tasks
      default:
        if (currentView.startsWith('project-')) {
          const projectId = currentView.replace('project-', '')
          return tasks.filter(task => task.project_id === projectId)
        }
        return tasks
    }
  }

  const getViewTitle = () => {
    switch (currentView) {
      case 'important':
        return 'Important Tasks'
      case 'all-tasks':
        return 'All Tasks'
      case 'settings':
        return 'Settings'
      default:
        if (currentView.startsWith('project-')) {
          const projectId = currentView.replace('project-', '')
          const project = projects.find(p => p.id === projectId)
          return project ? `${project.emoji} ${project.title}` : 'Project'
        }
        return 'Tasks'
    }
  }

  const handleTaskSave = async (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (editingTask) {
      await updateTask(editingTask.id, taskData)
      setEditingTask(null)
    } else {
      await createTask(taskData)
    }
  }

  const handleProjectSave = async (projectData: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'completed'>) => {
    if (editingProject) {
      await updateProject(editingProject.id, projectData)
      setEditingProject(null)
    } else {
      await createProject(projectData)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden">
          <div className="fixed inset-y-0 left-0 z-50">
            <Sidebar
              currentView={currentView}
              onViewChange={(view) => {
                setCurrentView(view)
                setIsSidebarOpen(false)
              }}
              projects={projects}
              onCreateProject={() => {
                setIsProjectModalOpen(true)
                setIsSidebarOpen(false)
              }}
            />
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          projects={projects}
          onCreateProject={() => setIsProjectModalOpen(true)}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 px-4 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-semibold text-white">{getViewTitle()}</h1>
            </div>
            {currentView !== 'settings' && (
              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Task</span>
              </button>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8">
          {currentView === 'settings' ? (
            <Settings />
          ) : (
            <TaskList
              tasks={getFilteredTasks()}
              onToggleComplete={(taskId, completed) => updateTask(taskId, { completed })}
              onToggleStarred={(taskId, starred) => updateTask(taskId, { starred })}
              onDeleteTask={deleteTask}
              onEditTask={(task) => {
                setEditingTask(task)
                setIsTaskModalOpen(true)
              }}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false)
          setEditingTask(null)
        }}
        onSave={handleTaskSave}
        task={editingTask}
        projects={projects}
      />

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => {
          setIsProjectModalOpen(false)
          setEditingProject(null)
        }}
        onSave={handleProjectSave}
        project={editingProject}
      />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return user ? <Dashboard /> : <Auth />
}

export default App