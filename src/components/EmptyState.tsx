import React from 'react';
import { UtensilsCrossed } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <UtensilsCrossed size={48} className="text-orange-500 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
        Create Your Recipe Visualizations
      </h2>
      <p className="text-gray-600 text-center mb-4">
        Generate beautiful step-by-step recipe images with action figures and your brand name overlay.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-4">
        {['chinese', 'italian', 'japanese'].map((cuisine) => (
          <div key={cuisine} className="bg-orange-50 p-4 rounded-lg text-center">
            <p className="font-medium text-orange-700 capitalize">{cuisine}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-500 mt-6 text-center">
        Fill out the form above to get started with your branded recipe visualization
      </p>
    </div>
  );
};

export default EmptyState;