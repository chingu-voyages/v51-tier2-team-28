import { UseDataContext } from "../context/SiteContext";
import Button from "../ui/Button";
import db from "../../utils/localstoragedb";
import { useRef, useState } from "react";
import Dialog from "../ui/Dialog";

const FriendList = () => {
  const { friends, groupData, setFriends, handleSetModal } = UseDataContext();

  // Create reference to dom element
  const deleteDialogRef = useRef(null);
  const cantDeleteDialogRef = useRef(null);
  const [deleteID, setDeleteID] = useState(null);

  // Closes or opens the dialog
  const toggleDialog = (ref) => {
    if (!ref.current) {
      return;
    }
    ref.current.hasAttribute("open")
      ? ref.current.close()
      : ref.current.showModal();
  };

  // Checks group data for user id
  const existsInGroup = (array, nestedArray, element) => {
    return array.some((obj) => obj[nestedArray].includes(element));
  };

  // Delete friend if matches id
  const handleDeleteFriend = (id) => {
    setFriends(friends.filter((friend) => friend.id !== id));
    // Delete friend from local storage
    db.deleteRows("friends", { id });
    db.commit();
  };

  return (
    <>
      {friends.map((friend) => (
        <div
          key={friend.id}
          className="mb-1 flex items-center rounded-lg bg-slate-100 px-4 py-4"
        >
          <i className="fa-solid fa-user mr-4 text-2xl"></i>
          <div className="flex max-w-36 flex-col">
            <div className="break-words">{friend.name}</div>
            <div className="text-sm font-light text-gray-500">
              <a href={`mailto: ${friend.email}`} className="break-words">
                {friend.email}
              </a>
            </div>
          </div>

          <div className="ml-auto flex gap-2">
            <Button
              variant={"small"}
              className="font-normal"
              onClick={() => {
                handleSetModal("FriendForm", friend.id);
              }}
            >
              Edit
            </Button>
            <Button
              variant={"small"}
              className="font-normal"
              // Put friend id in state and opens dialog
              onClick={() => {
                // Check if user if part of a group or expense
                if (existsInGroup(groupData, "friendIDs", friend.id)) {
                  console.log("User exists in a group");
                  toggleDialog(cantDeleteDialogRef);
                  return;
                }
                setDeleteID(friend.id);
                toggleDialog(deleteDialogRef);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}

      <Dialog
        dialogRef={deleteDialogRef}
        cancelOnClick={() => toggleDialog(deleteDialogRef)}
        confirmOnClick={() => handleDeleteFriend(deleteID)}
      >
        <p>Are you sure you want to delete this friend?</p>
      </Dialog>

      <Dialog
        dialogRef={cantDeleteDialogRef}
        cancelOnClick={() => toggleDialog(cantDeleteDialogRef)}
      >
        Cannot delete a friend that is part of a group.
      </Dialog>
    </>
  );
};

export default FriendList;
