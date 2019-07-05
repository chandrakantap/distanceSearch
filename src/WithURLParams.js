import React from "react";

export default Component => ({ location, ...props }) => {
  const searchParams = location.search.substring(1);
  const searchParamsJson = !!searchParams
    ? JSON.parse(
        '{"' +
          decodeURI(searchParams)
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"') +
          '"}'
      )
    : {};
  const compProps = {
    ...searchParamsJson,
    location,
    ...props
  };
  return <Component {...compProps} />;
};
