'use client'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { browserSupabase } from '@/lib/supabase-browser'

export default function LoginForm(){
  const [error,setError]=useState(''),[loading,setLoading]=useState(false)
  const router=useRouter()
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();setLoading(true);setError('')
    const f=new FormData(e.currentTarget)
    const email=String(f.get('email')||'').trim().toLowerCase(),password=String(f.get('password')||'')
    const supabase=browserSupabase()
    const { error }=await supabase.auth.signInWithPassword({email,password})
    if(error){setError('E-mail ou senha inválidos.');setLoading(false);return}
    router.replace('/dashboard');router.refresh()
  }
  return <form onSubmit={submit} className="loginCard"><div className="loginBrand">P90 <b>PROJETO 90 DIAS</b></div><h1>Área do aluno</h1><p>Entre com o e-mail usado na sua compra.</p><input name="email" type="email" placeholder="Seu e-mail" required autoComplete="email"/><input name="password" type="password" placeholder="Sua senha" required autoComplete="current-password"/><button disabled={loading}>{loading?'Entrando...':'Entrar'}</button>{error&&<small className="error">{error}</small>}<small className="loginHelp">Seu acesso depende do status da compra. Reembolso, chargeback ou cancelamento podem bloquear automaticamente a conta.</small></form>
}
