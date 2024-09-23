import { UseDataContext } from "../context/SiteContext";
import db from "../../utils/localstoragedb";
import IconButton from "../ui/IconButton";

export default function ExpenseList() {
  const { expenses, setExpenses, handleSetModal } = UseDataContext();
  // console.log('expenses', expenses)

  // Filter out id match, delete from local storage
  const handleDeleteExpense = (id) => {
    const updatedExpense = expenses.filter((exp) => exp.id !== id);
    console.log("expenses", updatedExpense);
    db.deleteRows("expenses", { id });
    db.commit();
    setExpenses(db.queryAll("expenses"));
  };

  const expenseItems = expenses.map((expense) => (
    <div
      key={expense.ID}
      className="mb-1 flex flex-col rounded-lg bg-slate-100 px-4 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="content-start">{expense.name}</div>
        <div className="content-end">{expense.amount}</div>
        <div className="flex content-end gap-2">
          <IconButton
            icon="fa-regular fa-pen-to-square"
            onClick={() => handleSetModal("EditExpense", expense.ID)}
            variant={"small"}
            className="font-normal"
            style="blue"
          ></IconButton>

          <IconButton
            icon="fa-regular fa-trash-can"
            onClick={() => {
              handleDeleteExpense(expense.id);
            }}
            variant={"small"}
            className="font-normal"
          ></IconButton>
        </div>
      </div>
    </div>
  ));

  return <div className="mb-4 flex flex-col-reverse">{expenseItems}</div>;
}
