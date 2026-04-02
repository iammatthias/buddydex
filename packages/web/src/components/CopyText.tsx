import { useState, useCallback } from "react";

export function CopyText({ text, children, className }: {
  text: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  }, [text]);

  return (
    <span className={`copyable ${className ?? ""}`} onClick={copy}>
      {children}
      {copied && <span className="copy-tip">copied!</span>}
    </span>
  );
}
