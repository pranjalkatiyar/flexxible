import { UserProfile } from '@/common.types';
import  {getUserProjects} from '@/lib/actions'
import ProfilePage from '@/app/components/Profile';
type Props={
    params:{
        id:string;
    }
}


const UserProfile = async({params}:Props) => {

const result=await getUserProjects(params.id,100) as {user: UserProfile}

    if(!result?.user){
        return <p className='no-result-text'>User not found</p>
    }

  return (
   <ProfilePage user={result.user}/>
  )
}

export default UserProfile