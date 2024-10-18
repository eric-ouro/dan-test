"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Editor from "@monaco-editor/react";

const QueryCooker: React.FC = () => {
  const [table, setTable] = useState("");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const runQuery = async () => {
    setLoading(true);
    setResult("");
    setError(null);
    const supabase = createClient();
    const { data, error } = await supabase.from(table).select(query);
    if (error) setError(error.message);
    else setResult(JSON.stringify(data, null, 2));
    setLoading(false);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 min-w-[50vw] p-6 space-y-4 flex flex-col">
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={table}
          onChange={(e) => {
            setTable(e.target.value);
          }}
          placeholder="Enter the table name..."
        />
        <div className="h-[40vh] border rounded overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage="sql"
            value={query}
            onChange={(value) => {
              setQuery(value ?? "");
            }}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false,
              wordWrap: "on",
            }}
          />
        </div>
        <button
          className="w-full mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={runQuery}
          disabled={loading}
        >
          {loading ? "Running..." : "Run Query"}
        </button>
      </div>

      <div className="w-1/2 flex flex-col">
        {error && (
          <div className="p-6">
            <div className="p-3 bg-red-800 border border-red-600 text-red-100 rounded">
              {error}
            </div>
          </div>
        )}

        {result && (
          <div className="flex-grow overflow-auto p-6">
            <pre className="h-full p-4 bg-gray-800 text-gray-100 rounded overflow-auto">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryCooker;
