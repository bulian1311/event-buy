import axios from "axios";
import { useState } from "react";

type TProps = {
  url: string;
  method: "get" | "post" | "put" | "putch" | "delete";
  body: {
    email: string;
    password: string;
  };
  onSuccess: () => void;
};

export const useRequest = ({ url, method, body, onSuccess }: TProps) => {
  const [errors, setErrors] = useState<string[] | null>(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const response = await axios[method](url, body);
      onSuccess();

      return response.data;
    } catch (err) {
      setErrors(err.response.data.errors.map((error) => error.message));
    }
  };

  return { doRequest, errors };
};
