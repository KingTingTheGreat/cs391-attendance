import { UserProps } from "@/types";
import { Dispatch, SetStateAction } from "react";
import { useUsersContext } from "./UsersContext";
import { Autocomplete, TextField } from "@mui/material";

export default function UserSelect({
  val,
  setVal,
  filterFunc,
}: {
  val: UserProps | null;
  setVal: Dispatch<SetStateAction<UserProps | null>>;
  filterFunc: (user: UserProps) => boolean;
}) {
  const { users } = useUsersContext();

  return (
    <Autocomplete
      value={val}
      onChange={(_, newValue) => setVal(newValue)}
      options={users.filter(filterFunc)}
      getOptionLabel={(option) => `${option.name} (${option.email})`}
      isOptionEqualToValue={(option, value) => option.email === value?.email}
      filterOptions={(options, state) => {
        const query = state.inputValue.toLowerCase();
        return options.filter(
          (user) =>
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query),
        );
      }}
      renderInput={(params) => <TextField {...params} label="Select a user" />}
      sx={{ margin: "0.25rem", width: "100%" }}
    />
  );
}
