
import React from 'react';

interface ErrorDisplayProps {
  saveError?: string | null;
  generationError?: string | null;
  lastSavedAt?: Date | null;
}

const ErrorDisplay = ({ saveError, generationError, lastSavedAt }: ErrorDisplayProps) => {
  if (!saveError && !generationError && !lastSavedAt) return null;

  return (
    <div className="space-y-2 mt-4">
      {saveError && (
        <div className="text-red-500">Error: {saveError}</div>
      )}
      {generationError && (
        <div className="text-red-500">Error: {generationError}</div>
      )}
      {lastSavedAt && (
        <div className="text-sm text-gray-500">
          Last saved: {lastSavedAt.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default ErrorDisplay;
