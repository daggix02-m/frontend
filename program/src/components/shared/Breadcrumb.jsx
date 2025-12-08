import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Breadcrumb component
 * @param {Array<{ name: string, href: string }>} paths
 */
const Breadcrumb = ({ paths = [] }) => {
  return (
    <nav className="flex items-center text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1">
        {paths.map((path, idx) => (
          <li key={path.href} className="inline-flex items-center">
            {idx !== 0 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
            {idx < paths.length - 1 ? (
              <Link
                to={path.href}
                className="hover:text-blue-600 transition-colors"
              >
                {path.name}
              </Link>
            ) : (
              <span className="font-semibold text-gray-700">{path.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
