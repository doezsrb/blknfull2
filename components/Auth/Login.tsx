import styles from "./Auth.module.css";
import useRedux from "util/useRedux";
import { FormEvent,useEffect,useRef,useState } from "react";
import { signIn, SignInResponse, useSession} from 'next-auth/client';
import { useRouter } from "next/dist/client/router";
export interface LoginProps {}

const Login = () => {
  const { setIsLogin,toggleIsOpenedWrapper } = useRedux();
  const formRef = useRef<any>(null);
  const router = useRouter();
  const [email_e,setEmail_e] = useState(false);
  const [password_e,setPassword_e] = useState(false);
  const [session,loading] = useSession();
  const [formValues,setFormValues] = useState({
    email:'',
    password:''
  })
  const setError = (state:string,value:boolean) => {
    switch(state){
      case 'email':
        setEmail_e(value);
        break;
      case 'password':
        setPassword_e(value);
        break;
    }
  }
  const submitForm = (e:FormEvent) => {
    e.preventDefault();

    let err = 0;
    var obj:any = formValues;
    Object.keys(obj).forEach(key => {
      if(obj[key] == ''){
        setError(key,true);
        err = 1;
      }
    })

    if(err === 0){
      signIn('credentials',{
        email:formValues.email,
        password:formValues.password,
        register:false,
        redirect:false
      }).then((res:SignInResponse|undefined) => {
        if(res!.error == null){
          formRef.current.reset();
          setFormValues({
            email:'',
            password:''
          });
          toggleIsOpenedWrapper();
      
        }else{
          alert("Failed")
        }
      }).catch(e => {
        alert("Failed");
      });
      
    }

  }
  const changeInput = (e:FormEvent) => {
    var target:any = e.target;
    var obj:any = formValues;
    obj[target.id] = target.value
    setError(target.id,false);
    setFormValues(obj);
  }
  
  useEffect(() => {
    
    if(session?.user?.email != null){
      var id = session?.user?.email;
      router.push(`/profile/${id}`);
    }
    
  },[session]);
  return (
    <form onSubmit={e => submitForm(e)} ref={formRef}>
      <div className={styles.label}>E-mail</div>
      <input
      onChange={e => changeInput(e)}
        className={`${styles.input} ${email_e ? styles.errorinput : null}`}
        type="email"
        name=""
        id="email"
        placeholder="yourname@example.com"
      />
      <div className={styles.label}>Password</div>
      <input
        onChange={e => changeInput(e)}
        className={`${styles.input} ${password_e ? styles.errorinput : null}`}
        type="password"
        name=""
        id="password"
        placeholder="••••••••••••••••••••"
      />
      <button className={styles.button} type="submit">
        LOGIN
      </button>
      <div className={styles.buttonUnderText}>
        Don&apos;t have an account?{" "}
        <a onClick={() => setIsLogin(false)}>Register here!</a>
      </div>
  </form>
  );
};

export default Login;
