import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { QUIZ_QUESTIONS, tallyQuizScores, getTopCategories } from '../data/quizConfig'

const STORAGE_KEY = 'happytails_quiz_payload'

const buttonBase = {
  padding: '12px 24px',
  borderRadius: 999,
  fontWeight: 600,
  fontSize: 15,
  border: 'none',
  cursor: 'pointer',
}

export default function QuizQuestions() {
  const navigate = useNavigate()
  const { isStaff } = useAuth()
  const questions = QUIZ_QUESTIONS
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState(() => ({}))
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isStaff) {
      navigate('/profile', { replace: true })
    }
  }, [isStaff, navigate])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentIndex])

  const currentQuestion = questions[currentIndex]
  const progress = useMemo(() => ((currentIndex + 1) / questions.length) * 100, [currentIndex, questions.length])

  const selectOption = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }))
    setError(null)
  }

  const goNext = () => {
    if (!answers[currentQuestion.id]) {
      setError('Please choose an option to continue.')
      return
    }
    if (currentIndex === questions.length - 1) {
      handleSubmit()
      return
    }
    setCurrentIndex((prev) => prev + 1)
  }

  const goBack = () => {
    if (currentIndex === 0) return
    setCurrentIndex((prev) => prev - 1)
    setError(null)
  }

  const handleSubmit = () => {
    const unanswered = questions.find((question) => !answers[question.id])
    if (unanswered) {
      setCurrentIndex(questions.indexOf(unanswered))
      setError('Please finish every question before submitting.')
      return
    }

    const detailedAnswers = questions.map((question) => {
      const selected = answers[question.id]
      return {
        id: question.id,
        prompt: question.prompt,
        option: selected.label,
        scores: selected.scores,
      }
    })

    const totals = tallyQuizScores(detailedAnswers)
    const topCategories = getTopCategories(totals)

    const payload = {
      answers: detailedAnswers,
      totals,
      topCategories: topCategories.map((category) => category.id),
      completedAt: new Date().toISOString(),
    }

    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch (err) {
      console.error('Unable to persist quiz results', err)
    }

    navigate('/quiz/results', { state: { fromQuestions: true } })
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gradient-soft)' }}>
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '48px clamp(24px, 7vw, 72px)', display: 'grid', gap: 32 }}>
        <header style={{ display: 'grid', gap: 12 }}>
          <span className="badge">Lifestyle Matching Quiz</span>
          <h1 style={{ margin: 0, fontSize: '2.2rem', color: '#253b2f' }}>Question {currentIndex + 1} of {questions.length}</h1>
          <p style={{ margin: 0, color: '#5e7263', fontSize: '1.05rem' }}>
            Choose the response that best reflects your routine. We&apos;ll tailor recommendations to match your pace,
            household, and the type of companionship you’re seeking.
          </p>
        </header>

        <div style={{ background: '#fff', borderRadius: 28, padding: '32px clamp(22px, 6vw, 46px)', boxShadow: '0 16px 48px rgba(84,135,104,0.12)', display: 'grid', gap: 28 }}>
          <div style={{ height: 6, borderRadius: 999, background: '#edf1e3', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: '#78c977' }} />
          </div>

          <div style={{ display: 'grid', gap: 20 }}>
            <h2 style={{ margin: 0, fontSize: '1.6rem', color: '#253b2f' }}>{currentQuestion.prompt}</h2>
            <div style={{ display: 'grid', gap: 14 }}>
              {currentQuestion.options.map((option) => {
                const isSelected = answers[currentQuestion.id]?.value === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => selectOption(currentQuestion.id, option)}
                    style={{
                      borderRadius: 20,
                      border: isSelected ? '2px solid #78c977' : '1px solid rgba(84,135,104,0.25)',
                      background: isSelected ? 'rgba(120, 201, 119, 0.12)' : '#fff',
                      padding: '16px 18px',
                      textAlign: 'left',
                      color: '#253b2f',
                      fontSize: 15,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(210, 63, 87, 0.12)', color: '#812334', padding: '12px 18px', borderRadius: 16, fontWeight: 600 }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <button
              type="button"
              onClick={goBack}
              disabled={currentIndex === 0}
              className="btn btn-outline"
              style={{ ...buttonBase, background: 'transparent', border: '1.5px solid #c1f2bb', color: '#4f8a3a' }}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={goNext}
              className="btn btn-primary"
              style={{
                ...buttonBase,
                background: '#78c977',
                color: '#fff',
                boxShadow: '0 10px 24px rgba(120, 201, 119, 0.32)',
                minWidth: 170,
              }}
            >
              {currentIndex === questions.length - 1 ? 'See my matches' : 'Next question'}
            </button>
          </div>
        </div>

        <section className="surface-card" style={{ borderRadius: 24, padding: '24px clamp(20px, 5vw, 36px)', display: 'grid', gap: 10, color: '#5e7263', fontSize: 14 }}>
          <strong style={{ color: '#4f8a3a' }}>Tip:</strong>
          <span>
            Stuck between options? Choose the one that reflects most days of the week. Your results highlight multiple profiles
            when scores are close.
          </span>
        </section>
      </main>
    </div>
  )
}
