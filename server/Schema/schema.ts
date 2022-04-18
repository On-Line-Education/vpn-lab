import { gql } from "apollo-server-express";

export default gql`
    type VPNHubGet {
        AdminPasswordPlainText_str: String
        HashedPassword_bin: String
        HubName_str: String
        HubType_u32: Int
        MaxSession_u32: Int
        NoEnum_bool: Boolean
        Online_bool: Boolean
        SecurePassword_bin: String
    }

    type Query {
        hello: String
        getVPNHub(name: String): VPNHubGet
    }
`;
