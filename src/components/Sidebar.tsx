import React from 'react'
import { CheckSquare, Star, Settings, FolderOpen, Plus } from 'lucide-react'

interface Project {
  id: string
  title: string
  emoji: string | null
  color: string | null
  completed: boolean | null
}

interface SidebarProps {
  currentView: string
  onViewChange: (view: string) => void
  projects: Project[]
  onCreateProject: () => void
}

export default function Sidebar({ currentView, onViewChange, projects, onCreateProject }: SidebarProps) {
  const menuItems = [
    { id: 'important', label: 'Important', icon: Star, color: 'text-yellow-400' },
    { id: 'all-tasks', label: 'All Tasks', icon: CheckSquare, color: 'text-blue-400' },
  ]

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <CheckSquare className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">TaskFlow</h1>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                currentView === item.id
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Icon className={`h-5 w-5 ${item.color}`} />
              <span>{item.label}</span>
            </button>
          )
        })}

        <div className="pt-6">
          <div className="flex items-center justify-between px-3 py-2">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Projects
            </h3>
            <button
              onClick={onCreateProject}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-1 mt-2">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => onViewChange(`project-${project.id}`)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  currentView === `project-${project.id}`
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="text-lg">{project.emoji || '📁'}</span>
                <span className={`flex-1 truncate ${project.completed ? 'line-through opacity-60' : ''}`}>
                  {project.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => onViewChange('settings')}
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
            currentView === 'settings'
              ? 'bg-gray-700 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <Settings className="h-5 w-5 text-gray-400" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  )
}