import { ChatShell } from "./components/ChatShell";
import { BackButton } from "@/components/ui/8bit/back-button";

export const metadata = {
  title: "GG — Gaming Assistant",
};

export default function ChatPage() {
  return (
    <div className="flex h-[calc(100dvh-7.5rem)] sm:h-[calc(100dvh-8.5rem)] min-h-[480px] w-full flex-col">
      <div className="mb-3 shrink-0 flex items-center gap-3">
        <BackButton href="/club/main-menu" />
        <div>
          <h1 className="text-lg font-semibold tracking-tight md:text-xl">
            Gaming Assistant
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground md:text-sm">
            Ask GG about mechanics, builds, lore and comparisons.
          </p>
        </div>
      </div>

      <ChatShell />
    </div>
  );
}
