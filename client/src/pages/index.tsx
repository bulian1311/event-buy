import styled from "styled-components";
import buildClient from "../api/build-client";

const Index = ({ currentUser }) => {
  return (
    <>
      <H1>
        {currentUser
          ? `Вы Авторизованы как ${currentUser.email}`
          : "Вы Не Авторизованы"}
      </H1>
    </>
  );
};

Index.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get("/api/users/currentuser");

  return data;
};

const H1 = styled.h1``;

export default Index;
