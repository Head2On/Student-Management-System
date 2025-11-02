"use client";
import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ConfettiPiece {
  id: number;
  left: number;
  animationDelay: number;
  animationDuration: number;
  color: string;
  shape: string;
  rotation: number;
  size: number;
}

export default function SuccessPage() {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Generate confetti pieces
    const pieces: ConfettiPiece[] = [];
    const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    const shapes = ['circle', 'square', 'triangle'];
    
    for (let i = 0; i < 100; i++) {
      pieces.push({
        id: i,
        left: Math.random() * 100,
        animationDelay: Math.random() * 3,
        animationDuration: 3 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        rotation: Math.random() * 360,
        size: 8 + Math.random() * 8
      });
    }
    setConfetti(pieces);
  }, []);

  const handleGoBack = () => {
    router.push('/courses');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
      {/* Confetti Animation */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${piece.left}%`,
            top: '-20px',
            animationDelay: `${piece.animationDelay}s`,
            animationDuration: `${piece.animationDuration}s`,
            transform: `rotate(${piece.rotation}deg)`
          }}
        >
          {piece.shape === 'circle' && (
            <div
              className="rounded-full"
              style={{
                width: `${piece.size}px`,
                height: `${piece.size}px`,
                backgroundColor: piece.color
              }}
            />
          )}
          {piece.shape === 'square' && (
            <div
              className="rounded-sm"
              style={{
                width: `${piece.size}px`,
                height: `${piece.size}px`,
                backgroundColor: piece.color
              }}
            />
          )}
          {piece.shape === 'triangle' && (
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: `${piece.size / 2}px solid transparent`,
                borderRight: `${piece.size / 2}px solid transparent`,
                borderBottom: `${piece.size}px solid ${piece.color}`
              }}
            />
          )}
        </div>
      ))}

      {/* Success Card */}
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full mx-4 text-center relative z-10 animate-scale-in">
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center animate-bounce-once shadow-lg">
            <Check size={48} className="text-white" strokeWidth={3} />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Thank you for your purchase
        </h1>
        <p className="text-gray-600 mb-2">
          Your account has been upgraded to <span className="font-semibold text-gray-800">Shifty Plus</span>. You`@apos`ll be
        </p>
        <p className="text-gray-600 mb-8">
          receiving an email shortly with purchase details.
        </p>

        {/* Order Number */}
        <div className="mb-8">
          <p className="text-sm text-gray-500">Order #1234567890</p>
        </div>

        {/* Go to Homepage Button */}
        <button 
          onClick={handleGoBack}
          className="bg-gray-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors inline-flex items-center gap-2 group"
        >
          <span>Go to Homepage</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>

      <style jsx global>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes scale-in {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes bounce-once {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }

        .animate-confetti-fall {
          animation: confetti-fall linear forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }

        .animate-bounce-once {
          animation: bounce-once 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}