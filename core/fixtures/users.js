import { Accounts } from "meteor/accounts-base";
import { USERS } from "./config";

export default () => {
    for (let i = 0; i < USERS; i++) {
        Accounts.createUser({
            email: `user-${i + 1}@epotek.ch`,
            password: "12345"
        });
    }
};
