import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Define schema for optional email
const optionalEmail = z.union([z.string().email(), z.literal("")]);
// Define validation schema and error messages
const schema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, { message: "Must be at least 2 characters" }),
  email: optionalEmail,
});

const CreateParticipant = () => {
  // Destructire useForm hook
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    // Used to check form data against validation schema
    resolver: zodResolver(schema),
  });

  // Handle form data on submit
  const onSubmit = async (data) => {
    // TODO - Store data in localstorage db
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
  };

  return (
    // Pass onSubmit function to useForm submit handler
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="name">Name: </label>
      <input
        id="name"
        placeholder="Min 2 characters"
        // Associate name input with useForm
        {...register("name")}
      />
      {/* Render errors if validation does not pass */}
      {errors.name && (
        <span className="text-red-500">{errors.name.message}</span>
      )}

      <label htmlFor="email">Email: </label>
      <input
        id="email"
        placeholder="Optional"
        // Associate email imput with useForm
        {...register("email")}
      />
      {/* Render errors if validation does not pass */}
      {errors.email && <span>{errors.email.message}</span>}
      {/* Disable button if waiting on async funciton */}
      <button disabled={isSubmitting} type="submit">
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default CreateParticipant;
