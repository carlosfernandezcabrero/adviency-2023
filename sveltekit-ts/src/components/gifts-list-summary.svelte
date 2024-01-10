<script lang="ts">
	import type { GiftInterface } from '../types';

	export let gifts: GiftInterface[];
</script>

<footer class="pt-2 border-t border-gray-500">
	<p class="font-medium text-center">
		Total:
		{gifts
			.reduce((acc, curr) => {
				return acc + curr.price * curr.quantity;
			}, 0)
			.toLocaleString('es-ES', {
				style: 'currency',
				currency: 'EUR'
			})}
	</p>
</footer>
