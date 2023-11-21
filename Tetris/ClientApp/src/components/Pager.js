import React from "react";
import { CommandButton } from "./CommandButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import styled, { keyframes } from "styled-components";

const MaxPages = 5;

const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const RotatingIcon = styled(FontAwesomeIcon)`
  animation: ${rotateAnimation} 2s linear infinite;
`;

export const Pager = ({ page, numPages, onPageChange }) => {
  const minDisplayPage = Math.max(1, page - Math.floor(MaxPages / 2));
  const maxDisplayPage = Math.min(minDisplayPage + MaxPages, numPages);

  return (
    <nav>
      <ul className="pagination">
        <li className="page-item">
          <CommandButton
            className="page-link"
            disabled={page - 1 < 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Previous"
            runningText={<RotatingIcon icon={faRotate} />}
          >
            <span aria-hidden="true">&laquo;</span>
          </CommandButton>
        </li>
        {Array.from({ length: maxDisplayPage - minDisplayPage + 1 }).map(
          (_, i) => (
            <li
              key={i}
              className={`page-item ${
                minDisplayPage + i === page ? "active" : ""
              }`}
            >
              <CommandButton
                className="page-link"
                onClick={() => onPageChange(minDisplayPage + i)}
                runningText={<RotatingIcon icon={faRotate} />}
              >
                {minDisplayPage + i}
              </CommandButton>
            </li>
          )
        )}
        <li className="page-item">
          <CommandButton
            className="page-link"
            disabled={page + 1 > numPages}
            onClick={() => onPageChange(page + 1)}
            runningText={<RotatingIcon icon={faRotate} />}
            aria-label="Next"
          >
            <span aria-hidden="true">&raquo;</span>
          </CommandButton>
        </li>
      </ul>
    </nav>
  );
};
