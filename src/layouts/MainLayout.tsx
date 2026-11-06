import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Plus,
  Settings,
  Info,
  ChevronLeft,
  BookOpen,
  Menu,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useChatStore } from '@/store/useChatStore';
import { useMobile } from '@/hooks/useMobile';
import { Button } from '@/components/ui/button';
import { SidebarItem } from '@/components/common/SidebarItem';
import { ThemeToggle } from '@/components/common/ThemeToggle';

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMobile();
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useAppStore();
  const { conversations, activeConversationId, selectConversation, createNewChat } =
    useChatStore();

  const handleSelectConv = (id: string) => {
    selectConversation(id);
    navigate('/');
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleNewChat = () => {
    createNewChat();
    navigate('/');
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const currentRouteTitle =
    location.pathname === '/settings'
      ? 'Reading Room Settings'
      : location.pathname === '/about'
      ? 'Archival Methodology & Corpus'
      : 'Archival Reference Folio';

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Mobile Drawer Overlay Backdrop */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/50"
          />
        )}
      </AnimatePresence>

      {/* Responsive Sidebar (Left Archival Ledger) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-secondary transition-all duration-200 md:static overflow-hidden shrink-0 ${
          sidebarOpen ? 'w-72 translate-x-0 border-r border-border' : '-translate-x-full md:w-0 md:translate-x-0'
        }`}
      >
        {/* Sidebar Institutional Masthead */}
        <div className="flex h-14 items-center justify-between border-b border-border px-4 shrink-0 bg-card/60">
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer select-none min-w-0"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-primary/30 bg-primary text-primary-foreground font-serif text-xs font-semibold tracking-wider">
              LKY
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-serif text-base font-medium leading-tight tracking-tight text-foreground truncate">
                Lee Kuan Yew
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground mt-0.5 truncate">
                Historical Archive
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 rounded-sm text-muted-foreground hover:text-foreground shrink-0"
            title="Collapse Archival Ledger"
            aria-label="Collapse Sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* New Inquiry Trigger */}
        <div className="p-3 border-b border-border/60 shrink-0">
          <Button
            onClick={handleNewChat}
            className="w-full justify-start gap-2.5 rounded-sm bg-primary text-primary-foreground font-mono text-xs font-medium uppercase tracking-wider h-9 px-3"
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span>New Inquiry Dossier</span>
          </Button>
        </div>

        {/* Chronological Inquiry Ledger */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          <div>
            <div className="px-2 pb-2 border-b border-border/60 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground flex items-center justify-between">
              <span>Inquiry Ledger</span>
              <span className="tabular-nums text-[10px] text-muted-foreground/80">
                [{String(conversations.length).padStart(2, '0')}]
              </span>
            </div>
            <div className="space-y-1 mt-2">
              {conversations.map((conv) => (
                <SidebarItem
                  key={conv.id}
                  icon={<FileText className="h-3.5 w-3.5" />}
                  label={conv.title}
                  active={location.pathname === '/' && activeConversationId === conv.id}
                  onClick={() => handleSelectConv(conv.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Institutional Navigation & Colophon Footer */}
        <div className="border-t border-border p-3 space-y-1 shrink-0 bg-card/50">
          <div className="px-2 pb-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Archive Sections
          </div>
          <SidebarItem
            icon={<BookOpen className="h-3.5 w-3.5" />}
            label="Chat Interface"
            active={location.pathname === '/'}
            onClick={() => {
              navigate('/');
              if (isMobile) setSidebarOpen(false);
            }}
          />
          <SidebarItem
            icon={<Settings className="h-3.5 w-3.5" />}
            label="Settings"
            active={location.pathname === '/settings'}
            onClick={() => {
              navigate('/settings');
              if (isMobile) setSidebarOpen(false);
            }}
          />
          <SidebarItem
            icon={<Info className="h-3.5 w-3.5" />}
            label="About"
            active={location.pathname === '/about'}
            onClick={() => {
              navigate('/about');
              if (isMobile) setSidebarOpen(false);
            }}
          />
          <div className="pt-2.5 pb-0.5 px-2 flex items-center justify-between font-mono text-[10px] text-muted-foreground border-t border-border/60 mt-2">
            <span>CURATED BY GERRIO PRATAMA</span>
            <span className="tabular-nums">1959–2015</span>
          </div>
        </div>
      </aside>

      {/* Main Viewport Reading Stage */}
      <div className="flex flex-1 flex-col overflow-hidden relative min-w-0">
        {location.pathname !== '/' && (
          <header className="flex h-14 items-center justify-between border-b border-border bg-card/90 px-4 md:px-6 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              {(!sidebarOpen || isMobile) && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="h-8 w-8 rounded-sm shrink-0 text-muted-foreground hover:text-foreground"
                  title="Open Archival Ledger"
                  aria-label="Toggle Navigation"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              )}
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-primary font-medium hidden sm:inline">
                  FOLIO //
                </span>
                <h1 className="font-serif text-base md:text-lg font-medium tracking-tight text-foreground truncate">
                  {currentRouteTitle}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <ThemeToggle />
            </div>
          </header>
        )}
        <Outlet />
      </div>
    </div>
  );
};
