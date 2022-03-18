import React from "react";
import { CommandButton } from './CommandButton';

export class ReloadRecoveryErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    render() {
        return this.state.hasError
            ? (
                <>
                    <h1 style={{ textAlign: "center", color: "black" }}>Something went wrong.</h1>

                    <span>
                        Please &nbsp;
                        <CommandButton
                            className="btn btn-link"
                            style={{ width: "auto", padding: 0, verticalAlign: "auto" }}
                            onClick={() => window.location.reload()}>
                            reload
                        </CommandButton>
                        &nbsp; the page to try again.
                    </span>
                </>
            )
            : this.props.children;
    }
}