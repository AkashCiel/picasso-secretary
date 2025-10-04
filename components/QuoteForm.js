import { useState } from 'react'
import ImagePreview from './ImagePreview'
import TemplateService from '../lib/template-service.js'
import { API } from '../config/constants.js'

export default function QuoteForm() {
  const [text, setText] = useState('')
  const [template, setTemplate] = useState('template1')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [generatedImages, setGeneratedImages] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setGeneratedImages([])

    try {
      const response = await fetch(API.ENDPOINTS.GENERATE_IMAGE, {
        method: API.METHODS.POST,
        headers: {
          'Content-Type': API.HEADERS.CONTENT_TYPE,
        },
        body: JSON.stringify({ text, template }),
      })

      const data = await response.json()
      
      if (data.success) {
        setMessage(`Generated ${data.imageCount} image(s) successfully!`)
        setGeneratedImages(data.images || [])
      } else {
        setMessage('Error generating images. Please try again.')
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
        placeholder="Enter your quote here... Use **bold** for emphasis. Use '---' to separate multiple images."
        rows={6}
        required
      />
      
      <div className="template-selector">
        <label>Select Template:</label>
        <div className="template-options">
          {TemplateService.getAllTemplates().map((t) => (
            <label key={t.value}>
              <input
                type="radio"
                value={t.value}
                checked={template === t.value}
                onChange={(e) => setTemplate(e.target.value)}
              />
              {t.label}
            </label>
          ))}
        </div>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Generating...' : 'Generate Images'}
      </button>

      {message && <p className="message">{message}</p>}
      
      {generatedImages.length > 0 && (
        <ImagePreview images={generatedImages} template={template} />
      )}
    </form>
  )
}
