import ProfileDropbox from "@/components/common/dropbox/ProfileDropbox";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function RootLayout({
  children,
  modal
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="relative grow">
        <ProfileDropbox />
        {children}
      </div>
      {modal}
      <div id="modal-root"></div>
      <div id="confirm-root"></div>
      <Footer />
    </div>
  );
}
