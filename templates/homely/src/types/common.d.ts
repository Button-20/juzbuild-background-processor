export interface PropertyFilters {
    search: string;
    status: string;
    propertyType?: string;
    featured: boolean;
}
export interface PaginationMeta {
    current: number;
    pages: number;
    total: number;
    limit: number;
}
export interface ApiResponse<T> {
    data?: T;
    error?: string;
    message?: string;
}
export interface ChartDataItem {
    name: string;
    value: number;
    fill?: string;
}
export type ChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
export type FormEvent = React.FormEvent<HTMLFormElement>;
export type MouseEvent = React.MouseEvent<HTMLButtonElement>;
export interface PageParams {
    params: Promise<{
        id?: string;
        slug?: string;
        type?: string;
    }>;
}
export type TooltipFormatter = (value: number) => [number, string];
//# sourceMappingURL=common.d.ts.map