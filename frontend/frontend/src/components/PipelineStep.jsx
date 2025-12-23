import React from 'react';

const PipelineStep = ({ title, icon: Icon, children, isActive, isComplete }) => {
  return (
    <div className={`relative flex gap-4 pb-8 ${isComplete ? 'opacity-100' : 'opacity-50'}`}>
      {/* Visual Connector Line */}
      <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gray-200 -z-10"></div>
      
      {/* Icon Bubble */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 
        ${isActive || isComplete ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
        <Icon size={20} />
      </div>

      {/* Content Card */}
      <div className="flex-1 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="font-semibold text-lg text-gray-800 mb-2">{title}</h3>
        <div className="space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PipelineStep;