import { useState } from 'react'

export default function QuoteForm() {
  const [text, setText] = useState('')
  const [template, setTemplate] = useState('template1')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, template }),
      })

      const data = await response.json()
      
      if (data.success) {
        setMessage('Image sent to your email!')
        setText('')
      } else {
        setMessage('Error generating image. Please try again.')
      }
    } catch (error) {
      setMessage('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="quote-form">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your quote here..."
        rows={6}
        required
      />
      
      <div className="template-selector">
        <label>Select Template:</label>
        <div className="template-options">
          {['template1', 'template2', 'template3'].map((t) => (
            <label key={t}>
              <input
                type="radio"
                value={t}
                checked={template === t}
                onChange={(e) => setTemplate(e.target.value)}
              />
              {t}
            </label>
          ))}
        </div>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Generating...' : 'Generate & Send'}
      </button>

      {message && <p className="message">{message}</p>}
    </form>
  )
}
