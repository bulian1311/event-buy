import React from "react";
import buildClient from "../api/build-client";
import Page from "../components/layout/page/page.component";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <Page title="event-buy" currentUser={currentUser}>
      <Component {...pageProps} />
    </Page>
  );
};

AppComponent.getInitialProps = async (context) => {
  const client = buildClient(context.ctx);
  const { data } = await client.get("/api/users/currentuser");

  let pageProps = {};
  if (context.Component.getInitialProps) {
    pageProps = await context.Component.getInitialProps(context.ctx);
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
