'use client'
import { useMemo, useState } from 'react'

type Exercise = {
  name: string
  muscle: string
  sets: string
  reps: string
  rest: string
  slug: string
  equipment: string
  cue: string
}

const gym: Exercise[] = [
  {name:'Supino reto',muscle:'Peito',sets:'4 séries',reps:'6–10 reps',rest:'120s',slug:'supino-reto',equipment:'Banco reto + barra + anilhas',cue:'Desça a barra ao meio do peito e empurre mantendo pés firmes e escápulas apoiadas.'},
  {name:'Supino inclinado com halteres',muscle:'Peito',sets:'3 séries',reps:'8–12 reps',rest:'90s',slug:'supino-inclinado-halteres',equipment:'Banco inclinado + 2 halteres',cue:'Parta com halteres na linha do peito e pressione para cima sem bater os pesos.'},
  {name:'Crucifixo máquina',muscle:'Peito',sets:'3 séries',reps:'10–12 reps',rest:'75s',slug:'crucifixo-maquina',equipment:'Peck deck / voador',cue:'Mantenha cotovelos levemente flexionados e feche os braços à frente do peito.'},
  {name:'Tríceps corda',muscle:'Tríceps',sets:'3 séries',reps:'10–15 reps',rest:'60s',slug:'triceps-corda',equipment:'Polia alta + corda',cue:'Cotovelos fixos ao lado do corpo; estenda até separar as pontas da corda.'},
  {name:'Puxada frontal',muscle:'Costas',sets:'4 séries',reps:'8–12 reps',rest:'90s',slug:'puxada-frontal',equipment:'Pulley alto + barra longa',cue:'Puxe a barra em direção à parte superior do peito sem balançar o tronco.'},
  {name:'Remada baixa',muscle:'Costas',sets:'4 séries',reps:'8–12 reps',rest:'90s',slug:'remada-baixa',equipment:'Polia baixa + triangulo',cue:'Puxe o pegador ao abdômen e aproxime as escápulas mantendo a coluna neutra.'},
  {name:'Rosca direta',muscle:'Bíceps',sets:'3 séries',reps:'8–12 reps',rest:'60s',slug:'rosca-direta',equipment:'Barra reta ou W',cue:'Flexione os cotovelos sem projetá-los à frente e sem embalar o tronco.'},
  {name:'Agachamento livre',muscle:'Pernas',sets:'4 séries',reps:'6–10 reps',rest:'120s',slug:'agachamento-livre',equipment:'Rack + barra + anilhas',cue:'Desça com joelhos acompanhando a linha dos pés e mantenha o tronco estável.'},
  {name:'Leg press',muscle:'Pernas',sets:'4 séries',reps:'10–15 reps',rest:'120s',slug:'leg-press',equipment:'Leg press 45°',cue:'Desça a plataforma com controle sem tirar quadril e lombar do encosto.'},
  {name:'Stiff',muscle:'Posterior',sets:'4 séries',reps:'8–12 reps',rest:'90s',slug:'stiff',equipment:'Barra + anilhas',cue:'Leve o quadril para trás com joelhos semiflexionados e coluna neutra.'},
  {name:'Desenvolvimento com halteres',muscle:'Ombros',sets:'4 séries',reps:'8–12 reps',rest:'90s',slug:'desenvolvimento-halteres',equipment:'Banco com encosto + 2 halteres',cue:'Comece com halteres na altura dos ombros e pressione acima da cabeça com controle.'},
  {name:'Elevação lateral',muscle:'Ombros',sets:'3 séries',reps:'12–15 reps',rest:'60s',slug:'elevacao-lateral',equipment:'2 halteres',cue:'Eleve os braços lateralmente até próximo da linha dos ombros sem usar impulso.'}
]

