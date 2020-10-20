import React from "react";
import Head from "next/head";

type TProps = {
  title: string;
};

const MetaData = ({ title }: TProps) => {
  return (
    <Head>
      <title>{title}</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default MetaData;
