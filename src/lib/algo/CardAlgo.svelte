<script lang="ts">
    import { mdiBookOpenPageVariantOutline, mdiPoll } from '@mdi/js'
    import { Icon } from 'fuma'
    import type { Algorithm, User } from '@prisma/client'

    let { algo }: { algo: Algorithm & { author: User } } = $props()
</script>

<div class="card border shadow-lg">
    <div class="card-body">
        <h2 class="card-title">
            <span>{algo.name}</span>
            <span class="grow"></span>
            <span class="badge">{algo.score100}</span>
            <span class="badge">{algo.score500}</span>
        </h2>
        <p class="mb-4 text-sm">
            By
            <a
                href="https://profile.intra.42.fr/users/{algo.author.login}"
                class="link link-hover"
            >
                {algo.author.displayname}
            </a>
            from {algo.author.campus}
        </p>

        <div class="card-actions justify-end">
            <a href="/docs/{algo.id}" class="btn btn-ghost btn-sm">
                <Icon path={mdiBookOpenPageVariantOutline} />
                <span>read more</span>
            </a>
            <a href="/analyze?algoId={algo.id}" class="btn btn-ghost btn-sm">
                <Icon path={mdiPoll} />
                <span>Analize</span>
            </a>
        </div>
    </div>
</div>
