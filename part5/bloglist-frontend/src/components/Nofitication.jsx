const Notification = ({ noti }) => {
  if (noti === null) {
    return null
  }

  return (
    <div className="noti" style={{ color: noti.isError ? 'red' : 'green' }}>
      {noti.message}
    </div>
  )
}

export default Notification