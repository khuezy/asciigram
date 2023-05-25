<script lang="ts">
  import { page } from "$app/stores";
  import dayjs from "dayjs";
  import relativeTime from "dayjs/plugin/relativeTime";
  import updateLocale from "dayjs/plugin/updateLocale";
  dayjs.extend(relativeTime);
  dayjs.extend(updateLocale);
  dayjs.updateLocale("en", {
    relativeTime: {
      future: "in %s",
      past: "%s",
      s: "%ds",
      ss: "%ds",
      m: "%ds",
      mm: "%dm",
      h: "%dh",
      hh: "%dh",
      d: "%dd",
      dd: "%dd",
      M: "%dM",
      MM: "%dM",
      y: "%dy",
      yy: "%dy",
    },
  });
  export let images: { data: string }[] = [];
  export let id = 0;
  export let avatar = "";
  export let author = "";
  export let authorId = "";
  export let date;
  export let likes: {
    name: string;
    image: string;
    user: { name: string; image: string };
  }[] = [];

  export let comments: Partial<{
    comment: string;
    user: { name: string; image: string };
  }>[] = [];

  $: com = comments;
  $: li = likes;
  $: like = !!li.find((l) => l.user?.id === $page.data.session?.user.id);

  let comment = "";
  const timeAgo = dayjs(date).fromNow();

  function toHtml(code: string) {
    // Extract the code value from the input string
    const [c, v] = code.split("|");
    return `<span style="color:${c.replaceAll(",", "&#44;")}">${v}</span>`;
  }

  function stringToHtml(str: string) {
    const data = JSON.parse(str) as string[][];
    return data
      .map((d) => d.map((dd) => toHtml(dd)))
      .join("<br />")
      .replaceAll(",", "");
  }

  function deletePost(postId: number, authorId: string) {
    return fetch("/upload", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId, authorId }),
    });
  }

  async function postComment() {
    const result = await fetch("/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment,
        postId: id,
        authorId: $page.data.session?.user.id,
      }),
    });
    const data = await result.json();
    com = com.concat(data.comment);
    comment = "";
  }

  async function postLike() {
    await fetch("/likes", {
      method: like ? "DELETE" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: id,
      }),
    });
    if (!like) {
      li = li.concat({ user: $page.data.session?.user });
    } else {
      li = li.filter((l) => l.user?.id !== $page.data.session?.user.id);
    }
    like = !like;
  }
</script>

<div
  class="mt-4 sm:w-[650px] mx-auto text-slate-300 pt-2 border-t border-t-slate-500"
