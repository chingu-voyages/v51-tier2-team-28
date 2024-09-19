import { nanoid } from "nanoid";
import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import { UseDataContext } from "../context/SiteContext";
import MultiSelectDropdown from "../ui/MultiSelectDropdown";
import db from "../../utils/localstoragedb";

export default function CreateGroup() {
  const { friends, setGroupData, handleSetModal } = UseDataContext();
  //form properties
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm();

  //onSubmit
  const onSubmit = (values) => {
    //// console.log("This is form submit", values);
    //// setGroupData((prev) => [...prev, { ...values, id: nanoid() }]);
    //insert the new group data into the group database
    db.insert("groups", { ...values, id: nanoid() });
    db.commit();
    //call setState to render the component
    setGroupData(db.queryAll("groups"));
    //close form after submit
    handleSetModal();
  };

  return (
    <div className="mb-5">
      <h1 className="text-center">Create a Group</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5 flex flex-col">
          <label className="mb-1">Group Name</label>
          <input
            placeholder="Name your group"
            {...register("name", { required: "name is required" })}
          />
          <div className="error-text">{errors.name && errors.name.message}</div>
        </div>

        <div className="mb-5 flex flex-col">
          <label className="mb-1">Group Description</label>
          <input
            placeholder="Tell us a little bit about your group"
            {...register("description", {
              required: "description is required",
            })}
          />
          <div className="error-text">
            {errors.description && errors.description.message}
          </div>
        </div>

        <div className="mb-5 flex flex-col">
          <label className="mb-1">Budget</label>
          <input
            placeholder="Enter a value"
            {...register("budget", {
              required: "budget is required",
              pattern: {
                value: /^[0-9]*(\.[0-9]{2})?$/i,
                message: "invalid type, only numbers allowed",
              },
            })}
          />
          <div className="error-text">
            {errors.budget && errors.budget.message}
          </div>
        </div>

        <div className="mb-5 flex flex-col">
          <label htmlFor="friends" className="mr-2">
            Friends
          </label>
          <MultiSelectDropdown friends={friends} control={control} />
        </div>

        <div className="flex">
          <Button className="w-full md:w-auto">Submit</Button>
          <Button
            type="button"
            onClick={handleSetModal}
            className="ml-4 w-full md:w-auto"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
