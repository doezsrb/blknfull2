import { useSelector, useDispatch } from "react-redux";

const useRedux = () => {
  const isOpenedWrapper = useSelector((state) => state.isOpenedWrapper);
  const isLogin = useSelector((state) => state.isLogin);
  const dispatch = useDispatch();

  const toggleIsOpenedWrapper = () => {
    dispatch({
      type: "TOGGLE_OPENED_WRAPPER",
    });
  };
  const setIsLogin = (isLoginBool) => {
    dispatch({
      type: "SET_IS_LOGIN",
      payload: isLoginBool,
    });
  };

  return {
    isOpenedWrapper,
    isLogin,
    toggleIsOpenedWrapper,
    setIsLogin,
  };
};

export default useRedux;
