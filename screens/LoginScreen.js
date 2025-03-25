import { useState } from 'react';
import { useNavigation } from '@react-navigation/native'; // 🚀 Import navigation hook
import './login.css';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import upload from '../lib/upload';

const LoginScreen = () => {
    const navigation = useNavigation(); // 🚀 Access navigation object

    const [avatar, setAvatar] = useState({
        file: null,
        url: ""
    });

    const [loading, setLoading] = useState(false);

    const handleAvatar = e => {
        if (e.target.files[0]) {
            setAvatar({
                file: e.target.files[0], 
                url: URL.createObjectURL(e.target.files[0])
            });
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        const formData = new FormData(e.target);
        const { username, email, password } = Object.fromEntries(formData);
    
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
    
            const imgUrl = avatar.file ? await upload(avatar.file) : "./avatar.png";
    
            await setDoc(doc(db, "users", res.user.uid), {
                username,
                email,
                avatar: imgUrl,
                id: res.user.uid,
                blocked: [],
            });

            await setDoc(doc(db, "userchats", res.user.uid), {
                chats: []
            });

            toast.success("Account created! Welcome!");
            navigation.navigate('HomeScreen'); // 🚀 Navigate to HomeScreen after sign-up
        } catch (err) {
            console.error(err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async e => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData(e.target);
            const { email, password } = Object.fromEntries(formData);

            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Welcome back!");
            navigation.navigate('Home'); // 🚀 Navigate to HomeScreen after login
        } catch (err) {
            console.error(err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='container'>
            <div className='login'>
                <div className="item">
                    <h2>Welcome back</h2>
                    <form onSubmit={handleLogin}>
                        <input type="text" name="email" placeholder='Email' />
                        <input type="password" placeholder='Password' name='password' />
                        <button disabled={loading}>{loading ? "Loading..." : "Sign In"}</button>
                    </form>
                </div>

                <div className="separator"></div>

                <div className="item">
                    <h2>Create an Account</h2>
                    <form onSubmit={handleRegister}>
                        <label htmlFor="file">
                            <img src={avatar.url || "./avatar.png"} alt="Avatar" />
                            Upload image (optional)
                        </label>
                        <input 
                            type="file" 
                            id='file' 
                            style={{ display: "none" }} 
                            onChange={handleAvatar} 
                        />
                        <input type="text" name="username" placeholder='First and Last name' />
                        <input type="text" name="email" placeholder='Email' />
                        <input type="password" placeholder='Password' name='password' />
                        <button disabled={loading}>{loading ? "Loading..." : "Sign Up"}</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
