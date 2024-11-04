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
    <>
      <Header />
      <ProfileDropbox />
      <div className="min-h-[calc(100vh-332px)]">{children}</div>
      {modal}
      <Footer />
    </>
  );
}
