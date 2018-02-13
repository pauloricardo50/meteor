import Security from "core/api/security";
import query from "./tasksUsersList";

query.expose({
    firewall(userId) {
        Security.checkAdmin(userId);
    }
});