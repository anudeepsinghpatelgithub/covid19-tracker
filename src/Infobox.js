import React from "react";
import { Card, CardContent, Typography, Tooltip } from "@material-ui/core";
import "./Infobox.css";
function Infobox({
  title,
  cases,
  total,
  active,
  isRed,
  casesType,
  tooltip,
  ...props
}) {
  let cssclass = "--warn";
  if (casesType === "recovered") {
    cssclass = "--green";
  } else if (casesType === "deaths") {
    cssclass = "--red";
  }
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"}${cssclass}`}
    >
      <Tooltip title={tooltip}>
        <CardContent>
          <Typography color="textPrimary" className="infobox__title">
            {title}
          </Typography>
          <h2 className={`infoBox__cases infoBox__cases${cssclass}`}>
            {cases}
          </h2>
          <Typography color="textSecondary" className="infobox__total">
            {total} Total
          </Typography>
        </CardContent>
      </Tooltip>
    </Card>
  );
}
export default Infobox;
