import { gql } from "apollo-server-express";

export default gql`
    type HubGet {
        AdminPasswordPlainText_str: String
        HashedPassword_bin: String
        HubName_str: String
        HubType_u32: Int
        MaxSession_u32: Int
        NoEnum_bool: Boolean
        Online_bool: Boolean
        SecurePassword_bin: String
    }

    type CreateHub {
        HubName_str: String
        AdminPasswordPlainText_str: String
        Online_bool: Boolean
        MaxSession_u32: Int
        NoEnum_bool: Boolean
        HubType_u32: HubType
    }

    type HubUser {
        AuthType_u32: Int
        DenyAccess_bool: Boolean
        Recv_BroadcastBytes_u64: Float
        Recv_BroadcastCount_u64: Float
        Recv_UnicastBytes_u64: Float
        Recv_UnicastCount_u64: Float
        Send_BroadcastBytes_u64: Float
        Send_BroadcastCount_u64: Float
        Send_UnicastBytes_u64: Float
        Send_UnicastCount_u64: Float
        Expires_dt: DateTime
        GroupName_str: String
        IsExpiresFilled_bool: Boolean
        IsTrafficFilled_bool: Boolean
        LastLoginTime_dt: DateTime
        Name_str: String
        Note_utf: String
        NumLogin_u32: Int
        Realname_utf: String
    }

    type EnumHubItem {
        HubName_str: String
        Online_bool: Boolean
        HubType_u32: HubType
        NumUsers_u32: Int
        NumGroups_u32: Int
        NumSessions_u32: Int
        NumMacTables_u32: Int
        NumIpTables_u32: Int
        LastCommTime_dt: String
        LastLoginTime_dt: String
        CreatedTime_dt: String
        NumLogin_u32: Int
        IsTrafficFilled_bool: Boolean
        Recv_BroadcastBytes_u64: Float
        Recv_BroadcastCount_u64: Float
        Recv_UnicastBytes_u64: Float
        Recv_UnicastCount_u64: Float
        Send_BroadcastBytes_u64: Float
        Send_BroadcastCount_u64: Float
        Send_UnicastBytes_u64: Float
        Send_UnicastCount_u64: Float
    }

    type HubStatus {
        HubName_str: String
        Online_bool: Boolean
        HubType_u32: HubType
        NumSessions_u32: Int
        NumSessionsClient_u32: Int
        NumSessionsBridge_u32: Int
        NumAccessLists_u32: Int
        NumUsers_u32: Int
        NumGroups_u32: Int
        NumMacTables_u32: Int
        NumIpTables_u32: Int
        Recv_BroadcastBytes_u64: Float
        Recv_BroadcastCount_u64: Float
        Recv_UnicastBytes_u64: Float
        Recv_UnicastCount_u64: Float
        Send_BroadcastBytes_u64: Float
        Send_BroadcastCount_u64: Float
        Send_UnicastBytes_u64: Float
        Send_UnicastCount_u64: Float
        SecureNATEnabled_bool: Boolean
        LastCommTime_dt: String
        LastLoginTime_dt: String
        CreatedTime_dt: String
        NumLogin_u32: Int
    }

    type HubsList {
        NumHub_u32: Int
        HubList: [EnumHubItem]
    }

    type HubDelete {
        HubName_str: String
    }

    enum HubType {
        Standalone
        FarmStatic
        FarmDynamic
    }

    type HubUserEntry {
        user: HubUser
        groups: [String]
    }

    type Query {
        listHubs: HubsList
        getHub(hubName: String): HubGet
        getHubStatus(hubName: String): HubStatus
        createHub(
            hubName: String
            hubType: HubType
            online: Boolean
            maxSession: Int
            password: String
            noEnum: Boolean
        ): CreateHub
        updateHub(
            hubName: String
            hubType: HubType
            online: Boolean
            maxSession: Int
            password: String
            noEnum: Boolean
        ): CreateHub
        deleteHub(hubName: String): HubDelete
        getHubUsers(hubName: String): [HubUserEntry]
    }

    scalar DateTime
`;
