import { useEffect, useRef } from "react";
import { UseDataContext } from "../context/SiteContext";
import Button from "../ui/Button";
import Dialog from "../ui/Dialog";

const GetStarted = () => {
  const { friends, groupData, handleSetModal } = UseDataContext();

  console.log(groupData);

  useEffect(() => {
    if (friends.length < 2) {
      toggleDialog(addFriendDialogRef);
    } else if (groupData.length === 0) {
      toggleDialog(addGroupDialogRef);
    }
  });

  const toggleDialog = (ref) => {
    if (!ref.current) {
      return;
    }
    ref.current.hasAttribute("open")
      ? ref.current.close()
      : ref.current.showModal();
  };

  // Create reference to dom elements
  const addFriendDialogRef = useRef(null);
  const addGroupDialogRef = useRef(null);
  return (
    <>
      <Dialog isCustom={true} dialogRef={addFriendDialogRef}>
        <div className="flex flex-col items-center justify-center">
          <p className="mb-6 text-center">
            Get started by adding a friend to split expenses with.
          </p>
          <Button
            className="w-full sm:w-48"
            onClick={() => handleSetModal("FriendForm")}
          >
            Add Friend
          </Button>
        </div>
      </Dialog>
      <Dialog isCustom={true} dialogRef={addGroupDialogRef}>
        <div className="flex flex-col items-center justify-center">
          <p className="mb-6 text-center">
            Create a group to add expenses with friends.
          </p>
          <Button
            className="w-full sm:w-48"
            onClick={() => handleSetModal("CreateGroup")}
          >
            Add a Group
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default GetStarted;
