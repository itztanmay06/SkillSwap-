import React from 'react';

// Computes a deterministic gradient based on user name string
function getAvatarGradient(name = '') {
  const gradients = [
    'linear-gradient(135deg, #10b981, #059669)', // Emerald (Brand color)
    'linear-gradient(135deg, #6366f1, #4f46e5)', // Indigo
    'linear-gradient(135deg, #3b82f6, #1d4ed8)', // Blue
    'linear-gradient(135deg, #8b5cf6, #6d28d9)', // Purple
    'linear-gradient(135deg, #f59e0b, #b45309)', // Amber
    'linear-gradient(135deg, #ec4899, #be185d)', // Pink
    'linear-gradient(135deg, #14b8a6, #0f766e)', // Teal
    'linear-gradient(135deg, #f97316, #c2410c)', // Orange
    'linear-gradient(135deg, #0ea5e9, #0369a1)', // Sky Blue
    'linear-gradient(135deg, #a855f7, #7e22ce)'  // Violet
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

// Letter initial avatar generator
export default function Avatar({ name = 'User', size = 'sm', className = '', onClick, style = {} }) {
  // Extract first letter
  const initial = (name ? name.trim().charAt(0) : '?').toUpperCase();
  const background = getAvatarGradient(name);

  // Predefined avatar dimensions
  const sizeMap = {
    sm: { width: '34px', height: '34px', fontSize: '14px', borderRadius: '8px' },
    header: { width: '38px', height: '38px', fontSize: '16px', borderRadius: '10px' },
    md: { width: '44px', height: '44px', fontSize: '18px', borderRadius: '12px' },
    lg: { width: '72px', height: '72px', fontSize: '30px', borderRadius: '18px' }
  };

  const currentSize = sizeMap[size] || sizeMap.sm;

  return (
    <div
      onClick={onClick}
      className={`initial-avatar ${className}`}
      style={{
        ...currentSize,
        background,
        color: '#ffffff',
        fontWeight: '700',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        flexShrink: 0,
        boxShadow: '0 2px 5px rgba(0,0,0,0.12)',
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
      title={name}
      aria-label={name}
    >
      {initial}
    </div>
  );
}
