export class ProfileLink {
  constructor(props) {
    const { path } = props.columnInfo.renderer.options;
    const { id, usrId } = props.grid.getRow(props.rowKey);
    this.el = document.createElement("a");
    this.el.href = `/${path}/${id ?? usrId}`;

    this.render(props);
  }

  getElement() {
    return this.el;
  }

  render(props) {
    const { text } = props.columnInfo.renderer.options;
    const innerText = props.grid.getRow(props.rowKey)[text];

    this.el.innerText = innerText;
  }
}
