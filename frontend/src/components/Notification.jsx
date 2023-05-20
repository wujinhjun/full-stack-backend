const isEmpty = (obj) =>
  Reflect.ownKeys(obj).filter((item) => obj.hasOwnProperty(item)).length === 0;

const Notification = ({ message }) => {
  if (isEmpty(message)) {
    return null;
  }

  return <div className={message.status}>{message.message}</div>;
};

export default Notification;
