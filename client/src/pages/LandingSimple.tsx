import React from 'react';

export function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            FireBrandIQ
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            AI-Powered Brand Intelligence Platform
          </p>
          <div className="space-y-4">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg">
              Get Started
            </button>
            <div className="text-sm text-gray-500">
              Build is working! 🎉
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}