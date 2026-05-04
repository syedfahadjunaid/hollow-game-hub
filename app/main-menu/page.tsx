import GameHero1 from "@/components/ui/8bit/blocks/game-hero1";
import MainMenu from "@/components/ui/8bit/blocks/main-menu";

export default function MainMenuPage() {
  return (
    <div className="w-full h-screen flex items-center justify-center gap-6">
      <div className="w-1/2">
        <MainMenu className="w-full h-full" />
      </div>
      <div className="w-1/2">
        <GameHero1 title="Welcome to Hollow Game Club" />
      </div>
    </div>
  );
}
