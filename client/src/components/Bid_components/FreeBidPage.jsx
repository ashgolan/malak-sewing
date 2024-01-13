import React, { useState, useRef, useMemo, useEffect } from "react";
import JoditEditor from "jodit-react";
import BidPage from "./BidPage";

export default function FreeBidPage({ placeholder, customOnChange }) {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || " תחילת כתיבה כאן ...",
      direction: "rtl", // Set the text direction to right-to-left (you can use 'ltr' for left-to-right)
      style: {
        textAlign: "right", // Set the default text alignment to right (you can use 'left', 'center', 'justify', etc.)
        height: "50vh",
      },
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "ol",
        "ul",
        "|",
        "outdent",
        "indent",
        "|",
        "font",
        "fontsize",
        "brush",
        "paragraph",
        "|",
        "image",
        "table",
        "link",
        "|",
        "align",
        "undo",
        "redo",
        "|",
        "hr",
        "eraser",
        "copyformat",
        "symbol",
        "|",
        "fullsize",
        "print",
        "about",
        "|",
        "fontcolor",
      ],
    }),

    [placeholder]
  );

  return (
    <div>
      <BidPage freeBid={true} freeTextContent={content}></BidPage>
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        tabIndex={1}
        onBlur={(newContent) => setContent(newContent)}
        onChange={(newContent) => {
          customOnChange && customOnChange(newContent);
        }}
      />
    </div>
  );
}
