import { GraduationCap } from "lucide-react";

const Header = () => (
  <header className="w-full border-b bg-card px-4 py-3">
    <div className="mx-auto flex max-w-5xl items-center gap-2">
      <GraduationCap className="h-6 w-6 text-primary" />
      <h1 className="text-lg font-semibold text-primary">University Quiz Portal</h1>
    </div>
  </header>
);

export default Header;
