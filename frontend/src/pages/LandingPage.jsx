import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const columns = [
  { name: 'To Do', className: 'todo', tasks: ['Plan the next task', 'Write clear details'] },
  { name: 'Doing', className: 'doing', tasks: ['Move work forward'] },
  { name: 'Done', className: 'done', tasks: ['Keep progress visible'] },
]

export default function LandingPage() {
  const { user } = useAuth()
  const workspacePath = user?.role === 'admin' ? '/admin' : '/board'

  return <div className="landing-page">
    <header className="landing-nav">
      <Link className="brand" to="/"><span className="brand-mark">T</span><span>TaskTrack</span></Link>
      <nav aria-label="Main navigation">
        <a href="#features">Features</a>
        <a href="#workflow">How it works</a>
      </nav>
      <div className="landing-actions">
        {user ? <Link className="button primary" to={workspacePath}>Open workspace</Link> : <><Link className="button ghost" to="/login">Log in</Link><Link className="button primary" to="/register">Register</Link></>}
      </div>
    </header>

    <main>
      <section className="landing-hero">
        <div className="hero-copy">
          <span className="eyebrow">A SIMPLE TASK WORKSPACE</span>
          <h1>Keep work clear.<br /><span>Make progress visible.</span></h1>
          <p>TaskTrack gives your team one focused board to create, assign, and move tasks from To Do to Done.</p>
          <div className="hero-actions">
            <Link className="button primary large" to={user ? workspacePath : '/register'}>{user ? 'Open your workspace' : 'Create your account'} <span>→</span></Link>
            {!user && <Link className="button quiet large" to="/login">I already have an account</Link>}
          </div>
        </div>
        <div className="board-preview" aria-label="Preview of the TaskTrack board">
          <div className="preview-toolbar"><span /><span /><span /><strong>Task board</strong></div>
          <div className="preview-columns">
            {columns.map((column) => <div className="preview-column" key={column.name}>
              <div className="preview-column-title"><span className={`column-icon ${column.className}`} />{column.name}<small>{column.tasks.length}</small></div>
              {column.tasks.map((task) => <div className="preview-task" key={task}><span className={`preview-tag ${column.className}`} /> <strong>{task}</strong><div><i /><i /></div></div>)}
            </div>)}
          </div>
        </div>
      </section>

      <section className="landing-section" id="features">
        <div className="section-heading"><span className="eyebrow">WHAT TASKTRACK DOES</span><h2>The essentials for managing work</h2><p>No unnecessary dashboards—just the tools required to organize tasks and ownership.</p></div>
        <div className="feature-grid">
          <article><span className="feature-icon">✓</span><h3>Clear workflow</h3><p>Organize every task in exactly three stages: To Do, Doing, and Done.</p></article>
          <article><span className="feature-icon">↔</span><h3>Drag and drop</h3><p>Move tasks between columns and keep each status saved in your workspace.</p></article>
          <article><span className="feature-icon">◎</span><h3>Task ownership</h3><p>Users can claim eligible tasks while administrators manage assignments across the workspace.</p></article>
          <article><span className="feature-icon">◇</span><h3>Role-based access</h3><p>User and administrator permissions are checked by the backend on protected actions.</p></article>
        </div>
      </section>

      <section className="workflow-section" id="workflow">
        <div className="workflow-copy"><span className="eyebrow">HOW IT WORKS</span><h2>From an idea to finished work</h2><p>Create a task with the details people need, assign responsibility, then move it across the board as work progresses.</p></div>
        <ol className="workflow-steps"><li><span>01</span><div><strong>Create</strong><p>Add a title and an optional description.</p></div></li><li><span>02</span><div><strong>Assign</strong><p>Claim an eligible task or let an administrator assign it.</p></div></li><li><span>03</span><div><strong>Complete</strong><p>Drag it through Doing and into Done.</p></div></li></ol>
      </section>

      <section className="landing-cta"><div><span className="eyebrow">READY TO ORGANIZE YOUR WORK?</span><h2>Start with a clear board.</h2></div><Link className="button light-button large" to={user ? workspacePath : '/register'}>{user ? 'Open workspace' : 'Create an account'} →</Link></section>
    </main>

    <footer className="landing-footer"><Link className="brand" to="/"><span className="brand-mark">T</span><span>TaskTrack</span></Link><p>A simple task management application.</p></footer>
  </div>
}
