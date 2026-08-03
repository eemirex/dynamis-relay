import Link from "next/link";
import { ArrowRight, Bot, Check, Gauge, Headphones, MessageSquare, Radio, RefreshCw, ShieldCheck, Sparkles, Workflow } from "lucide-react";

const proof = [{ value: "41%", label: "faster resolution" }, { value: "72%", label: "AI draft acceptance" }, { value: "99.95%", label: "event delivery target" }];

export default function Home() {
  return (
    <main className="marketing-shell">
      <nav className="marketing-nav">
        <Link href="/" className="relay-brand" aria-label="Dynamis Relay home"><span className="relay-mark"><Radio size={15} /></span><strong>Dynamis</strong><span>Relay</span></Link>
        <div className="marketing-links"><a href="#platform">Platform</a><a href="#reliability">Reliability</a><a href="#intelligence">Intelligence</a></div>
        <Link className="nav-demo" href="/workspace">Open live workspace <ArrowRight size={14} /></Link>
      </nav>

      <section className="relay-hero">
        <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
        <div className="relay-hero-copy">
          <span className="relay-eyebrow"><Sparkles size={13} /> AI customer operations</span>
          <h1>Resolve faster.<br /><span>Stay human.</span></h1>
          <p>One support workspace for every conversation, answer, SLA, and customer signal—with AI that assists your team without taking control away.</p>
          <div className="hero-actions"><Link href="/workspace" className="primary-link">Explore Dynamis Relay <ArrowRight size={15} /></Link><a href="#platform" className="secondary-link">See how it works</a></div>
          <small><ShieldCheck size={13} /> Human approval by default · Full audit history</small>
        </div>

        <div className="relay-product" aria-label="Dynamis Relay support workspace preview">
          <div className="preview-sidebar">
            <div className="preview-logo"><span><Radio size={10} /></span><b>Relay</b></div>
            {['Overview','Inbox','Queues','Knowledge','Customers','Analytics'].map((item, index) => <span key={item} className={index === 1 ? 'active' : ''}><i />{item}{index === 1 && <b>12</b>}</span>)}
          </div>
          <div className="preview-main">
            <div className="preview-top"><span>Search conversations, customers…</span><b>Ask Relay ✦</b><i>EE</i></div>
            <div className="preview-body">
              <div className="preview-list"><small>PRIORITY INBOX</small>{['Unable to export monthly finance report','Webhook signatures changed after rotation','SSO mapping for contractor accounts'].map((text,index)=><div key={text} className={index===0?'selected':''}><i>{['AO','DM','NJ'][index]}</i><p><b>{text}</b><span>{['Kora Labs · 4m','Fieldwork · 17m','BrightPay · 22m'][index]}</span></p>{index===0&&<em>URGENT</em>}</div>)}</div>
              <div className="preview-thread"><span className="ticket-id">RLY-1048 · OPEN</span><h3>Unable to export monthly finance report</h3><div className="preview-message"><i>AO</i><p><b>Amara Okafor</b><span>The export has failed three times and our board pack is due today.</span></p></div><div className="preview-signal"><Sparkles size={12}/><p><b>Relay detected urgency</b><span>Board deadline today · negative sentiment · enterprise account</span></p><em>94%</em></div><div className="preview-draft"><small>AI DRAFT · GROUNDED IN 3 SOURCES</small><p>Hi Amara — I can see the export job is failing during entity consolidation. I’ve restarted it with…</p><button>Review & send <ArrowRight size={10}/></button></div></div>
            </div>
          </div>
          <div className="delivery-float"><span><RefreshCw size={15}/></span><p><b>Delivery recovered</b><small>Webhook succeeded on attempt 3</small></p><em>12s ago</em></div>
        </div>
      </section>

      <section className="trust-strip"><span>Built for support teams at</span><div><b>northstar</b><b>kora</b><b>aperture</b><b>brightpay</b><b>fieldwork</b></div></section>

      <section className="platform-section" id="platform">
        <div className="section-heading"><span className="relay-eyebrow dark">THE WHOLE CUSTOMER STORY</span><h2>Clarity for every conversation.</h2><p>Relay connects the queue, the customer, and the knowledge your team needs to act with confidence.</p></div>
        <div className="platform-grid">
          <article className="platform-wide"><span className="feature-number">01</span><div><Headphones size={23}/><h3>A calmer shared inbox</h3><p>Prioritize by urgency, SLA risk, customer sentiment, and business impact—not just arrival time.</p></div><div className="queue-visual"><span><i className="urgent"/>Urgent <b>3</b></span><span><i className="high"/>High priority <b>7</b></span><span><i className="normal"/>Standard <b>24</b></span><span><i className="waiting"/>Waiting <b>11</b></span></div></article>
          <article><Bot size={23}/><h3>AI answers with evidence</h3><p>Draft from trusted knowledge, ticket history, and customer context. Agents see the sources before anything is sent.</p><div className="source-pills"><span><Check size={11}/> Help center</span><span><Check size={11}/> Account history</span><span><Check size={11}/> Product status</span></div></article>
          <article><Gauge size={23}/><h3>Operations in real time</h3><p>Track load, response time, resolution quality, SLA risk, and automation health from one command center.</p><div className="mini-bars">{[64,82,49,91,73,88,68].map((v,i)=><i key={i} style={{height:`${v}%`}} />)}</div></article>
        </div>
      </section>

      <section className="reliability-section" id="reliability">
        <div><span className="relay-eyebrow">RELIABILITY BY DESIGN</span><h2>Every message gets a deliberate outcome.</h2><p>Inbound events are deduplicated, processed asynchronously, and retried with exponential backoff and jitter. Persistent failures move to a visible dead-letter queue instead of disappearing.</p><Link href="/workspace" className="text-link">Inspect the reliability console <ArrowRight size={14}/></Link></div>
        <div className="event-flow"><div><span>01</span><i><MessageSquare size={17}/></i><p><b>Receive</b><small>Validate + deduplicate</small></p></div><em/><div><span>02</span><i><Workflow size={17}/></i><p><b>Process</b><small>Classify + route</small></p></div><em/><div><span>03</span><i><RefreshCw size={17}/></i><p><b>Deliver</b><small>Retry + audit</small></p></div></div>
      </section>

      <section className="intelligence-band" id="intelligence"><div><span className="relay-eyebrow">SUPPORT INTELLIGENCE</span><h2>AI that knows when to help—and when to step back.</h2></div><div>{['Grounded drafting','Intent and sentiment','Conversation summaries','Quality coaching'].map((title,index)=><article key={title}><span>0{index+1}</span><h3>{title}</h3><p>{['Replies cite the exact knowledge and context used.','Urgency and emotion shape routing without hiding the original message.','Long threads become decisions, actions, and unresolved questions.','Review response clarity, empathy, accuracy, and policy compliance.'][index]}</p></article>)}</div></section>

      <section className="proof-band"><div><span className="relay-eyebrow dark">MEASURE WHAT CUSTOMERS FEEL</span><h2>Less queue anxiety.<br/>More useful answers.</h2></div><div className="proof-grid">{proof.map(item=><div key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>)}</div></section>
      <footer className="relay-footer"><div className="relay-brand"><span className="relay-mark"><Radio size={15}/></span><strong>Dynamis</strong><span>Relay</span></div><p>Support operations without the chaos.</p><span>© 2026 Dynamis</span></footer>
    </main>
  );
}
