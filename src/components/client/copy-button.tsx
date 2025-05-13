"use client"

import { useState } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";

function CopyButton({text}: {text: string}) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (error) {
            console.error("Failed to copy text to clipboard")
        }
    }

    return (
        <button className="flex h-fit w-fit items-center gap-2 justify-center rounded-md border border-gray-200 bg-white px-2 py-1 text-sm text-gray-600 hover:bg-gray-50 transition-colors " onClick={handleCopy}>
            {copied ? (
                <FiCheck className="h-4 w-4" />
            ) : (
                <FiCopy className="h-4 w-4" />
            )}
            {copied ? "Copied" : "Copy"}
        </button>
    )
}

export default CopyButton;