import { useEffect, useState } from 'react'
import { Api } from '../index'
type Project = { id:string; name:string; updatedAt:string }
type Task = { id:string; title:string; status:'todo'|'doing'|'done'; assignee?:string }

export function useZlab(getToken?: any) {
  const api = new Api(process.env.NEXT_PUBLIC_ZLAB_API!, getToken)
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  useEffect(()=>{ api.get<Project[]>('/projects').then(setProjects); api.get<Task[]>('/tasks').then(setTasks) },[])
  return {
    projects, tasks,
    createProject: (name:string)=>api.post('/projects', { name }),
    createTask: (p:{title:string; projectId:string})=>api.post('/tasks', p),
    updateTask: (id:string, patch:any)=>api.post(`/tasks/${id}`, patch)
  }
}
