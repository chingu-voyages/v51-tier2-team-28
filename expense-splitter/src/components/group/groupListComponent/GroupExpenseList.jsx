export default function GroupExpenseList({ expenseList }) {
  console.log(expenseList);

  return (
    <>
      <h3 className="text-decoration-line mt-2 text-base font-bold">
        Group Expenses:
      </h3>
      {expenseList.map((expense) => {
        return (
          <div key={expense.id} className="flex flex-row justify-between">
            <p>{expense.name}</p>
            <p>${expense.amount}</p>
          </div>
        );
      })}
    </>
  );
}
