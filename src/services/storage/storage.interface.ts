export interface StorageService {
    upload(file: File, folder: string): Promise<{ url: string; error?: string }>;
    
    delete(path: string): Promise<boolean>;
}
