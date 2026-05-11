declare module 'next-swagger-doc' {
  interface SwaggerDefinition {
    openapi?: string;
    info?: {
      title: string;
      version: string;
      description?: string;
    };
    components?: Record<string, any>;
    security?: any[];
    [key: string]: any;
  }

  interface CreateSwaggerSpecOptions {
    apiFolder: string;
    definition: SwaggerDefinition;
    schemaFolders?: string[];
  }

  export function createSwaggerSpec(
    options: CreateSwaggerSpecOptions
  ): Record<string, any>;
}