export default function GroupFriendList({ friends }) {
  return (
    //display the names of the friends
    <>
      <h3 className="text-decoration-line mt-2 text-base font-bold">
        In this group:
      </h3>
      {friends.map((friend) => (
        <p key={friend.id}>{friend.name}</p>
      ))}
    </>
  );
}
