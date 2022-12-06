import { Box, Button, TextField } from "@mui/material";
import React from "react";
import { Form, redirect } from "react-router-dom";

export const newAction = async ({ request }) => {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  const response = await fetch("https://fakestoreapi.com/products/", {
    method: "POST",
    body: JSON.stringify(updates),
  });

  if (response.status === 200) {
    return redirect("/");
  }

  return response.status;
};

const NewPage = () => {
  return (
    <Box
      m={4}
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
      }}
    >
      <Form method="post">
        <TextField required label="Title" name="title" m={2} />
        <TextField required label="Description" name="description" m={2} />
        <TextField required label="Image" name="image" m={2} />
        <TextField required label="Price" name="price" m={2} />
        <TextField required label="Category" name="category" m={2} />
        <Button type="submit">Create item</Button>
      </Form>
    </Box>
  );
};

export default NewPage;
