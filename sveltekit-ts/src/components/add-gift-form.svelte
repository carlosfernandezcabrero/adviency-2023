<script lang="ts">
	import { getGiftSchema } from '../schemas';
	import { upsertGifts } from '../services/gifts.service';
	import type { GiftInterface } from '../types';

	export let initialGift: GiftInterface;
	export let gifts: GiftInterface[];
	export let currentGift: GiftInterface;
	export let showForm: boolean;

	let submitted = false;
	let fields = { ...initialGift };

	const giftsSuggestions = ['Pantalla', 'Celular', 'Laptop', 'Audifonos'];
	const { giftSchema, textFieldRule, quantityFieldRule } = getGiftSchema();

	$: setFields(currentGift);

	function setFields(currentGift: GiftInterface) {
		fields = { ...currentGift };
	}

	function handleSubmit() {
		submitted = true;

		if (giftSchema.safeParse(fields).success) {
			const newGifts = upsertGifts(fields, gifts);

			localStorage.setItem('gifts', JSON.stringify(newGifts));
			gifts = newGifts;
			fields = { ...initialGift };
			submitted = false;
		}
	}
</script>

<form class="grid gap-4" on:submit|preventDefault={handleSubmit}>
	{#if showForm}
		<div class="grid gap-2">
			<div>
				<div class="flex items-center gap-x-2">
					<input
						type="text"
						placeholder="Agrega un regalo"
						bind:value={fields.name}
						class="flex-1 block w-full"
						name="name"
					/>
					<button
						on:click={() =>
							(fields.name = giftsSuggestions[Math.floor(Math.random() * giftsSuggestions.length)])}
						type="button"
					>
						Sorprenderme
					</button>
				</div>
				{#if submitted && !textFieldRule.safeParse(fields.name).success}
					<p class="error-message">El campo es requerido</p>
				{/if}
			</div>
			<div>
				<input
					type="text"
					placeholder="Url imagen"
					bind:value={fields.imageUrl}
					class="block w-full"
					name="imageUrl"
				/>
				{#if submitted && !textFieldRule.safeParse(fields.imageUrl).success}
					<p class="error-message">El campo es requerido</p>
				{/if}
			</div>
			<div>
				<input
					type="text"
					placeholder="Propietario"
					bind:value={fields.owner}
					class="block w-full"
					name="owner"
				/>
				{#if submitted && !textFieldRule.safeParse(fields.owner).success}
					<p class="error-message">El campo es requerido</p>
				{/if}
			</div>
			<div>
				<input
					type="number"
					placeholder="Precio"
					bind:value={fields.price}
					class="block w-full"
					name="price"
				/>
				{#if submitted && !quantityFieldRule.safeParse(fields.price).success}
					<p class="error-message">El numero debe ser un numero positivo</p>
				{/if}
			</div>
			<div>
				<input
					type="number"
					placeholder="Cantidad"
					bind:value={fields.quantity}
					class="block w-full"
					name="quantity"
				/>
				{#if submitted && !quantityFieldRule.safeParse(fields.quantity).success}
					<p class="error-message">El numero debe ser un entero positivo</p>
				{/if}
			</div>
		</div>
	{/if}
	<footer class={`flex ${showForm ? 'justify-between' : 'justify-center'}`}>
		<button
			type="button"
			class="primary"
			on:click={() => {
				if (!showForm) {
					fields = { ...initialGift };
				}
				showForm = !showForm;
			}}
		>
			{showForm ? 'Cerrar' : 'Agregar regalo'}
		</button>
		{#if showForm}
			<button type="submit" class="primary">
				{fields.id ? 'Editar' : 'Agregar'}
			</button>
		{/if}
	</footer>
</form>
