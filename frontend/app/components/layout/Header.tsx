import Logo from "./Logo";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#2B3A33]/80 bg-[#0F1720]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Logo className="h-16 w-16 shrink-0" />

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C89B3C]">
              Maps: Goal Planner
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-[#F4EFE6]">
              AI Goal Planner
            </h1>
          </div>
        </div>

        <div className="hidden rounded-full border border-[#3A4A42] bg-[#18222B]/80 px-4 py-2 text-sm text-[#C9C3B8] md:block">
          OpenStreetMap · OpenAI · FastAPI
        </div>
      </div>
    </header>
  );
}