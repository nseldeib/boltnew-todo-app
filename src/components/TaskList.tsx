import React from 'react'
import { Star, Calendar, CheckCircle2, Circle, Trash2, Edit3 } from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string | null
  completed: boolean | null
  priority: string | null
  due_date: string | null
  starred: boolean | null
  emoji: string | null
  project_id: string | null
}

interface TaskListProps {
  tasks: Task[]
  onToggleComplete: (taskId: string, completed: boolean) => void
  onToggleStarred: (taskId: string, starred: boolean) => void
  onDeleteTask: (taskId: string) => void
  onEditTask: (task: Task) => void
}

export default function TaskList({ 
  tasks, 
  onToggleComplete, 
  onToggleStarred, 
  onDeleteTask, 
  onEditTask 
}: TaskListProps) {
  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case 'high': return 'text-red-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  const formatDueDate = (dateString: string | null) => {
    if (!dateString) return null
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays === -1) return 'Yesterday'
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`
    return `${diffDays} days`
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle2 className="h-12 w-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No tasks yet. Create your first task!</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-colors ${
            task.completed ? 'opacity-60' : ''
          }`}
        >
          <div className="flex items-start space-x-3">
            <button
              onClick={() => onToggleComplete(task.id, !task.completed)}
              className="mt-1 text-gray-400 hover:text-blue-400 transition-colors"
            >
              {task.completed ? (
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                {task.emoji && <span className="text-lg">{task.emoji}</span>}
                <h3 className={`text-white font-medium ${task.completed ? 'line-through' : ''}`}>
                  {task.title}
                </h3>
                <div className="flex items-center space-x-2">
                  {task.priority && (
                    <span className={`text-xs px-2 py-1 rounded-full bg-gray-700 ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  )}
                  {task.due_date && (
                    <div className="flex items-center space-x-1 text-xs text-gray-400">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDueDate(task.due_date)}</span>
                    </div>
                  )}
                </div>
              </div>
              {task.description && (
                <p className={`text-gray-400 text-sm mt-1 ${task.completed ? 'line-through' : ''}`}>
                  {task.description}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onToggleStarred(task.id, !task.starred)}
                className={`transition-colors ${
                  task.starred ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                }`}
              >
                <Star className={`h-4 w-4 ${task.starred ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={() => onEditTask(task)}
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDeleteTask(task.id)}
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}