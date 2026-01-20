'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface CheckoutProgressProps {
  currentStep: number;
}

interface Step {
  number: number;
  label: string;
  icon: string;
}

const CheckoutProgress = ({ currentStep }: CheckoutProgressProps) => {
  const steps: Step[] = [
    { number: 1, label: 'Shipping', icon: 'TruckIcon' },
    { number: 2, label: 'Payment', icon: 'CreditCardIcon' },
    { number: 3, label: 'Confirmation', icon: 'CheckCircleIcon' },
  ];

  return (
    <div className="w-full bg-card rounded-lg p-6 shadow-warm mb-6">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-border -z-10">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step) => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;

          return (
            <div key={step.number} className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? 'bg-primary text-primary-foreground'
                    : isActive
                    ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {isCompleted ? (
                  <Icon name="CheckIcon" size={24} />
                ) : (
                  <Icon name={step.icon as any} size={24} />
                )}
              </div>
              <span
                className={`mt-2 text-sm font-medium transition-colors ${
                  isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutProgress;