import Security from "core/api/security";
import query from "./adminActionsList";

query.expose({
    firewall(userId) {
        Security.checkAdmin(userId);
    }
});
