import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import BanMessage from './BanMessage';

const BanCheck = ({ children }) => {
  const { user } = useSelector((state) => state.profile);
  const [isBanned, setIsBanned] = useState(false);

  useEffect(() => {
    if (user && user.isBanned) {
      setIsBanned(true);
    } else {
      setIsBanned(false);
    }
  }, [user]);

  // If user is banned, show ban message instead of app content
  if (isBanned) {
    return <BanMessage />;
  }

  // Otherwise, render the normal app content
  return children;
};

export default BanCheck;
