import { BedrockRuntimeClient, ConverseCommand, ConverseCommandInput, ConverseCommandOutput } from "@aws-sdk/client-bedrock-runtime";
import { config } from 'dotenv';
import { BrowserWindow } from "electron";

config();

export class BedRockService {
    private data: { ui: string; api: string; };
    // Define AWS configuration
    private aws_region = 'us-east-1';
    private aws_region_2 = 'us-west-2';
    private credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        sessionToken: process.env.AWS_SESSION_TOKEN || ''
    };

    private awsConfig = {
        region: this.aws_region_2,
        credentials: this.credentials
    };
    // Define Large Language Model Id
    private llm_id = 'anthropic.claude-3-5-sonnet-20240620-v1:0';
    private sonnet_3_5_2 = 'anthropic.claude-3-5-sonnet-20241022-v2:0';

    private queue: Array<{ request: any, response: any }> = [];
    private isProcessing = false;

    processedRequests: Array<{ request: any, response: any }> = [];

    constructor(private readonly mainWindow: BrowserWindow,  data: { ui: string, api: string }) {
        this.data = data;
    }

    queueRequest = async (request: any, response: any) => {
        if (!this.isDuplicateRequest(request)) {
            // this.queue.push({ request, response });
            // if (!this.isProcessing) {
            //     this.processQueue();
            // }

            this.processedRequests.push({ request: request, response: response });
            const result = await this.chatWithLLM(request, response);
            this.mainWindow.webContents.send('from-main', { type: 'api-specs', data: result.openapi_spec });
        } else {
            console.log('Duplicate request found, skipping...', request.url, request.method);
        }
    }

    isDuplicateRequest = (newRequest: any) => {
        return this.processedRequests.some((queuedItem: any) =>
            this.getUrlPath(queuedItem.request.url) === this.getUrlPath(newRequest.url) && queuedItem.request.method === newRequest.method
        );
    }

    getUrlPath = (url: string) => {
        const urlObj = new URL(url);
        return urlObj.pathname;
    }

    private processQueue = async () => {
        this.isProcessing = true;
        while (this.queue.length > 0) {
            const { request, response } = this.queue.shift()!;
            this.processedRequests.push({ request: request, response: response });
            const result = await this.chatWithLLM(request, response);
            this.mainWindow.webContents.send('from-main', { type: 'api-specs', data: result.openapi_spec });
        }
        this.isProcessing = false;
    }

    private chatWithLLM = async (request: any, response: any) => {
        const client = new BedrockRuntimeClient(this.awsConfig);

        const input: ConverseCommandInput = {
            modelId: this.sonnet_3_5_2,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            text: `Please generate OPEN API specification for below request and response data in JSON format.
                            request :  ${JSON.stringify(request)}
                            response : ${JSON.stringify(response)}
                            `
                        }
                    ]
                }
            ],
            system: [
                {
                    text: `You are an expert in writing Open API specifications and you only respond to questions related to Open API specifications. 
                         you are going to be given request and response data, your job is to use it to detgermine open api specification JSON and return it.
                         your response should strictly follow below format, and only contain JSON object. Also take a look at the guidelines for some metadata information in the specification.

                         { openapi_spec: response }

                         Guidelines:
                         1. The title in the info of Open API spec should be something depenedent on the request url.
                            e.g. if the request url is /users/v1/xyz, the title could be "User API" 
                            e.g. if the request url is /products/v1/xyz, the title could be "Product API"
                    `
                }
            ]
        }

        const command = new ConverseCommand(input);
        const chatResponse: ConverseCommandOutput = await client.send(command);

        if (chatResponse.output?.message?.content
            && chatResponse.output?.message?.content[0].text
        ) {
            // console.log(JSON.stringify(chatResponse.output?.message?.content[0].text, null, 2));
            return JSON.parse(chatResponse.output?.message?.content[0].text);
        }
    }
}