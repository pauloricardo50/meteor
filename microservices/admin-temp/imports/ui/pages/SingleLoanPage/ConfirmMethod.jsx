import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'core/components/Material/Dialog';
import Button from 'core/components/Button';
import TextField from 'core/components/Material/TextField';

export default class ConfirmMethod extends Component {
    state = {
        open: false,
        text: ''
    };

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleSubmit = () => {
        this.props.method(err => {
            if (!err) {
                this.setState({ open: false });
            }
        });
    };

    handleChange = event => {
        this.setState({
            text: event.target.value
        });
    };

    render() {
        const actions = [
            <Button
                label="Annuler"
                primary
                onClick={this.handleClose}
                key="cancel"
            />,
            <Button
                label="Okay"
                primary
                disabled={this.state.text !== this.props.keyword}
                onClick={this.handleSubmit}
                key="ok"
            />
        ];

        return (
            <div>
                <Button
                    raised
                    label={this.props.label}
                    onClick={this.handleOpen}
                    style={this.props.style}
                    disabled={this.props.disabled}
                />
                <Dialog
                    title="Êtes-vous sûr?"
                    actions={actions}
                    important
                    open={this.state.open}
                >
                    Tapez le mot &quot;{this.props.keyword}&quot; pour valider
                    cette action.
                    <div>
                        <TextField autoFocus onChange={this.handleChange} />
                    </div>
                </Dialog>
            </div>
        );
    }
}

ConfirmMethod.propTypes = {
    label: PropTypes.string.isRequired,
    keyword: PropTypes.string.isRequired,
    method: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
    style: PropTypes.object.isRequired
};
