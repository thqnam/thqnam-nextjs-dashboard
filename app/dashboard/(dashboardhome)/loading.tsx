import { standardMetadata } from '@/app/lib/standardMetadata';
import DashboardSkeleton from '@/app/ui/skeletons';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Loading',
  ...standardMetadata,
};
 
export default function Loading() {
  return <DashboardSkeleton />;
}