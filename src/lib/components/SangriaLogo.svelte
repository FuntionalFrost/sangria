<script lang="ts">
	let { size = 36, class: className = '' } = $props<{ size?: number; class?: string }>();
</script>

<div
	class="flex shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-rose-500 via-rose-600 to-amber-500 text-white shadow-md shadow-rose-500/30 transition-transform duration-200 hover:scale-105 {className}"
	style="width: {size}px; height: {size}px;"
>
	<svg
		width={Math.round(size * 0.58)}
		height={Math.round(size * 0.58)}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2.2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<!-- Sangria Wine Glass -->
		<path d="M8 22h8" />
		<path d="M12 15v7" />
		<path d="M6 3h12l-1.5 6a4.5 4.5 0 0 1-9 0L6 3z" fill="currentColor" fill-opacity="0.3" />
		<!-- Wave liquid fill line -->
		<path d="M8.5 7.5c1.5 1 2.5-1 3.5 0" />
	</svg>
</div>
