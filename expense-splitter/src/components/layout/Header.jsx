import { Link } from 'react-router-dom';
import IconButton from '../ui/IconButton'
import { UseDataContext } from '../context/SiteContext'

export default function Header() {
  const {handleSetModal} = UseDataContext();

  return (
    <div className='flex flex-col pt-[62px] pb-3 h-[200px] bg-primary/70 text-white'>
      <div className='text-center text-[40px] uppercase font-extrabold'>Let's Split It</div>
      <nav className='m-auto w-full px-4 max-w-4xl'>
        <div className='flex justify-between gap-2'>
            <Link to="/">
              <IconButton icon={'house'}>Home</IconButton>
            </Link>
            <Link to="/groups">
              <IconButton icon={'people-group'}>Groups</IconButton>
            </Link>
            <Link to="/friends">
              <IconButton icon={'address-book'}>Friends</IconButton>
            </Link>
            <Link to="/expenses">
              <IconButton icon={'credit-card'}>Expenses</IconButton>
            </Link>
        </div>
      </nav>
    </div>
  )
}
