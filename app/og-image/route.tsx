import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'AILINKXIN - AI Agent System';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '80px',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            marginBottom: '20px',
            letterSpacing: '-0.02em',
          }}
        >
          AILINKXIN
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 600,
            marginBottom: '30px',
            textAlign: 'center',
            maxWidth: '900px',
          }}
        >
          AI Agent System
        </div>
        <div
          style={{
            fontSize: 24,
            opacity: 0.9,
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.5,
          }}
        >
          Professional AI agent system for intelligent customer service, automated marketing, and business automation
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

