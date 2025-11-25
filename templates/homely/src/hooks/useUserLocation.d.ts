export interface LocationInfo {
    country: string;
    countryCode: string;
    currency: string;
    currencySymbol: string;
}
export declare function useUserLocation(): {
    location: any;
    loading: any;
    error: any;
};
export declare function formatPrice(price: number, currency?: string): string;
//# sourceMappingURL=useUserLocation.d.ts.map