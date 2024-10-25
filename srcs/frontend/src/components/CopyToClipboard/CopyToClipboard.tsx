import { useState } from "react";
import classes from './CpyToClipboard.module.css'
import Image from "next/image";
import CopyWhite from '../../../assets/CopyWithe.svg'
import CopyBlack from '../../../assets/CopyBlack.svg'
import CopiedBlack from '../../../assets/CopiedBlack.svg'

export default function CopyToClipboard({textToCopy, width, height}) {

   // State to manage copied effect
  const [isCopied, setIsCopied] = useState(false);
  // State to manage notification visibility
  const [showNotification, setShowNotification] = useState(false); 
   // State for the new input field
  const [newInputValue, setNewInputValue] = useState("");

  const handleCopy = async () => {
    try {
    // Copy text to clipboard
      await navigator.clipboard.writeText(textToCopy); 
      setIsCopied(true); // Show "Copied!" effect
      setShowNotification(true); // Show notification
       // Remove "Copied!" text after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
      // Hide notification after 3 seconds
      setTimeout(() => setShowNotification(false), 3000); 
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div className={classes.container} >
      <div style={{ display: "flex", alignItems: "center" }}>
        <button 
          onClick={handleCopy}
          className={classes.button}
        >
          {isCopied ? <Image src={CopiedBlack} width={width} height={height} alt="CopiedBlack" /> : <Image src={CopyBlack} width={width} height={height} alt="CopyBlack" />}
        </button>
      </div>
    </div>
  );
}
