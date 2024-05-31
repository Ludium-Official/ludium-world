import sanitizer from "./sanitizer";

export const YoutubeEmbedToolbar = (editorInstance) => {
  const container = document.createElement("form");
  const label = document.createElement("label");
  const textField = document.createElement("input");
  const button = document.createElement("button");

  label.textContent = "URL";
  label.htmlFor = "Youtube URL";

  textField.name = "Youtube URL";
  textField.id = "Youtube URL";

  button.type = "submit";
  button.textContent = "OK";

  container.addEventListener("submit", (e) => {
    e.preventDefault();

    const html = sanitizer(e.target["Youtube URL"].value);

    e.target["Youtube URL"].value = "";
    editorInstance.setMarkdown(editorInstance.getMarkdown() + html);
    editorInstance.eventEmitter.emit("closePopup");
  });

  container.appendChild(label);
  container.appendChild(textField);
  container.appendChild(button);

  return {
    name: "YouTube",
    tooltip: "YouTube",
    text: "You",
    className: "toastui-editor-toolbar-icons first",
    style: { backgroundImage: "none", color: "#333" },
    popup: {
      className: "",
      body: container,
      style: { width: "auto" },
    },
  };
};
