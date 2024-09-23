import Button from "./Button";
import PropTypes from "prop-types";

const Dialog = ({ dialogRef, cancelOnClick, confirmOnClick, children }) => {
  return (
    <dialog
      ref={dialogRef}
      className="rounded-md px-6 py-10 backdrop:bg-black backdrop:opacity-60"
    >
      <div className="mb-6">{children}</div>
      <div className="flex gap-2">
        <Button onClick={cancelOnClick} className={"grow"}>
          Cancel
        </Button>

        {confirmOnClick && ( //Render 2nd button if 2nd onClick is provided
          <Button
            className={"grow bg-primary"}
            onClick={() => {
              confirmOnClick();
              cancelOnClick();
            }}
          >
            Confirm
          </Button>
        )}
      </div>
    </dialog>
  );
};

// Props validation
Dialog.propTypes = {
  dialogRef: PropTypes.object.isRequired,
  cancelOnClick: PropTypes.func,
  confirmOnClick: PropTypes.func,
  children: PropTypes.node,
};

export default Dialog;
