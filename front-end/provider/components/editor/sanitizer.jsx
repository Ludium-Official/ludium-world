import DOMPurify from "dompurify";

export default (html) =>
  DOMPurify.sanitize(html, {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: [
      "rel",
      "target",
      "hreflang",
      "type",
      "frameborder",
      "allow",
      "allowfullscreen",
    ],
    FORBID_TAGS: [
      "input",
      "script",
      "textarea",
      "form",
      "button",
      "select",
      "meta",
      "style",
      "link",
      "title",
      "object",
      "base",
    ],
  });
