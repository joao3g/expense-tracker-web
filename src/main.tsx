import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './Routes.tsx';
import { RouterProvider } from 'react-router/dom';
import { AuthProvider } from './context/AuthContext.tsx';

createRoot(document.getElementById('root')!).render(
    <AuthProvider>
        <RouterProvider router={router} />,
    </AuthProvider>
);
