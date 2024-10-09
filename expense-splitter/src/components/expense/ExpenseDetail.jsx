import { useParams, useNavigate, Navigate } from "react-router-dom";
import { UseDataContext } from "../context/SiteContext";
import Card from "../ui/Card";
import PieChart from "../widgets/PieChart";
import DownloadPDF from "../widgets/DownloadPDF";
import { useRef, useState } from "react";
import ButtonFooter from "../ui/ButtonFooter";
import Button from "../ui/Button";
import db from "../../utils/localstoragedb";
import Dialog from "../ui/Dialog";
import ReceiptUpload from "../upload/ReceiptUpload";
import DisplayReceipt from "../upload/DisplayReceipt";
import deleteReceiptFromStorage from "../../utils/deleteReceipt";

function ExpenseDetail() {
  const { expenses, groupData, friends, handleSetModal, setExpenses, modal } =
    UseDataContext();
  const { expenseId } = useParams();
  const navigate = useNavigate();

  // Create reference to dom elements
  const deleteDialogRef = useRef(null);
  const downloadRef = useRef(null);

  const [deleteID, setDeleteID] = useState(null);

  // get expense details
  const expenseDetails = expenses.find((expense) => expense.id === expenseId);

  // Closes or opens the dialog
  const toggleDialog = (ref) => {
    if (!ref.current) {
      return;
    }
    ref.current.hasAttribute("open")
      ? ref.current.close()
      : ref.current.showModal();
  };

  //delete an expense
  const deleteExpense = () => {
    db.deleteRows("expenses", { id: expenseDetails.id });
    db.commit();
    //call setState to render the component
    setExpenses(db.queryAll("expenses"));
    // after deleting, navigate to groups
    navigate("/expenses");
  };

  const handleDelete = () => {
    if (expenseDetails.receipt_URL) {
      deleteReceiptFromStorage(expenseDetails.receipt_URL, deleteExpense);
    } else {
      deleteExpense();
    }
  };

  // Redirect to 404 page if expense not found
  if (!expenseDetails) {
    return <Navigate to={"404"} />;
  }

  // get group connected to expense
  const expenseGroup = groupData.filter(
    (group) => group.id === expenseDetails.groupId,
  )[0];

  // get friends names from goup
  const friendNames = friends.filter((friend) =>
    expenseGroup.friendIDs.includes(friend.id),
  );

  // set data for pie chart to be array of contribution values
  const pieChartData = {};

  expenseDetails.weight.forEach((weight) => {
    const friendInfo = friends.find((friend) => friend.id === weight.friendId);
    pieChartData[friendInfo.name] = (
      (weight.percentage / 100) *
      expenseDetails.amount
    ).toFixed(2);
  });

  // sort payers by contribution amount
  const sortedContributions = expenseDetails.weight.sort(function (a, b) {
    return b.percentage - a.percentage;
  });

  const memberDisplay = sortedContributions.map((friend) => {
    return (
      <Card
        key={friend.friendId}
        icon={"fa-user"}
        hasButtons={true}
        title={friendNames.find((i) => i.id === friend.friendId).name}
        subtitle={friend.percentage + "%"}
        price={((friend.percentage / 100) * expenseDetails.amount).toFixed(2)}
      />
    );
  });

  return (
    !modal.show && (
      <div ref={downloadRef} className="mb-16">
        <div className="mb-4 flex items-center">
          <i
            data-html2canvas-ignore
            onClick={() => navigate("/expenses")}
            className="fa-solid fa-chevron-left cursor-pointer text-3xl text-accent"
          ></i>
          <h1 className="mx-auto mb-0">{expenseDetails.name}</h1>
          <i className="fa-solid fa-chevron-right text-3xl text-accent opacity-0"></i>
        </div>
        <h1 className="mb-2 p-2 text-center">${expenseDetails.amount}</h1>
        <div className="mb-2 flex">
          <p>{expenseDetails.description}</p>
        </div>
        <div className="flex">
          <p>
            <span className="mr-1 font-bold">Category:</span>
            {expenseDetails.category}
          </p>
        </div>
        <PieChart label="Amount Owed" pieData={pieChartData} />
        <div className="flex justify-between">
          <DownloadPDF
            filename={expenseDetails.name}
            contentRef={downloadRef}
          />
          <button
            className="text-xl underline"
            onClick={() => {
              navigate(`/groups/${expenseGroup.id}`);
            }}
          >
            {expenseGroup.name}
          </button>
        </div>
        <p className="mb-2 mt-4 bg-primary p-2 text-white">Split Costs:</p>
        <div>
          <>{memberDisplay}</>
        </div>
        {expenseDetails.receipt_URL ? (
          <DisplayReceipt expense={expenseDetails} setExpenses={setExpenses} />
        ) : (
          <ReceiptUpload
            expenseDetails={expenseDetails}
            setExpenses={setExpenses}
            expenses={expenses}
          />
        )}

        <ButtonFooter>
          <Button
            className="bg-red-700"
            onClick={() => {
              setDeleteID(expenseDetails.ID);
              toggleDialog(deleteDialogRef);
            }}
          >
            Delete
          </Button>
          <Button
            className="bg-primary"
            // onClick={() => handleSetModal("EditGroup", singleGroup.ID)}
            onClick={() => handleSetModal("EditExpense", expenseDetails.ID)}
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
          confirmOnClick={() => handleDelete()}
        >
          <p>Are you sure you want to delete this expense?</p>
        </Dialog>
      </div>
    )
  );
}

export default ExpenseDetail;
