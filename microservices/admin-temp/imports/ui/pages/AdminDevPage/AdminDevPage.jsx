import React from "react";
import PropTypes from "prop-types";
import cleanMethod from "core/api/cleanMethods";

import Button from "core/components/Button";

const addVerifyingLoan = () => {
    const object = {
        general: { fortuneUsed: 250000, partnersToAvoid: ["joe", "john"] },
        borrowers: "testBorrower",
        property: { value: 1000000 },
        logic: {
            verification: {
                requested: true,
                requestedTime: new Date()
            }
        },
        admin: {}
    };
    cleanMethod("insertLoan", { object });
};

const AdminDev = () => (
    <section>
        <h1>Ajouter des tests</h1>
        <div>
            <Button
                raised
                label="En demande de vérification"
                onClick={() => addVerifyingLoan()}
            />
        </div>
    </section>
);

AdminDev.propTypes = {};

export default AdminDev;
