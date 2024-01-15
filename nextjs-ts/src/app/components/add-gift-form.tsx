import type { GiftInterface } from "../types";

import React, { useEffect, useState } from "react";

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
  const [fields, setFields] = useState({...currentGift});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setFields({...currentGift});
  }, [currentGift]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const {name, value} = event.target;

    setFields((prevGift) => ({
      ...prevGift,
      [name]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    const giftToSubmit: GiftInterface = {
      ...fields,
      quantity: Number(fields.quantity),
      price: Number(fields.price),
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
                value={fields.name}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => {
                  setFields((prevGift) => ({
                    ...prevGift,
                    name: giftsSuggestions[Math.floor(Math.random() * giftsSuggestions.length)],
                  }));
                }}
              >
                Sorprenderme
              </button>
            </div>
            {submitted && !textFieldRule.safeParse(fields.name).success ? (
              <p className="error-message">El campo es requerido</p>
            ) : null}
          </div>
          <div>
            <input
              className="block w-full"
              name="imageUrl"
              placeholder="Url imagen"
              type="text"
              value={fields.imageUrl}
              onChange={handleChange}
            />
            {submitted && !textFieldRule.safeParse(fields.imageUrl).success ? (
              <p className="error-message">El campo es requerido</p>
            ) : null}
          </div>
          <div>
            <input
              className="block w-full"
              name="owner"
              placeholder="Propietario"
              type="text"
              value={fields.owner}
              onChange={handleChange}
            />
            {submitted && !textFieldRule.safeParse(fields.owner).success ? (
              <p className="error-message">El campo es requerido</p>
            ) : null}
          </div>
          <div>
            <input
              className="block w-full"
              name="price"
              placeholder="Precio"
              type="number"
              value={fields.price}
              onChange={handleChange}
            />
            {submitted && !quantityFieldRule.safeParse(Number(fields.price)).success ? (
              <p className="error-message">El numero debe ser un numero positivo</p>
            ) : null}
          </div>
          <div>
            <input
              className="block w-full"
              name="quantity"
              placeholder="Cantidad"
              type="number"
              value={fields.quantity}
              onChange={handleChange}
            />
            {submitted && !quantityFieldRule.safeParse(Number(fields.quantity)).success ? (
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
            {fields.id ? "Editar" : "Agregar"}
          </button>
        ) : null}
      </footer>
    </form>
  );
}
