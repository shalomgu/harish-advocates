import { useState, type FormEvent } from 'react'
import { OWNER_VIDEO_TARGETS } from '../content/ownerVideos'
import type { OwnerVideoTarget } from '../content/pages'
import { commitOwnerVideo, promoteOwnerVideosViaPr } from './github'
import {
  clearStoredPat,
  githubConfig,
  MAX_VIDEO_BYTES,
  readStoredPat,
  slugifyVideoFilename,
  storePat,
} from './utils'

type Phase = 'idle' | 'working' | 'done' | 'error'

export default function AdminApp() {
  const { owner, repo, branch, mainBranch } = githubConfig()
  const [pat, setPat] = useState(() => readStoredPat())
  const [target, setTarget] = useState<OwnerVideoTarget>('infoVideos')
  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [status, setStatus] = useState('')
  const [resultUrl, setResultUrl] = useState<string | null>(null)

  function onPatChange(value: string) {
    setPat(value)
    if (value.trim()) storePat(value.trim())
    else clearStoredPat()
  }

  function logout() {
    clearStoredPat()
    setPat('')
    setPhase('idle')
    setStatus('')
    setResultUrl(null)
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setResultUrl(null)

    const token = pat.trim()
    if (!token) {
      setPhase('error')
      setStatus('יש להדביק Personal Access Token.')
      return
    }
    const label = title.trim()
    if (!label) {
      setPhase('error')
      setStatus('יש להזין כותרת בעברית.')
      return
    }
    if (!file) {
      setPhase('error')
      setStatus('יש לבחור קובץ MP4.')
      return
    }
    if (!file.name.toLowerCase().endsWith('.mp4') && file.type !== 'video/mp4') {
      setPhase('error')
      setStatus('מותר להעלות קבצי MP4 בלבד.')
      return
    }
    if (file.size > MAX_VIDEO_BYTES) {
      setPhase('error')
      setStatus(`הקובץ גדול מדי (מקסימום ${MAX_VIDEO_BYTES / (1024 * 1024)}MB).`)
      return
    }

    const filename = slugifyVideoFilename(file.name)
    const targetLabel = OWNER_VIDEO_TARGETS.find((t) => t.id === target)?.label ?? target
    setPhase('working')
    setStatus('מתחילים…')

    try {
      const result = await commitOwnerVideo({
        pat: token,
        title: label,
        file,
        filename,
        target,
        onProgress: setStatus,
      })
      setPhase('done')
      setStatus(
        `נשמר ב־${branch} לדף ״${targetLabel}״: ${result.filename}. בדקו באתר ה־dev, ואז השתמשו ב״פרסום ל־main״.`,
      )
      setResultUrl(result.htmlUrl ?? null)
      setTitle('')
      setFile(null)
    } catch (err) {
      setPhase('error')
      setStatus(err instanceof Error ? err.message : 'שגיאה לא צפויה.')
    }
  }

  async function onPromoteToMain() {
    setResultUrl(null)
    const token = pat.trim()
    if (!token) {
      setPhase('error')
      setStatus('יש להדביק Personal Access Token.')
      return
    }
    if (
      !window.confirm(
        `ליצור Pull Request ל־${mainBranch} עם כל סרטוני ה־owner מ־${branch}?\n(רק קבצי וידאו + JSON — לא כל ענף ${branch})`,
      )
    ) {
      return
    }

    setPhase('working')
    setStatus('מתחילים פרסום…')
    try {
      const result = await promoteOwnerVideosViaPr({
        pat: token,
        onProgress: setStatus,
      })
      setPhase('done')
      setStatus(
        `נפתח PR #${result.prNumber} ל־${mainBranch} (${result.fileCount} קבצי וידאו). אשרו את ה־PR ב־GitHub כדי לפרסם לפרודקשן.`,
      )
      setResultUrl(result.prUrl)
    } catch (err) {
      setPhase('error')
      setStatus(err instanceof Error ? err.message : 'שגיאה לא צפויה.')
    }
  }

  return (
    <div className="admin">
      <header className="admin-header">
        <h1>הוספת סרטון לאתר</h1>
        <p className="admin-meta">
          העלאה ל־<code>{branch}</code> · פרסום דרך PR ל־<code>{mainBranch}</code> ב־
          <code>
            {owner}/{repo}
          </code>
        </p>
      </header>

      <form className="admin-form" onSubmit={onSubmit}>
        <label className="admin-field">
          <span>GitHub Personal Access Token</span>
          <input
            type="password"
            autoComplete="off"
            value={pat}
            onChange={(e) => onPatChange(e.target.value)}
            placeholder="github_pat_… או ghp_…"
            disabled={phase === 'working'}
          />
        </label>

        <fieldset className="admin-field admin-fieldset" disabled={phase === 'working'}>
          <legend>לאיזה דף להוסיף את הסרטון?</legend>
          <div className="admin-radios">
            {OWNER_VIDEO_TARGETS.map((opt) => (
              <label key={opt.id} className="admin-radio">
                <input
                  type="radio"
                  name="target"
                  value={opt.id}
                  checked={target === opt.id}
                  onChange={() => setTarget(opt.id)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="admin-field">
          <span>כותרת (עברית)</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="לדוגמה: על החשיבות בעריכת צוואה"
            disabled={phase === 'working'}
            required
          />
        </label>

        <label className="admin-field">
          <span>קובץ וידאו (MP4, עד 40MB)</span>
          <input
            type="file"
            accept="video/mp4,.mp4"
            disabled={phase === 'working'}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          {file && (
            <span className="admin-hint">
              {file.name} · {(file.size / (1024 * 1024)).toFixed(1)}MB →{' '}
              {slugifyVideoFilename(file.name)}
            </span>
          )}
        </label>

        <div className="admin-actions">
          <button type="submit" className="admin-btn" disabled={phase === 'working'}>
            {phase === 'working' ? 'מעלה…' : 'שמירה ל־dev'}
          </button>
          {pat && (
            <button type="button" className="admin-btn admin-btn--ghost" onClick={logout} disabled={phase === 'working'}>
              נקה טוקן
            </button>
          )}
        </div>
      </form>

      <section className="admin-promote">
        <h2>פרסום לפרודקשן</h2>
        <p className="admin-hint">
        אחרי שבדקת באתר הפיתוח לחץ על הכפתור          
        </p>
        <button
          type="button"
          className="admin-btn admin-btn--promote"
          onClick={onPromoteToMain}
          disabled={phase === 'working' || !pat.trim()}
        >
          פרסום ל־main (יצירת <strong>Pull Request</strong>)
        </button>
      </section>

      {status && (
        <p
          className={`admin-status${
            phase === 'error' ? ' is-error' : phase === 'done' ? ' is-ok' : ''
          }`}
          role="status"
        >
          {status}
          {resultUrl && (
            <>
              {' '}
              <a href={resultUrl} target="_blank" rel="noreferrer">
                פתיחה ב־GitHub
              </a>
            </>
          )}
        </p>
      )}
    </div>
  )
}
