export interface StorageService {
    upload(file: File, folder: string): Promise<{ url: string; error?: string }>;

    delete(file_path: string): Promise<boolean>;
}
