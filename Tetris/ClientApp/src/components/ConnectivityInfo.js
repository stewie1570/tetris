import React from "react";
import { CopyButton } from "./CopyButton";

export const ConnectivityInfo = ({ organizerUserId, otherPlayersLink }) => {
  return (
    <div className="card" style={{
      overflow: "hidden"
    }}>
      <div className="card-header" style={{
        background: "rgba(255, 255, 255, 0.2)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        fontWeight: "600",
        color: "#2d3748",
        borderRadius: "16px 16px 0 0"
      }}>
        Connectivity
      </div>
      <div className="card-body" style={{
        padding: 0,
        overflow: "hidden"
      }}>
        <table className="table" style={{
          marginBottom: 0,
          border: "none",
          borderRadius: "0 0 16px 16px",
          overflow: "hidden"
        }}>
          <thead>
            <tr>
              <th colSpan={2} style={{
                border: "none",
                background: "rgba(255, 255, 255, 0.1)",
                color: "#2d3748",
                fontWeight: "600",
                padding: "16px",
                borderRadius: "0"
              }}>
                Other players can join via the Code or URL below:
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th style={{
                border: "none",
                background: "rgba(255, 255, 255, 0.1)",
                color: "#4a5568",
                fontWeight: "600",
                padding: "12px 16px",
                width: "20%",
                borderRadius: "0"
              }}>Code</th>
              <td style={{
                border: "none",
                padding: "12px 16px",
                color: "#2d3748",
                borderRadius: "0"
              }}>
                {organizerUserId}
                <br />
                <CopyButton text={organizerUserId} />
              </td>
            </tr>
            <tr>
              <th style={{
                border: "none",
                background: "rgba(255, 255, 255, 0.1)",
                color: "#4a5568",
                fontWeight: "600",
                padding: "12px 16px",
                borderRadius: "0 0 0 16px"
              }}>URL</th>
              <td style={{
                border: "none",
                padding: "12px 16px",
                color: "#2d3748",
                borderRadius: "0 0 16px 0"
              }}>
                {otherPlayersLink}
                <br />
                <CopyButton text={otherPlayersLink} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
