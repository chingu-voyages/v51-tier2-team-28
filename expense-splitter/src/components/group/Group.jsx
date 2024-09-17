import Button from "../ui/Button";
import GroupList from "./GroupList";
import { UseDataContext } from "../context/SiteContext"
import ReceiptUpload from "../upload/ReceiptUpload"

export default function Group() {
  const {handleSetModal, modal} = UseDataContext()
  console.log(modal)

  return (
    // if modal is not showing then display the following
    !modal.show && (
      <div>
        <h1 className="text-center">Groups</h1>
        <div>
          <GroupList />
          <ReceiptUpload />
        </div>
        <div className="absolute over left-1/2 bottom-6 -translate-x-1/2 z-10">
          <Button 
            onClick={() => handleSetModal('CreateGroup')} 
            className={'bg-primary'}
          >Create Group</Button>
        </div>
      </div>
    )
  );
}