>
  <div class="flex items-center gap-2 text-sm">
    <!-- {#if $page.data.session?.user} -->
    <img
      referrerpolicy="no-referrer"
      class="w-6 rounded-xl"
      src={avatar}
      alt="avatar"
    />
    <span>{author}</span>•<span>{timeAgo}</span>
    <!-- {/if} -->
  </div>

  <!-- <img class="w-full my-2" {src} alt="insta" /> -->
  <pre
    class="text-[7px] sm:text-[12px] mt-4 sm:text-sm border-0 shadow-none leading-tight"
    style={"background: #000"}>
{#each images as image}{@html stringToHtml(image.data)}{/each}
  </pre>
  <!-- liked by -->
  <div class="flex gap-1 text-pink-200">
    <span>Liked by </span>
    {#if li.length === 0}
      <span>0</span>
    {:else if li.length > 0}
      <span>
        <img
          referrerpolicy="no-referrer"
          class="w-6 rounded-full flex-grow-[2]"
          src={li[0].user?.image}
          alt={li[0].user?.name}
        /></span
      >
    {/if}
    {#if li.length > 1}
      <span>and {li.length - 1} others</span>
    {/if}
  </div>
  {#if $page.data.session?.user}
    <div class="flex">
      <!-- heart -->
      <svg on:click={postLike} class="w-8 cursor-pointer" viewBox="0 0 20 20">
        <path
          fill={like ? "#f00" : "#fff"}
          d="M13.22,2.984c-1.125,0-2.504,0.377-3.53,1.182C8.756,3.441,7.502,2.984,6.28,2.984c-2.6,0-4.714,2.116-4.714,4.716c0,0.32,0.032,0.644,0.098,0.96c0.799,4.202,6.781,7.792,7.46,8.188c0.193,0.111,0.41,0.168,0.627,0.168c0.187,0,0.376-0.041,0.55-0.127c0.011-0.006,1.349-0.689,2.91-1.865c0.021-0.016,0.043-0.031,0.061-0.043c0.021-0.016,0.045-0.033,0.064-0.053c3.012-2.309,4.6-4.805,4.6-7.229C17.935,5.1,15.819,2.984,13.22,2.984z M12.544,13.966c-0.004,0.004-0.018,0.014-0.021,0.018s-0.018,0.012-0.023,0.016c-1.423,1.076-2.674,1.734-2.749,1.771c0,0-6.146-3.576-6.866-7.363C2.837,8.178,2.811,7.942,2.811,7.7c0-1.917,1.554-3.47,3.469-3.47c1.302,0,2.836,0.736,3.431,1.794c0.577-1.121,2.161-1.794,3.509-1.794c1.914,0,3.469,1.553,3.469,3.47C16.688,10.249,14.474,12.495,12.544,13.966z"
        />
      </svg>
      {#if $page.data.session?.user?.id === authorId}
        <svg
          on:click={async () => {
            await deletePost(id, $page.data.session?.user?.id);
            location.reload();
          }}
          class="w-8 cursor-pointer"
          viewBox="0 0 20 20"
        >
          <path
            fill="#fff"
            d="M16.471,5.962c-0.365-0.066-0.709,0.176-0.774,0.538l-1.843,10.217H6.096L4.255,6.5c-0.066-0.362-0.42-0.603-0.775-0.538C3.117,6.027,2.876,6.375,2.942,6.737l1.94,10.765c0.058,0.318,0.334,0.549,0.657,0.549h8.872c0.323,0,0.6-0.23,0.656-0.549l1.941-10.765C17.074,6.375,16.833,6.027,16.471,5.962z"
          />
          <path
            fill="#fff"
            d="M16.594,3.804H3.406c-0.369,0-0.667,0.298-0.667,0.667s0.299,0.667,0.667,0.667h13.188c0.369,0,0.667-0.298,0.667-0.667S16.963,3.804,16.594,3.804z"
          />
          <path
            fill="#fff"
            d="M9.25,3.284h1.501c0.368,0,0.667-0.298,0.667-0.667c0-0.369-0.299-0.667-0.667-0.667H9.25c-0.369,0-0.667,0.298-0.667,0.667C8.583,2.985,8.882,3.284,9.25,3.284z"
          />
        </svg>
      {/if}
    </div>
  {/if}

  {#if $page.data.session?.user}
    <div class="flex gap-1 my-2">
      <img
        referrerpolicy="no-referrer"
        class="w-6 rounded-full flex-grow-[2]"
        src={$page.data.session?.user.image}
        alt={$page.data.session?.user.name}
      />:

      <input
        bind:value={comment}
        class="w-full text-zinc-950 px-2"
        type="text"
      />
      <button class="border px-2" on:click={postComment}>
        <svg class="w-4" viewBox="0 0 20 20">
          <path
            fill="#fff"
            d="M19.404,6.65l-5.998-5.996c-0.292-0.292-0.765-0.292-1.056,0l-2.22,2.22l-8.311,8.313l-0.003,0.001v0.003l-0.161,0.161c-0.114,0.112-0.187,0.258-0.21,0.417l-1.059,7.051c-0.035,0.233,0.044,0.47,0.21,0.639c0.143,0.14,0.333,0.219,0.528,0.219c0.038,0,0.073-0.003,0.111-0.009l7.054-1.055c0.158-0.025,0.306-0.098,0.417-0.211l8.478-8.476l2.22-2.22C19.695,7.414,19.695,6.941,19.404,6.65z M8.341,16.656l-0.989-0.99l7.258-7.258l0.989,0.99L8.341,16.656z M2.332,15.919l0.411-2.748l4.143,4.143l-2.748,0.41L2.332,15.919z M13.554,7.351L6.296,14.61l-0.849-0.848l7.259-7.258l0.423,0.424L13.554,7.351zM10.658,4.457l0.992,0.99l-7.259,7.258L3.4,11.715L10.658,4.457z M16.656,8.342l-1.517-1.517V6.823h-0.003l-0.951-0.951l-2.471-2.471l1.164-1.164l4.942,4.94L16.656,8.342z"
          />
        </svg>
      </button>
    </div>
  {/if}
  <div class="max-h-40 overflow-auto">
    {#each com as c}
      <div class="flex gap-1">
        <img
          referrerpolicy="no-referrer"
          class="w-6 rounded-full"
          src={c.user.image}
          alt={c.user?.name}
        />:
        <!-- <span>{c.user?.name.split(" ")[0]}:</span> -->
        <span class="ml-1">{c.comment}</span>
      </div>
    {/each}
  </div>
</div>
