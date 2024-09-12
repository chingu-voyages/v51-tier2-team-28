import { nanoid } from 'nanoid'
import { useForm } from 'react-hook-form'
import Button from '../ui/Button'
import { UseDataContext } from '../context/SiteContext'

export default function CreateExpense() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm()

  const { expense, handleSetExpense } = UseDataContext()

  const onSubmit = (values) => {
    handleSetExpense(values)
  }

  console.log(expense)

  return (
    <div className="mb-5">
      <h1 className="text-2xl mb-2">Create an Expense </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-2">
          <label className="mr-2">Name: </label>
          <input
            placeholder="Name of expense"
            {...register('name', { required: 'Required' })}
          />
          {/* {errors.name && errors.name.message} */}
        </div>

        <div className="mb-2">
          <label className="mr-2">Description: </label>
          <input
            placeholder="Describe the expense"
            {...register('description', { required: 'Required' })}
          />
          {/* {errors.description && errors.description.message} */}
        </div>

        <div className="mb-2">
          <label htmlFor="category" className="mr-2">
            Category:
          </label>

          <select
            name="category"
            {...register('category', {
              required: 'select a category',
            })}
          >
            <option value=""></option>
            <option value="entertainment">Entertainment</option>
            <option value="gift">Gift</option>
            <option value="groceries">Groceries</option>
            <option value="restaurant">Restaurant</option>
            <option value="shopping">Shopping</option>
            <option value="trip">Trip</option>
            <option value="utilities">Utilities</option>
            <option value="other">Other</option>
          </select>

          {/* {errors.func && <p style={{color:'red'}}> {errors.func.message}</p> } */}
        </div>

        <div className="mb-2">
          <label className="mr-2">Amount: </label>
          <input
            placeholder="Enter a value"
            {...register('amount', {
              required: 'Required',
              pattern: {
                value: /^[0-9]*$/i,
                message: 'invalid type, please enter a number',
              },
            })}
          />
          <div>{errors.budget && errors.budget.message}</div>
        </div>

        <div className="mb-2">
          <label htmlFor="group" className="mr-2">
            Group Name:
          </label>

          <select
            name="group"
            {...register('group', {
              required: 'select a group',
            })}
          >
            <option value=""></option>
            <option value="Beach Lunch">Beach Lunch</option>
            <option value="gift">Bar Night</option>
            <option value="groceries">Groceries</option>
            <option value="restaurant">Restaurant</option>
            <option value="shopping">Shopping</option>
            <option value="trip">Trip</option>
            <option value="utilities">Utilities</option>
            <option value="other">Other</option>
          </select>

          {/* {errors.func && <p style={{color:'red'}}> {errors.func.message}</p> } */}
        </div>

        {/* <div className="mb-2">
          <label className="mr-2">Date:</label>
          <input
            placeholder="Date created"
            {...register('date', { required: 'Required' })}
          />
          {errors.description && errors.description.message}
        </div> */}

        <Button>Submit</Button>
      </form>
    </div>
  )
}
