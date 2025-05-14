"use client"

import { useState } from "react";

function CodeExamples() {
    const [activeTab, setActiveTab] = useState<"ts" | "curl">("ts")

    const tsCode = `// 1. Get upload URL
const {url, key} = await fetch('/api/upload-url', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + YOUR_API_KEY,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({fileType: '.mp4'})
}).then(res => res.json());

// 2. Upload file 
await fetch(url, {
  method: 'POST',
  headers: {'Content-Type': 'video/mp4'},
  body: videoFile,
});

// 3. Analyze video
const analysis = await fetch('/api/sentiment-inference', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + YOUR_API_KEY,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ key })
}).then(res => res.json());
    `

    const curlCode = `# 1. Get upload URL
curl -X POST '/api/upload-url' \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -H 'Content-Type: application/json' \\
  -d '{"fileType": ".mp4"}'

# Response contains url and key

# 2. Upload file (using the URL from previous response)
curl -X POST 'UPLOAD_URL' \\
  -H 'Content-Type: video/mp4' \\
  --data-binary '@/path/to/your/video.mp4'

# 3. Analyze video
curl -X POST '/api/sentiment-inference' \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -H 'Content-Type: application/json' \\
  -d '{"key": "FILE_KEY"}'
    `

    return (
        <div className="mt-3 flex h-fit w-full flex-col rounded-md">
            <span className="text-sm">API Usage</span>
            <span className="mb-4 text-sm text-gray-500">
                Code examples
            </span>

            <div className="overflow-hidden rounded-lg bg-gray-900">
                <div className="flex border-b border-b-gray-700">
                    <button 
                        onClick={() => setActiveTab("ts")}
                        className={`px-4 py-2 text-xs ${activeTab === "ts" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-gray-300"}`}
                    >
                        Typescript
                    </button>
                    <button 
                        onClick={() => setActiveTab("curl")}
                        className={`px-4 py-2 text-xs ${activeTab === "curl" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-gray-300"}`}
                    >
                        cURL
                    </button>
                </div>
                <div className="p-4">
                    <pre className="max-h-[300px] overflow-y-auto text-xs text-gray-300">
                        <code>
                            {activeTab === 'ts' ? tsCode : curlCode}
                        </code>
                    </pre>
                </div>
            </div>
        </div>
    )
}

export default CodeExamples;