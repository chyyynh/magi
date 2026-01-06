"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Play, Loader2 } from "lucide-react";

interface TaskInputPanelProps {
  onSubmit: (task: string) => void;
  disabled?: boolean;
  className?: string;
}

export const TaskInputPanel: React.FC<TaskInputPanelProps> = ({
  onSubmit,
  disabled = false,
  className = "",
}) => {
  const [task, setTask] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim() && !disabled) {
      onSubmit(task.trim());
      setTask("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !disabled) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={`bg-black border border-[#FF6600]/50 p-4 ${className}`}>
      <div className="mb-2 font-mono text-xs text-[#FF6600]">
        TASK INPUT INTERFACE
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Textarea
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter task for all agents..."
          disabled={disabled}
          rows={3}
          className="bg-black border-[#FF6600]/30 text-white font-mono text-sm resize-none focus:border-[#FF6600] placeholder:text-gray-600"
        />

        <div className="flex items-center justify-between">
          <div className="text-xs font-mono text-gray-500">
            Press Enter to execute
          </div>

          <Button
            type="submit"
            disabled={disabled || !task.trim()}
            className="bg-[#FF6600] hover:bg-[#FF6600]/80 text-black font-mono font-bold gap-2"
          >
            {disabled ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                PROCESSING
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                EXECUTE ALL
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TaskInputPanel;
