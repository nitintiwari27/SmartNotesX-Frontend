import { Loader2 } from 'lucide-react';

const Loader = ({ size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary-600`} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary-600`} />
    </div>
  );
};

export default Loader;