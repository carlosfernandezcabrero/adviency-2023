<script lang="ts">
	import { onMount } from 'svelte';
	import api from '../api';
	import AddGiftForm from '../components/add-gift-form.svelte';
	import GiftsListItem from '../components/gifts-list-item.svelte';
	import GiftsListSummary from '../components/gifts-list-summary.svelte';
	import type { GiftInterface } from '../types';

	const INITIAL_GIFT: GiftInterface = {
		id: '',
		name: '',
		quantity: 1,
		imageUrl: '',
		owner: '',
		price: 0
	};

	let gifts: GiftInterface[] = [];
	let currentGift: GiftInterface = { ...INITIAL_GIFT };
	let showForm = false;
	let loadingData = true;
	let showList = false;

	onMount(async () => {
		loadingData = true;
		gifts = await api.gifts.list();
		loadingData = false;
	});

	function handleDeleteAllGifts() {
		gifts = [];
		localStorage.removeItem('gifts');
	}

	function previewList() {
		window.scrollTo(0, 0);
		showList = true;
	}

	function printList() {
		window.print();
	}
</script>

{#if showList}
	<dialog
		class="absolute top-0 grid w-full h-full bg-transparent shadow-xl text-neutral-900 place-content-center"
	>
		<div class="flex flex-col flex-1 gap-10 p-8 bg-white rounded">
			<div class="grid gap-10 bg-white rounded" id="printable">
				<h2 class="text-5xl text-center title">Comprar:</h2>
				<ul class="grid gap-4 list-inside" id="print-list">
					{#each gifts as gift (`${gift.name}-${gift.owner}`)}
						<GiftsListItem {gift} anonymous={true} />
					{/each}
				</ul>
			</div>
			<footer class="flex items-center justify-between">
				<button on:click={() => (showList = false)}>Cerrar</button>
				<button class="primary" on:click={printList}>Imprimir</button>
			</footer>
		</div>
	</dialog>
{:else}
	<section
		class="flex flex-col gap-16 p-8 bg-white text-neutral-900 rounded shadow-xl min-w-[500px] z-0"
	>
		<h1 class="text-5xl font-bold text-center title">Regalos:</h1>

		<div class="grid gap-12">
			<AddGiftForm bind:currentGift bind:gifts bind:showForm initialGift={INITIAL_GIFT} />

			{#if loadingData}
				<div class="flex flex-col items-center mx-auto gap-y-4">
					<span class="loader"></span>
					<p class="text-2xl font-bold text-pink-500 animate-pulse">Cargando tus regalos !!!</p>
				</div>
			{:else}
				<div>
					{#if gifts.length}
						<ul class="grid gap-4 list-inside">
							{#each gifts as gift (`${gift.name}-${gift.owner}`)}
								<GiftsListItem {gift} bind:gifts bind:currentGift bind:showForm />
							{/each}
						</ul>
					{:else}
						<p class="font-semibold text-center text-gray-500">
							No hay regalos Grinch! Agrega algo!
						</p>
					{/if}
				</div>
			{/if}

			{#if gifts.length}
				<GiftsListSummary {gifts} />
			{/if}
		</div>

		{#if gifts.length}
			<footer class="grid gap-2">
				<button class="w-full danger" on:click={handleDeleteAllGifts}>Borrar todo</button>
				<button class="w-full" on:click={previewList}>Previsualizar</button>
			</footer>
		{/if}
	</section>
{/if}
