import type { GiftInterface } from "../types";

export default function GiftsListSummary({gifts}: {gifts: GiftInterface[]}) {
  return (
    <footer className="border-t border-gray-500 pt-2">
      <p className="text-center font-medium">
        Total:{" "}
        {gifts
          .reduce((acc, curr) => {
            return acc + curr.price * curr.quantity;
          }, 0)
          .toLocaleString("es-ES", {
            style: "currency",
            currency: "EUR",
          })}
      </p>
    </footer>
  );
}
