export default class DynamicLink {
  constructor(props) {
    const row = props.grid.getRow(props.rowKey);
    const key = props.columnInfo.renderer.options.key;
    const href = key.reduce((acc, cur) => {
      return acc.replace("$", row[cur]);
    }, props.columnInfo.renderer.options.href);

    this.el = document.createElement("a");
    this.el.href = href;
    this.render(props);
  }

  getElement() {
    return this.el;
  }

  render(props) {
    this.el.innerText = props.columnInfo.renderer.options.text;
  }
}
