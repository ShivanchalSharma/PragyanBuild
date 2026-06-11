export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShCgm08NVGYFkSMv_NlmAfyT96FyW1Xx4cCg&s"
        alt="eDC Logo"
        className="h-12 w-auto object-contain"
      />
      <span className="font-bold tracking-tight text-foreground">KnowledgeHub</span>
    </div>
  );
} 