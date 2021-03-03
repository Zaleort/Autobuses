const debounde = (delay: number, callback: Function) => {
  let timeoutID: any;
  let cancelled = false;

  const clearExistingTimeout = () => {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
  };

  const cancel = () => {
    clearExistingTimeout();
    cancelled = true;
  };

  const wrapper = (...arguments_: any[]) => {
    if (cancelled) {
      return;
    }

    function exec() {
      callback(arguments_);
    }

    clearExistingTimeout();
    timeoutID = setTimeout(exec, delay);
  };

  wrapper.cancel = cancel;
  return wrapper;
};

export default debounde;
