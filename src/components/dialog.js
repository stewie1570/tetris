import "./dialog.css";
import React from "react";

export class Dialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = { visible: props.visible };
  }

  hide = () => this.setState({ visible: false });

  exit = () => {
    this.props.onExit && this.props.onExit();
    this.hide();
  };

  show = () => this.setState({ visible: true });

  render() {
    return this.state.visible ? (
      <div className="modal" style={{ display: "block" }} role="dialog">
        <div className="dialog-shade" />
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                onClick={this.exit}
                className="close"
                aria-label="Close"
              >
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">{this.props.children}</div>
          </div>
        </div>
      </div>
    ) : (
      <div role="dialog" />
    );
  }
}
