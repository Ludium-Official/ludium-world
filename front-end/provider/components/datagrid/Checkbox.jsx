export default class Checkbox {
  constructor(props) {
    this.el = document.createElement("input");
    this.el.type = "checkbox";
    this.el.onclick = () => {
      props.columnInfo.renderer.options.onClick(
        props.grid.getRow(props.rowKey),
        this.el.checked
      );
    };
    this.render(props);
  }

  getElement() {
    return this.el;
  }

  render(props) {
    this.el.checked = props.value;
  }
}
