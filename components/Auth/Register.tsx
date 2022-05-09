import styles from "./Auth.module.css";
import useRedux from "util/useRedux";
import { FormEvent,useEffect,useRef,useState } from "react";
import {signIn, SignInResponse, useSession} from 'next-auth/client';
import clsx from "clsx";
import { useRouter } from "next/dist/client/router";

const Register = () => {
  const { setIsLogin,toggleIsOpenedWrapper } = useRedux();
  const [gender, setGender] = useState("");
  const formRef = useRef<any>(null);
  const [session,loading] = useSession();
  const router = useRouter();
  
  const [gender_e,setGender_e] = useState(false);
  const [name_e,setName_e] = useState(false);
  const [email_e,setEmail_e] = useState(false);
  const [password_e,setPassword_e] = useState(false);


  const [formValues, setFormValues] = useState<any>({
    gender:'',
    email:'',
    name:'',
    password:''
  });

  const setGenderFunction = (g: string) => {
    setGender(g);
    setGender_e(false);
    var obj:any = formValues;
    obj['gender'] = g
    setFormValues(formValues);
  };
  

  const setError = (state:string,value:boolean) => {
    switch(state){
      case 'gender':
        setGender_e(value);
        break;
      case 'name':
        setName_e(value);
        break;
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
    var err = 0;  
    var obj = formValues;
    Object.keys(obj).forEach(key => {
     if(obj[key] == "" || obj[key].length < 3){
       setError(key,true);
       err = 1
     }
     if(key == "password"){
       if(obj[key].length < 6){
        setError(key,true);
        err = 1
       }
     }
    })
    if(err === 0){
      signIn('credentials',{
        name:formValues.name,
        email:formValues.email,
        gender:formValues.gender,
        password:formValues.password,
        register:true,
        redirect:false
      }).then((res:SignInResponse|undefined) => {
        if(res!.error == null){
          formRef.current.reset();
          setGender("");
          setFormValues({
            gender:'',
            email:'',
            name:'',
            password:''
          });
          toggleIsOpenedWrapper();
          
          
        }else{
          alert("Failed");
        }
      }).catch(e => {
        alert("Failed");
      })
  
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
      <div className={styles.label}>Your gender</div>
      <div className={styles.radioGroup}>
        <div
          className={clsx({
            [styles.radioDiv]: true,
            [styles.selected]: gender == "Man",
            [styles.errorinput]: gender_e,
  
            
          })}
        >
          <p>Man</p>
          <input
            type="radio"
            name="gender"
            id=""
            value="man"
            onClick={() => setGenderFunction("Man")}
          />
        </div>
        <div
          className={clsx({
            [styles.radioDiv]: true,
            [styles.selected]: gender == "Woman",
            [styles.errorinput]: gender_e,
          })}
        >
          <p>Woman</p>
          <input
            type="radio"
            name="gender"
            id=""
            value="woman"
            onClick={() => setGenderFunction("Woman")}
          />
        </div>
      </div>
      <div className={styles.label}>Your name</div>
      <input
        className={`${styles.input} ${name_e ? styles.errorinput : null}`}
        type="text"
        name=""
        id="name"
        placeholder="Enter your name here"
        onChange={e => changeInput(e)}
      />
      <div className={styles.label}>E-mail</div>
      <input
        className={`${styles.input} ${email_e ? styles.errorinput : null}`}
        type="email"
        name=""
        id="email"
        placeholder="yourname@example.com"
        onChange={e => changeInput(e)}
      />
      <div className={styles.label}>Password</div>
      <input
        className={`${styles.input} ${password_e ? styles.errorinput : null}`}
        type="password"
        name=""
        id="password"
        placeholder="••••••••••••••••••••"
        onChange={e => changeInput(e)}
      />
      <button className={styles.button} type="submit">
        REGISTER
      </button>
      <div className={styles.buttonUnderText}>
        Already have an account?{" "}
        <a onClick={() => setIsLogin(true)}>Login here!</a>
      </div>
    </form>
  );
};

export default Register;
