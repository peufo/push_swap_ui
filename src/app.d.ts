import type { User, Session } from '@prisma/client'

declare global {
    namespace App {
        interface Locals {
            user: User | null
            session: Session | null
        }
        interface PageData {
            user: User | null
        }
        // interface Error {}
        // interface PageState {}
        // interface Platform {}
    }
}

export {}
