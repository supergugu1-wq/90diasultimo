import Link from 'next/link'

export default function Home() {
  return <main className="premiumLanding">
    <header className="landingNav"><div className="brandLockup"><div className="brandMark">P90</div><div><span>PROJETO</span><b>90 DIAS</b></div></div><Link className="loginLink" href="/login">Área do aluno →</Link></header>
    <section className="landingHero">
      <div className="heroCopy"><span className="heroPill">TRANSFORMAÇÃO COMPLETA EM 90 DIAS</span><h1>Consistência vira resultado quando o caminho é claro.</h1><p>Treinos de academia e em casa, evolução diária e uma experiência organizada para você saber exatamente o que fazer hoje.</p><div className="heroButtons"><Link className="heroPrimary" href="/login">Acessar minha plataforma</Link><Link className="heroSecondary" href="/dashboard?mode=casa">Conhecer o treino em casa</Link></div><div className="trustRow"><span>✓ Academia + casa</span><span>✓ Progresso diário</span><span>✓ Acesso protegido</span></div></div>
      <div className="heroMockup"><div className="mockTop"><span>PROGRESSO ATUAL</span><b>Dia 12 de 90</b></div><div className="mockProgress"><i style={{width:'13%'}} /></div><div className="mockCards"><div><span>HOJE</span><b>Peito + tríceps</b><small>5 exercícios • 46 min</small></div><div><span>SEQUÊNCIA</span><b>4 dias</b><small>Continue assim</small></div></div><div className="mockWorkout"><div className="mockPlay">▶</div><div><span>PRÓXIMO EXERCÍCIO</span><b>Supino reto</b><small>4 séries • 6–10 reps</small></div></div></div>
    </section>
    <section className="landingFeatures"><article><span>01</span><b>Treino sem confusão</b><p>Abra a plataforma e saiba exatamente qual exercício fazer em seguida.</p></article><article><span>02</span><b>Academia ou em casa</b><p>Troque o modo de treino sem perder a organização do seu programa.</p></article><article><span>03</span><b>Evolução visível</b><p>Acompanhe dias concluídos, sequência e progresso ao longo dos 90 dias.</p></article></section>
  </main>
}
