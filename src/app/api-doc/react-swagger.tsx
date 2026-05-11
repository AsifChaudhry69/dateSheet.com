'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { useEffect } from 'react';

type Props = {
  spec: Record<string, any>;
};

export default function ReactSwagger({ spec }: Props) {
  useEffect(() => {
    // Suppress swagger-ui-react internal warnings
    const originalError = console.error;
    console.error = (...args: any[]) => {
      if (
        typeof args[0] === 'string' &&
        args[0].includes('UNSAFE_componentWillReceiveProps')
      ) {
        return;
      }
      originalError(...args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return <SwaggerUI spec={spec} />;
}