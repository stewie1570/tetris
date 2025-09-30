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
    background: var(--color-table-bg);
    border: none !important;
    border-radius: 12px !important;
    padding: 12px 16px !important;
    color: var(--color-text-primary);
    font-weight: 600 !important;
    text-decoration: none;
    transition: all 0.3s ease !important;
    min-width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
    outline: none !important;

    &:hover:not(:disabled) {
      background: var(--color-table-header-bg);
      transform: translateY(-2px) !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
      color: var(--color-text-primary);
      text-decoration: none;
    }

    &:active {
      transform: translateY(0) !important;
    }

    &:focus {
      outline: none !important;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.5) !important;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: var(--color-square-empty-inactive);
      color: var(--color-text-secondary);
    }
  }

  .page-item.active .page-link {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    border: none !important;
    color: white !important;
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3) !important;
  }

  /* Additional focus styling for CommandButton components */
  button.page-link:focus {
    outline: none !important;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.5) !important;
  }

  .page-item.active button.page-link:focus {
    outline: none !important;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.5) !important;
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
