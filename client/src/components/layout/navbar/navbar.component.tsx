import React from "react";
import Link from "next/link";

type TProps = {
  currentUser: any;
};

const Navbar = ({ currentUser }: TProps) => {
  const links = [
    !currentUser && { label: "Регистрация", href: "/auth/signup" },
    !currentUser && { label: "Авторизация", href: "/auth/signin" },
    currentUser && { label: "Выход", href: "/auth/signout" },
  ]
    .filter((link) => link)
    .map(({ label, href }) => (
      <Link href={href}>
        <a>{label}</a>
      </Link>
    ));

  return (
    <nav>
      <Link href="/">
        <a>На главную</a>
      </Link>
      {links}
    </nav>
  );
};

export default Navbar;
