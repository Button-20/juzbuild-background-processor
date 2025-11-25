"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ContactInfo;
const jsx_runtime_1 = require("react/jsx-runtime");
const contactInfo_client_1 = require("@/lib/contactInfo-client");
const react_1 = require("react");
function ContactInfo() {
    const [email, setEmail] = (0, react_1.useState)("");
    const [address, setAddress] = (0, react_1.useState)("");
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const loadContactInfo = async () => {
            try {
                const data = await (0, contactInfo_client_1.fetchContactData)();
                setEmail(data.contact.supportEmail);
                setAddress(data.contact.address);
            }
            catch (error) {
                console.error("Failed to load contact info:", error);
            }
            finally {
                setLoading(false);
            }
        };
        loadContactInfo();
    }, []);
    if (loading) {
        return (0, jsx_runtime_1.jsx)("p", { children: "Loading contact information..." });
    }
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)("p", { children: ["Email: ", email, (0, jsx_runtime_1.jsx)("br", {}), "Address: ", address] }) }));
}
//# sourceMappingURL=ContactInfo.js.map