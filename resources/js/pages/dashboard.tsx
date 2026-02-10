import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

               <section className="bg-primary text-primary-foreground py-12 px-6 mt-6">
                <div className="container mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-settings h-8 w-8 text-accent"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        <h1 className="text-3xl md:text-4xl font-bold">Supplier Parts Portal</h1>
                    </div>
                    <p className="text-lg text-primary-foreground/80 max-w-2xl">
                        Manage part numbers and equivalent parts across major brands.
                    </p>
                </div>
            </section>
            <section className="container mx-auto px-6 -mt-6"><div className="grid grid-cols-2 md:grid-cols-4 gap-4"><div className="rounded-lg bg-card text-card-foreground border-0 shadow-lg"><div className="space-y-1.5 p-6 flex flex-row items-center justify-between pb-2"><h3 className="tracking-tight text-sm font-medium text-muted-foreground">Total Parts</h3><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-package h-4 w-4 text-accent"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"></path><path d="M12 22V12"></path><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"></path><path d="m7.5 4.27 9 5.15"></path></svg></div><div className="p-6 pt-0"><div className="text-2xl font-bold">15</div></div></div><div className="rounded-lg bg-card text-card-foreground border-0 shadow-lg"><div className="space-y-1.5 p-6 flex flex-row items-center justify-between pb-2"><h3 className="tracking-tight text-sm font-medium text-muted-foreground">Cross-References</h3><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-git-compare h-4 w-4 text-accent"><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M13 6h3a2 2 0 0 1 2 2v7"></path><path d="M11 18H8a2 2 0 0 1-2-2V9"></path></svg></div><div className="p-6 pt-0"><div className="text-2xl font-bold">22</div></div></div><div className="rounded-lg bg-card text-card-foreground border-0 shadow-lg"><div className="space-y-1.5 p-6 flex flex-row items-center justify-between pb-2"><h3 className="tracking-tight text-sm font-medium text-muted-foreground">Suppliers</h3><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-database h-4 w-4 text-accent"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5V19A9 3 0 0 0 21 19V5"></path><path d="M3 12A9 3 0 0 0 21 12"></path></svg></div><div className="p-6 pt-0"><div className="text-2xl font-bold">6</div></div></div><div className="rounded-lg bg-card text-card-foreground border-0 shadow-lg"><div className="space-y-1.5 p-6 flex flex-row items-center justify-between pb-2"><h3 className="tracking-tight text-sm font-medium text-muted-foreground">Categories</h3><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-file-stack h-4 w-4 text-accent"><path d="M21 7h-3a2 2 0 0 1-2-2V2"></path><path d="M21 6v6.5c0 .8-.7 1.5-1.5 1.5h-7c-.8 0-1.5-.7-1.5-1.5v-9c0-.8.7-1.5 1.5-1.5H17Z"></path><path d="M7 8v8.8c0 .3.2.6.4.8.2.2.5.4.8.4H15"></path><path d="M3 12v8.8c0 .3.2.6.4.8.2.2.5.4.8.4H11"></path></svg></div><div className="p-6 pt-0"><div className="text-2xl font-bold">3</div></div></div></div></section>
        </AppLayout>
    );
}
