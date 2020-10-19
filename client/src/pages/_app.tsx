import { Provider } from "react-redux";
import store from "../redux/store";

import App from "next/app";
import React from "react";
//import Page from "../components/layout/page";

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <div>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </div>
    );
  }
}