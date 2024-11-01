import ProfileDropbox from "@/components/common/dropbox/ProfileDropbox";
import Header from "@/components/layout/header/Header";

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
      {children}
      {modal}
    </>
  );
}
