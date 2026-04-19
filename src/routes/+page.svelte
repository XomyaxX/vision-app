<script lang="ts">
	import { SITE_NAME } from '$constants/common';
	import Main from '$pages/Main/Main.svelte';
</script>

<svelte:head>
	<title>{SITE_NAME} — Главная</title>
</svelte:head>

<Main />
