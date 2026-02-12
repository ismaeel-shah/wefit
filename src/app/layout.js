import './globals.css';
import Sidebar from '@/components/Sidebar';
import { DataProvider } from '@/context/DataContext';

export const metadata = {
  title: 'We Fit CRM',
  description: 'Manage your gym leads and campaigns',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <DataProvider>
          <div className="main-layout">
            <Sidebar />
            <main className="content-area">
              {children}
            </main>
          </div>
        </DataProvider>
      </body>
    </html>
  );
}
