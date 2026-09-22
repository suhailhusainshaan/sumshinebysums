'use client';

import React from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import PageForm from '../../components/PageForm';
import { useParams } from 'next/navigation';

export default function EditStaticPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Static Page" />
      <PageForm pageId={parseInt(id)} />
    </div>
  );
}
