const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'stitch_templates');
const outputDir = path.join(__dirname, 'components', 'templates');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const folders = fs.readdirSync(templatesDir);

folders.forEach(folder => {
  const htmlFile = path.join(templatesDir, folder, 'index.html');
  if (!fs.existsSync(htmlFile)) return;

  const html = fs.readFileSync(htmlFile, 'utf8');

  // Extract body content
  let bodyContent = '';
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let bodyClass = '';
  const bodyClassMatch = html.match(/<body[^>]*class="([^"]*)"/i);
  if (bodyClassMatch) bodyClass = bodyClassMatch[1];
  
  if (bodyMatch) {
    bodyContent = bodyMatch[1];
  } else {
    bodyContent = html; // fallback
  }

  // Extract styles (to keep scrolling-bg and material symbols configs)
  let styles = '';
  const styleMatches = [...html.matchAll(/<style>([\s\S]*?)<\/style>/gi)];
  styleMatches.forEach(m => {
    styles += m[1] + '\n';
  });

  // Extract colors from Tailwind config to generate CSS variables
  let cssVariables = '';
  const twMatch = html.match(/tailwind\.config\s*=\s*({[\s\S]*?})\s*<\/script>/i);
  if (twMatch) {
    try {
      // Very naive extraction of hex colors from string match since we can't eval easily without sanitizing
      const colorMatches = [...twMatch[1].matchAll(/"([^"]+)":\s*"([^"]+)"/g)];
      colorMatches.forEach(m => {
        if (m[2].startsWith('#')) {
          cssVariables += `  --color-${m[1]}: ${m[2]};\n`;
        }
      });
    } catch(e) {}
  }

  // JSX Conversion
  let jsx = bodyContent
    .replace(/class=/g, 'className=')
    .replace(/for=/g, 'htmlFor=')
    .replace(/<!--[\s\S]*?-->/g, '') // remove HTML comments
    .replace(/<img(.*?)>/g, (match) => {
        // Close img tags
        if (!match.endsWith('/>')) return match.replace(/>$/, ' />');
        return match;
    })
    .replace(/<input(.*?)>/g, (match) => {
        if (!match.endsWith('/>')) return match.replace(/>$/, ' />');
        return match;
    })
    .replace(/<br>/g, '<br />')
    .replace(/<hr(.*?)>/g, (match) => {
        if (!match.endsWith('/>')) return match.replace(/>$/, ' />');
        return match;
    });

  // CamelCasing style attributes mapping
  jsx = jsx.replace(/style="([^"]*)"/g, (match, p1) => {
    // converts style="font-variation-settings: 'FILL' 1;" to style={{ fontVariationSettings: "'FILL' 1" }}
    if (!p1.trim()) return '';
    try {
      const parts = p1.split(';').filter(Boolean);
      const styleObj = {};
      parts.forEach(part => {
        let [key, val] = part.split(':');
        if (key && val) {
          key = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
          styleObj[key] = val.trim();
        }
      });
      return `style={${JSON.stringify(styleObj)}}`;
    } catch(e) {
      return '';
    }
  });

  // Create component name
  const componentName = folder.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');

  // Extract Tailwind config block literally to inject it securely
  let tailwindConfigString = 'tailwind.config = {}';
  if (twMatch) {
    tailwindConfigString = twMatch[0].replace(/<\/?script[^>]*>/gi, '');
  }

  const templateCode = `// Auto-generated Template: ${componentName}
import React from 'react';
import Script from 'next/script';

export default function ${componentName}() {
  return (
    <div className={\`${bodyClass}\`} style={{ minHeight: '100dvh' }}>
      <Script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" strategy="lazyOnload" />
      <Script 
        id="tailwind-config-${componentName}" 
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{ __html: ${JSON.stringify(tailwindConfigString)} }}
      />
      <style dangerouslySetInnerHTML={{__html: \`
${styles}
      \`}} />
      ${jsx}
    </div>
  );
}
`;

  const outFile = path.join(outputDir, `${componentName}.tsx`);
  fs.writeFileSync(outFile, templateCode);
  console.log(`✓ Ported ${folder} -> ${componentName}.tsx`);
});
