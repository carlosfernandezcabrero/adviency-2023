export default function Spinner() {
  return (
    <div className="mx-auto flex flex-col items-center gap-y-4">
      <span className="loader" />
      <p className="animate-pulse text-2xl font-bold text-pink-500">Cargando tus regalos !!!</p>
    </div>
  );
}
