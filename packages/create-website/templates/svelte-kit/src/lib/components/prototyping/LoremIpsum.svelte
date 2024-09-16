<script lang="ts">
  import { type ILoremIpsumParams, loremIpsum } from 'lorem-ipsum'

  export let paragraphs: number | undefined = undefined
  export let sentences: number | undefined = undefined
  export let words: number | undefined = undefined

  let props = { paragraphs, sentences, words } as const
  let text: string[] = []

  $: {
    const config = Object.entries(props).filter(([_, value]) => value != null)
    if (config.length > 1) {
      console.warn(
        'You can only configure paragraphs, sentences, or words for the LoremIpsum component.',
        `${paragraphs != null ? '`paragraphs`' : '`sentences`'} will be used.`,
      )
    }

    const unit = config[0]?.[0] ?? 'paragraphs'
    text = loremIpsum({
      count: props[unit as 'paragraphs' | 'sentences' | 'words'] ?? 1,
      units: unit as ILoremIpsumParams['units'],
    }).split('\n')
  }
</script>

<div>
  {#each text as paragraph}
    <p>{paragraph}</p>
  {/each}
</div>