const home: Exercise[] = [
  {name:'Flexão de braço',muscle:'Peito',sets:'4 séries',reps:'8–15 reps',rest:'60s',slug:'flexao-braco',equipment:'Peso corporal + chão firme',cue:'Mantenha o corpo alinhado, desça o peito com controle e empurre sem perder a postura.'},
  {name:'Agachamento',muscle:'Pernas',sets:'4 séries',reps:'15–20 reps',rest:'60s',slug:'agachamento-corporal',equipment:'Peso corporal',cue:'Desça levando o quadril para trás, joelhos alinhados aos pés e retorne contraindo pernas e glúteos.'},
  {name:'Afundo',muscle:'Pernas',sets:'3 séries',reps:'10–12 reps por perna',rest:'60s',slug:'afundo',equipment:'Peso corporal',cue:'Dê um passo à frente e desça com controle até os joelhos se aproximarem de 90 graus.'},
  {name:'Prancha',muscle:'Core',sets:'3 séries',reps:'30–60s',rest:'45s',slug:'prancha',equipment:'Tapete ou chão firme',cue:'Apoie antebraços e pontas dos pés mantendo cabeça, tronco e quadril alinhados.'},
  {name:'Abdominal crunch',muscle:'Abdômen',sets:'3 séries',reps:'15–20 reps',rest:'45s',slug:'abdominal-crunch',equipment:'Tapete ou chão firme',cue:'Eleve o tronco contraindo o abdômen sem puxar o pescoço e retorne de forma controlada.'},
  {name:'Elevação pélvica',muscle:'Glúteos',sets:'4 séries',reps:'15–20 reps',rest:'60s',slug:'elevacao-pelvica',equipment:'Tapete ou chão firme',cue:'Empurre o quadril para cima contraindo glúteos e retorne sem hiperestender a lombar.'},
  {name:'Tríceps no banco',muscle:'Tríceps',sets:'3 séries',reps:'10–15 reps',rest:'60s',slug:'triceps-banco',equipment:'Cadeira ou banco firme',cue:'Mãos apoiadas atrás do corpo; flexione os cotovelos para trás e empurre até retornar.'},
  {name:'Remada com toalha',muscle:'Costas',sets:'3 séries',reps:'12–15 reps',rest:'60s',slug:'remada-toalha',equipment:'Toalha resistente',cue:'Mantenha o tronco firme e faça a puxada controlada, aproximando os cotovelos do corpo.'},
  {name:'Mountain climber',muscle:'Core',sets:'3 séries',reps:'30–45s',rest:'45s',slug:'mountain-climber',equipment:'Peso corporal + chão firme',cue:'Em prancha alta, alterne os joelhos em direção ao peito mantendo o abdômen contraído.'}
]

