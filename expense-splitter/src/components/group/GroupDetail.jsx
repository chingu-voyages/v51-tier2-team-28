import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { UseDataContext } from "../context/SiteContext";
import db from "../../utils/localstoragedb";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Dialog from "../ui/Dialog";
import PieChart from "../widgets/PieChart";
import NoDataPlaceholder from "../ui/NoDataPlaceholder";
import ButtonFooter from "../ui/ButtonFooter";

function GroupDetail() {
  const [deleteID, setDeleteID] = useState(null);
  const [seeMore, setSeeMore] = useState(false);
  const [progressBarStyle, setProgressBarStyle] = useState({
    width: 0,
    color: "#05299e",
  });
  const { groupData, setGroupData, friends, expenses, handleSetModal, modal } =
    UseDataContext();

  // Create reference to dom elements
  const deleteDialogRef = useRef(null);

  const { groupId } = useParams();
  const navigate = useNavigate();

  const singleGroup = groupData.find((group) => group.id === groupId);

  // get all the group expenses
  const groupExpenses = expenses.filter((expense) =>
    singleGroup?.expenseIDs?.includes(expense.id),
  );

  // get the total group expense amount
  const totalExpenseAmount = groupExpenses
    .map((expense) => parseFloat(expense.amount))
    .reduce((acc, curr) => acc + curr, 0)
    .toFixed(2);

  // figure out the width of the expense percentage bar
  // max it out at 100 to avoid growing outside the div
  const expensePercentage =
    ((totalExpenseAmount / singleGroup?.budget) * 100).toFixed() >= 100
      ? 100
      : ((totalExpenseAmount / singleGroup?.budget) * 100).toFixed();

  // set the percentage and color to state and disply as style
  // tailwind is bad at rendering dynamically
  useEffect(() => {
    let barColor;
    switch (true) {
      case expensePercentage <= 25:
        barColor = "#1d9e05"; //green
        break;
      case expensePercentage > 25 && expensePercentage <= 50:
        barColor = "#e6d900"; //yellow
        break;
      case expensePercentage > 50 && expensePercentage <= 75:
        barColor = "#de8200"; //orange
        break;
      default:
        barColor = "#d20000"; //red
    }
    setProgressBarStyle((prev) => ({
      ...prev,
      width: expensePercentage,
      color: barColor,
    }));
  }, [expensePercentage]);

  // 404 if no ID found
  if (!singleGroup) {
    return <Navigate to={"/404"} />;
  }

  // pie data
  const pieData = () => {
    const results = {};
    groupExpenses.forEach((expense) => {
      const cat = expense.category;
      const amt = parseFloat(expense.amount);
      if (results[cat]) {
        results[cat] += amt;
      } else {
        results[cat] = amt;
      }
    });
    return results;
  };

  // Closes or opens the dialog
  const toggleDialog = (ref) => {
    if (!ref.current) {
      return;
    }
    ref.current.hasAttribute("open")
      ? ref.current.close()
      : ref.current.showModal();
  };

  //delete a group
  const handleDelete = (id) => {
    db.deleteRows("groups", { ID: id });
    db.commit();
    //call setState to render the component
    setGroupData(db.queryAll("groups"));
    // after deleting, navigate to groups
    navigate("/groups");
  };

  const friendsList = friends
    .filter(
      (friend) =>
        singleGroup.friendIDs.includes(friend.id) && friend.name !== "Me",
    )
    .map((friend) => friend.name.split(" ")[0]);

  const friendsDisplay =
    friendsList.length > 3 ? (
      seeMore ? (
        <>
          {friendsList.join(", ")}{" "}
          <span
            onClick={() => setSeeMore(false)}
            className="cursor-pointer font-semibold hover:underline"
          >
            see less
          </span>
        </>
      ) : (
        <>
          {friendsList.slice(0, 3).join(", ")}
          ...{" "}
          <span
            onClick={() => setSeeMore(true)}
            className="cursor-pointer font-semibold hover:underline"
          >
            see more
          </span>
        </>
      )
    ) : (
      friendsList.join(", ")
    );

  const expenseDisplay = groupExpenses
    .sort((a, b) => b.ID - a.ID) // show latest expense up top
    .map((expense, i) => {
      return (
        <Card
          key={expense.id}
          id={expense.id}
          type={"expense"}
          icon={"fa-money-check-dollar"}
          title={expense.name}
          price={expense.amount}
        />
      );
    });

  return (
    !modal.show && (
      <>
        <div className="mb-4 flex items-center">
          <i
            onClick={() => navigate("/groups")}
            className="fa-solid fa-chevron-left cursor-pointer text-3xl text-accent"
          ></i>
          <h1 className="mx-auto mb-0">{singleGroup.name}</h1>
          <i className="fa-solid fa-chevron-right text-3xl text-accent opacity-0"></i>
        </div>
        <p className="mb-2">{singleGroup.description}</p>
        <p className="mb-4">
          <span className="font-bold">Group Members: </span>
          {friendsDisplay}
        </p>
        {groupExpenses.length < 1 ? (
          <p className="text-center font-normal">
            <span className="font-bold">Budget this month:</span> $
            {singleGroup.budget}
          </p>
        ) : (
          <>
            <div className="relative mb-2 flex">
              <div
                className={`absolute h-8 rounded-lg transition-all duration-500 ease-out`}
                style={{
                  width: `${progressBarStyle.width}%`,
                  background: `${progressBarStyle.color}`,
                }}
              ></div>
              <div className="h-8 w-full rounded-lg bg-accent"></div>
            </div>
            <p className="text-center font-normal">
              <span className="font-bold">Budget remaining this month:</span> $
              {totalExpenseAmount} / ${singleGroup.budget}
            </p>
            <PieChart label={"Categories"} pieData={pieData()} />
          </>
        )}

        <div className="mt-8">
          {groupExpenses.length > 0 ? (
            <>{expenseDisplay}</>
          ) : (
            <NoDataPlaceholder
              title="There are no expenses to display"
              subtitle="Get started by creating an expense."
              btnText="Create a Expense"
              onClick={() => handleSetModal("CreateExpense")}
            />
          )}
        </div>

        <ButtonFooter>
          <Button
            className="bg-red-700"
            onClick={() => {
              setDeleteID(singleGroup.ID);
              toggleDialog(deleteDialogRef);
            }}
          >
            Delete
          </Button>
          <Button
            className="bg-primary"
            onClick={() => handleSetModal("EditGroup", singleGroup.ID)}
          >
            Edit
          </Button>
          <Button
            className="bg-primary"
            onClick={() => handleSetModal("CreateExpense")}
          >
            Create Expense
          </Button>
        </ButtonFooter>

        <Dialog
          dialogRef={deleteDialogRef}
          cancelOnClick={() => toggleDialog(deleteDialogRef)}
          confirmOnClick={() => handleDelete(deleteID)}
        >
          <p>Are you sure you want to delete this group?</p>
        </Dialog>
      </>
    )
  );
}

export default GroupDetail;
