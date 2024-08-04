import { Skeleton, Stack } from "@mui/material";
import React from "react";

const ChatLoader: React.FC = () => {
  return (
    <Stack style={{ width: "100%" }} spacing={2}>
      <Stack
        alignItems="center"
        style={{ width: "100%" }}
        direction="row"
        spacing={1}
      >
        <Skeleton width={60} height={50} variant="circular" animation="wave" />
        <Skeleton variant="rounded" height={60} style={{ width: "100%" }} />
      </Stack>
      <Stack
        alignItems="center"
        style={{ width: "100%" }}
        direction="row"
        spacing={1}
      >
        {" "}
        <Skeleton width={60} height={50} variant="circular" animation="wave" />
        <Skeleton variant="rounded" height={60} style={{ width: "100%" }} />
      </Stack>
      <Stack
        alignItems="center"
        style={{ width: "100%" }}
        direction="row"
        spacing={1}
      >
        {" "}
        <Skeleton width={60} height={50} variant="circular" animation="wave" />
        <Skeleton variant="rounded" height={60} style={{ width: "100%" }} />
      </Stack>
      <Stack
        alignItems="center"
        style={{ width: "100%" }}
        direction="row"
        spacing={1}
      >
        {" "}
        <Skeleton width={60} height={50} variant="circular" animation="wave" />
        <Skeleton variant="rounded" height={60} style={{ width: "100%" }} />
      </Stack>
      <Stack
        alignItems="center"
        style={{ width: "100%" }}
        direction="row"
        spacing={1}
      >
        {" "}
        <Skeleton width={60} height={50} variant="circular" animation="wave" />
        <Skeleton variant="rounded" height={60} style={{ width: "100%" }} />
      </Stack>
      <Stack
        alignItems="center"
        style={{ width: "100%" }}
        direction="row"
        spacing={1}
      >
        {" "}
        <Skeleton width={60} height={50} variant="circular" animation="wave" />
        <Skeleton variant="rounded" height={60} style={{ width: "100%" }} />
      </Stack>
    </Stack>
  );
};

export default ChatLoader;
