import { LanguageProvider } from '@/context/LanguageContext';
import { ProfileProvider } from '@/context/ProfileContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NIRA • Explainable Bilingual Career-Readiness Platform',
  description:
    'NIRA helps Indian college students identify career fits, analyze skill gaps transparently, follow a personalized weekly roadmap, and match with opportunities.',
  keywords: [
    'NIRA',
    'Career Readiness',
    'Skill Gap Analysis',
    'Tamil Career Guidance',
    'Indian Engineering Students',
    'Explainable AI',
    'Roadmap Generator',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500 selection:text-white dark:bg-slate-950 dark:text-slate-100">
        <LanguageProvider>
          <ProfileProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </ProfileProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
