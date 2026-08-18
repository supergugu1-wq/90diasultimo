'use client'
import { ReactNode, useEffect, useState } from 'react'
import { browserSupabase } from '@/lib/supabase-browser'

function getDeviceId(){
  const key='p90_device_id';let id=localStorage.getItem(key)
  if(!id){id=crypto.randomUUID()+crypto.randomUUID();localStorage.setItem(key,id)}
  return id
}
export default function AccessGuard({children}:{children:ReactNode}){
  const [state,setState]=useState<'checking'|'ok'|'blocked'>('checking'),[message,setMessage]=useState('')
  useEffect(()=>{(async()=>{
    try{
      const supabase=browserSupabase();const {data}=await supabase.auth.getSession();const token=data.session?.access_token
      if(!token){location.href='/login';return}
      const r=await fetch('/api/access/authorize',{method:'POST',headers:{'content-type':'application/json','authorization':`Bearer ${token}`},body:JSON.stringify({deviceId:getDeviceId(),deviceName:navigator.platform||'Navegador'})})
      const d=await r.json().catch(()=>({}))
      if(!r.ok){setMessage(d.error==='Device limit reached'?`Limite de ${d.limit||2} dispositivos atingido.`:'Seu acesso está bloqueado ou expirado.');setState('blocked');return}
      setState('ok')
    }catch{setMessage('Não foi possível validar seu acesso.');setState('blocked')}
  })()},[])
  if(state==='checking')return <main className="accessState"><div><b>Validando acesso...</b><small>Verificando assinatura e dispositivo.</small></div></main>
  if(state==='blocked')return <main className="accessState"><div><b>Acesso indisponível</b><small>{message}</small><a href="/login">Voltar ao login</a></div></main>
  return <>{children}</>
}
