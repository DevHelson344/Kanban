import { Moon, Sun, LogOut, User } from "lucide-react";

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  user: { name: string; email: string };
  onLogout: () => void;
}

export function Header({ isDark, onToggleTheme, user, onLogout }: HeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors">
        Sistema de Produtividade
      </h1>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <User className="h-4 w-4" />
          <span>{user.name}</span>
        </div>
        
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
          title={isDark ? "Modo claro" : "Modo escuro"}
        >
          {isDark ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5 text-gray-600" />
          )}
        </button>
        
        <button
          onClick={onLogout}
          className="p-2 rounded-md bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-800/50 text-red-600 dark:text-red-400 transition-all"
          title="Sair"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}