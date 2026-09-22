'use client';

import React from 'react';
import ContactInfo from './ContactInfo';
import FAQSection from './FAQSection';
import { FAQResponse } from '@/service/faq.service';

interface Props {
  initialFaqData?: FAQResponse | null;
}

const ContactSupportInteractive = ({ initialFaqData }: Props) => {
  const handleFAQSearch = (query: string) => {
    console.log('FAQ search query:', query);
  };

  return (
    <div className="space-y-8">
      <div className="max-w-xl mx-auto">
        <ContactInfo />
      </div>
      <FAQSection onSearchQuery={handleFAQSearch} initialData={initialFaqData} />
    </div>
  );
};

export default ContactSupportInteractive;
