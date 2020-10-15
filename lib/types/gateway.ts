export interface SessionStartLimit {
    total: number,
    remaining: number,
    reset_after: number
}

export interface Gateway {
    url: string,
    shards: number,
    session_start_limit: SessionStartLimit
}

export interface GatewayPayload {
    op: number,
    d: any,
    s?: number,
    t?: string
}