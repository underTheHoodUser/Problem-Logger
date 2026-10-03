"use client";
import { Toaster as HotToaster } from 'react-hot-toast';

export default function Toaster() {
  return (
    <HotToaster 
      position="top-center"
      toastOptions={{
        style: {
          background: '#111',
          color: '#fff',
          border: '4px solid #000',
          boxShadow: '4px 4px 0 0 #000',
          borderRadius: '12px',
          fontFamily: 'var(--font-sans)',
          fontWeight: 'bold',
          textTransform: 'uppercase',
        },
        success: {
          style: {
            borderColor: '#4ade80',
            boxShadow: '4px 4px 0 0 #4ade80',
          }
        },
        error: {
          style: {
            borderColor: '#ef4444',
            boxShadow: '4px 4px 0 0 #ef4444',
          }
        }
      }}
    />
  );
}
