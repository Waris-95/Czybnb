import { useModal } from "../../context/Modal";

function OpenModalButton({
  modalComponent, // component to render inside the modal
  buttonText, // text of the button that opens the modal
  onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
  onModalClose, // optional: callback function that will be called once the modal is close
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (typeof onButtonClick === "function") onButtonClick();
    if (typeof onModalClose === "function") setOnModalClose(onModalClose);
    setModalContent(modalComponent);
  };

  return (
    <button
      style={{
        width: "fit-content",
        boxShadow: "2px 2px 2px black",
        backgroundColor: "gray",
        cursor: "pointer",
        color: "white"
      }}
      onClick={onClick}
    >
      {buttonText}
    </button>
  );
}

export default OpenModalButton;