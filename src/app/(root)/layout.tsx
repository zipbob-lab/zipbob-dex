import Header from "@/components/layout/header/Header";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
