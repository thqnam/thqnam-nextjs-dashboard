import Form from '@/app/ui/customers/delete-form';
import Breadcrumbs from '@/app/ui/customers/breadcrumbs';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Delete Customer',
};
 
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Customers', href: '/dashboard/customers' },
          {
            label: 'Edit Customer',
            href: `/dashboard/customers/${id}/edit`,
            active: true,
          },
          {
            label: 'Delete Customer',
            href: `/dashboard/customers/${id}/delete`,
            active: true,
          },
        ]}
      />
      <Form id={id} />
    </main>
  );
}