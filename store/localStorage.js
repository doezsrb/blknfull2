export const loadState = () => {
  try {
    const serialazedState = localStorage.getItem("state");
    if (serialazedState === null) {
      return undefined;
    }
    return JSON.parse(serialazedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serialazedState = JSON.stringify(state);
    localStorage.setItem("state", serialazedState);
  } catch (err) {
    //ignore
  }
};
