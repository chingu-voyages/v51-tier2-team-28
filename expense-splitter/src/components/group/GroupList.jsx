import { useState } from "react";
import Button from "../ui/Button";
import { UseDataContext } from "../context/SiteContext";
import GroupFriendList from "./groupListComponent/GroupFriendList";
import GroupExpenseList from "./groupListComponent/GroupExpenseList";
import db from "../../utils/localstoragedb";

// export default function GroupList(props) {
export default function GroupList() {
  const [displayDetails, setDisplayDetails] = useState("");
  const { groupData, setGroupData, friends, expenses, handleSetModal } =
    UseDataContext();

  // const filteredData = groupData.filter((search) => {
  //   if (props.input === '') {
  //     return search;
  //   } else {
  //     return search.name.toLowerCase().includes(props.input)
  //   }
  // });

  const handleDisplayDetails = (id) => {
    if (displayDetails === id) {
      setDisplayDetails("");
    } else {
      setDisplayDetails(id);
    }
  };

  //delete a group
  const handleDelete = (id) => {
    db.deleteRows("groups", { ID: id });
    db.commit();
    //call setState to render the component
    setGroupData(db.queryAll("groups"));
  };

  //retrieve Friends/Expense List
  //input : object in search, object in search ID, type
  //output: display a list depending type
  const retrieveList = (objectData, groupObjectIdArray, type) => {
    //filter thru the friends object to return related friends in the group
    const retrieveCurrentGroupObjectKeyIds = objectData.filter((object) =>
      groupObjectIdArray.includes(object.id),
    );
    if (type === "friends") {
      return <GroupFriendList friends={retrieveCurrentGroupObjectKeyIds} />;
    } else {
      return (
        <GroupExpenseList expenseList={retrieveCurrentGroupObjectKeyIds} />
      );
    }
  };

  //calculate the expense amount
  //input: Expense Object, Group Expense Array, Group Budget
  //output : Array with Expenses amount and flag to determine over/under
  const expenseAmount = (
    expenseObject,
    groupExpenseArray,
    currentGroupBudget,
  ) => {
    if (!groupExpenseArray) {
      return [currentGroupBudget, "", true];
    }
    //filter to get the current group expenses
    const retrieveGroupExpenses = expenseObject.filter((object) =>
      groupExpenseArray.includes(object.id),
    );
    //if group has no expenses then it a new group
    const newGroup = retrieveGroupExpenses ? false : true;
    //calculate the expense Amount
    const expenseAmount = retrieveGroupExpenses.reduce(
      (acc, currentValue) => acc - Number(currentValue.amount),
      Number(currentGroupBudget),
    );
    //determine over / under
    const overBudget = expenseAmount < 0 ? true : false; //"text-red-600" : "text-green-600";
    //return an array
    return [Math.abs(expenseAmount.toFixed(2)), overBudget, newGroup];
  };

  // const groupList = filteredData.map((group) => (
  const groupList = groupData.map((group) => {
    //expense calculator
    const [expenseTotal, overBudget, newGroup] = expenseAmount(
      expenses,
      group.expenseIDs,
      group.budget,
    );
    return (
      <div
        onClick={() => {
          handleDisplayDetails(group.ID);
        }}
        key={group.ID}
        className="mb-1 flex cursor-pointer flex-col rounded-lg bg-slate-100 px-4 py-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="">{group.name}</h2>
            {!newGroup && (
              <span
                className={`${overBudget ? `text-red-600` : `text-green-600`} text-sm`}
              >
                {overBudget ? `Over: ` : `Under: `}
                {expenseTotal}
              </span>
            )}
          </div>
          <i
            className={`fa-solid ${displayDetails === group.ID ? `fa-chevron-down` : `fa-chevron-up`} text-3xl text-accent`}
          ></i>
        </div>
        <div>
          {displayDetails === group.ID && (
            <>
              <div className="mb-4 mt-2 font-roboto text-sm font-light">
                <p>{group.description}</p>
                <p>Budget:{group.budget}</p>
                {/* call a function to display friends list */}
                {group.friendIDs &&
                  retrieveList(friends, group.friendIDs, "friends")}
                {/* check for group expenses, if exists call a function to display expense list */}
                {group.expenseIDs &&
                  retrieveList(expenses, group.expenseIDs, "expenses")}
              </div>
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Button
                    variant={"small"}
                    // onClick={() => handleEditGroup(group)}
                    onClick={() => handleSetModal("EditGroup", group.ID)}
                    className={"bg-accent"}
                  >
                    Edit
                  </Button>
                  <Button
                    variant={"small"}
                    onClick={() => handleDelete(group.ID)}
                    className={"bg-accent"}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  });
  return (
    <div>
      <div className="mb-4 flex flex-col-reverse">{groupList}</div>
    </div>
  );
}
