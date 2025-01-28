import { useState } from "react";
import Image from "next/image";
import classes from "./CpyToClipboard.module.css";
import CopyBlack from "../../../assets/CopyBlack.svg";
import CopiedBlack from "../../../assets/CopiedBlack.svg";

// 1. Create an interface describing the props
interface CopyToClipboardProps {
  textToCopy: string; // or any other type you want to allow
  width: number;
  height: number;
}

// 2. Type your component with the interface
export default function CopyToClipboard({
  textToCopy,
  width,
  height,
}: CopyToClipboardProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div className={classes.container}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <button onClick={handleCopy} className={classes.button}>
          {isCopied ? (
            <Image
              src={CopiedBlack}
              width={width}
              height={height}
              alt="CopiedBlack"
            />
          ) : (
            <Image
              src={CopyBlack}
              width={width}
              height={height}
              alt="CopyBlack"
            />
          )}
        </button>
      </div>
    </div>
  );
}
