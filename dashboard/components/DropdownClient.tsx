"use client";

import { useEffect } from "react";

const DropdownClient = () => {
  useEffect(() => {
    const dropdownToggle = document.querySelector('.dropdown2');
    const dropdownContent = document.querySelector('.dropdown-signout');

    const handleToggle = () => {
      dropdownContent?.classList.toggle('show');
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownToggle?.contains(event.target as Node)) {
        dropdownContent?.classList.remove('show');
      }
    };

    dropdownToggle?.addEventListener('click', handleToggle);
    document.addEventListener('click', handleClickOutside);

    return () => {
      dropdownToggle?.removeEventListener('click', handleToggle);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return null; // This component doesn't render anything itself
};

export default DropdownClient;