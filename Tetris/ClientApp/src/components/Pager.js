import React from "react";
import { CommandButton } from "./CommandButton";
import { Spinner } from './AnimatedIcons';
import styled from 'styled-components';

const MaxPages = 5;

const StyledNav = styled.nav`
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .page-item {
    margin: 0;
  }

  .page-link {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    padding: 8px 12px;
    color: #2d3748;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    min-width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.3);
      transform: translateY(-1px);
      color: #2d3748;
      text-decoration: none;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: rgba(255, 255, 255, 0.05);
      color: rgba(45, 55, 72, 0.5);
    }
  }

  .page-item.active .page-link {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: #667eea;
    color: white;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  }
`;

export const Pager = ({ page, numPages, onPageChange }) => {
  const minDisplayPage = Math.max(1, page - Math.floor(MaxPages / 2));
  const maxDisplayPage = Math.min(minDisplayPage + MaxPages, numPages);

  return (
    <StyledNav>
      <ul className="pagination">
        <li className="page-item">
          <CommandButton
            className="page-link"
            disabled={page - 1 < 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Previous"
            runningText={<Spinner />}
          >
            <span aria-hidden="true">&laquo;</span>
          </CommandButton>
        </li>
        {Array.from({ length: maxDisplayPage - minDisplayPage + 1 }).map(
          (_, i) => (
            <li
              key={i}
              className={`page-item ${minDisplayPage + i === page ? "active" : ""
                }`}
            >
              <CommandButton
                className="page-link"
                onClick={() => onPageChange(minDisplayPage + i)}
                runningText={<Spinner />}
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
            runningText={<Spinner />}
            aria-label="Next"
          >
            <span aria-hidden="true">&raquo;</span>
          </CommandButton>
        </li>
      </ul>
    </StyledNav>
  );
};
