import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { Toaster } from 'sonner';
import useThemeStore from '@/store/useThemeStore';

function App() {
  console.log("App component rendered");
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors theme="system" />
    </>
  );
}

export default App;
