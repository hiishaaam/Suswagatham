import React from 'react';

export interface DynamicTheme {
  theme_id: string;
  theme_name: string;
  mood: string;
  background: string;
  border_style: string;
  font_heading: string;
  font_body: string;
  heading_color: string;
  body_color: string;
  accent_color: string;
  layout: 'centered-portrait' | 'split-panel' | 'layered-overlap';
}

interface DynamicTemplateProps {
  theme: DynamicTheme;
  data: {
    coupleNames: string;
    date: string;
    venue: string;
    ceremonyType: string;
  };
}

export default function DynamicTemplate({ theme, data }: DynamicTemplateProps) {
  // Use a link tag to lazily load the requested Google Fonts
  const fontUrl = `https://fonts.googleapis.com/css2?family=${theme.font_heading.replace(/ /g, '+')}:ital,wght@0,400;0,700;1,400&family=${theme.font_body.replace(/ /g, '+')}:wght@400;600&display=swap`;

  const getLayoutClasses = () => {
    switch (theme.layout) {
      case 'split-panel':
        return 'flex-col justify-between';
      case 'layered-overlap':
        return 'flex-col justify-center gap-12 relative';
      case 'centered-portrait':
      default:
        return 'flex-col justify-center items-center text-center gap-8';
    }
  };

  return (
    <div 
      className="w-full h-[600px] sm:h-[700px] overflow-hidden relative flex shadow-2xl rounded-lg"
      style={{ background: theme.background }}
    >
      <link href={fontUrl} rel="stylesheet" />
      
      {/* Texture overlay (mocked using a subtle CSS pattern) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
           style={{
             backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 1px)',
             backgroundSize: '24px 24px'
           }}
      />

      {/* Decorative Border */}
      <div className="absolute inset-4 sm:inset-6 z-10 pointer-events-none"
           style={{ border: theme.border_style, borderRadius: '8px' }}
      />

      {/* Main Content Area */}
      <div className={`relative z-20 w-full h-full p-8 flex ${getLayoutClasses()} text-center`} style={{ color: theme.body_color }}>
        
        <div className="top-section">
            <div style={{ color: theme.accent_color, fontFamily: `"${theme.font_body}", serif`, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '10px' }} className="mb-4">
              Join us to celebrate the {data.ceremonyType} of
            </div>
            <h1 
              style={{ fontFamily: `"${theme.font_heading}", serif`, color: theme.heading_color }}
              className="text-5xl sm:text-6xl drop-shadow-md leading-tight"
            >
              {data.coupleNames || 'Rahul & Priya'}
            </h1>
        </div>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center my-6">
          <div className="w-16 h-[1px]" style={{ backgroundColor: theme.accent_color }} />
          <div className="w-2 h-2 rotate-45 mx-2" style={{ border: `1px solid ${theme.accent_color}` }} />
          <div className="w-16 h-[1px]" style={{ backgroundColor: theme.accent_color }} />
        </div>

        <div className="bottom-section space-y-4">
            <div style={{ fontFamily: `"${theme.font_body}", serif`, fontSize: '1.2rem', letterSpacing: '0.05em' }}>
              {data.date || 'December 28, 2026'}
            </div>
            
            <div style={{ fontFamily: `"${theme.font_body}", sans-serif`, fontSize: '0.9rem', opacity: 0.8 }} className="max-w-[250px] mx-auto leading-relaxed">
              {data.venue || 'Taj Malabar Resort & Spa, Kochi'}
            </div>
        </div>
      </div>
    </div>
  );
}
