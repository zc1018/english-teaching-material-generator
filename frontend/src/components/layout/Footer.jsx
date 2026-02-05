import { Github, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bento-card bg-white rounded-2xl p-6 mt-12 border-none shadow-sm">
      <div className="flex items-center justify-between text-slate-500 text-sm font-semibold">
        <div className="flex items-center gap-2">
          <span>Made with</span>
          <Heart className="w-4 h-4 text-rose-400 fill-current" />
          <span>by Claude Code</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-primary-600 transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
