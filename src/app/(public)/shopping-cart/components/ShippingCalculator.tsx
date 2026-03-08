'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ShippingCalculatorProps {
  onCalculate: (country: string, state: string, zipCode: string) => void;
}

const ShippingCalculator = ({ onCalculate }: ShippingCalculatorProps) => {
  const [country, setCountry] = useState('United States');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isCalculated, setIsCalculated] = useState(false);

  const countries = ['United States', 'Canada', 'United Kingdom', 'Australia'];
  const usStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
    'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
    'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
    'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
    'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  const handleCalculate = () => {
    if (country && state && zipCode) {
      onCalculate(country, state, zipCode);
      setIsCalculated(true);
    }
  };

  return (
    <div className="bg-muted rounded-md p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="TruckIcon" size={20} className="text-primary" />
        <h3 className="font-heading text-lg font-semibold text-foreground">
          Estimate Shipping
        </h3>
      </div>

      <div className="space-y-4">
        {/* Country Selection */}
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-foreground mb-2">
            Country
          </label>
          <select
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full h-10 px-3 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe"
          >
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* State Selection */}
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-foreground mb-2">
            State/Province
          </label>
          <select
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full h-10 px-3 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe"
          >
            <option value="">Select state</option>
            {usStates.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* ZIP Code Input */}
        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium text-foreground mb-2">
            ZIP/Postal Code
          </label>
          <input
            id="zipCode"
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            placeholder="Enter ZIP code"
            className="w-full h-10 px-3 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe"
          />
        </div>

        {/* Calculate Button */}
        <button
          onClick={handleCalculate}
          disabled={!country || !state || !zipCode}
          className="w-full h-10 bg-secondary text-secondary-foreground rounded-md font-medium hover:scale-102 transition-luxe disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Calculate Shipping
        </button>

        {/* Calculated Result */}
        {isCalculated && (
          <div className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-md">
            <div className="flex items-center gap-2">
              <Icon name="CheckCircleIcon" size={20} className="text-success" />
              <span className="text-sm font-medium text-foreground">
                Standard Shipping
              </span>
            </div>
            <span className="text-data font-semibold text-success">FREE</span>
          </div>
        )}
      </div>

      {/* Shipping Info */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-caption text-muted-foreground">
          Free standard shipping on all orders over $50. Express shipping available at checkout.
        </p>
      </div>
    </div>
  );
};

export default ShippingCalculator;