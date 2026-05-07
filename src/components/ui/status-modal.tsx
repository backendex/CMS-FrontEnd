import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, XCircle, Info, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatusType = "success" | "error" | "info" | "loading" | "warning";

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: StatusType;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const StatusModal: React.FC<StatusModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  description,
  actionLabel = "Entendido",
  onAction
}) => {
  const icons = {
    success: <CheckCircle2 className="w-12 h-12 text-green-500" />,
    error: <XCircle className="w-12 h-12 text-red-500" />,
    warning: <AlertCircle className="w-12 h-12 text-amber-500" />,
    info: <Info className="w-12 h-12 text-blue-500" />,
    loading: <Loader2 className="w-12 h-12 text-primary animate-spin" />
  };

  const bgColors = {
    success: "bg-green-50 dark:bg-green-500/10",
    error: "bg-red-50 dark:bg-red-500/10",
    warning: "bg-amber-50 dark:bg-amber-500/10",
    info: "bg-blue-50 dark:bg-blue-500/10",
    loading: "bg-primary/5"
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none shadow-2xl">
        <div className={cn("flex flex-col items-center justify-center pt-10 pb-6 px-6 text-center space-y-4", bgColors[type])}>
          <div className="bg-background rounded-full p-3 shadow-sm">
            {icons[type]}
          </div>
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl font-bold tracking-tight text-center">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-muted-foreground text-base leading-relaxed">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        </div>
        
        <DialogFooter className="p-6 pt-0 bg-background sm:justify-center">
          <Button 
            onClick={onAction || onClose} 
            className={cn(
              "w-full sm:w-[240px] h-12 font-bold text-base transition-all duration-300 active:scale-95 rounded-xl shadow-md",
              "bg-slate-950 text-white hover:text-white border-none",
              type === 'success' && "hover:bg-green-600 hover:shadow-green-500/30",
              type === 'error' && "hover:bg-red-600 hover:shadow-red-500/30",
              type === 'warning' && "hover:bg-amber-600 hover:shadow-amber-500/30",
              type === 'info' && "hover:bg-blue-600 hover:shadow-blue-500/30",
              type === 'loading' && "hidden"
            )}
          >
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
