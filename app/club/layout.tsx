import Header from "@/components/Header";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header showProfile />
      <main className="flex-1 overflow-y-auto bg-muted/20">
        <div className="container mx-auto p-6 flex items-center justify-center h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
