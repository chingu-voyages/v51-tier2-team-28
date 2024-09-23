import { useState } from 'react';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
// import SearchBar from "../ui/SearchBar";
// import CreateGroup from "./CreateGroup";
import GroupList from "./GroupList";
import { UseDataContext } from "../context/SiteContext";

export default function Group() {
  const navigate = useNavigate();
  const { user, handleSetModal, modal } = UseDataContext();

  useEffect(() => {
    // if user is not "logged in", go to login
    if (!user) {
      navigate("/");
    }
  }, [user]);

  // const [inputText, setInputText] = useState("");
    
    // let inputHandler = (e) => {
    //     var lowerCase = e.target.value.toLowerCase();
    //     setInputText(lowerCase);
    // };

  return (
    // if modal is not showing then display the following
    !modal.show && (
      <>
        <h1 className="text-center">Groups</h1>
        {/* <SearchBar input={inputText} inputHandler={inputHandler}/> */}
        <div>
          {/* <GroupList input={inputText} /> */}
          <GroupList />
        </div>
        <Button
          className="over absolute bottom-6 left-1/2 z-10 h-14 w-[200px] -translate-x-1/2 rounded-md bg-primary"
          onClick={() => {
            handleSetModal("CreateGroup");
          }}
        >
          Create Group
        </Button>
      </>
    )
  );
}