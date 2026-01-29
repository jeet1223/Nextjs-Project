"use client";

import React, { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { handleSubmit } from "@/app/services/apiService";

type PageType = "about" | "terms" | "privacy";

export default function CRMPage() {
  const [Editor, setEditor] = useState<any>(null);
  const [activePage, setActivePage] = useState<PageType>("about");
  const [data, setData] = useState<string>("");

  // Load CKEditor only on client
  useEffect(() => {
    const loadEditor = async () => {
      const ClassicEditor = (await import("@ckeditor/ckeditor5-build-classic")).default;
      setEditor(() => ClassicEditor);
    };
    loadEditor();
  }, []);

  // Fetch content dynamically from API when activePage changes
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const token = sessionStorage.getItem("access_token");
        const res = await fetch(`/api/admin/cms?type=${activePage}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        setData(json.html || "");
      } catch (err) {
        console.error(err);
        setData("");
      }
    };

    fetchContent();
  }, [activePage]);

  const handlePageChange = (page: PageType) => {
    setActivePage(page);
  };

  const handleSaveClick = async () => {
    try {
      await handleSubmit(activePage, data);
    } catch (err) {
      console.error(err);
      alert("Failed to save content!");
    }
  };

  if (!Editor) return <p>Loading editor...</p>;

  return (
    <div style={{ maxWidth: 800, margin: "20px auto" }}>
      <h1>CMS Editor</h1>

      {/* Page Buttons */}
      <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
        {(["about", "terms", "privacy"] as PageType[]).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            style={{
              padding: "6px 14px",
              cursor: "pointer",
              borderRadius: 4,
              border: "1px solid #ccc",
              backgroundColor: activePage === page ? "#0070f3" : "#f1f1f1",
              color: activePage === page ? "#fff" : "#000",
              fontWeight: activePage === page ? "bold" : "normal",
            }}
          >
            {page === "about"
              ? "About"
              : page === "terms"
              ? "Terms & Conditions"
              : "Privacy Policy"}
          </button>
        ))}
      </div>

      {/* CKEditor */}
     <CKEditor
  editor={Editor}
  disableWatchdog={true}
  config={{
    licenseKey: "GPL",
    toolbar: [
      "heading",
      "|",
      "bold",
      "italic",
      "link",
      "bulletedList",
      "numberedList",
      "blockQuote",
      "undo",
      "redo",
    ],
    heading: {
      options: [
        { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
        { model: "heading1", view: "h1", title: "Heading 1", class: "ck-heading_heading1" },
        { model: "heading2", view: "h2", title: "Heading 2", class: "ck-heading_heading2" },
        { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" },
      ],
    },
  }}
  data={data}
  onChange={(_, editor) => setData(editor.getData())}
/>


      {/* Save Button */}
      <button
        onClick={handleSaveClick}
        style={{
          marginTop: 20,
          padding: "8px 16px",
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Save {activePage}
      </button>

      <style jsx global>{`
        .ck-editor__editable_inline {
          min-height: 350px !important;
        }
      `}</style>
    </div>
  );
}
