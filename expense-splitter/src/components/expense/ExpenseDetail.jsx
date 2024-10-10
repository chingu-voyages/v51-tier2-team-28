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
import formatDate from "../../utils/formatDate";
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

  // set data for pie chart to be array of contribution values
  const pieChartData = {};

  // get date and format it
  const expenseDate = formatDate(expenseDetails.date);

  const expenseAmount = parseInt(expenseDetails.amount);

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
    console.log(friend);
    return (
      <Card
        key={friend.friendId}
        icon={"fa-user"}
        hasButtons={true}
        title={friends.find((i) => i.id === friend.friendId).name}
        subtitle={parseFloat(friend.percentage).toFixed(2) + "%"}
        price={((friend.percentage / 100) * expenseDetails.amount).toFixed(2)}
      />
    );
  });

  console.log(memberDisplay);

  return (
    !modal.show && (
      <div ref={downloadRef} className="mb-8">
        <div className="mb-4 flex items-center">
          <i
            data-html2canvas-ignore
            onClick={() => navigate("/expenses")}
            className="fa-solid fa-chevron-left cursor-pointer text-3xl text-accent"
          ></i>
          <h1 className="mx-auto mb-0">{expenseDetails.name}</h1>
          <i className="fa-solid fa-chevron-right text-3xl text-accent opacity-0"></i>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="p-2 text-center text-[32px] font-medium">
            ${expenseAmount.toFixed(2)}
          </h2>
          <p>{expenseDetails.description}</p>
          <p>
            <span className="mr-1 font-bold">Category:</span>
            {expenseDetails.category.replace(/^\w/, (char) =>
              char.toUpperCase(),
            )}
          </p>
          <p>
            <span className="mr-1 font-bold">Date:</span>
            {expenseDate}
          </p>
        </div>

        <PieChart label="Amount Owed" pieData={pieChartData} />
        <div className="mb-2 flex justify-between">
          <DownloadPDF
            filename={expenseDetails.name}
            contentRef={downloadRef}
          />
          <Button
            onClick={() => {
              navigate(`/groups/${expenseGroup.id}`);
            }}
          >
            {expenseGroup.name}
          </Button>
        </div>

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
            className="min-w-32 bg-red-700"
            onClick={() => {
              setDeleteID(expenseDetails.ID);
              toggleDialog(deleteDialogRef);
            }}
          >
            Delete
          </Button>
          <Button
            className="min-w-32 bg-primary"
            onClick={() => handleSetModal("EditExpense", expenseDetails.ID)}
          >
            Edit
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
