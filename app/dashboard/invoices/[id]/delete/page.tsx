import Form from '@/app/ui/invoices/delete-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Delete Invoices',
};
 
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
          {
            label: 'Delete Invoice',
            href: `/dashboard/invoices/${id}/delete`,
            active: true,
          },
        ]}
      />
      <Form id={id} />
    </main>
  );
}