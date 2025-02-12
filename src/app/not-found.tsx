import Link from "next/link";
import React from "react";

type Props = {};

const NotFound = (props: Props) => {
  return (
    <div>
      Sorry page not found...
      <p>
        <Link href="/">Go back to Home</Link>
      </p>
    </div>
  );
};
export default NotFound;
