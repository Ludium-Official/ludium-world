export default class Button {
  constructor(props) {
    this.el = document.createElement("button");
    this.el.type = "button";
    this.el.onclick = () => {
      props.columnInfo.renderer.options.onClick(
        props.grid.getRow(props.rowKey)
      );
    };
    this.render(props);
  }

  getElement() {
    return this.el;
  }

  render(props) {
    this.el.innerText = props.columnInfo.renderer.options.text;
  }
}
