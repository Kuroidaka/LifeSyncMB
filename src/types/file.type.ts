// "id": "4d6a9050-1d8b-4202-bfa8-0adece1450c2",
// "createdAt": "2024-09-14T08:14:28.326Z",
// "updatedAt": "2024-09-14T08:14:28.383Z",
// "name": "win-10.jpeg",
// "urlPath": "file/stream/4d6a9050-1d8b-4202-bfa8-0adece1450c2.jpeg",
// "extname": ".jpeg"

export interface BackgroundImageType {
    id: string | null;
    createdAt: string;
    updatedAt: string;
    name: string;
    urlPath: string;
    extname: string;
}

export interface BackgroundImageModifyType {
    id: string | null;
    name?: string;
    urlPath?: string;
    extname?: string;
}