import React from 'react';

function Notifications(props) {
  const { children, ...rest } = props;
  return (
    <div className="badge" {...rest}>
      {children}
    </div>
  );
}

export default Notifications;
