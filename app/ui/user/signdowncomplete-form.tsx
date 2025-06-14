'use client';
 
import { lusitana } from '@/app/ui/fonts';
import { 
  ArrowLeftIcon,
} from '@heroicons/react/20/solid';
import { resetTarget } from '@/app/lib/actions';
 
export default function Form() {

  return (
    <form
      className="space-y-3"
    >
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
            <strong>Sign Down complete successful !</strong>
        </h1>
        <button 
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 mt-4 w-full" 
          onClick={() => resetTarget('/dashboard')}
        >
          Back to Dashboard <ArrowLeftIcon className="ml-auto h-5 w-5 text-gray-50" />
        </button>
      </div>
    </form>
  );
}