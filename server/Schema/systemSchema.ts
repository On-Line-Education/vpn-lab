import { gql } from "apollo-server-express";

export default gql`
    input Import {
        csv: [CSV]
        newHub: Boolean
        hubName: String
    }

    input CSV {
        name: String
        role: String
        password: String
        passcode: String
    }

    type Query {
        import(data: Import): Boolean
    }
`;
