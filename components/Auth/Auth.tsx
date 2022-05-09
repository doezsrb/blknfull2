import { Login, Wrapper, PopUp, Register } from "components";

import useRedux from "../../util/useRedux";

export interface AuthProps {}

const Auth = () => {
  const { isOpenedWrapper, toggleIsOpenedWrapper, isLogin } = useRedux();
  return (
    isOpenedWrapper && (
      <>
        <Wrapper
          onClick={toggleIsOpenedWrapper}
          isOpened={isOpenedWrapper}
        ></Wrapper>
        <PopUp
          title={
            isLogin
              ? "Welcome back to Balkan Dating!"
              : "Sign up to Balkan Dating!"
          }
          closeClick={toggleIsOpenedWrapper}
        >
          {isLogin ? <Login /> : <Register />}
        </PopUp>
      </>
    )
  );
};

export default Auth;
