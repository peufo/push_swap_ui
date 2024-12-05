import type { User, Session } from '@prisma/client'

declare global {
    namespace App {
        interface Locals {
            user: User | null
            session: Session | null
        }
        // interface Error {}
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }
}

export {}
