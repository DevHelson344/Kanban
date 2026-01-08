import type { Task } from "@/types";

const DATA_FILE = "tasks-data.json";

export const fileStorage = {
  save: (tasks: Task[]) => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = DATA_FILE;
    link.click();
    
    URL.revokeObjectURL(url);
  },

  load: (): Promise<Task[]> => {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
          resolve([]);
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const tasks = JSON.parse(e.target?.result as string);
            resolve(Array.isArray(tasks) ? tasks : []);
          } catch {
            resolve([]);
          }
        };
        reader.readAsText(file);
      };
      
      input.click();
    });
  }
};