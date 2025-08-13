import { useEffect, useState } from 'react';

export default function Home() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL}/api/health`)
      .then(res => res.json())
      .then(data => {
        setStatus(data.status);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to connect to backend');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{color:'red'}}>Error: {error}</div>;
  return <div>Backend status: <b>{status}</b></div>;
}
