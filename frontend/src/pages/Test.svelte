<script>
  import Button from '@components/Basic/Button.svelte'
  let themes = ['light', 'dark', 'blue'];

  let colors = [
    { name: 'pri', label: 'Primary' },
    { name: 'privari', label: 'Primary Variant' },
    { name: 'sec', label: 'Secondary' },
    { name: 'secvari', label: 'Secondary Variant' },
    { name: 'bg', label: 'Background' },
    { name: 'card', label: 'Card' },
    { name: 'err', label: 'Error' }
  ];

  let onColors = [
    { name: 'onpri', label: 'On Primary' },
    { name: 'onprivari', label: 'On Primary Variant' },
    { name: 'onsec', label: 'On Secondary' },
    { name: 'onsecvari', label: 'On Secondary Variant' },
    { name: 'onbg', label: 'On Background' },
    { name: 'oncard', label: 'On Card' },
    { name: 'onerr', label: 'On Error' }
  ];

  let activeTheme = 'light';

  function setTheme(theme) {
    activeTheme = theme;
    document.documentElement.classList.remove('light', 'dark', 'blue');
    document.documentElement.classList.add(theme);
  }
</script>

<style>
  .color-box {
    width: 120px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0.5rem;
    border-radius: 0.5rem;
    font-weight: bold;
    text-align: center;
  }

  .grid {
    display: flex;
    flex-wrap: wrap;
  }

  .theme-btn {
    margin-right: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
    border: 1px solid #ccc;
    background: #f9f9f9;
  }

  .theme-btn.active {
    border-color: #1c3d5a;
    font-weight: bold;
  }
</style>

<div>
  <h2>Theme Selector</h2>
  {#each themes as theme}
    <button
      class="theme-btn {theme === activeTheme ? 'active' : ''}"
      on:click={() => setTheme(theme)}>
      {theme}
    </button>
  {/each}
</div>

<h2>Colors</h2>
<div class="grid">
  {#each colors as color}
    <div
      class="color-box"
      style="background-color: var(--{color.name}); color: var(--on{color.name});">
      {color.label}
    </div>
  {/each}
</div>

<h2>On Colors (text colors)</h2>
<div class="grid">
  {#each onColors as color}
    <div
      class="color-box"
      style="background-color: var(--{color.name.replace('on','').toLowerCase()}); color: var(--{color.name});">
      {color.label}
    </div>
  {/each}
</div>

<button>
  test
  <Button label="Submit" onClick={() => console.log('Clicked!')} />
</button>
