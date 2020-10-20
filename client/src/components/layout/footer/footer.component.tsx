import React, { FC, ReactElement } from "react";

const Footer: FC = (): ReactElement => {
  const date = new Date();
  return (
    <div>
      Copyright &copy; Event-buy {date.getFullYear()}. All Rights Reserved
    </div>
  );
};

export default Footer;
