import { useEffect, useState } from 'react'
import { Api } from '../index'
type Repo = { id:string; name:string; branch:string }
type Build = { id:string; status:'queued'|'running'|'passed'|'failed'; createdAt:string }

export function useZync(getToken?: any) {
  const api = new Api(process.env.NEXT_PUBLIC_ZYNC_API!, getToken)
  const [repos, setRepos] = useState<Repo[]>([])
  const [builds, setBuilds] = useState<Build[]>([])
  useEffect(()=>{ api.get<Repo[]>('/repos').then(setRepos); api.get<Build[]>('/builds').then(setBuilds) },[])
  return {
    repos, builds,
    runBuild: (repoId:string)=>api.post('/builds', { repoId }),
    deploy: (repoId:string)=>api.post('/deploy', { repoId })
  }
}
