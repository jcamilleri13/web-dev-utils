<script lang="ts">
  import type { Snippet } from 'svelte'

  import { get } from '$lib/utils/get'

  import Button from './Button.svelte'

  interface Props {
    children: Snippet
    product: {
      _id: string
      name: string
      shortDescription: string
      image: string
      price: number
      metadata?: Record<string, string | number | boolean>
    }
  }
  const { children, product }: Props = $props()

  function onAddToCart() {
    // Add any secondary functions, like analytics, here.
  }

  let dataAttributes = {
    'data-item-id': product._id,
    'data-item-name': product.name,
    'data-item-description': product.shortDescription,
    'data-item-image': get.thumbnailUrl(product.image),
    'data-item-price': product.price,
    'data-item-metadata': JSON.stringify(product.metadata),
  }
</script>

<Button primary class="snipcart-add-item" onclick={onAddToCart} {...dataAttributes}>
  {@render children()}
</Button>
