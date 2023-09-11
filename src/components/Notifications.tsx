import React, { ReactNode,  } from 'react';
function Notifications(props: { children: ReactNode , style?: React.CSSProperties }) {
  const { children, ...rest } = props;
  return (
    <div className="badge" {...rest}>
      {children}
    </div>
  );
}

export default Notifications;
