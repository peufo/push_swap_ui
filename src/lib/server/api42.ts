import type { OAuth2Tokens } from 'arctic'

const endpoint = 'https://api.intra.42.fr/v2'

export const api42 = {
    async me(tokens: OAuth2Tokens) {
        const res = await fetch(endpoint + '/me', {
            headers: {
                Authorization: `Bearer ${tokens.accessToken()}`,
            },
        })
        return (await res.json()) as User42
    },
}

type User42 = {
    id: number
    email: string
    login: string
    first_name: string
    last_name: string
    usual_full_name: string
    usual_first_name: string
    url: string
    phone: null
    displayname: string
    kind: string
    image: {
        link: string
        versions: {
            large: string
            medium: string
            small: string
            micro: string
        }
    }
    'staff?': boolean
    correction_point: number
    pool_month: string
    pool_year: string
    location: null
    wallet: number
    anonymize_date: Date
    data_erasure_date: null
    'alumni?': boolean
    'active?': boolean
    groups: any[]
    cursus_users: {
        id: number
        begin_at: Date
        end_at: null
        grade: null
        level: number
        skills: any[]
        cursus_id: number
        has_coalition: boolean
        user: {
            id: number
            login: string
            url: string
        }
        cursus: {
            id: number
            created_at: Date
            name: string
            slug: string
        }
    }[]
    projects_users: any[]
    languages_users: {
        id: number
        language_id: number
        user_id: number
        position: number
        created_at: Date
    }[]
    achievements: any[]
    titles: any[]
    titles_users: any[]
    partnerships: any[]
    patroned: {
        id: number
        user_id: number
        godfather_id: number
        ongoing: boolean
        created_at: Date
        updated_at: Date
    }[]
    patroning: any[]
    expertises_users: {
        id: number
        expertise_id: number
        interested: boolean
        value: number
        contact_me: boolean
        created_at: Date
        user_id: number
    }[]
    roles: any[]
    campus: {
        id: number
        name: string
        time_zone: string
        language: {
            id: number
            name: string
            identifier: string
            created_at: Date
            updated_at: Date
        }
        users_count: number
        vogsphere_id: number
    }[]
    campus_users: {
        id: number
        user_id: number
        campus_id: number
        is_primary: boolean
    }[]
}
