import { useEffect } from "react";
import { useRequest } from "../../hooks/use-request.hook";
import Router from "next/router";

const Signout = () => {
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    onSuccess: () => Router.push("/"),
  });

  useEffect(() => {
    doRequest();
  }, [doRequest]);

  return <div>Выход...</div>;
};

export default Signout;
