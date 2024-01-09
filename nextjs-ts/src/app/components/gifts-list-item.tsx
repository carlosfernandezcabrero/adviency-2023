/* eslint-disable @typescript-eslint/no-empty-function */
import type { GiftInterface } from "../types";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { DocumentDuplicateIcon, PencilIcon } from "@heroicons/react/24/solid";

interface PropsInterface {
  gift: GiftInterface;
  anonymous?: boolean;
  setShowForm?: (value: boolean) => void;
  setCurrentGift?: (value: GiftInterface) => void;
  setGifts?: React.Dispatch<React.SetStateAction<GiftInterface[]>>;
}

export default function GiftsListItem({
  gift,
  anonymous = false,
  setCurrentGift = () => {},
  setShowForm = () => {},
  setGifts = () => {},
}: PropsInterface) {
  function handleDeleteGift() {
    setGifts((prevGifts: GiftInterface[]) => {
      const newGifts = prevGifts.filter(
        ({id: _id, owner: _owner}) => _id !== gift.id || _owner !== gift.owner,
      );

      localStorage.setItem("gifts", JSON.stringify(newGifts));

      return newGifts;
    });
  }

  return (
    <li className="flex items-center gap-x-12 rounded border border-gray-200 p-4 shadow-sm">
      <span className="flex flex-1 items-center gap-x-4">
        <img
          alt="imagen regalo"
          className="aspect-square size-14 rounded border border-pink-300 p-0.5"
          src={gift.imageUrl}
        />
        <div>
          <h3 className="font-medium">
            {gift.name} ({gift.quantity})
            {!anonymous && (
              <span>
                {" "}
                -{" "}
                {(gift.price * gift.quantity).toLocaleString("es-ES", {
                  style: "currency",
                  currency: "EUR",
                })}
              </span>
            )}
          </h3>
          <p className="text-lg">Propietario: {gift.owner || "No definido"}</p>
        </div>
      </span>
      {!anonymous && (
        <span className="flex items-center gap-x-2">
          <button
            aria-label="editar"
            className="secondary"
            type="button"
            onClick={() => {
              setCurrentGift({...gift});
              setShowForm(true);
            }}
          >
            <PencilIcon className="size-4 stroke-[4]" />
          </button>
          <button
            aria-label="duplicar"
            type="button"
            onClick={() => {
              setCurrentGift({
                ...gift,
                id: "",
                owner: "",
                quantity: 1,
              });
              setShowForm(true);
            }}
          >
            <DocumentDuplicateIcon className="size-4 stroke-[4]" />
          </button>
          <button aria-label="borrar" className="danger" type="button" onClick={handleDeleteGift}>
            <XMarkIcon className="size-4 stroke-[4]" />
          </button>
        </span>
      )}
    </li>
  );
}
