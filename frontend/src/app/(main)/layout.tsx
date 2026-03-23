import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import RadiantConcierge from '@/components/ui/RadiantConcierge';
import MaintenanceOverlay from '@/components/ui/MaintenanceOverlay';
import LenisProvider from '@/components/providers/LenisProvider';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MaintenanceOverlay />
      <LenisProvider>
        <Navbar />
        {children}
        <RadiantConcierge />
        <Footer />
      </LenisProvider>
    </>
  );
}
