import Header from "@/components/Header";
import LandingPageContent from "@/components/landing/LandingPageContent";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <LandingPageContent mode="public" />
      </main>
    </div>
  );
}

