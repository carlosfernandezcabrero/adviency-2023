import type { GiftInterface } from "../types";

import React, { useState } from "react";

import { getGiftSchema } from "../schemas";

interface PropsInterface {
  currentGift: GiftInterface;
  showForm: boolean;
  initialGift: GiftInterface;
  setCurrentGift: React.Dispatch<React.SetStateAction<GiftInterface>>;
  setGifts: React.Dispatch<React.SetStateAction<GiftInterface[]>>;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const {giftSchema, textFieldRule, quantityFieldRule} = getGiftSchema();
const giftsSuggestions = ["Pantalla", "Celular", "Laptop", "Audifonos"];

export default function AddGiftForm({
  currentGift,
  showForm,
  initialGift,
  setCurrentGift,
  setGifts,
  setShowForm,
}: PropsInterface) {
  const [submitted, setSubmitted] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const {name, value} = event.target;

    setCurrentGift((prevGift) => ({
      ...prevGift,
      [name]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    const giftToSubmit: GiftInterface = {
      ...currentGift,
      quantity: Number(currentGift.quantity),
      price: Number(currentGift.price),
    };

    if (giftSchema.safeParse(giftToSubmit).success) {
      if (giftToSubmit.id) {
        setGifts((prevGifts: GiftInterface[]) => {
          const giftIndex = prevGifts.findIndex(({id: _id}) => _id === giftToSubmit.id);

          prevGifts[giftIndex] = giftToSubmit;
          localStorage.setItem("gifts", JSON.stringify(prevGifts));

          return [...prevGifts];
        });
      } else {
        setGifts((prevGifts: GiftInterface[]) => {
          const newGifts = [...prevGifts, {...giftToSubmit, id: giftToSubmit.name}];

          localStorage.setItem("gifts", JSON.stringify(newGifts));

          return newGifts;
        });
      }

      setCurrentGift({...initialGift});
      setSubmitted(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={(event) => handleSubmit(event)}>
      {showForm ? (
        <div className="grid gap-2">
          <div>
            <div className="flex items-center gap-x-2">
              <input
                className="block w-full flex-1"
                name="name"
                placeholder="Agrega un regalo"
                type="text"
                value={currentGift.name}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => {
                  setCurrentGift((prevGift) => ({
                    ...prevGift,
                    name: giftsSuggestions[Math.floor(Math.random() * giftsSuggestions.length)],
                  }));
                }}
              >
                Sorprenderme
              </button>
            </div>
            {submitted && !textFieldRule.safeParse(currentGift.name).success ? (
              <p className="error-message">El campo es requerido</p>
            ) : null}
          </div>
          <div>
            <input
              className="block w-full"
              name="imageUrl"
              placeholder="Url imagen"
              type="text"
              value={currentGift.imageUrl}
              onChange={handleChange}
            />
            {submitted && !textFieldRule.safeParse(currentGift.imageUrl).success ? (
              <p className="error-message">El campo es requerido</p>
            ) : null}
          </div>
          <div>
            <input
              className="block w-full"
              name="owner"
              placeholder="Propietario"
              type="text"
              value={currentGift.owner}
              onChange={handleChange}
            />
            {submitted && !textFieldRule.safeParse(currentGift.owner).success ? (
              <p className="error-message">El campo es requerido</p>
            ) : null}
          </div>
          <div>
            <input
              className="block w-full"
              name="price"
              placeholder="Precio"
              type="number"
              value={currentGift.price}
              onChange={handleChange}
            />
            {submitted && !quantityFieldRule.safeParse(Number(currentGift.price)).success ? (
              <p className="error-message">El numero debe ser un numero positivo</p>
            ) : null}
          </div>
          <div>
            <input
              className="block w-full"
              name="quantity"
              placeholder="Cantidad"
              type="number"
              value={currentGift.quantity}
              onChange={handleChange}
            />
            {submitted && !quantityFieldRule.safeParse(Number(currentGift.quantity)).success ? (
              <p className="error-message">El numero debe ser un entero positivo</p>
            ) : null}
          </div>
        </div>
      ) : null}
      <footer className={`flex ${showForm ? "justify-between" : "justify-center"}`}>
        <button
          className="primary"
          type="button"
          onClick={() => {
            setShowForm((prev) => !prev);
          }}
        >
          {showForm ? "Cerrar" : "Agregar regalo"}
        </button>
        {showForm ? (
          <button className="primary" type="submit">
            {currentGift.id ? "Editar" : "Agregar"}
          </button>
        ) : null}
      </footer>
    </form>
  );
}
