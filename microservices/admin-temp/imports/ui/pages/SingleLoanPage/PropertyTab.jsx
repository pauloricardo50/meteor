import React from "react";
import { getLoanValue } from "core/utils/loanFunctions";
import { IntlNumber } from "core/components/Translation";

const styles = {
    recapDiv: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: 400
    }
};

export default class PropertyTab extends React.Component {
    constructor(props) {
        super(props);

        this.state = { showObject: false };
    }

    render() {
        const { loan, borrowers, property, dataToPassDown } = this.props;
        const { showObject } = this.state;

        return (
            <div>
                <h1>
                    {property.name ||
                        property.address ||
                        property.address1 ||
                        property.address2}{" "}
                    - Emprunt de{" "}
                    <IntlNumber
                        value={getLoanValue({
                            loan,
                            property
                        })}
                        format="money"
                    />
                </h1>
            </div>
        );
    }
}
