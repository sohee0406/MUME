import { TailSpin } from "react-loader-spinner";

export default function Loading() {
  return (
    <div
      className="
        min-h-screen
        bg-black
        flex
        justify-center
        items-center
      "
    >
      <TailSpin
        visible={true}
        height="80"
        width="80"
        color="blue"
        ariaLabel="tail-spin-loading"
        radius="1"
      />
    </div>
  );
}
