import { UseDataContext } from "../context/SiteContext";
import Button from "../ui/Button";
import db from "../../utils/localstoragedb";
import { useRef, useState } from "react";
import Dialog from "../ui/Dialog";
import Card from "../ui/Card";

const FriendList = () => {
  const { friends, groupData, setFriends, handleSetModal } = UseDataContext();

  // Create reference to dom element
  const deleteDialogRef = useRef(null);
  const cantDeleteDialogRef = useRef(null);
  const [deleteID, setDeleteID] = useState(null);

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
        <Card
          key={friend.id}
          id={friend.id}
          type={"expense"}
          icon={"fa-user"}
          title={friend.name}
          subtitle={friend?.email}
          hasButtons={true}
        >
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
                cantDeleteDialogRef.current.showModal();
                return;
              }
              setDeleteID(friend.id);
              deleteDialogRef.current.showModal();
            }}
          >
            Delete
          </Button>
        </Card>
      ))}

      <Dialog
        dialogRef={deleteDialogRef}
        confirmOnClick={() => handleDeleteFriend(deleteID)}
      >
        <p>Are you sure you want to delete this friend?</p>
      </Dialog>

      <Dialog dialogRef={cantDeleteDialogRef}>
        Cannot delete a friend that is part of a group.
      </Dialog>
    </>
  );
};

export default FriendList;
