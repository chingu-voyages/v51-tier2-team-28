import { useState } from "react";
import { Controller } from "react-hook-form";
import useOutsideClick from "../../hooks/useOutsideClick";

export default function MultiSelectDropdown({
  friends,
  control,
  editFriends,
  errors,
}) {
  const [isOpen, setIsOpen] = useState(false);
  //this is to store friends list to display after added to group
  const [displayFriendName, setDisplayFriendName] = useState(() =>
    editFriends ? editFriends : null,
  );

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = () => {
    setIsOpen(false);
  };

  const ref = useOutsideClick(handleClickOutside);

  //handle adding selected friend to the list to be displayed
  const handleDisplaySelectedFriends = (arr) => {
    setDisplayFriendName([...arr]);
  };

  return (
    <div ref={ref}>
      <div
        className={`flex cursor-pointer items-center justify-between rounded-lg bg-accent/10 px-4 py-3 font-roboto font-light ${errors ? "border-red-500 outline-red-500" : "border-transparent"}`}
        onClick={toggleDropdown}
      >
        <div className="text-accent">Select Friends</div>
        <i className="fa-solid fa-chevron-down text-3xl text-accent"></i>
      </div>
      {isOpen && (
        <div className="z-10 mt-1 max-h-60 w-full cursor-pointer rounded-md border bg-white">
          {friends.map((friend) => (
            <label key={friend.id} className="flex items-center p-2">
              <Controller
                name="friendIDs"
                control={control}
                render={({ field }) => (
                  <input
                    id="friends"
                    type="checkbox"
                    value={friend.id}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      const valueArray = field.value || [];
                      const newValue = isChecked
                        ? [...valueArray, friend.id]
                        : valueArray.filter((id) => id !== friend.id);
                      field.onChange(newValue);
                      //update the checked friends list
                      handleDisplaySelectedFriends(newValue);
                    }}
                    checked={field.value?.includes(friend.id) || false}
                  />
                )}
              />
              <span className="ml-2">{friend.name}</span>
            </label>
          ))}
        </div>
      )}
      {displayFriendName && (
        <p className="text-sm font-bold">
          Friends:
          {friends.map(
            (friend, i) =>
              displayFriendName.includes(friend.id) && (
                <span key={friend.id} className="pl-[2px]">
                  {friend.name} {displayFriendName.length > i + 1 && `,`}
                </span>
              ),
          )}
        </p>
      )}
    </div>
  );
}
