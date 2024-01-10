<script lang="ts">
	import { getGiftSchema } from '../schemas';
	import type { GiftInterface } from '../types';

	export let initialGift: GiftInterface;
	export let gifts: GiftInterface[];
	export let currentGift: GiftInterface;
	export let showForm: boolean;

	let submitted = false;

	const giftsSuggestions = ['Pantalla', 'Celular', 'Laptop', 'Audifonos'];
	const { giftSchema, textFieldRule, quantityFieldRule } = getGiftSchema();

	function handleSubmit() {
		submitted = true;

		if (giftSchema.safeParse(currentGift).success) {
			if (currentGift.id) {
				const giftIndex = gifts.findIndex(({ id: _id }) => _id === currentGift.id);
				gifts[giftIndex] = { ...currentGift };
			} else {
				gifts.push({ ...currentGift, id: currentGift.name });
			}

			localStorage.setItem('gifts', JSON.stringify(gifts));

			currentGift = { ...initialGift };
			submitted = false;
		}
	}
</script>

<form class="grid gap-4" on:submit|preventDefault={handleSubmit}>
	{#if showForm}
		<div class="grid gap-2">
			<div class="flex items-center gap-x-2">
				<div class="flex-1">
					<input
						type="text"
						placeholder="Agrega un regalo"
						bind:value={currentGift.name}
						class="block w-full"
						name="name"
					/>
					{#if submitted && !textFieldRule.safeParse(currentGift.name).success}
						<p class="error-message">El campo es requerido</p>
					{/if}
				</div>
				<button
					on:click={() =>
						(currentGift.name =
							giftsSuggestions[Math.floor(Math.random() * giftsSuggestions.length)])}
					type="button"
				>
					Sorprenderme
				</button>
			</div>
			<div>
				<input
					type="text"
					placeholder="Url imagen"
					bind:value={currentGift.imageUrl}
					class="block w-full"
					name="imageUrl"
				/>
				{#if submitted && !textFieldRule.safeParse(currentGift.imageUrl).success}
					<p class="error-message">El campo es requerido</p>
				{/if}
			</div>
			<div>
				<input
					type="text"
					placeholder="Propietario"
					bind:value={currentGift.owner}
					class="block w-full"
					name="owner"
				/>
				{#if submitted && !textFieldRule.safeParse(currentGift.owner).success}
					<p class="error-message">El campo es requerido</p>
				{/if}
			</div>
			<div>
				<input
					type="number"
					placeholder="Precio"
					bind:value={currentGift.price}
					class="block w-full"
					name="price"
				/>
				{#if submitted && !quantityFieldRule.safeParse(currentGift.price).success}
					<p class="error-message">El numero debe ser un numero positivo</p>
				{/if}
			</div>
			<div>
				<input
					type="number"
					placeholder="Cantidad"
					bind:value={currentGift.quantity}
					class="block w-full"
					name="quantity"
				/>
				{#if submitted && !quantityFieldRule.safeParse(currentGift.quantity).success}
					<p class="error-message">El numero debe ser un entero positivo</p>
				{/if}
			</div>
		</div>
	{/if}
	<footer class={`flex ${showForm ? 'justify-between' : 'justify-center'}`}>
		<button type="button" class="primary" on:click={() => (showForm = !showForm)}>
			{showForm ? 'Cerrar' : 'Agregar regalo'}
		</button>
		{#if showForm}
			<button type="submit" class="primary">
				{currentGift.id ? 'Editar' : 'Agregar'}
			</button>
		{/if}
	</footer>
</form>
