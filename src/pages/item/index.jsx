import { Avatar, Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useCallback, useEffect, useState } from "react";
import { Form, redirect, useLoaderData } from "react-router-dom";

// NOTE: if spending longer on this, I would want to put in some state management (e.g. redux) or React context,
// and have this loader first check whether the item exists in state, and return it from there if so.
// Lots of boilerplate for an exercise like this.

// This also has the side effect of not actually adding or deleting items from the menu, as react-router
// will revalidate, run the loaders and fetch the data again, resulting in the original array.
export const itemLoader = async ({ params: { id } }) => {
  const response = await fetch(`https://fakestoreapi.com/products/${id}`);
  const item = await response.json();

  return { item };
};

export const editAction = async ({ request, params: { id } }) => {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });

  if (response.status === 200) {
    return redirect("/");
  }

  return response.status;
};

export const deleteAction = async ({ params: { id } }) => {
  const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
    method: "DELETE",
  });

  if (response.status === 200) {
    return redirect("/");
  }

  return response.status;
};

const ItemPage = () => {
  const { item } = useLoaderData();
  const [formValues, setFormValues] = useState();

  useEffect(() => {
    if (item) {
      setFormValues(item);
    }
  }, [item]);

  const onInputChange = useCallback((name, value) => {
    setFormValues((values) => ({ ...values, [name]: value }));
  }, []);

  if (!formValues) {
    return null;
  }

  return (
    <Box
      m={4}
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
      }}
    >
      <Form method="post" action="edit">
        <Avatar src={formValues.image} />
        <TextField
          required
          label="Title"
          name="title"
          value={formValues.title}
          onChange={(event) => onInputChange("title", event.target.value)}
          m={2}
        />
        <TextField
          required
          label="Description"
          name="description"
          value={formValues.description}
          onChange={(event) => onInputChange("description", event.target.value)}
          m={2}
        />
        <TextField
          required
          label="Image"
          name="image"
          value={formValues.image}
          onChange={(event) => onInputChange("image", event.target.value)}
          m={2}
        />
        <TextField
          required
          label="Price"
          name="price"
          value={formValues.price}
          onChange={(event) => onInputChange("price", event.target.value)}
          m={2}
        />
        <TextField
          required
          label="Category"
          name="category"
          value={formValues.category}
          onChange={(event) => onInputChange("category", event.target.value)}
          m={2}
        />
        <Button variant="contained" type="submit" sx={{ display: "flex" }}>
          Save changes
        </Button>
      </Form>
      <Form method="delete" action="delete">
        <Button
          variant="contained"
          color="error"
          type="submit"
          sx={{ display: "flex", marginTop: 1 }}
        >
          Delete item
        </Button>
      </Form>
    </Box>
  );
};

export default ItemPage;
