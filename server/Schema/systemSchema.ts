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

    type IPSecOutput {
        L2TP_Raw_bool: Boolean,
        L2TP_IPsec_bool: Boolean,
        EtherIP_IPsec_bool: Boolean,
        IPsec_Secret_str: String,
        L2TP_DefaultHub_str: String
    }

    input IPSec {
        L2TP_Raw_bool: Boolean,
        L2TP_IPsec_bool: Boolean,
        EtherIP_IPsec_bool: Boolean,
        IPsec_Secret_str: String,
        L2TP_DefaultHub_str: String
    }

    type Query {
        import(data: Import): Boolean
        getIpSec: IPSecOutput
        setIpSec(ipsec: IPSec): IPSecOutput
    }
`;
