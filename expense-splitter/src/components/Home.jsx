import { UseDataContext } from "./context/SiteContext";
import ExpenseList from "./expense/ExpenseList";
import GroupList from "./group/GroupList";
import FriendList from "./friend/FriendList";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const { user, modal } = UseDataContext();
  console.log(user);

  useEffect(() => {
    // if user is not "logged in", go to login
    if (!user) {
      navigate("/");
    }
  }, [user]);

  return (
    // if modal is not showing then display the following
    !modal.show && (
      <div>
        <h1 className="text-center">Welcome, {user}!</h1>
        <div className="mb-4">
          <h2 className="mb-2 text-2xl font-normal">Groups</h2>
          <GroupList />
        </div>
        <div className="mb-4">
          <h2 className="mb-2 text-2xl font-normal">Expenses</h2>
          <ExpenseList />
        </div>
        <div className="mb-4">
          <h2 className="mb-2 text-2xl font-normal">Friends</h2>
          <FriendList />
        </div>
      </div>
    )
  );
}
