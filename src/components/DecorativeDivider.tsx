import React from 'react';
import { Flower2 } from 'lucide-react';

export const DecorativeDivider: React.FC = () => {
  return (
    <div className="w-full flex justify-center items-center py-4 opacity-80 z-20 relative pointer-events-none">
      <div className="w-24 sm:w-48 h-[1px] bg-gradient-to-r from-transparent to-brand-gold/60" />
      <Flower2 className="w-6 h-6 mx-4 text-brand-gold" strokeWidth={1.25} />
      <div className="w-24 sm:w-48 h-[1px] bg-gradient-to-l from-transparent to-brand-gold/60" />
    </div>
  );
};
