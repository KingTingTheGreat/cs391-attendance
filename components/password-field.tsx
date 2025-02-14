import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";

export default function PasswordField({
  val,
  setVal,
  idLabel,
}: {
  val: string;
  setVal: Dispatch<SetStateAction<string>>;
  idLabel: string;
}) {
  const [show, setShow] = useState(false);
  const id = idLabel.toLowerCase().replaceAll(" ", "-");
  return (
    <div>
      <InputLabel htmlFor={id}>{idLabel}</InputLabel>
      <OutlinedInput
        id={id}
        type={show ? "text" : "password"}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={show ? "hide the password" : "display the password"}
              onClick={() => setShow(!show)}
              onMouseDown={(e) => e.preventDefault()}
              onMouseUp={(e) => e.preventDefault()}
              edge="end"
            >
              {show ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        placeholder="Password"
      />
    </div>
  );
}
