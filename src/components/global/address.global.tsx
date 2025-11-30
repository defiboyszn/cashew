import React, { useEffect, useState } from 'react';

interface AddressProps {
  address: string;
}

const Address: React.FC<AddressProps> = ({ address }) => {
  const [truncatedAddress, setTruncatedAddress] = useState('');
  const maxLength = 20;
  
  useEffect(() => {
    if (address.length <= maxLength) {
      setTruncatedAddress(address);
    } else {
      const firstPartLength = maxLength / 2;
      const lastPartLength = maxLength - firstPartLength - 3; // Account for the ellipsis '...'
      const truncatedAddress =
        address.slice(0, firstPartLength) +
        '...' +
        address.slice(-lastPartLength);
      setTruncatedAddress(truncatedAddress);
    }
  }, [address, maxLength]);

  return <span>{truncatedAddress}</span>;
};

export default Address;
