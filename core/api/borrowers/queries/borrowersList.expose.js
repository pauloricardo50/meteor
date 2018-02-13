import Security from "core/api/security";
import query from "./borrowersList";

query.expose({
    firewall(userId) {
        Security.checkAdmin(userId);
    }
});