// For App Router: app/user-inputs/page.tsx
// For Pages Router: pages/user-inputs.tsx

'use client';

import { useState, FormEvent } from 'react';

export default function UserInputsPage() {
  const [sentence, setSentence] = useState('');
  const [integer1, setInteger1] = useState('');
  const [integer2, setInteger2] = useState('');

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setImageSrc(null); // Clear previous image

    const num1 = parseInt(integer1, 10);
    const num2 = parseInt(integer2, 10);

    if (isNaN(num1) || isNaN(num2)) {
      setError('Please enter valid integer values.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/viz_heatmap', { // ADJUST YOUR API ENDPOINT URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          msg: sentence,
          layer: num1,
          head: num2,
        }),
      });

      if (!response.ok) {
        let errorMsg = `Error: ${response.status}`;
        try {
          const errorData = await response.json(); // Try to get error from backend
          errorMsg = errorData.error || errorMsg;
        } catch (e) {
          // Backend did not send JSON error, or other issue
        }
        throw new Error(errorMsg);
      }

      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageSrc(imageUrl);

    } catch (err: any) {
      setError(err.message || 'Failed to generate image. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  // --- Style Objects (optional, but can make JSX cleaner) ---
  const pageStyle = {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '550px',
    margin: '40px auto',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    background: '#f9f9f9',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column' as 'column', // Required for TypeScript
    gap: '18px',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontWeight: 'bold' as 'bold',
    color: '#333',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box' as 'border-box',
    fontSize: '1rem',
    backgroundColor: '#ffffff', 
    color: '#333333',         
  };

  const buttonStyle = {
    padding: '12px 18px',
    backgroundColor: loading ? '#aaa' : '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: loading ? 'not-allowed' : 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold' as 'bold',
    transition: 'background-color 0.2s ease',
  };

  const errorStyle = {
    color: '#D8000C', // Dark red
    backgroundColor: '#FFD2D2', // Light red
    border: '1px solid #D8000C',
    padding: '10px',
    borderRadius: '4px',
    marginTop: '15px',
    textAlign: 'center' as 'center',
  };

  const imageContainerStyle = {
    marginTop: '25px',
    textAlign: 'center' as 'center',
  };

  const imageStyle = {
    maxWidth: '100%',
    height: 'auto',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginTop: '10px',
  };
  // --- End Style Objects ---


  return (
    <div style={pageStyle}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '25px' }}>Image Generator</h1>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div>
          <label htmlFor="sentence" style={labelStyle}>Sentence:</label>
          <input
            type="text"
            id="sentence"
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            placeholder="Enter your sentence here"
            required
            disabled={loading}
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="integer1" style={labelStyle}>Layer (Integer):</label>
          <input
            type="number"
            id="integer1"
            value={integer1}
            onChange={(e) => setInteger1(e.target.value)}
            placeholder="e.g., 0"
            required
            disabled={loading}
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="integer2" style={labelStyle}>Head (Integer):</label>
          <input
            type="number"
            id="integer2"
            value={integer2}
            onChange={(e) => setInteger2(e.target.value)}
            placeholder="e.g., 0"
            required
            disabled={loading}
            style={inputStyle}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={buttonStyle}
          onMouseOver={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#0056b3'; }}
          onMouseOut={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#007bff'; }}
        >
          {loading ? 'Generating...' : 'Generate Image'}
        </button>
      </form>

      {error && <p style={errorStyle}>Error: {error}</p>}

      {imageSrc && (
        <div style={imageContainerStyle}>
          <h2 style={{ color: '#2c3e50', marginBottom: '10px' }}>Generated Image:</h2>
          <img src={imageSrc} alt="Generated by backend" style={imageStyle} />
        </div>
      )}
    </div>
  );
}