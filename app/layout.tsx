export const metadata = {
  title: "Agentic Health & Productivity",
  description: "Your integrated AI for habits, tasks, and wellbeing.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          {children}
        </div>
      </body>
    </html>
  );
}
