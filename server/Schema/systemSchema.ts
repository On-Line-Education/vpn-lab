import { gql } from "apollo-server-express";

export default gql`
    input Import {
        csv: [CSV]
        newHub: Boolean
        hubName: String
    }

    input CSV {
        name: String
        username: String
        role: String
        password: String
    }

    type IPSecOutput {
        L2TP_Raw_bool: Boolean
        L2TP_IPsec_bool: Boolean
        EtherIP_IPsec_bool: Boolean
        IPsec_Secret_str: String
        L2TP_DefaultHub_str: String
    }

    input IPSec {
        L2TP_Raw_bool: Boolean
        L2TP_IPsec_bool: Boolean
        EtherIP_IPsec_bool: Boolean
        IPsec_Secret_str: String
        L2TP_DefaultHub_str: String
    }

    input FileEdit {
        id: Int
        name: String
        url: String
        permission: String
    }

    type FileOutput {
        id: Int
        name: String
        url: String
        permission: String
    }

    type ImportResult {
        successful: Boolean
        message: String
        names: [String]
    }

    enum Permission {
        ADMIN
        INSTRUCTOR
        USER
    }

    type Query {
        getIpSec: IPSecOutput
        getFilesList: [FileOutput]
        getRoles: [String]
    }

    type Mutation {
        import(data: Import): ImportResult
        setIpSec(ipsec: IPSec): IPSecOutput
        addFileEntry(name: String, permission: Permission, url: String): Boolean
        deleteFileEntry(id: Int): Boolean
        editFileEntry(data: FileEdit): Boolean
    }
`;
