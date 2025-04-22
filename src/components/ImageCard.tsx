import React, { useState } from 'react';
import { Download, Share2, RefreshCw } from 'lucide-react';
import { downloadImage } from '../utils/downloadUtils';

interface ImageCardProps {
  imageUrl: string;
  brandName: string;
  description: string;
  stepNumber: number;
  recipeName: string;
  onRegenerate?: () => Promise<void>;
}

const ImageCard: React.FC<ImageCardProps> = ({ 
  imageUrl, 
  brandName, 
  description, 
  stepNumber,
  recipeName,
  onRegenerate
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  const handleDownload = () => {
    downloadImage(imageUrl, brandName, stepNumber, recipeName);
  };

  const handleShare = () => {
    // In a real implementation, this would open a share dialog
    alert(`Sharing Step ${stepNumber}: ${description}`);
  };

  const handleRegenerate = async () => {
    if (onRegenerate) {
      setIsRegenerating(true);
      try {
        await onRegenerate();
      } finally {
        setIsRegenerating(false);
      }
    }
  };

  return (
    <div 
      className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Image with brand overlay */}
        <div className="aspect-w-16 aspect-h-9 relative">
          <img 
            src={imageUrl} 
            alt={`Recipe step ${stepNumber}`}
            className="w-full h-full object-cover"
          />
          {/* Brand name overlay - always visible */}
          <div className="absolute top-2 right-2 bg-black bg-opacity-60 px-3 py-1 rounded text-white text-sm font-medium z-10">
            {brandName}
          </div>
        </div>
        
        {/* Action buttons that appear on hover */}
        <div 
          className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-4 transition-opacity ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button 
            onClick={handleDownload}
            className="p-2 bg-white rounded-full text-gray-800 hover:bg-orange-500 hover:text-white transition-colors"
            aria-label="Download image"
          >
            <Download size={20} />
          </button>
          <button 
            onClick={handleShare}
            className="p-2 bg-white rounded-full text-gray-800 hover:bg-orange-500 hover:text-white transition-colors"
            aria-label="Share image"
          >
            <Share2 size={20} />
          </button>
          {onRegenerate && (
            <button 
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className={`p-2 bg-white rounded-full text-gray-800 hover:bg-orange-500 hover:text-white transition-colors ${
                isRegenerating ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-label="Regenerate image"
            >
              <RefreshCw size={20} className={isRegenerating ? 'animate-spin' : ''} />
            </button>
          )}
        </div>
      </div>
      
      {/* Step information */}
      <div className="p-4">
        <div className="inline-block px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-xs font-semibold mb-2">
          Step {stepNumber}
        </div>
        <p className="text-gray-800">{description}</p>
      </div>
    </div>
  );
};

export default ImageCard;