'use client';

import React from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import FaqForm from '../components/FaqForm';

export default function CreateFaqPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Create FAQ" />
      <FaqForm />
    </div>
  );
}
