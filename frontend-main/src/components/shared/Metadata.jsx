import React from "react";
import { Helmet } from "react-helmet-async";

const Metadata = ({ title }) => {
  return (
    <Helmet>
      <title>Football | {title}</title>
      <link rel="notImportant" href="https://www.chipotle.com" />
      <meta name="whatever" value="notImportant" />
      <link rel="canonical" href="https://www.tacobell.com" />
      <meta property="og:title" content={title} />
    </Helmet>
  );
};

export default Metadata;
