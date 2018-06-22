import './error-message.css';
import React from 'react';

export class ErrorMessage extends React.Component {
    constructor(props) {
        super(props);

        this.state = { visible: false };
    }

    componentWillMount() {
        window.onerror = errorMessage => this.setState({ visible: true, errorMessage });
        var windowClick = ({ target }) => !this.errorContainer.contains(target) && this.hide();
        window.addEventListener("click", windowClick);
        window.addEventListener("touchstart", windowClick);
    }

    componentWillUnmount() {
        window.removeEventListener("click");
        window.removeEventListener("touchstart");
    }

    hide = () => this.setState({ visible: false });

    render() {
        return <div
            className="modal"
            style={{ display: this.state.visible ? "block" : "none" }}
            role="dialog">
            <div className="dialog-shade" />
            <div className="modal-dialog" ref={ref => this.errorContainer = ref} role="document">
                <div className="modal-content">
                    <div className="modal-header modal-header-error">
                        <b>Error</b>
                        <button type="button" onClick={this.hide} className="close" aria-label="Close">
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {(this.state.errorMessage || "").replace("Uncaught Error: ", "")}
                    </div>
                </div>
            </div>
        </div>;
    }
}