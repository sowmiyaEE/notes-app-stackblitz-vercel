import React, { useState } from 'react';
import './style.css';

export default function Pin({ isPinned, updatePin }) {
  const update = () => {
    updatePin(!isPinned);
  };

  return <button onClick={update} className = {isPinned ? 'pinned' : 'pin'} >  </button>;
}
