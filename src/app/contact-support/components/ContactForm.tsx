'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FormData {
  name: string;
  email: string;
  orderNumber: string;
  inquiryType: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  orderNumber?: string;
  inquiryType?: string;
  message?: string;
}

interface ContactFormProps {
  onSubmit: (data: FormData) => void;
}

const ContactForm = ({ onSubmit }: ContactFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    orderNumber: '',
    inquiryType: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const maxMessageLength = 500;

  const inquiryTypes = [
    { value: '', label: 'Select inquiry type' },
    { value: 'order', label: 'Order Status' },
    { value: 'product', label: 'Product Information' },
    { value: 'shipping', label: 'Shipping & Delivery' },
    { value: 'returns', label: 'Returns & Exchanges' },
    { value: 'payment', label: 'Payment Issues' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'other', label: 'Other' },
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.inquiryType) {
      newErrors.inquiryType = 'Please select an inquiry type';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      onSubmit(formData);
      setSubmitSuccess(true);
      setIsSubmitting(false);
      
      setFormData({
        name: '',
        email: '',
        orderNumber: '',
        inquiryType: '',
        message: '',
      });

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="bg-card rounded-lg shadow-warm-md p-6 lg:p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Icon name="EnvelopeIcon" size={24} className="text-primary" />
        </div>
        <div>
          <h2 className="font-heading text-2xl font-semibold text-foreground">
            Send Us a Message
          </h2>
          <p className="text-caption text-muted-foreground">
            We typically respond within 24 hours
          </p>
        </div>
      </div>

      {submitSuccess && (
        <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg flex items-start space-x-3">
          <Icon name="CheckCircleIcon" size={20} className="text-success mt-0.5" />
          <div>
            <p className="font-medium text-success">Message sent successfully!</p>
            <p className="text-sm text-success/80 mt-1">
              We'll get back to you as soon as possible.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
            Full Name <span className="text-error">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-input border ${
              errors.name ? 'border-error' : 'border-border'
            } rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-luxe`}
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="mt-2 text-sm text-error flex items-center space-x-1">
              <Icon name="ExclamationCircleIcon" size={16} />
              <span>{errors.name}</span>
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Email Address <span className="text-error">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-input border ${
              errors.email ? 'border-error' : 'border-border'
            } rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-luxe`}
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-error flex items-center space-x-1">
              <Icon name="ExclamationCircleIcon" size={16} />
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        <div>
          <label htmlFor="orderNumber" className="block text-sm font-medium text-foreground mb-2">
            Order Number <span className="text-caption text-muted-foreground">(Optional)</span>
          </label>
          <input
            type="text"
            id="orderNumber"
            name="orderNumber"
            value={formData.orderNumber}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-luxe"
            placeholder="JC-2026-12345"
          />
        </div>

        <div>
          <label htmlFor="inquiryType" className="block text-sm font-medium text-foreground mb-2">
            Inquiry Type <span className="text-error">*</span>
          </label>
          <select
            id="inquiryType"
            name="inquiryType"
            value={formData.inquiryType}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-input border ${
              errors.inquiryType ? 'border-error' : 'border-border'
            } rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-luxe`}
          >
            {inquiryTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.inquiryType && (
            <p className="mt-2 text-sm text-error flex items-center space-x-1">
              <Icon name="ExclamationCircleIcon" size={16} />
              <span>{errors.inquiryType}</span>
            </p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
            Message <span className="text-error">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={6}
            maxLength={maxMessageLength}
            className={`w-full px-4 py-3 bg-input border ${
              errors.message ? 'border-error' : 'border-border'
            } rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-luxe resize-none`}
            placeholder="Please describe your inquiry in detail..."
          />
          <div className="mt-2 flex items-center justify-between">
            {errors.message ? (
              <p className="text-sm text-error flex items-center space-x-1">
                <Icon name="ExclamationCircleIcon" size={16} />
                <span>{errors.message}</span>
              </p>
            ) : (
              <span className="text-caption text-muted-foreground">
                Minimum 10 characters
              </span>
            )}
            <span className={`text-caption ${
              formData.message.length > maxMessageLength * 0.9
                ? 'text-warning' :'text-muted-foreground'
            }`}>
              {formData.message.length}/{maxMessageLength}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-primary-foreground py-4 px-6 rounded-md font-medium hover:scale-102 hover:shadow-warm-md transition-luxe disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground border-t-transparent"></div>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Icon name="PaperAirplaneIcon" size={20} />
              <span>Send Message</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;