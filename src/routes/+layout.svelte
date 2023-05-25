<script>
  import Header from "./Header.svelte";
  import "./styles.css";
  import "../app.css";
</script>

<div class="app sm:px-2 py-2 mx-auto overflow-auto">
  <main>
    <Header />

    <slot />
  </main>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  /* main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    max-width: 64rem;
    margin: 0 auto;
    box-sizing: border-box;
  } */
</style>
