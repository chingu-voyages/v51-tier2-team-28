import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import { UseDataContext } from "../context/SiteContext";
import db from "../../utils/localstoragedb";
import { categories } from "../../utils/dummyData";

export default function CreateExpense() {
  const { groupData, friends, expenses, setExpenses, modal, handleSetModal } =
    UseDataContext();
  const [currentExpense, setCurrentExpense] = useState({});
  const [allFriends, setAllFriends] = useState([]);
  const [weightTotal, setWeightTotal] = useState(0);

  const {
    handleSubmit,
    register,
    reset,
    watch, // lets use this to track values
    formState: { errors },
  } = useForm();

  // watch all fields
  const watchedValues = watch();

  // load current expense and friends in state on initial render
  useEffect(() => {
    const initialExpense = expenses.find((expense) => expense.ID === modal.id);
    setCurrentExpense(initialExpense);

    const friendIdsArr = initialExpense.weight?.map(
      (friend) => friend.friendId,
    );

    const friendsInGroup = friends.filter((friend) =>
      friendIdsArr.includes(friend.id),
    );

    const friendObjs = initialExpense.weight.map((item) => {
      if (friendIdsArr.includes(item.friendId)) {
        const friendName = friendsInGroup?.filter(
          (friend) => friend.id === item.friendId,
        );
        const dollarValue =
          (parseFloat(item.percentage) * initialExpense.amount) / 100;
        return {
          id: item.friendId,
          weight: item.percentage.toString(),
          name: friendName[0]?.name,
          dollar: dollarValue.toString(),
        };
      }
    });

    setAllFriends(friendObjs);

    // get the friend values for weights
    // populate the initial form values
    const friendValues = friendObjs.reduce((acc, friend) => {
      acc[friend.name] = parseFloat(friend.weight).toFixed(2);
      return acc;
    }, {});

    const valuesObj = {
      name: currentExpense.name || "",
      description: currentExpense.description || "",
      category: currentExpense.category || "",
      amount: currentExpense.amount || "",
      group: currentExpense.groupId || "",
      receipt_URL: currentExpense.receipt_URL || "",
      ...friendValues,
    };
    reset(valuesObj);
  }, [currentExpense]);

  // calculate weight data
  useEffect(() => {
    // get friends with non-zeros
    const getFriendsWithNonZeros = () => {
      let results = [];
      allFriends.forEach((friend) => {
        if (watchedValues[friend.name] != "0") {
          results.push({ ...friend, weight: watchedValues[friend.name] });
        }
      });
      return results;
    };
    const friendsWithNonZeros = getFriendsWithNonZeros();

    // get friends with empty weights
    const hasEmptyWeights = friendsWithNonZeros.some(
      (friend) => friend.weight === "",
    );

    // filter out friends with empty weights
    const friendsWithWeight = friendsWithNonZeros.filter(
      (friend) => friend.weight !== "",
    );

    // calculate percentages
    const totalPercentages = !hasEmptyWeights
      ? friendsWithNonZeros.reduce(
          (acc, curr) => acc + parseFloat(curr.weight),
          0,
        )
      : friendsWithWeight.reduce(
          (acc, curr) => acc + parseFloat(curr.weight),
          0,
        );

    // update weight/dollar on weight value change
    const updatedFriends = allFriends.map((friend) => {
      const newWeight = watchedValues[friend.name];
      const zeroDefault =
        watchedValues["amount"] / parseFloat(allFriends.length);

      // generate the dollar amount based on weight
      const newDollar =
        parseInt(newWeight) === 0
          ? zeroDefault
          : (parseFloat(watchedValues[friend.name]) * watchedValues["amount"]) /
            100;

      const newZeroWeight =
        (100 - parseInt(totalPercentages)) /
        (allFriends.length - friendsWithNonZeros.length);

      const weightLimit = totalPercentages - parseInt(newWeight);

      setWeightTotal(Math.round(totalPercentages));

      const acceptedWeight =
        parseInt(newWeight) <= weightLimit ? newWeight : "0";

      // if a new weight has been inputted
      return newWeight !== "0"
        ? {
            ...friend,
            weight: acceptedWeight.toString(),
            dollar: !newWeight ? 0 : `$${newDollar.toFixed(2)}`,
          }
        : {
            ...friend,
            weight: newZeroWeight.toString(),
            dollar: 0,
          };
    });

    setAllFriends(updatedFriends);
    // only update state when friend values change
  }, [
    allFriends.map((friend) => watchedValues[friend.name]).join(),
    watchedValues["amount"],
  ]);

  // load group values
  useEffect(() => {
    const friendIdsArr = groupData.find(
      (group) => group.id === watchedValues["group"],
    )?.friendIDs;

    const friendsInGroup = friends
      .filter((friends) => friendIdsArr?.includes(friends.id))
      .map((friend, i) => ({
        name: friend.name,
        weight: 0,
        id: friendIdsArr[i],
      }));
    setAllFriends(friendsInGroup);
  }, [watchedValues["group"]]);

  // generate friend contribution fields
  const friendContributionFields = allFriends?.map((friend) => {
    return (
      <div
        key={friend.name}
        className="mb-2 grid grid-cols-3 items-center justify-between gap-2"
      >
        <label className="mr-2" htmlFor={friend.name}>
          {friend.name}
        </label>
        <div className="relative ml-auto flex w-[98px] items-center">
          <input
            id={friend.name}
            className="w-full pr-4"
            name={friend.name}
            required
            placeholder="0"
            defaultValue={0}
            {...register(`${friend.name}`, {
              pattern: {
                alue: /^\d{1,2}(\.\d{0,2})?$/,
                message:
                  "Invalid input. Please enter a number between 0 and 99.",
              },
            })}
            // Allow only numbers with up to 2 whole numbers, a period, and 2 decimal places
            onInput={(e) => {
              const input = e.target;
              input.value = input.value
                .replace(/[^0-9.]/g, "") // Remove non-numeric and non-period characters
                .replace(/^(\d{1,2})\.(\d{2}).*/, "$1.$2") // Limit to 2 decimal places
                .replace(/^(\d{3,})/, "$1") // Prevents more than 2 whole numbers
                .slice(0, 5); // Ensure the input length is capped (2 whole, period, 2 decimal)
            }}
          />
          <span className="absolute right-4 font-roboto font-light text-gray-800">
            %
          </span>
        </div>
        <div className="rounded-lg bg-accent/50 p-5 text-center font-semibold">
          {friend.dollar}
        </div>
      </div>
    );
  });

  const onSubmit = (values) => {
    const { ID } = expenses.find((expense) => expense.id === currentExpense.id);
    const weightObj = allFriends.map((friend) => ({
      friendId: friend.id,
      percentage: parseFloat(friend.weight),
    }));
    const updatedExpense = {
      amount: values.amount,
      category: values.category,
      name: values.name,
      description: values.description,
      weight: weightObj,
      groupId: values.group,
    };
    db.insertOrUpdate("expenses", { ID: ID }, { ...updatedExpense });
    db.commit();
    // update expenses state with new db values
    setExpenses(db.queryAll("expenses"));
    handleSetModal();
  };

  return (
    <>
      <h1 className="text-center">Edit Expense </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5 flex flex-col">
          <label className="mb-1" aria-required="true" htmlFor="name">
            Name:*{" "}
          </label>
          <input
            id="name"
            autoComplete="name"
            placeholder="Name of expense"
            {...register("name", { required: "name is required" })}
          />
          <div className="error-text">{errors.name && errors.name.message}</div>
        </div>

        <div className="mb-5 flex flex-col">
          <label className="mb-1" aria-required="true" htmlFor="description">
            Description:*{" "}
          </label>
          <input
            id="description"
            placeholder="Describe the expense"
            defaultValue={currentExpense.description}
            {...register("description", {
              required: "description is required",
            })}
          />
          <div className="error-text">
            {errors.description && errors.description.message}
          </div>
        </div>

        <div className="mb-5 flex flex-col">
          <label htmlFor="category" className="mb-1" aria-required="true">
            Category:*
          </label>
          <select
            id="category"
            className="h-16"
            name="category"
            {...register("category", {
              required: "select a category",
            })}
          >
            <option value=""></option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.replace(/^\w/, (char) => char.toUpperCase())}
              </option>
            ))}
          </select>
          {errors.category && (
            <p style={{ color: "red" }}> {errors.category.message}</p>
          )}
        </div>

        <div className="mb-5 flex flex-col">
          <label className="mb-1" aria-required="true" htmlFor="amount">
            Amount:*{" "}
          </label>
          <input
            id="amount"
            placeholder="Enter a value"
            {...register("amount", {
              required: "amount required",
              pattern: {
                value: /^[0-9]*(.[0-9]{2})?$/i,
                message: "invalid type, please enter a number from 0-100",
              },
            })}
          />
          {errors.amount && (
            <p style={{ color: "red" }}> {errors.amount.message} </p>
          )}
        </div>

        <div className="mb-5 flex flex-col" aria-required="true">
          <label htmlFor="group" className="mb-2">
            Group Name:*
          </label>

          <select
            id="group"
            name="group"
            disabled={true}
            className="h-16 cursor-not-allowed opacity-50"
            {...register("group", {
              required: "select a group to apply this expense",
            })}
          >
            <option value=""></option>
            {groupData.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
          {errors.group && (
            <p style={{ color: "red" }}> {errors.group.message}</p>
          )}
        </div>

        <div className="mb-8">
          {watchedValues["group"] && (
            <>
              <h2 className="mb-4">Weight Contribution:*</h2>
              <div className="bg-neutral/[2%] mb-4 flex items-center justify-between rounded-xl border border-primary/10 p-4">
                <div>
                  {weightTotal !== 100 ? (
                    <p className="error-text">Combined weights must be 100%</p>
                  ) : (
                    <p>Combined weights:</p>
                  )}
                </div>
                <div>
                  <p
                    className={`font-bold ${weightTotal === 100 ? "text-green-800" : "text-red-500"}`}
                  >
                    {weightTotal}% <span className="font-normal">of</span> 100%
                  </p>
                </div>
              </div>
              {friendContributionFields}
            </>
          )}
        </div>

        <div className="flex gap-8">
          <Button
            type="button"
            onClick={handleSetModal}
            className="w-full md:w-auto"
          >
            Cancel
          </Button>
          {weightTotal !== 100 ? (
            <Button
              disabled={true}
              className="w-full cursor-not-allowed bg-primary opacity-25 md:w-auto"
            >
              Submit
            </Button>
          ) : (
            <Button className="w-full bg-primary md:w-auto">Submit</Button>
          )}
        </div>
      </form>
    </>
  );
}
