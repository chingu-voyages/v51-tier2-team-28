import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../ui/Button";
import { UseDataContext } from "../context/SiteContext";
import MultiSelectDropdown from "../ui/MultiSelectDropdown";
import db from "../../utils/localstoragedb";

export default function EditGroup() {
  const { friends, setGroupData, groupData, modal, handleSetModal } =
    UseDataContext();

  // Define validation schema and error messages
  const schema = z.object({
    name: z
      .string({ required_error: "Name is required" })
      .trim()
      .min(2, { message: "Must be at least 2 characters" }),
    description: z
      .string({ required_error: "Description is required" })
      .trim()
      .min(1, { message: "Please add a description" }),
    budget: z
      .string()
      .min(1, { message: "Enter the amount please" })
      .regex(new RegExp(/^[0-9]*(.[0-9]{2})?$/, "i"), {
        message: "Please enter an valid amount (100, 100.99)",
      }),
    friendIDs: z
      .array(z.string())
      .nonempty({ message: "At least one friend ID is required" }),
  });

  //form properties
  const currentGroupData = groupData.find((group) => group.ID === modal.id);

  //save the list of friends
  const editFriends = currentGroupData.friendIDs;

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors },
  } = useForm({
    // Used to check form data against validation schema
    resolver: zodResolver(schema),
  });

  // if another group is selected for edit, reset the form
  useEffect(() => {
    if (currentGroupData) {
      reset({
        name: currentGroupData.name || "",
        description: currentGroupData.description || "",
        budget: currentGroupData.budget || "",
        friendIDs: currentGroupData.friendIDs || "",
      });
    }
  }, [currentGroupData]);

  //onSubmit
  const onSubmit = (values) => {
    //updating the group data in groups database
    db.insertOrUpdate("groups", { ID: currentGroupData.ID }, { ...values });
    db.commit();
    //call setState to render the component
    setGroupData(db.queryAll("groups"));
    //close the modal
    handleSetModal();
  };

  return (
    <div className="mb-5">
      <h1 className="text-center">Edit a group</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5 flex flex-col">
          <label htmlFor="name" autoComplete="on" className="mb-1">
            Name
          </label>
          <input
            id="name"
            placeholder="Name"
            className={`border ${errors.name ? "border-red-500 outline-red-500" : "border-transparent"} `}
            {...register("name")}
          />
          {errors.name && (
            <span className="ml-2 text-sm text-red-400">
              {errors.name.message}
            </span>
          )}
        </div>

        <div className="mb-5 flex flex-col">
          <label htmlFor="description" autoComplete="on" className="mb-1">
            Description
          </label>
          <input
            id="description"
            placeholder="What is this group about"
            className={`border ${errors.description ? "border-red-500 outline-red-500" : "border-transparent"} `}
            {...register("description")}
          />
          {errors.description && (
            <span className="ml-2 text-sm text-red-400">
              {errors.description.message}
            </span>
          )}
        </div>

        <div className="mb-5 flex flex-col">
          <label htmlFor="budget" autoComplete="on" className="mb-1">
            Budget
          </label>
          <input
            id="budget"
            placeholder="Enter a value"
            className={`border ${errors.budget ? "border-red-500 outline-red-500" : "border-transparent"} `}
            {...register("budget")}
          />
          {errors.budget && (
            <span className="ml-2 text-sm text-red-400">
              {errors.budget.message}
            </span>
          )}
        </div>

        <div className="mb-5 flex flex-col">
          <label htmlFor="friends" className="mr-2">
            Friends
          </label>
          <MultiSelectDropdown
            friends={friends}
            control={control}
            editFriends={editFriends}
            errors={errors.friendIDs}
          />
        </div>

        <div className="flex gap-8">
          <Button
            type="button"
            onClick={handleSetModal}
            className="w-full md:w-auto"
          >
            Cancel
          </Button>
          <Button className="w-full bg-primary md:w-auto">Submit</Button>
        </div>
      </form>
    </div>
  );
}
