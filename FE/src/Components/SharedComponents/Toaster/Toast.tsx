import {toast} from 'react-toastify'


function ToasterWithMessage(){
    const error = (message: string,delay=2000) => {
        toast.error(message,{
          //prevent duplicate toaster
          toastId: `error-${message}`,
        });
        return true;
      };

      const success = (message: string,delay=2000) => {
        toast.success(message,{
          //prevent duplicate toaster
          toastId: `success-${message}`,
        });
        return true;
      };
      return {error,success}
}


export default ToasterWithMessage;