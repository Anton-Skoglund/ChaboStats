<script>
  // Destructure props using $props
  let { label = 'Click me', onClick } = $props();
</script>

<button onclick={onClick}>
  {label}
</button>
