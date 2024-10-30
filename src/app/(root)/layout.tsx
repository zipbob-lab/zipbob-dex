import ProfileDropbox from "@/components/common/dropbox/ProfileDropbox";

import Header from "@/components/layout/header/Header";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <ProfileDropbox />
      {children}
    </>
  );
}
