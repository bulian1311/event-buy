import React from "react";
import Navbar from "../navbar/navbar.component";
import Footer from "../footer/footer.component";
import MetaData from "../metadata/meta-data.component";
import Container from "../container";
import { GlobalStyle } from "../global-styles/global.styles";

type TProps = {
  children: React.ReactNode;
  title: string;
  currentUser: any;
};

const Page = ({ children, title, currentUser }: TProps) => {
  return (
    <>
      <MetaData title={title} />
      <GlobalStyle />
      <Navbar currentUser={currentUser} />
      <Container>{children}</Container>
      <Footer />
    </>
  );
};

export default Page;
