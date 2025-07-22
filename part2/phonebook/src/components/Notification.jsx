const Notification = ({ noti }) => {
  if (noti === null) {
    return null
  }

  return (
    <div className={noti.isError ? 'error' : 'notification'}>
      {noti.message}
    </div>
  )
}

export default Notification