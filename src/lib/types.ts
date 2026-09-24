export interface SmtpConfig {
    id: string;
    user_id: string;
    name: string;
    description: string | null;
    host: string;
    port: number;
    username: string;
    password: string; // Encrypted at rest; never returned by the API
    use_tls: boolean;
    is_default: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface EmailProviderConfig {
    id: string;
    user_id: string;
    provider: 'graph' | 'gmail';
    name: string;
    description: string | null;
    graph_tenant_id: string | null;
    graph_client_id: string | null;
    graph_client_secret: string | null; // Encrypted at rest; never returned by the API
    gmail_sender_email: string | null;
    gmail_service_account_json: string | null; // Encrypted at rest; never returned by the API
    is_default: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface EmailTemplate {
    id: string;
    user_id: string;
    name: string;
    subject: string;
    html_content: string;
    from_name: string;
    from_email: string;
    created_at: string;
}

export interface EmailList {
    id: string;
    user_id: string;
    name: string;
    description: string;
    email_count: number;
    created_at: string;
}

export interface Campaign {
    id: string;
    user_id: string;
    name: string;
    template_id: string;
    list_id: string;
    smtp_config_id: string;
    status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused';
    total_emails: number;
    sent_emails: number;
    failed_emails: number;
    scheduled_at?: string;
    started_at?: string;
    completed_at?: string;
    created_at: string;
}

export interface CampaignLog {
    id: string;
    campaign_id: string;
    recipient_email: string;
    status: 'sent' | 'failed' | 'bounced';
    error_message?: string;
    sent_at?: string;
}
