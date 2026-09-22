'use client';

import React from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import PageForm from '../components/PageForm';

export default function CreateStaticPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Create Static Page" />
      <PageForm />
    </div>
  );
}
