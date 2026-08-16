import Header from "@/components/Header";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden">
      <Header showProfile />
      <main className="flex-1 overflow-y-auto bg-muted/20">
        <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 flex flex-col flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
