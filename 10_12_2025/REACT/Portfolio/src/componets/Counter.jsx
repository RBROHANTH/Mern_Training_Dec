import React from 'react'
import { useState } from 'react'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const Counter = () => {
    const [count, setCount] = useState(0)
  return (
    <>
    <h2>Count : {count}</h2>
    
    <Stack spacing={2} direction="row">
      <Button variant="text">Text</Button>
      <Button variant="contained" onClick={() => setCount(count + 1)}>Increment</Button>
      <Button variant="outlined" onClick={() => setCount(count - 1)}>Decrement</Button>
    </Stack>
    </>

  )
}

export default Counter