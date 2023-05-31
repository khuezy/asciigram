<script lang="ts">
  import welcome from "$lib/images/svelte-welcome.webp";
  import welcome_fallback from "$lib/images/svelte-welcome.png";
  import FileUpload from "$lib/fileupload/FileUpload.svelte";
  import Post from "../lib/Post/Post.svelte";
  export let data;
</script>

<svelte:head>
  <title>asciigram</title>
  <meta name="description" content="AsciiGram" />
</svelte:head>

<section>
  <div class="">
    <!-- # ATTN -->
    {#each data.posts as post}
      <Post
        id={post.id}
        authorId={post.authorId}
        images={post.images}
        author={post.author}
        avatar={post.avatar}
        date={post.time}
        comments={post.comments}
        likes={post.likes}
      />
    {/each}
  </div>
</section>

<style>
</style>
