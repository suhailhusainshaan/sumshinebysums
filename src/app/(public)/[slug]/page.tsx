import React from 'react';
import { notFound } from 'next/navigation';
import Header from '@/components/common/Header';
import Breadcrumb from '@/components/common/Breadcrumb';
import { getPageBySlug } from '@/service/static-page.service';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function StaticPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const breadcrumbItems = [{ label: 'Home', path: '/' }, { label: page.title }];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 lg:pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          <div className="bg-card rounded-lg shadow-warm-md p-6 lg:p-10">
            <h1 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-8 text-center pb-6 border-b border-border">
              {page.title}
            </h1>
            
            <div 
              className="prose dark:prose-invert prose-brand max-w-none"
              dangerouslySetInnerHTML={{ __html: page.content || '' }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
