'use client';

import React, { useState } from 'react';
import ContactForm from './ContactForm';
import ContactInfo from './ContactInfo';
import FAQSection from './FAQSection';
import LiveChatWidget from './LiveChatWidget';

interface FormData {
  name: string;
  email: string;
  orderNumber: string;
  inquiryType: string;
  message: string;
}

const ContactSupportInteractive = () => {
  const handleFormSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
  };

  const handleStartChat = () => {
    console.log('Starting live chat...');
  };

  const handleFAQSearch = (query: string) => {
    console.log('FAQ search query:', query);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ContactForm onSubmit={handleFormSubmit} />
        </div>
        <div className="space-y-6">
          <ContactInfo />
          <LiveChatWidget onStartChat={handleStartChat} />
        </div>
      </div>

      <FAQSection onSearchQuery={handleFAQSearch} />
    </div>
  );
};

export default ContactSupportInteractive;