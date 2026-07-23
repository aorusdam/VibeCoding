import "./globals.css";
import "./product-images.css";

export const metadata = { title: "Cartwise — considered everyday goods", description: "A simple shopping experience" };

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
