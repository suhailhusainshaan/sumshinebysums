'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface LiveChatWidgetProps {
  onStartChat?: () => void;
}

const LiveChatWidget = ({ onStartChat }: LiveChatWidgetProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStartChat = () => {
    if (onStartChat) {
      onStartChat();
    }
    setIsExpanded(false);
  };

  const currentHour = new Date().getHours();
  const isBusinessHours = currentHour >= 9 && currentHour < 18;

  return (
    <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg shadow-warm-md p-6 lg:p-8">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="p-3 bg-accent rounded-lg">
              <Icon name="ChatBubbleLeftRightIcon" size={24} className="text-white" />
            </div>
            {isBusinessHours && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-success rounded-full border-2 border-card animate-pulse"></span>
            )}
          </div>
          <div>
            <h3 className="font-heading text-xl font-semibold text-foreground">
              Live Chat Support
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span
                className={`h-2 w-2 rounded-full ${
                  isBusinessHours ? 'bg-success' : 'bg-muted-foreground'
                }`}
              ></span>
              <span className="text-caption text-muted-foreground">
                {isBusinessHours ? 'Available now' : 'Currently offline'}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 text-muted-foreground hover:text-foreground transition-luxe lg:hidden"
        >
          <Icon
            name={isExpanded ? 'ChevronUpIcon' : 'ChevronDownIcon'}
            size={20}
          />
        </button>
      </div>

      <div className={`space-y-4 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        <p className="text-sm text-muted-foreground">
          Get instant help from our customer service team. Average response time is under 2 minutes during business hours.
        </p>

        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-sm">
            <Icon name="ClockIcon" size={16} className="text-primary" />
            <span className="text-muted-foreground">
              Monday - Friday: 9:00 AM - 6:00 PM EST
            </span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <Icon name="ClockIcon" size={16} className="text-primary" />
            <span className="text-muted-foreground">
              Saturday: 10:00 AM - 4:00 PM EST
            </span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <Icon name="UserGroupIcon" size={16} className="text-primary" />
            <span className="text-muted-foreground">
              {isBusinessHours ? '3 agents available' : 'Agents offline'}
            </span>
          </div>
        </div>

        <button
          onClick={handleStartChat}
          disabled={!isBusinessHours}
          className={`w-full py-3 px-6 rounded-md font-medium transition-luxe flex items-center justify-center space-x-2 ${
            isBusinessHours
              ? 'bg-accent text-white hover:scale-102 hover:shadow-warm-md'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          <Icon name="ChatBubbleLeftEllipsisIcon" size={20} />
          <span>{isBusinessHours ? 'Start Live Chat' : 'Chat Unavailable'}</span>
        </button>

        {!isBusinessHours && (
          <p className="text-xs text-center text-muted-foreground">
            Leave us a message using the form above and we'll respond within 24 hours
          </p>
        )}

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-3">What our customers say:</p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Icon key={star} name="StarIcon" size={14} className="text-warning" variant="solid" />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">4.9/5 from 2,847 chats</span>
            </div>
            <p className="text-xs text-muted-foreground italic">
              "Quick responses and very helpful team!"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveChatWidget;