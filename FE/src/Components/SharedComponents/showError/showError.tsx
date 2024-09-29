import './showError.css'
interface ShowErrorProps {
    errorMessage: string
  }
const ShowError =  ({errorMessage}:ShowErrorProps) => {
  return (
    <div className='error-Container'>
      {errorMessage}
    </div>
  )
}

export default ShowError