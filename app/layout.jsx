import "./globals.css";

export const metadata = {
  title: "SmartGym",
  description: "A minimal SmartGym landing page",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
