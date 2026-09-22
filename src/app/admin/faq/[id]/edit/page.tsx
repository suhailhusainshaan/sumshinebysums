'use client';

import React from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import FaqForm from '../../components/FaqForm';
import { useParams } from 'next/navigation';

export default function EditFaqPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit FAQ" />
      <FaqForm faqId={parseInt(id)} />
    </div>
  );
}
