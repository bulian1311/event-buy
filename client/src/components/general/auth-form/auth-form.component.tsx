import { FormEvent, useState } from "react";
import Router from "next/router";
import styled from "styled-components";

import { useRequest } from "../../../hooks/use-request.hook";

type TProps = {
  title: string;
  type: "signin" | "signup";
};

const Auth = ({ title, type }: TProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: `/api/users/${type}`,
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await doRequest();
  };

  return (
    <StyledForm onSubmit={onSubmit}>
      <StyledH1>{title}</StyledH1>
      <FormGroup>
        <label>Емейл</label>
        <StyledInput
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <label>Пароль</label>
        <StyledInput
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormGroup>
      {errors && (
        <ul>
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
      <StyledButton type="submit">Авторизация</StyledButton>
    </StyledForm>
  );
};

const StyledH1 = styled.h1``;

const StyledForm = styled.form``;

const FormGroup = styled.div``;

const StyledInput = styled.input``;

const StyledButton = styled.button``;

export default Auth;
