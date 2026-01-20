'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

interface FAQSectionProps {
  onSearchQuery?: (query: string) => void;
}

const FAQSection = ({ onSearchQuery }: FAQSectionProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Questions', icon: 'QuestionMarkCircleIcon' },
    { id: 'shipping', label: 'Shipping', icon: 'TruckIcon' },
    { id: 'returns', label: 'Returns', icon: 'ArrowPathIcon' },
    { id: 'sizing', label: 'Sizing', icon: 'ScaleIcon' },
    { id: 'care', label: 'Care', icon: 'SparklesIcon' },
    { id: 'payment', label: 'Payment', icon: 'CreditCardIcon' },
  ];

  const faqData: FAQItem[] = [
    {
      category: 'shipping',
      question: 'What are your shipping options and delivery times?',
      answer: 'We offer Standard Shipping (5-7 business days, $5.99), Express Shipping (2-3 business days, $12.99), and Next Day Delivery (1 business day, $24.99). Free standard shipping on orders over $75. All orders are processed within 1-2 business days.',
    },
    {
      category: 'shipping',
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times vary by destination. Customs duties and taxes may apply and are the responsibility of the recipient.',
    },
    {
      category: 'shipping',
      question: 'How can I track my order?',
      answer: 'Once your order ships, you\'ll receive a tracking number via email. You can also track your order by logging into your account and visiting the Order History section.',
    },
    {
      category: 'returns',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for unworn items in original condition with tags attached. Returns are free for US customers. Refunds are processed within 5-7 business days of receiving your return.',
    },
    {
      category: 'returns',
      question: 'Can I exchange an item?',
      answer: 'Yes! We offer free exchanges within 30 days. Simply initiate a return and place a new order for the item you want. We\'ll refund your original purchase once we receive the return.',
    },
    {
      category: 'returns',
      question: 'What items cannot be returned?',
      answer: 'Earrings (for hygiene reasons), personalized items, and sale items marked as final sale cannot be returned. Gift cards are also non-refundable.',
    },
    {
      category: 'sizing',
      question: 'How do I find my ring size?',
      answer: 'Use our printable ring sizer available on product pages, or visit a local jeweler for professional sizing. Our rings are available in sizes 5-10, including half sizes.',
    },
    {
      category: 'sizing',
      question: 'Are your necklaces adjustable?',
      answer: 'Most of our necklaces feature adjustable chains with 2-inch extenders, allowing you to customize the length. Specific measurements are listed on each product page.',
    },
    {
      category: 'care',
      question: 'How should I care for my artificial jewelry?',
      answer: 'Store pieces separately in a cool, dry place. Avoid contact with water, perfumes, and lotions. Clean gently with a soft cloth. Remove jewelry before swimming, exercising, or sleeping.',
    },
    {
      category: 'care',
      question: 'Will the jewelry tarnish?',
      answer: 'Our jewelry is made with high-quality materials and protective coatings to resist tarnishing. With proper care, your pieces will maintain their beauty for years. We also offer a 6-month warranty against manufacturing defects.',
    },
    {
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay. All transactions are secured with SSL encryption.',
    },
    {
      category: 'payment',
      question: 'Do you offer payment plans?',
      answer: 'Yes! We partner with Afterpay and Klarna to offer interest-free payment plans. Split your purchase into 4 installments with no hidden fees. Available on orders $35-$1,000.',
    },
  ];

  const toggleItem = (index: number) => {
    setExpandedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearchQuery) {
      onSearchQuery(query);
    }
  };

  const filteredFAQs = faqData.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-card rounded-lg shadow-warm-md p-6 lg:p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-secondary/10 rounded-lg">
          <Icon name="QuestionMarkCircleIcon" size={24} className="text-secondary" />
        </div>
        <div>
          <h2 className="font-heading text-2xl font-semibold text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-caption text-muted-foreground">
            Find quick answers to common questions
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Icon
            name="MagnifyingGlassIcon"
            size={20}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search FAQs..."
            className="w-full pl-12 pr-4 py-3 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-luxe"
          />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-luxe ${
              activeCategory === category.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <Icon name={category.icon as any} size={16} />
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="MagnifyingGlassIcon" size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-foreground font-medium mb-2">No results found</p>
            <p className="text-caption text-muted-foreground">
              Try adjusting your search or browse by category
            </p>
          </div>
        ) : (
          filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="border border-border rounded-lg overflow-hidden transition-luxe hover:shadow-warm"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-muted transition-luxe"
              >
                <span className="font-medium text-foreground pr-4">{faq.question}</span>
                <Icon
                  name="ChevronDownIcon"
                  size={20}
                  className={`text-muted-foreground flex-shrink-0 transform transition-transform ${
                    expandedItems.includes(index) ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedItems.includes(index) && (
                <div className="px-4 pb-4 text-sm text-muted-foreground border-t border-border pt-4">
                  {faq.answer}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="mt-8 p-6 bg-muted rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="InformationCircleIcon" size={24} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-foreground mb-2">Still have questions?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Can't find what you're looking for? Our customer service team is ready to help.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="tel:+15551234567"
                className="inline-flex items-center space-x-2 text-sm font-medium text-primary hover:text-accent transition-luxe"
              >
                <Icon name="PhoneIcon" size={16} />
                <span>Call Us</span>
              </a>
              <a
                href="mailto:support@jewelcraft.com"
                className="inline-flex items-center space-x-2 text-sm font-medium text-primary hover:text-accent transition-luxe"
              >
                <Icon name="EnvelopeIcon" size={16} />
                <span>Email Us</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;