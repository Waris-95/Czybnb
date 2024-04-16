import { useModal } from "../../context/Modal";

function OpenModalMenuItem({
  modalComponent,
  itemText,
  onItemClick,
  onModalClose,
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (onItemClick) onItemClick();
  };

  return (
    <li
      onClick={onClick}
      className="open-modal-menu-item profile-elements"
      style={styles.menuItem}
    >
      {itemText}
    </li>
  );
}

export default OpenModalMenuItem;

const styles = {
  menuItem: {
    fontFamily: "Avenir, sans-serif",
    fontWeight: 600,
    cursor: "pointer",
    transition: "transform 0.3s ease-in-out",
    padding: "10px 20px",
    borderRadius: "8px",
    background: "linear-gradient(45deg, #ff8a00, #e52e71)",
    color: "#fff",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
};