const imageSrc = (mode: string, slug: string) => `/media/exercises/${mode}/${slug}.webp`
export default function Dashboard({ initialMode='academia' }: { initialMode?: string }) {
  const [mode,setMode] = useState(initialMode === 'casa' ? 'casa' : 'academia')
  const [selected,setSelected] = useState(0)
  const [completed,setCompleted] = useState<number[]>([0,2])
  const exercises = useMemo(() => mode === 'casa' ? home : gym,[mode])
  const ex = exercises[selected % exercises.length]
  const switchMode=(m:string)=>{setMode(m);setSelected(0);setCompleted([])}
  const toggleDone=()=>setCompleted(v=>v.includes(selected)?v.filter(i=>i!==selected):[...v,selected])
  const completion=Math.round((completed.length/exercises.length)*100)

  return <div className="appShell">
    <aside className="sideNav">
      <div className="brandLockup"><div className="brandMark">P90</div><div><span>PROJETO</span><b>90 DIAS</b></div></div>
      <div className="navLabel">PRINCIPAL</div>
      <nav className="mainNav">
        <button className="active"><span>⌂</span>Painel</button><button><span>◆</span>Treinos</button><button><span>◈</span>Alimentação</button><button><span>↗</span>Evolução</button><button><span>▦</span>Calendário</button><button><span>▶</span>Aulas</button>
      </nav>
      <div className="sideSpacer" />
      <div className="premiumCard"><span>PLANO ATUAL</span><b>★ Premium</b><small>Acesso completo liberado</small></div>
      <button className="profileMini"><div className="avatar">R</div><div><b>Ricardo</b><small>Aluno Premium</small></div><span>›</span></button>
    </aside>

    <main className="appMain">
      <header className="appHeader">
        <div><p className="overline">PROJETO 90 DIAS</p><h1>Seu treino de hoje</h1></div>
        <div className="headerActions"><button className="iconButton" aria-label="Notificações">♡</button><div className="dayBadge"><span>DIA ATUAL</span><b>12 <small>/ 90</small></b></div></div>
      </header>

      <section className="journeyCard">
        <div className="journeyCopy"><span className="statusPill">EM ANDAMENTO</span><h2>Continue construindo sua evolução.</h2><p>Você já completou 12 dias. Mantenha a consistência e avance um treino por vez.</p></div>
        <div className="journeyProgress"><div className="progressRing"><strong>13%</strong><span>concluído</span></div><div className="journeyStats"><div><b>12</b><span>dias feitos</span></div><div><b>78</b><span>dias restantes</span></div><div><b>4</b><span>sequência atual</span></div></div></div>
      </section>

      <section className="workspaceHead">
        <div><h2>Treino do dia</h2><p>{mode==='academia'?'Academia • Força e hipertrofia':'Em casa • Full Body Progressivo'}</p></div>
        <div className="segmented"><button className={mode==='academia'?'selected':''} onClick={()=>switchMode('academia')}>Academia</button><button className={mode==='casa'?'selected':''} onClick={()=>switchMode('casa')}>Em casa</button></div>
      </section>

      <section className="trainingGrid">
        <div className="exercisePanel">
          <div className="panelHead"><div><span>LISTA DE EXERCÍCIOS</span><b>{exercises.length} exercícios</b></div><div className="miniProgress"><span>{completed.length}/{exercises.length}</span><div><i style={{width:`${completion}%`}} /></div></div></div>
          <div className="exerciseScroll">{exercises.map((e,i)=><button key={e.name} onClick={()=>setSelected(i)} className={`exerciseRow ${i===selected?'selected':''}`}><span className={`numberBubble ${completed.includes(i)?'done':''}`}>{completed.includes(i)?'✓':String(i+1).padStart(2,'0')}</span><div className="exerciseMeta"><b>{e.name}</b><small>{e.muscle} • {e.sets} • {e.reps}</small></div><span className="rowArrow">›</span></button>)}</div>
        </div>

        <article className="exerciseDetail">
          <div className="detailTop"><div><div className="breadcrumb">TREINO / {mode==='academia'?'ACADEMIA':'EM CASA'} / {ex.muscle.toUpperCase()}</div><div className="titleLine"><h2>{ex.name}</h2><span className="muscleTag">{ex.muscle}</span></div><p>Movimento guiado para executar com segurança, controle e boa amplitude.</p></div><button className="moreButton">•••</button></div>

          <div className="executionCard">
            <div className="executionHeader"><div><span>EXECUÇÃO</span><b>Veja a execução completa</b></div><span className="mediaBadge">3 etapas • personagem padrão P90</span></div>
            <div className="videoFrame imageFrame">
              <img key={`${mode}-${ex.slug}`} src={imageSrc(mode, ex.slug)} alt={`${ex.name}: posição inicial, movimento e posição final`} loading="eager" />
            </div>
            <div className="exerciseTechnical"><div><span>EQUIPAMENTO / OBJETO</span><b>{ex.equipment}</b></div><div><span>MOVIMENTO CORRETO</span><p>{ex.cue}</p></div></div>
            <p className="mediaNotice">Demonstração individual em alta qualidade com posição inicial, movimento e posição final, usando o personagem padrão P90 e o equipamento correto do exercício.</p>
          </div>

          <div className="metricsGrid"><div><span>SÉRIES</span><b>{ex.sets}</b></div><div><span>REPETIÇÕES</span><b>{ex.reps}</b></div><div><span>DESCANSO</span><b>{ex.rest}</b></div><div><span>INTENSIDADE</span><b>Moderada</b></div></div>

          <div className="coachGrid"><div className="coachCard"><span className="coachIcon">✓</span><div><b>Como fazer</b><p>Controle a descida, mantenha o core firme e respeite a amplitude confortável.</p></div></div><div className="coachCard warning"><span className="coachIcon">!</span><div><b>Evite</b><p>Movimentos bruscos, compensações e cargas que prejudiquem a técnica.</p></div></div></div>

          <div className="detailActions"><button className="secondaryAction">☆ Salvar exercício</button><button className={`primaryAction ${completed.includes(selected)?'completed':''}`} onClick={toggleDone}>{completed.includes(selected)?'✓ Exercício concluído':'✓ Marcar como concluído'}</button></div>
        </article>
      </section>

      <nav className="mobileNav"><button className="active">⌂<span>Início</span></button><button>◆<span>Treino</span></button><button>↗<span>Evolução</span></button><button>☻<span>Perfil</span></button></nav>
    </main>
  </div>
}
