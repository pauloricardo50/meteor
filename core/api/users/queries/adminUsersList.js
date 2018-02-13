import { Users } from "../../";

export default Users.createQuery("adminUsersList", {
    $options: {
        sort: {
            createdAt: -1
        }
    },
    emails: 1,
    createdAt: 1,
    roles: 1
});
