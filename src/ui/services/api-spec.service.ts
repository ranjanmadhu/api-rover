import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiSpecService {
  private specs = [
    {
      openapi: '3.0.0',
      info: {
        title: 'Documents API',
        description: 'API for managing documents',
        version: '1.0.0',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Local development server',
        },
      ],
      paths: {
        '/api/documents/status': {
          get: {
            summary: 'Get document status',
            description: 'Returns the status of documents',
            operationId: 'getDocumentStatus',
            responses: {
              '200': {
                description: 'Successful response',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        test: {
                          type: 'string',
                          example: '123',
                        },
                      },
                      required: ['test'],
                    },
                  },
                },
              },
              '400': {
                description: 'Bad request',
              },
              '500': {
                description: 'Internal server error',
              },
            },
            tags: ['Documents'],
          },
        },
      },
      tags: [
        {
          name: 'Documents',
          description: 'Operations related to documents',
        },
      ],
    },
    {
      openapi: '3.0.0',
      info: {
        title: 'Documents API 2nd',
        description: 'API for managing documents',
        version: '1.0.0',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Local development server',
        },
      ],
      paths: {
        '/api/documents/status': {
          get: {
            summary: 'Get document status',
            description: 'Returns the status of documents',
            operationId: 'getDocumentStatus',
            responses: {
              '200': {
                description: 'Successful response',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        test: {
                          type: 'string',
                          example: '123',
                        },
                      },
                      required: ['test'],
                    },
                  },
                },
              },
              '400': {
                description: 'Bad request',
              },
              '500': {
                description: 'Internal server error',
              },
            },
            tags: ['Documents'],
          },
        },
      },
      tags: [
        {
          name: 'Documents',
          description: 'Operations related to documents',
        },
      ],
    },
  ];

  getSpecs = () => {
    return this.specs;
  };
}
