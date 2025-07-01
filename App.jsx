import React, { useState } from 'react'

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

export default function App() {
  const [images, setImages] = useState([])
  const [question, setQuestion] = useState('')
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Handle file selection, max 4 images
  function handleFileChange(e) {
    const files = Array.from(e.target.files).slice(0, 4)
    setResponses([])
    setImages(files)
  }

  // Convert file to base64
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('File reading failed'))
      reader.readAsDataURL(file)
    })
  }

  async function handleSubmit() {
    if (!question.trim()) {
      setError('Please enter a question')
      return
    }
    if (images.length === 0) {
      setError('Please upload at least one image')
      return
    }
    setError(null)
    setLoading(true)
    setResponses([])
    try {
      // Prepare prompts for each image
      const imageData = await Promise.all(images.map(fileToBase64))

      const results = []
      for (let i = 0; i < imageData.length; i++) {
        const messages = [
          {
            role: 'system',
            content:
              'You are an AI assistant that answers questions about product images for e-commerce.'
          },
          {
            role: 'user',
            content: question
          },
          {
            role: 'user',
            content: `Here is the image data: ${imageData[i]}`
          }
        ]

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: messages,
            max_tokens: 200
          })
        })

        if (!response.ok) {
          throw new Error('OpenAI API error')
        }
        const data = await response.json()
        results.push(data.choices[0].message.content)
      }
      setResponses(results)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Image Checker Chat</h1>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        disabled={loading}
        style={{ marginBottom: 10 }}
      />
      <div>
        <small>Upload up to 4 images</small>
      </div>
      <textarea
        placeholder="Enter your question here..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        rows={3}
        style={{ width: '100%', marginTop: 10, padding: 8, fontSize: 16 }}
        disabled={loading}
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          marginTop: 10,
          padding: '10px 20px',
          fontSize: 16,
          cursor: 'pointer'
        }}
      >
        {loading ? 'Checking...' : 'Check Images'}
      </button>

      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}

      <div style={{ marginTop: 20 }}>
        {images.map((img, i) => (
          <div
            key={i}
            style={{
              border: '1px solid #ddd',
              borderRadius: 6,
              marginBottom: 20,
              padding: 10,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 15
            }}
          >
            <img
              src={URL.createObjectURL(img)}
              alt={`upload-${i}`}
              style={{ width: 150, height: 'auto', borderRadius: 6, objectFit: 'contain' }}
            />
            <div style={{ flex: 1 }}>
              <strong>Response for Image {i + 1}:</strong>
              <p style={{ marginTop: 6, whiteSpace: 'pre-wrap' }}>
                {responses[i] ? responses[i] : 'No response yet.'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
