"use client";

import type { GiftInterface } from "../types";

import { useEffect, useState } from "react";

import api from "../api";

import AddGiftForm from "./add-gift-form";
import GiftsListItem from "./gifts-list-item";
import GiftsListSummary from "./gifts-list-summary";
import Spinner from "./spinner";

const INITIAL_GIFT: GiftInterface = {
  id: "",
  name: "",
  quantity: 1,
  imageUrl: "",
  owner: "",
  price: 0,
};

export default function App() {
  const [gifts, setGifts] = useState<GiftInterface[]>([]);
  const [currentGift, setCurrentGift] = useState<GiftInterface>({...INITIAL_GIFT});
  const [showForm, setShowForm] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    setLoadingData(true);

    api.gifts.list().then((gifts) => {
      setGifts(gifts);
      setLoadingData(false);
    });
  }, []);

  function handleDeleteAllGifts() {
    setGifts([]);
    localStorage.removeItem("gifts");
  }

  function previewList() {
    window.scrollTo(0, 0);
    setShowList(true);
  }

  function printList() {
    window.print();
  }

  return (
    <>
      {showList ? (
        <dialog className="absolute top-0 grid h-full w-full place-content-center bg-transparent text-neutral-900 shadow-xl">
          <div className="flex flex-1 flex-col gap-10 rounded bg-white p-8">
            <div className="grid gap-10 rounded bg-white" id="printable">
              <h2 className="title text-center text-5xl">Comprar:</h2>
              <ul className="grid list-inside gap-4" id="print-list">
                {gifts.map((gift: GiftInterface) => (
                  <GiftsListItem key={`${gift.name}-${gift.owner}`} anonymous gift={gift} />
                ))}
              </ul>
            </div>
            <footer className="flex items-center justify-between">
              <button type="button" onClick={() => setShowList(false)}>
                Cerrar
              </button>
              <button className="primary" type="button" onClick={printList}>
                Imprimir
              </button>
            </footer>
          </div>
        </dialog>
      ) : (
        <section className="z-0 flex min-w-[500px] flex-col gap-16 rounded bg-white p-8 text-neutral-900 shadow-xl">
          <h1 className="title text-center text-5xl font-bold">Regalos:</h1>

          <div className="grid gap-12">
            <AddGiftForm
              currentGift={currentGift}
              initialGift={INITIAL_GIFT}
              setGifts={setGifts}
              setShowForm={setShowForm}
              showForm={showForm}
            />

            {loadingData ? (
              <Spinner />
            ) : (
              <div>
                {gifts.length ? (
                  <ul className="grid list-inside gap-4">
                    {gifts.map((gift) => (
                      <GiftsListItem
                        key={`${gift.name}-${gift.owner}`}
                        gift={gift}
                        setCurrentGift={setCurrentGift}
                        setGifts={setGifts}
                        setShowForm={setShowForm}
                      />
                    ))}
                  </ul>
                ) : (
                  <p className="text-center font-semibold text-gray-500">
                    No hay regalos Grinch! Agrega algo!
                  </p>
                )}
              </div>
            )}

            {gifts.length ? <GiftsListSummary gifts={gifts} /> : null}
          </div>

          {gifts.length ? (
            <footer className="grid gap-2">
              <button className="danger w-full" type="button" onClick={handleDeleteAllGifts}>
                Borrar todo
              </button>
              <button className="w-full" type="button" onClick={previewList}>
                Previsualizar
              </button>
            </footer>
          ) : null}
        </section>
      )}
    </>
  );
}
