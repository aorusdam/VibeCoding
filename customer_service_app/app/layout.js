import "./globals.css";

export const metadata = {
  title: "Lord of Mysteries Guide",
  description: "A spoiler-conscious Lord of Mysteries customer service assistant"
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
