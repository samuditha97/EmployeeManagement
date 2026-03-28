function ConfirmButton({ text, message, onConfirm, className = "" }) {
  const handleClick = () => {
    if (window.confirm(message)) {
      onConfirm();
    }
  };

  return (
    <button onClick={handleClick} className={className}>
      {text}
    </button>
  );
}

export default ConfirmButton;