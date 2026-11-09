import "./globals.css";

export const metadata = {
  title: "Label Team Photos",
  description: "Penyimpanan foto bersama untuk tim",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
