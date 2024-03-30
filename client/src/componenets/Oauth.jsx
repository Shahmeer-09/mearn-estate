import {GoogleAuthProvider , getAuth, signInWithPopup} from 'firebase/auth';
import {app} from "../firebase"
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signinSuccess } from '../redux/user/userSlice';

const Oauth = () => {
  const navigate = useNavigate()
    const dispatch = useDispatch();
    const handleOauthClick=async ()=>{
        try {
           const provider = new GoogleAuthProvider();
           const auth = getAuth(app)
           const result = await signInWithPopup(auth, provider)
        
           const res = await fetch('/api/auth/google', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: result.user.displayName,
              email: result.user.email,
              photo: result.user.photoURL,
            }),
          });
          const data = await res.json();
          dispatch(signinSuccess(data));
          navigate('/profile')
        } catch (e){
            console.log(e);
        }
    }
  return (
    <button onClick={handleOauthClick} type='button' className=' bg-red-600 p-3 rounded-lg text-white hover:opacity-95 uppercase ' >Continue With Google</button>
  )
}

export default Oauth