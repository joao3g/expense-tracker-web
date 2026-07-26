import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './Routes.tsx';
import { RouterProvider } from 'react-router/dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { ToastProvider } from './context/ToastContext.tsx';
import { DateProvider } from './context/DateContext.tsx';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './Routes.tsx';

createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
            <ToastProvider>
                <DateProvider>
                    <RouterProvider router={router} />
                </DateProvider>
            </ToastProvider>
        </AuthProvider>
    </QueryClientProvider>
);
