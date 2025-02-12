import Link from "next/link";
import React from "react";

const NotFound = () => {
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
