import { Users } from "../../";

export default Users.createQuery("tasksUsersList", {
    $filter({filters, options, params}) { 
    
        filters.roles= {$in: ['admin']}
        
    },
    $options: {
        sort: {
            createdAt: -1
        },
    },
    emails: 1,    
});