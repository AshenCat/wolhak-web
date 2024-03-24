type GuildObject = {
    id: string;
    name: string;
    icon: string;
    description: any;
    splash: string;
    discovery_splash: any;
    approximate_member_count: number;
    approximate_presence_count: number;
    features: string[];
    emojis: [
        {
            name: string;
            roles: [];
            id: string;
            require_colons: boolean;
            managed: false;
            animated: boolean;
            available: boolean;
        }
    ];
    banner: string;
    owner_id: string;
    application_id: any;
    region: any;
    afk_channel_id: any;
    afk_timeout: number;
    system_channel_id: any;
    widget_enabled: true;
    widget_channel_id: string;
    verification_level: number;
    roles: {
        id: string;
        name: string;
        permissions: string;
        position: number;
        color: number;
        hoist: boolean;
        managed: boolean;
        mentionable: boolean;
    }[];
    default_message_notifications: number;
    mfa_level: number;
    explicit_content_filter: number;
    max_presences: any;
    max_members: number;
    max_video_channel_users: number;
    vanity_url_code: string;
    premium_tier: number;
    premium_subscription_count: number;
    system_channel_flags: number;
    preferred_locale: string;
    rules_channel_id: any;
    public_updates_channel_id: any;
    safety_alerts_channel_id: any;
};

type GuildPartials = {
    id: string;
    name: string;
    icon: string | null;
    owner: boolean;
    permissions: string;
    permissions_new?: string;
    features: string[];
};

type ServerProps<T> = {
    params: T;
    searchParams: ReadonlyURLSearchParams;
};
