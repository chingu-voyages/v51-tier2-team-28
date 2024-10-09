import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UseDataContext } from "../context/SiteContext";
import SearchBar from "../ui/SearchBar";
import Button from "../ui/Button";
import ButtonFooter from "../ui/ButtonFooter";
import Card from "../ui/Card";
import NoDataPlaceholder from "../ui/NoDataPlaceholder";

export default function Expense() {
  const navigate = useNavigate();
  const { user, handleSetModal, modal, expenses } = UseDataContext();

  const [inputText, setInputText] = useState("");

  let inputHandler = (e) => {
    let lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  useEffect(() => {
    // if user is not "logged in", go to login
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Sort expenses by db ID
  const expenseDisplay = expenses
    .sort((a, b) => b.ID - a.ID)
    .map((expense) => (
      <Card
        key={expense.id}
        id={expense.id}
        type={"expense"}
        icon={"fa-money-check-dollar"}
        title={expense.name}
        subtitle={"$" + expense.amount}
      />
    ));

  const filteredExpenses = expenseDisplay.filter((search) => {
    if (inputText === "") {
      return search;
    } else {
      return (
        search.props.title.toLowerCase().includes(inputText) ||
        search.props.subtitle.toLowerCase().includes(inputText)
      );
    }
  });

  return (
    // if modal is not showing then display the following
    !modal.show && (
      <>
        <h1 className="text-center">Expenses</h1>
        <div className="mb-2">
          <SearchBar input={inputText} inputHandler={inputHandler} />
        </div>
        {expenseDisplay.length < 1 ? (
          <NoDataPlaceholder
            title="There are no expenses to display"
            subtitle="Get started by creating a new expense"
            btnText="Create an Expense"
            onClick={() => handleSetModal("CreateExpense")}
          />
        ) : filteredExpenses.length > 0 ? (
          filteredExpenses
        ) : (
          <NoDataPlaceholder
            title="There are no expenses matching this search"
            subtitle="Would you like to create a new expense?"
            btnText="Create an Expense"
            onClick={() => {
              handleSetModal("CreateExpense");
            }}
          />
        )}
        <ButtonFooter>
          <Button
            className="bg-primary"
            onClick={() => handleSetModal("CreateExpense")}
          >
            Create Expense
          </Button>
        </ButtonFooter>
      </>
    )
  );
}
