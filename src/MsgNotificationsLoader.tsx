import { Skeleton, Stack } from "@mui/material";
import React from "react";

const MsgNotificationLoader: React.FC = () => {
  return (
    <Stack spacing={1}>
      <Skeleton variant="rounded" height={70} animation="wave" />{" "}
      <Skeleton variant="rounded" height={70} animation="wave" />{" "}
      <Skeleton variant="rounded" height={70} animation="wave" />{" "}
      <Skeleton variant="rounded" height={70} animation="wave" />{" "}
      <Skeleton variant="rounded" height={70} animation="wave" />{" "}
      <Skeleton variant="rounded" height={70} animation="wave" />{" "}
    </Stack>
  );
};

export default MsgNotificationLoader;
